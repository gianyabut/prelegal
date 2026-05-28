'use client';

import { useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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

function Blank({ value }: { value: string }) {
  if (value) return <span className="font-medium">{value}</span>;
  return <span className="inline-block w-32 border-b border-gray-400 align-bottom" />;
}

function DateBlank({ value }: { value: string }) {
  if (value) return <span className="font-medium">{formatDisplayDate(value)}</span>;
  return <span className="inline-block w-40 border-b border-gray-400 align-bottom" />;
}

function TermRow({ label, checked, text }: { label?: string; checked: boolean; text: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="mt-0.5 text-base">{checked ? '☑' : '☐'}</span>
      <span>{label && <span className="font-medium">{label}: </span>}{text}</span>
    </div>
  );
}

function PartySignatureBlock({ label, party }: { label: string; party: PartyInfo }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="border-b border-gray-300 pb-1 min-h-[2rem]">
        <span className="text-xs text-muted-foreground">Signature</span>
      </div>
      <div className="space-y-1 text-sm">
        {(['Print Name', 'Title', 'Company', 'Notice Address'] as const).map((field) => {
          const key = field === 'Print Name' ? 'printName' : field === 'Notice Address' ? 'noticeAddress' : field.toLowerCase() as keyof PartyInfo;
          return (
            <div key={field} className="flex gap-2">
              <span className="text-muted-foreground w-28 shrink-0">{field}</span>
              <Blank value={party[key]} />
            </div>
          );
        })}
        <div className="flex gap-2">
          <span className="text-muted-foreground w-28 shrink-0">Date</span>
          <DateBlank value={party.date} />
        </div>
      </div>
    </div>
  );
}

export function NDAPreview({ data }: NDAPreviewProps) {
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const resolvedTerms = resolveStandardTerms(data);

  const mndaTermIsYears = data.mndaTerm !== 'indefinite';
  const tocIsYears = data.termOfConfidentiality !== 'perpetual';

  return (
    <div className="flex flex-col h-full">
      {/* Download bar — hidden on print */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-background border-b print:hidden">
        <p className="text-sm text-muted-foreground">Live preview</p>
        <Button onClick={handlePrint} size="sm">
          Download / Print PDF
        </Button>
      </div>

      {/* Document */}
      <div
        id="nda-document"
        className="flex-1 overflow-y-auto px-8 py-8 print:overflow-visible print:p-0"
      >
        {/* ── COVER PAGE ── */}
        <article className="max-w-3xl mx-auto space-y-6 text-sm leading-relaxed font-serif print:max-w-none">
          <h1 className="text-2xl font-bold font-sans text-center">
            Mutual Non-Disclosure Agreement
          </h1>

          <div className="bg-muted/50 rounded-md p-4 text-xs text-muted-foreground">
            <p className="font-semibold mb-1">USING THIS MUTUAL NON-DISCLOSURE AGREEMENT</p>
            <p>
              This Mutual Non-Disclosure Agreement (the &ldquo;MNDA&rdquo;) consists of: (1) this
              Cover Page and (2) the Common Paper Mutual NDA Standard Terms Version 1.0. Any
              modifications of the Standard Terms should be made on the Cover Page, which will
              control over conflicts with the Standard Terms.
            </p>
          </div>

          {/* Purpose */}
          <section>
            <h3 className="font-bold font-sans text-base mb-1">Purpose</h3>
            <p className="text-xs text-muted-foreground mb-2">How Confidential Information may be used</p>
            <p>{data.purpose || <span className="text-muted-foreground italic">Not specified</span>}</p>
          </section>

          {/* Effective Date */}
          <section>
            <h3 className="font-bold font-sans text-base mb-1">Effective Date</h3>
            <p>
              <DateBlank value={data.effectiveDate} />
            </p>
          </section>

          {/* MNDA Term */}
          <section>
            <h3 className="font-bold font-sans text-base mb-1">MNDA Term</h3>
            <p className="text-xs text-muted-foreground mb-2">The length of this MNDA</p>
            <div className="space-y-1">
              <TermRow
                checked={mndaTermIsYears}
                text={mndaTermIsYears ? `Expires ${getMndaTermLabel(data.mndaTerm)} from Effective Date.` : 'Expires [___] from Effective Date.'}
              />
              <TermRow
                checked={!mndaTermIsYears}
                text="Continues until terminated in accordance with the terms of the MNDA."
              />
            </div>
          </section>

          {/* Term of Confidentiality */}
          <section>
            <h3 className="font-bold font-sans text-base mb-1">Term of Confidentiality</h3>
            <p className="text-xs text-muted-foreground mb-2">How long Confidential Information is protected</p>
            <div className="space-y-1">
              <TermRow
                checked={tocIsYears}
                text={tocIsYears ? `${getConfidentialityTermLabel(data.termOfConfidentiality)} from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.` : '[___] from Effective Date.'}
              />
              <TermRow
                checked={!tocIsYears}
                text="In perpetuity."
              />
            </div>
          </section>

          {/* Governing Law & Jurisdiction */}
          <section>
            <h3 className="font-bold font-sans text-base mb-1">Governing Law &amp; Jurisdiction</h3>
            <p>
              <span className="text-muted-foreground">Governing Law: </span>
              <Blank value={data.governingLaw} />
            </p>
            <p className="mt-1">
              <span className="text-muted-foreground">Jurisdiction: </span>
              <Blank value={data.jurisdiction} />
            </p>
          </section>

          {/* MNDA Modifications */}
          <section>
            <h3 className="font-bold font-sans text-base mb-1">MNDA Modifications</h3>
            {data.modifications ? (
              <p className="whitespace-pre-wrap">{data.modifications}</p>
            ) : (
              <p className="text-muted-foreground italic">None</p>
            )}
          </section>

          <p className="text-xs">
            By signing this Cover Page, each party agrees to enter into this MNDA as of the
            Effective Date.
          </p>

          {/* Signature blocks */}
          <div className="grid grid-cols-2 gap-8 border-t pt-4">
            <PartySignatureBlock label="Party 1" party={data.party1} />
            <PartySignatureBlock label="Party 2" party={data.party2} />
          </div>

          <p className="text-xs text-muted-foreground">
            Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY 4.0
            </a>
            .
          </p>

          <Separator className="my-8 print:my-12" />

          {/* ── STANDARD TERMS ── */}
          <div className="prose prose-sm max-w-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:font-sans [&_h1]:mb-4 [&_ol]:space-y-4 [&_li]:text-sm [&_li]:leading-relaxed [&_a]:underline [&_strong]:font-semibold">
            <ReactMarkdown>{resolvedTerms}</ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}
