import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { canConnectPlatform } from "@/lib/plan";
import { getYouTubeStats, syncYouTubeData, YouTubeAPIError } from "@/lib/social/youtube";
import SocialMetrics from "@/models/SocialMetrics";
import SocialPost from "@/models/SocialPost";
import {
  getInstagramStats,
  getInstagramBusinessStats,
  getInstagramProfile,
} from "@/lib/social/instagram";
import { getTikTokStats } from "@/lib/social/tiktok";

const VALID_PLATFORMS = ["instagram", "tiktok", "youtube"] as const;
type Platform = (typeof VALID_PLATFORMS)[number];

function buildUnavailableStats(platform: string, username: string) {
  const displayName = username || "Account social";

  if (platform === "youtube") {
    return {
      subscribers: 0,
      views: 0,
      engagement: 0,
      videos: 0,
      title: displayName,
      thumbnail: "",
      unavailable: true,
    };
  }

  return {
    followers: 0,
    views: 0,
    engagement: 0,
    videos: 0,
    displayName,
    avatar: "",
    unavailable: true,
  };
}

async function fetchRealStats(platform: Platform, username: string) {
  try {
    switch (platform) {
      case "youtube":
        return await getYouTubeStats(username);
      case "instagram":
        return await getInstagramStats(username);
      case "tiktok":
        return await getTikTokStats(username);
      default:
        return null;
    }
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    let token = request.cookies.get("token")?.value;
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      connectedPlatforms: user.connected_platforms,
      socialStats: user.social_stats,
    });
  } catch (error) {
    console.error("Connect GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch connections" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let token = request.cookies.get("token")?.value;
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const { platform, action, username } = await request.json();

    if (!platform || !VALID_PLATFORMS.includes(platform)) {
      return NextResponse.json(
        { error: "Invalid platform. Must be instagram, tiktok, or youtube" },
        { status: 400 },
      );
    }

    if (!action || !["connect", "disconnect"].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "connect" or "disconnect"' },
        { status: 400 },
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const connectedPlatforms = { ...user.connected_platforms };
    const socialStats = { ...user.social_stats };

    if (action === "connect") {
      const platformCheck = await canConnectPlatform(user as any);
      if (!platformCheck.allowed) {
        return NextResponse.json(
          {
            error: platformCheck.reason,
          },
          { status: 403 },
        );
      }

      if (platform === "instagram") {
        const appId = process.env.INSTAGRAM_APP_ID;
        if (!appId) {
          return NextResponse.json(
            {
              error:
                "Instagram non è ancora configurato. Contatta l'amministratore.",
            },
            { status: 503 },
          );
        }

        if (username) {
          const instagramToken = (user as any).instagram_access_token;
          let stats = null;

          if (instagramToken) {
            const profile = await getInstagramProfile(instagramToken);
            if (profile) {
              stats = {
                followers: 0,
                views: 0,
                videos: profile.media_count,
                engagement: 0,
              };
            }
          } else {
            stats = await getInstagramBusinessStats(username, appId);
          }

          connectedPlatforms.instagram = true;
          socialStats.instagram =
            stats || (buildUnavailableStats("instagram", username) as any);
        } else {
          return NextResponse.json({
            redirect: `/api/auth/instagram/authorize`,
          });
        }
      } else {
        connectedPlatforms[platform as Platform] = true;

        let stats = null;

        if (username) {
          if (platform === "youtube") {
            try {
              const sync = await syncYouTubeData(username);
              stats = {
                subscribers: sync.channel.subscribers,
                views: sync.channel.views,
                videos: sync.channel.videos,
                engagement: sync.channel.engagement,
                channelId: sync.channel.channelId,
                title: sync.channel.title,
                thumbnail: sync.channel.thumbnail,
                handle: username,
              };

              const today = new Date();
              await SocialMetrics.upsertMetric(user.id, "youtube", today, {
                subscribers: sync.channel.subscribers,
                views: sync.channel.views,
                engagement: sync.channel.engagement,
                videos: sync.channel.videos,
                extra: {
                  title: sync.channel.title,
                  thumbnail: sync.channel.thumbnail,
                  channelId: sync.channel.channelId,
                },
              });

              if (sync.videos.length > 0) {
                const postInputs = sync.videos.map((video) => ({
                  post_id: video.id,
                  title: video.title,
                  published_at: video.publishedAt,
                  views: video.views,
                  likes: video.likes,
                  comments: video.comments,
                  shares: 0,
                  thumbnail: video.thumbnail,
                  extra: { durationSeconds: video.durationSeconds },
                }));
                await SocialPost.upsertMany(user.id, "youtube", postInputs);
              }
            } catch (err: any) {
              console.error("YouTube connect sync error:", err);
              if (err instanceof YouTubeAPIError) {
                return NextResponse.json(
                  { error: err.message, code: err.code },
                  { status: err.code === "NOT_CONFIGURED" ? 503 : 400 },
                );
              }
              return NextResponse.json(
                { error: "Errore durante la sincronizzazione di YouTube" },
                { status: 500 },
              );
            }
          } else {
            stats = await fetchRealStats(platform as Platform, username);
          }
        }

        socialStats[platform as Platform] =
          stats || (buildUnavailableStats(platform, username) as any);
      }
    } else {
      connectedPlatforms[platform as Platform] = false;
    }

    await User.updateById(user.id, {
      connected_platforms: connectedPlatforms,
      social_stats: socialStats,
    });

    if (action === "connect") {
      await Notification.create({
        userId: user.id,
        text: `Ottime notizie! Hai collegato con successo il tuo account ${platform.charAt(0).toUpperCase() + platform.slice(1)}.`,
        type: "success",
      });
    }

    return NextResponse.json({
      message: `${platform} ${action === "connect" ? "connected" : "disconnected"} successfully`,
      connectedPlatforms: connectedPlatforms,
      socialStats: socialStats,
    });
  } catch (error) {
    console.error("Connect error:", error);
    return NextResponse.json(
      { error: "Failed to update platform connection" },
      { status: 500 },
    );
  }
}
