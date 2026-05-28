'use client';

import { NDAFormData, PartyInfo, MNDATermOption, ConfidentialityTermOption } from '@/types/nda';
import { getMndaTermLabel, getConfidentialityTermLabel } from '@/lib/nda-template';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface NDAFormProps {
  data: NDAFormData;
  onChange: (data: NDAFormData) => void;
}

const MNDA_TERM_OPTIONS: { value: MNDATermOption; label: string }[] = (
  ['1', '2', '3', 'indefinite'] as MNDATermOption[]
).map((v) => ({ value: v, label: getMndaTermLabel(v) }));

const CONFIDENTIALITY_TERM_OPTIONS: { value: ConfidentialityTermOption; label: string }[] = (
  ['1', '2', '3', 'perpetual'] as ConfidentialityTermOption[]
).map((v) => ({ value: v, label: getConfidentialityTermLabel(v) }));

interface FieldGroupProps {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}

function FieldGroup({ id, label, hint, children }: FieldGroupProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-foreground block">
        {label}
      </label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

function SelectField<T extends string>({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function PartySection({
  prefix,
  label,
  data,
  onChange,
}: {
  prefix: string;
  label: string;
  data: PartyInfo;
  onChange: (p: PartyInfo) => void;
}) {
  function field(key: keyof PartyInfo) {
    return (value: string) => onChange({ ...data, [key]: value });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <FieldGroup id={`${prefix}-name`} label="Print Name">
          <Input
            id={`${prefix}-name`}
            placeholder="Full legal name"
            value={data.printName}
            onChange={(e) => field('printName')(e.target.value)}
          />
        </FieldGroup>
        <FieldGroup id={`${prefix}-title`} label="Title">
          <Input
            id={`${prefix}-title`}
            placeholder="e.g. CEO"
            value={data.title}
            onChange={(e) => field('title')(e.target.value)}
          />
        </FieldGroup>
        <FieldGroup id={`${prefix}-company`} label="Company">
          <Input
            id={`${prefix}-company`}
            placeholder="Legal company name"
            value={data.company}
            onChange={(e) => field('company')(e.target.value)}
          />
        </FieldGroup>
        <FieldGroup id={`${prefix}-address`} label="Notice Address" hint="Email or postal address">
          <Textarea
            id={`${prefix}-address`}
            placeholder="email@company.com"
            value={data.noticeAddress}
            onChange={(e) => field('noticeAddress')(e.target.value)}
            rows={2}
          />
        </FieldGroup>
        <FieldGroup id={`${prefix}-date`} label="Date">
          <Input
            id={`${prefix}-date`}
            type="date"
            value={data.date}
            onChange={(e) => field('date')(e.target.value)}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

export function NDAForm({ data, onChange }: NDAFormProps) {
  function set<K extends keyof NDAFormData>(key: K, value: NDAFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Agreement Details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the fields to generate your Mutual NDA.
        </p>
      </div>

      <Separator />

      <FieldGroup id="purpose" label="Purpose" hint="How Confidential Information may be used">
        <Textarea
          id="purpose"
          placeholder="Evaluating whether to enter into a business relationship with the other party."
          value={data.purpose}
          onChange={(e) => set('purpose', e.target.value)}
          rows={3}
        />
      </FieldGroup>

      <FieldGroup id="effective-date" label="Effective Date">
        <Input
          id="effective-date"
          type="date"
          value={data.effectiveDate}
          onChange={(e) => set('effectiveDate', e.target.value)}
        />
      </FieldGroup>

      <FieldGroup id="mnda-term" label="MNDA Term" hint="Length of this agreement">
        <SelectField
          id="mnda-term"
          value={data.mndaTerm}
          onChange={(v) => set('mndaTerm', v)}
          options={MNDA_TERM_OPTIONS}
        />
      </FieldGroup>

      <FieldGroup
        id="confidentiality-term"
        label="Term of Confidentiality"
        hint="How long Confidential Information is protected"
      >
        <SelectField
          id="confidentiality-term"
          value={data.termOfConfidentiality}
          onChange={(v) => set('termOfConfidentiality', v)}
          options={CONFIDENTIALITY_TERM_OPTIONS}
        />
      </FieldGroup>

      <FieldGroup id="governing-law" label="Governing Law" hint="US state whose law governs">
        <Input
          id="governing-law"
          placeholder="e.g. Delaware"
          value={data.governingLaw}
          onChange={(e) => set('governingLaw', e.target.value)}
        />
      </FieldGroup>

      <FieldGroup
        id="jurisdiction"
        label="Jurisdiction"
        hint='City or county and state (e.g. "New Castle, DE")'
      >
        <Input
          id="jurisdiction"
          placeholder="e.g. New Castle, DE"
          value={data.jurisdiction}
          onChange={(e) => set('jurisdiction', e.target.value)}
        />
      </FieldGroup>

      <FieldGroup
        id="modifications"
        label="MNDA Modifications"
        hint="Any modifications to the standard terms (optional)"
      >
        <Textarea
          id="modifications"
          placeholder="List any modifications here..."
          value={data.modifications}
          onChange={(e) => set('modifications', e.target.value)}
          rows={3}
        />
      </FieldGroup>

      <Separator />

      <PartySection
        prefix="p1"
        label="Party 1"
        data={data.party1}
        onChange={(p) => set('party1', p)}
      />
      <PartySection
        prefix="p2"
        label="Party 2"
        data={data.party2}
        onChange={(p) => set('party2', p)}
      />
    </div>
  );
}
