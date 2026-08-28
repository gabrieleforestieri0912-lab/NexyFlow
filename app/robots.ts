import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/api/', '/dashboard/', '/chat/', '/recupera-password/']

  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: [...disallow, '/login/', '/register/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: [...disallow, '/login/', '/register/'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: [...disallow, '/login/', '/register/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: [...disallow, '/login/', '/register/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: [...disallow, '/login/', '/register/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: [...disallow, '/login/', '/register/'],
      },
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: [...disallow, '/login/', '/register/'],
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
        disallow: [...disallow, '/login/', '/register/'],
      },
      {
        userAgent: 'Amazonbot',
        allow: '/',
        disallow: [...disallow, '/login/', '/register/'],
      },
      {
        userAgent: 'meta-externalagent',
        allow: '/',
        disallow: [...disallow, '/login/', '/register/'],
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: [...disallow, '/login/', '/register/'],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: [...disallow, '/login/', '/register/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
    ],
    sitemap: 'https://nexyflow.it/sitemap.xml',
  }
}
