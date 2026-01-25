export const metadata = {
  title: 'Breathe',
  description: 'Guided breathing exercises for calm, focus, and energy',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Breathe',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Breathe" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, overflowX: 'hidden' }}>{children}</body>
    </html>
  )
}
