'use client';

import ReactMarkdown from 'react-markdown';
import { NDAFormData, PartyInfo } from '@/types/nda';
import {
  formatDisplayDate,
  getMndaTermLabel,
  getConfidentialityTermLabel,
  resolveStandardTerms,
} from '@/lib/nda-template';

interface NDAPreviewProps {
  data: NDAFormData;
}

/* ─── Small helpers ─── */

function Blank({ value }: { value: string }) {
  if (value) return <span style={{ fontWeight: 500 }}>{value}</span>;
  return (
    <span
      style={{
        display: 'inline-block',
        width: '7rem',
        borderBottom: '1px solid #9CA3AF',
        verticalAlign: 'bottom',
      }}
    />
  );
}

function DateBlank({ value }: { value: string }) {
  if (value) return <span style={{ fontWeight: 500 }}>{formatDisplayDate(value)}</span>;
  return (
    <span
      style={{
        display: 'inline-block',
        width: '9rem',
        borderBottom: '1px solid #9CA3AF',
        verticalAlign: 'bottom',
      }}
    />
  );
}

function CheckRow({ checked, text }: { checked: boolean; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.25rem' }}>
      <span style={{ fontSize: '0.8rem', lineHeight: 1.6, flexShrink: 0, color: '#374151' }}>
        {checked ? '☑' : '☐'}
      </span>
      <span style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#374151' }}>{text}</span>
    </div>
  );
}

function DocSection({ title, label, children }: { title: string; label?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <h3
        style={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#111827',
          marginBottom: label ? '0.2rem' : '0.5rem',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {title}
      </h3>
      {label && (
        <p
          style={{
            fontSize: '0.7rem',
            color: '#6B7280',
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-sans)',
            fontStyle: 'italic',
          }}
        >
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

function SigBlock({ label, party }: { label: string; party: PartyInfo }) {
  const fields: { display: string; key: keyof PartyInfo; isDate?: boolean }[] = [
    { display: 'Print Name', key: 'printName' },
    { display: 'Title', key: 'title' },
    { display: 'Company', key: 'company' },
    { display: 'Notice Address', key: 'noticeAddress' },
    { display: 'Date', key: 'date', isDate: true },
  ];

  return (
    <div>
      <p
        style={{
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#374151',
          marginBottom: '0.75rem',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {label}
      </p>

      {/* Signature line */}
      <div
        style={{
          borderBottom: '1px solid #D1D5DB',
          minHeight: '2rem',
          marginBottom: '0.75rem',
          paddingBottom: '0.25rem',
        }}
      >
        <span style={{ fontSize: '0.65rem', color: '#9CA3AF', fontFamily: 'var(--font-sans)' }}>
          Signature
        </span>
      </div>

      {/* Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        {fields.map(({ display, key, isDate }) => (
          <div key={key} style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
            <span
              style={{
                fontSize: '0.7rem',
                color: '#6B7280',
                width: '6rem',
                flexShrink: 0,
                fontFamily: 'var(--font-sans)',
              }}
            >
              {display}
            </span>
            {isDate ? (
              <DateBlank value={party[key]} />
            ) : (
              <Blank value={party[key]} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ─── */

export function NDAPreview({ data }: NDAPreviewProps) {
  const resolvedTerms = resolveStandardTerms(data);
  const mndaIsYears = data.mndaTerm !== 'indefinite';
  const tocIsYears = data.termOfConfidentiality !== 'perpetual';

  const docStyle: React.CSSProperties = {
    fontFamily: 'var(--font-document), Georgia, serif',
    fontSize: '0.8125rem',
    lineHeight: 1.7,
    color: '#1F2937',
    background: '#FAFAF7',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 4px 24px rgba(0,0,0,0.35)',
    borderRadius: '1px',
    padding: '3rem 3.5rem',
    maxWidth: '680px',
    margin: '0 auto',
  };

  return (
    <div
      id="nda-document"
      className="flex-1 overflow-y-auto print:overflow-visible print:flex-none print:h-auto"
      style={{ padding: '2rem 2rem', background: 'inherit' }}
    >
      {/* "Live preview" label */}
      <div
        className="print:hidden"
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <span
          style={{
            fontSize: '0.625rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(176,168,152,0.35)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Live Preview
        </span>
      </div>

      {/* ── The Paper Document ── */}
      <article className="doc-paper" style={docStyle}>

        {/* Document title */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '1.75rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: '1.5rem',
              fontWeight: 400,
              letterSpacing: '0.02em',
              color: '#111827',
              lineHeight: 1.2,
            }}
          >
            Mutual Non-Disclosure Agreement
          </h1>
        </div>

        {/* Usage instructions */}
        <div
          style={{
            background: '#F3F4F6',
            border: '1px solid #E5E7EB',
            padding: '0.875rem 1rem',
            marginBottom: '1.75rem',
            borderRadius: '1px',
          }}
        >
          <p
            style={{
              fontSize: '0.625rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#374151',
              marginBottom: '0.375rem',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Using This Agreement
          </p>
          <p style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
            This MNDA consists of (1) this Cover Page and (2) the Common Paper Mutual NDA Standard
            Terms v1.0. Modifications to the Standard Terms must be made on the Cover Page.
          </p>
        </div>

        {/* Purpose */}
        <DocSection title="Purpose" label="How Confidential Information may be used">
          <p style={{ fontSize: '0.8125rem', color: '#374151' }}>
            {data.purpose || <em style={{ color: '#9CA3AF' }}>Not specified</em>}
          </p>
        </DocSection>

        {/* Effective Date */}
        <DocSection title="Effective Date">
          <DateBlank value={data.effectiveDate} />
        </DocSection>

        {/* MNDA Term */}
        <DocSection title="MNDA Term" label="The length of this agreement">
          <CheckRow
            checked={mndaIsYears}
            text={mndaIsYears
              ? `Expires ${getMndaTermLabel(data.mndaTerm)} from Effective Date.`
              : 'Expires [___] from Effective Date.'}
          />
          <CheckRow
            checked={!mndaIsYears}
            text="Continues until terminated in accordance with the terms of the MNDA."
          />
        </DocSection>

        {/* Term of Confidentiality */}
        <DocSection title="Term of Confidentiality" label="How long Confidential Information is protected">
          <CheckRow
            checked={tocIsYears}
            text={tocIsYears
              ? `${getConfidentialityTermLabel(data.termOfConfidentiality)} from Effective Date, but in the case of trade secrets until no longer considered a trade secret under applicable laws.`
              : '[___] from Effective Date.'}
          />
          <CheckRow checked={!tocIsYears} text="In perpetuity." />
        </DocSection>

        {/* Governing Law */}
        <DocSection title="Governing Law & Jurisdiction">
          <p style={{ fontSize: '0.8125rem', color: '#374151' }}>
            <span style={{ color: '#6B7280' }}>Governing Law: </span>
            <Blank value={data.governingLaw} />
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#374151', marginTop: '0.25rem' }}>
            <span style={{ color: '#6B7280' }}>Jurisdiction: </span>
            <Blank value={data.jurisdiction} />
          </p>
        </DocSection>

        {/* Modifications */}
        <DocSection title="MNDA Modifications">
          {data.modifications ? (
            <p style={{ fontSize: '0.8125rem', color: '#374151', whiteSpace: 'pre-wrap' }}>
              {data.modifications}
            </p>
          ) : (
            <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', fontStyle: 'italic' }}>None.</p>
          )}
        </DocSection>

        {/* Signing statement */}
        <p
          style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            marginBottom: '1.25rem',
            fontFamily: 'var(--font-sans)',
          }}
        >
          By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
        </p>

        {/* Signature blocks */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #E5E7EB',
            marginBottom: '1.25rem',
          }}
        >
          <SigBlock label="Party 1" party={data.party1} />
          <SigBlock label="Party 2" party={data.party2} />
        </div>

        {/* Attribution */}
        <p style={{ fontSize: '0.7rem', color: '#9CA3AF', fontFamily: 'var(--font-sans)' }}>
          Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under{' '}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#6B7280' }}
          >
            CC BY 4.0
          </a>
          .
        </p>

        {/* Divider */}
        <div
          style={{
            margin: '2rem 0',
            height: '1px',
            background: '#E5E7EB',
          }}
        />

        {/* ── Standard Terms ── */}
        <div
          style={{
            fontSize: '0.8rem',
            lineHeight: 1.75,
            color: '#374151',
            fontFamily: 'var(--font-document), Georgia, serif',
          }}
        >
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1
                  style={{
                    fontFamily: 'var(--font-display), Georgia, serif',
                    fontSize: '1.25rem',
                    fontWeight: 400,
                    color: '#111827',
                    marginBottom: '1.25rem',
                    letterSpacing: '0.01em',
                  }}
                >
                  {children}
                </h1>
              ),
              ol: ({ children }) => (
                <ol style={{ paddingLeft: '1.25rem', listStyle: 'none', padding: 0 }}>
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li style={{ marginBottom: '1rem', fontSize: '0.8rem', lineHeight: 1.75 }}>
                  {children}
                </li>
              ),
              a: ({ href, children }) => (
                <a href={href} style={{ color: '#6B7280', textDecoration: 'underline' }}>
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong style={{ fontWeight: 600, color: '#1F2937' }}>{children}</strong>
              ),
              em: ({ children }) => (
                <em style={{ fontStyle: 'italic' }}>{children}</em>
              ),
              p: ({ children }) => (
                <p style={{ marginBottom: '0.5rem' }}>{children}</p>
              ),
            }}
          >
            {resolvedTerms}
          </ReactMarkdown>
        </div>

      </article>

      {/* Bottom padding */}
      <div style={{ height: '2rem' }} className="print:hidden" />
    </div>
  );
}
