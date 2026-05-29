'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push('/dashboard');
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#032147',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      padding: '1.5rem',
    }}>

      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <span style={{
          fontFamily: 'var(--font-display, serif)',
          fontWeight: 300,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontSize: '1.5rem',
          color: '#ecad0a',
        }}>
          Prelegal
        </span>
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.04em',
        }}>
          Legal document drafting platform
        </p>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '0.5rem',
        padding: '2.5rem',
      }}>
        <h1 style={{
          color: '#ffffff',
          fontSize: '1.25rem',
          fontWeight: 500,
          marginBottom: '1.75rem',
          letterSpacing: '0.01em',
        }}>
          Sign in to your account
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '0.25rem',
                padding: '0.65rem 0.875rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '0.25rem',
                padding: '0.65rem 0.875rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: '0.5rem',
              background: '#753991',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.25rem',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Sign In
          </button>
        </form>
      </div>

    </div>
  );
}
