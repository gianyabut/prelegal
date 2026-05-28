'use client';

import { NDAFormData, PartyInfo, MNDATermOption, ConfidentialityTermOption } from '@/types/nda';
import { getMndaTermLabel, getConfidentialityTermLabel } from '@/lib/nda-template';

interface NDAFormProps {
  data: NDAFormData;
  onChange: (data: NDAFormData) => void;
}

const MNDA_TERM_OPTIONS = (['1', '2', '3', 'indefinite'] as MNDATermOption[]).map((v) => ({
  value: v,
  label: getMndaTermLabel(v),
}));

const CONFIDENTIALITY_TERM_OPTIONS = (['1', '2', '3', 'perpetual'] as ConfidentialityTermOption[]).map(
  (v) => ({ value: v, label: getConfidentialityTermLabel(v) })
);

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: '0.625rem',
  fontWeight: 500,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'rgba(201,149,74,0.7)',
  marginBottom: '0.375rem',
  fontFamily: 'var(--font-sans)',
};

const HINT_STYLE: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'rgba(176,168,152,0.45)',
  marginTop: '0.375rem',
  fontStyle: 'italic',
  fontFamily: 'var(--font-sans)',
};

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 pt-6 pb-3">
      <span
        style={{
          fontSize: '0.6rem',
          fontWeight: 600,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(176,168,152,0.5)',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <label htmlFor={id} style={LABEL_STYLE}>
        {label}
      </label>
      {children}
      {hint && <p style={HINT_STYLE}>{hint}</p>}
    </div>
  );
}

function PartyBlock({
  prefix,
  number,
  data,
  onChange,
}: {
  prefix: string;
  number: string;
  data: PartyInfo;
  onChange: (p: PartyInfo) => void;
}) {
  const upd = (key: keyof PartyInfo) => (val: string) =>
    onChange({ ...data, [key]: val });

  return (
    <div
      style={{
        padding: '1.25rem 1.25rem 0.25rem',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '2px',
        marginBottom: '1.25rem',
      }}
    >
      <p
        style={{
          fontSize: '0.6rem',
          fontWeight: 600,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(201,149,74,0.6)',
          marginBottom: '1.25rem',
          fontFamily: 'var(--font-sans)',
        }}
      >
        Party {number}
      </p>

      <Field id={`${prefix}-name`} label="Print Name">
        <input
          id={`${prefix}-name`}
          className="input-line"
          placeholder="Full legal name"
          value={data.printName}
          onChange={(e) => upd('printName')(e.target.value)}
        />
      </Field>
      <Field id={`${prefix}-title`} label="Title">
        <input
          id={`${prefix}-title`}
          className="input-line"
          placeholder="Chief Executive Officer"
          value={data.title}
          onChange={(e) => upd('title')(e.target.value)}
        />
      </Field>
      <Field id={`${prefix}-company`} label="Company">
        <input
          id={`${prefix}-company`}
          className="input-line"
          placeholder="Legal entity name"
          value={data.company}
          onChange={(e) => upd('company')(e.target.value)}
        />
      </Field>
      <Field id={`${prefix}-address`} label="Notice Address" hint="Email or mailing address">
        <textarea
          id={`${prefix}-address`}
          className="input-line"
          placeholder="legal@company.com"
          value={data.noticeAddress}
          onChange={(e) => upd('noticeAddress')(e.target.value)}
          rows={2}
          style={{ resize: 'none' }}
        />
      </Field>
      <Field id={`${prefix}-date`} label="Signing Date">
        <input
          id={`${prefix}-date`}
          type="date"
          className="input-line"
          value={data.date}
          onChange={(e) => upd('date')(e.target.value)}
        />
      </Field>
    </div>
  );
}

export function NDAForm({ data, onChange }: NDAFormProps) {
  function set<K extends keyof NDAFormData>(key: K, value: NDAFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div style={{ padding: '2rem 2rem 3rem', fontFamily: 'var(--font-sans)' }}>

      {/* Title */}
      <div style={{ marginBottom: '0.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <p
          style={{
            fontSize: '0.6rem',
            fontWeight: 600,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(201,149,74,0.5)',
            marginBottom: '0.5rem',
          }}
        >
          New Document
        </p>
        <h2
          className="font-display font-light"
          style={{ fontSize: '1.6rem', color: '#F0EAE0', lineHeight: 1.1 }}
        >
          Agreement Details
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#6A6258', marginTop: '0.375rem' }}>
          Fill in the fields below to generate your Mutual NDA.
        </p>
      </div>

      {/* ── Agreement Terms ── */}
      <SectionHeader>Agreement Terms</SectionHeader>

      <Field id="purpose" label="Purpose" hint="How Confidential Information may be used">
        <textarea
          id="purpose"
          className="input-line"
          placeholder="Evaluating whether to enter into a business relationship with the other party."
          value={data.purpose}
          onChange={(e) => set('purpose', e.target.value)}
          rows={3}
          style={{ resize: 'none' }}
        />
      </Field>

      <Field id="effective-date" label="Effective Date">
        <input
          id="effective-date"
          type="date"
          className="input-line"
          value={data.effectiveDate}
          onChange={(e) => set('effectiveDate', e.target.value)}
        />
      </Field>

      <Field id="mnda-term" label="MNDA Term" hint="Duration of the agreement">
        <select
          id="mnda-term"
          className="select-line"
          value={data.mndaTerm}
          onChange={(e) => set('mndaTerm', e.target.value as MNDATermOption)}
        >
          {MNDA_TERM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </Field>

      <Field
        id="confidentiality-term"
        label="Term of Confidentiality"
        hint="How long information remains protected"
      >
        <select
          id="confidentiality-term"
          className="select-line"
          value={data.termOfConfidentiality}
          onChange={(e) => set('termOfConfidentiality', e.target.value as ConfidentialityTermOption)}
        >
          {CONFIDENTIALITY_TERM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </Field>

      {/* ── Jurisdiction ── */}
      <SectionHeader>Governing Law</SectionHeader>

      <Field id="governing-law" label="State" hint="US state whose laws govern this agreement">
        <input
          id="governing-law"
          className="input-line"
          placeholder="Delaware"
          value={data.governingLaw}
          onChange={(e) => set('governingLaw', e.target.value)}
        />
      </Field>

      <Field id="jurisdiction" label="Jurisdiction" hint='City or county (e.g. "New Castle, DE")'>
        <input
          id="jurisdiction"
          className="input-line"
          placeholder="New Castle, DE"
          value={data.jurisdiction}
          onChange={(e) => set('jurisdiction', e.target.value)}
        />
      </Field>

      <Field id="modifications" label="Modifications" hint="Any deviations from the standard terms (optional)">
        <textarea
          id="modifications"
          className="input-line"
          placeholder="None."
          value={data.modifications}
          onChange={(e) => set('modifications', e.target.value)}
          rows={3}
          style={{ resize: 'none' }}
        />
      </Field>

      {/* ── Parties ── */}
      <SectionHeader>Parties</SectionHeader>

      <PartyBlock
        prefix="p1"
        number="1"
        data={data.party1}
        onChange={(p) => set('party1', p)}
      />
      <PartyBlock
        prefix="p2"
        number="2"
        data={data.party2}
        onChange={(p) => set('party2', p)}
      />
    </div>
  );
}
