-- Migration: MongoDB to Supabase
-- Run this in the Supabase SQL Editor

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (replaces MongoDB User model)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  avatar TEXT DEFAULT '',
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  daily_queries_count INTEGER DEFAULT 0,
  last_query_date TEXT DEFAULT '',
  connected_platforms JSONB DEFAULT '{"instagram": false, "tiktok": false, "youtube": false}',
  social_stats JSONB DEFAULT '{"instagram": {"followers": 0, "views": 0, "engagement": 0, "videos": 0}, "tiktok": {"followers": 0, "views": 0, "engagement": 0, "videos": 0}, "youtube": {"subscribers": 0, "views": 0, "engagement": 0, "videos": 0}}',
  language TEXT DEFAULT 'it' CHECK (language IN ('it', 'en', 'es', 'fr')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications table (replaces MongoDB Notification model)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Social metrics history (daily snapshots per platform)
CREATE TABLE IF NOT EXISTS social_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube')),
  metric_date DATE NOT NULL,
  followers INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  engagement REAL DEFAULT 0,
  videos INTEGER DEFAULT 0,
  subscribers INTEGER DEFAULT 0,
  extra JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, platform, metric_date)
);

-- Social posts/videos history (individual content performance)
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube')),
  post_id TEXT NOT NULL,
  title TEXT,
  published_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  thumbnail TEXT,
  extra JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, platform, post_id)
);

CREATE INDEX IF NOT EXISTS idx_social_metrics_user_platform_date ON social_metrics(user_id, platform, metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_user_platform ON social_posts(user_id, platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_published ON social_posts(published_at DESC);

-- Auto-update updated_at trigger for new tables
DROP TRIGGER IF EXISTS trigger_social_metrics_updated_at ON social_metrics;
CREATE TRIGGER trigger_social_metrics_updated_at
  BEFORE UPDATE ON social_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_social_posts_updated_at ON social_posts;
CREATE TRIGGER trigger_social_posts_updated_at
  BEFORE UPDATE ON social_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
