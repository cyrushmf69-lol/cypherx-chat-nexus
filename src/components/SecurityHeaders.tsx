
import { useEffect } from 'react';

const SecurityHeaders = () => {
  useEffect(() => {
    // Set Content Security Policy via meta tag
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://rbezfdzfwbzsiyuujcxq.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https://rbezfdzfwbzsiyuujcxq.supabase.co wss://rbezfdzfwbzsiyuujcxq.supabase.co; frame-ancestors 'none';";
    document.head.appendChild(cspMeta);

    // Set additional security headers via meta tags
    const headers = [
      { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
      { httpEquiv: 'X-Frame-Options', content: 'DENY' },
      { httpEquiv: 'X-XSS-Protection', content: '1; mode=block' },
      { httpEquiv: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
    ];

    headers.forEach(header => {
      const meta = document.createElement('meta');
      meta.httpEquiv = header.httpEquiv;
      meta.content = header.content;
      document.head.appendChild(meta);
    });

    return () => {
      // Cleanup on unmount
      const metas = document.querySelectorAll('meta[http-equiv]');
      metas.forEach(meta => {
        if (meta.getAttribute('http-equiv')?.startsWith('Content-Security-Policy') ||
            meta.getAttribute('http-equiv')?.startsWith('X-')) {
          meta.remove();
        }
      });
    };
  }, []);

  return null;
};

export default SecurityHeaders;
