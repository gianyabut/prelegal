'use client';

import Link from 'next/link';

const CATALOG = [
  {
    name: 'Mutual Non-Disclosure Agreement',
    description: 'Common Paper standard Mutual Non-Disclosure Agreement for protecting confidential information shared between two parties.',
    href: '/create',
  },
  {
    name: 'Mutual NDA Cover Page',
    description: 'Cover page template for the Common Paper Mutual NDA, used to configure party details, terms, and sign the agreement.',
    href: null,
  },
  {
    name: 'Cloud Service Agreement',
    description: 'Common Paper standard Cloud Service Agreement governing subscription access to and use of cloud-based software products.',
    href: null,
  },
  {
    name: 'Design Partner Agreement',
    description: 'Common Paper standard Design Partner Agreement for early product access programs where partners provide feedback to help shape the product.',
    href: null,
  },
  {
    name: 'Service Level Agreement',
    description: 'Common Paper Service Level Agreement defining uptime and response time targets, and remedies such as service credits for cloud services.',
    href: null,
  },
  {
    name: 'Professional Services Agreement',
    description: 'Common Paper standard Professional Services Agreement for engaging service providers to deliver project-based work and deliverables.',
    href: null,
  },
  {
    name: 'Data Processing Agreement',
    description: 'Common Paper Data Processing Agreement governing the processing of personal data in compliance with GDPR and other data protection laws.',
    href: null,
  },
  {
    name: 'Software License Agreement',
    description: 'Common Paper standard Software License Agreement for on-premise or self-hosted software products.',
    href: null,
  },
  {
    name: 'Partnership Agreement',
    description: 'Common Paper standard Partnership Agreement for business partnerships including trademark licensing and mutual collaboration obligations.',
    href: null,
  },
  {
    name: 'Pilot Agreement',
    description: 'Common Paper standard Pilot Agreement for time-limited product evaluations before entering a long-term agreement.',
    href: null,
  },
  {
    name: 'Business Associate Agreement',
    description: 'Common Paper standard Business Associate Agreement for HIPAA-compliant handling of protected health information.',
    href: null,
  },
  {
    name: 'AI Addendum',
    description: 'Common Paper Standard AI Addendum governing the use of artificial intelligence and machine learning features within a product.',
    href: null,
  },
];

export default function DashboardPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#032147',
      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
    }}>

      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: 'var(--font-display, serif)',
          fontWeight: 300,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontSize: '1rem',
          color: '#ecad0a',
        }}>
          Prelegal
        </span>
        <Link
          href="/"
          style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none',
            letterSpacing: '0.05em',
          }}
        >
          Sign out
        </Link>
      </header>

      <main style={{ padding: '3rem 2rem', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            color: '#ffffff',
            fontSize: '1.75rem',
            fontWeight: 400,
            fontFamily: 'var(--font-display, serif)',
            letterSpacing: '0.02em',
            marginBottom: '0.5rem',
          }}>
            Documents
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>
            Choose a document type to get started.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {CATALOG.map(doc => (
            <div
              key={doc.name}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                opacity: doc.href ? 1 : 0.5,
              }}
            >
              <div>
                <h2 style={{
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  letterSpacing: '0.01em',
                }}>
                  {doc.name}
                </h2>
                <p style={{
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '0.8rem',
                  lineHeight: '1.5',
                }}>
                  {doc.description}
                </p>
              </div>

              {doc.href ? (
                <Link
                  href={doc.href}
                  style={{
                    display: 'inline-block',
                    background: '#209dd7',
                    color: '#ffffff',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    alignSelf: 'flex-start',
                  }}
                >
                  Open →
                </Link>
              ) : (
                <span style={{
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}
