export default function robots() {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/chat/', '/recupera-password/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/chat/', '/login/', '/register/', '/recupera-password/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/chat/', '/login/', '/register/', '/recupera-password/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/chat/', '/recupera-password/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/chat/', '/recupera-password/'],
      },
    ],
    sitemap: 'https://nextbrand.it/sitemap.xml',
  }
}
