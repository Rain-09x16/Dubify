export const runtime = 'edge';

export default function NotFound() {
  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <h1 style={{ fontSize: '72px', margin: 0 }}>404</h1>
          <p style={{ fontSize: '24px', marginTop: '16px' }}>Page Not Found</p>
          <a
            href="/"
            style={{
              marginTop: '32px',
              padding: '12px 24px',
              background: '#0070f3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
            }}
          >
            Go Home
          </a>
        </div>
      </body>
    </html>
  );
}
