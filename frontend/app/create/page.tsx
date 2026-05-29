'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { NDAChat, NDAFieldsPartial } from '@/components/nda-chat';
import { NDAPreview } from '@/components/nda-preview';
import { NDAFormData, defaultNDAFormData } from '@/types/nda';

export default function CreatePage() {
  const [formData, setFormData] = useState<NDAFormData>(() => ({
    ...defaultNDAFormData,
    effectiveDate: (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })(),
  }));

  const handlePrint = useCallback(() => window.print(), []);

  const handleFieldsUpdate = useCallback((update: NDAFieldsPartial) => {
    setFormData((prev) => {
      const { party1, party2, ...flat } = update;
      return {
        ...prev,
        ...flat,
        ...(party1 && { party1: { ...prev.party1, ...party1 } }),
        ...(party2 && { party2: { ...prev.party2, ...party2 } }),
      };
    });
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible" style={{ background: '#0C1120' }}>

      {/* ── Header ── */}
      <header
        className="flex items-center justify-between px-8 py-4 shrink-0 print:hidden"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Link href="/dashboard" className="header-nav-link font-display font-light text-base tracking-[0.14em] uppercase">
          ← Prelegal
        </Link>

        <h1
          className="font-display font-light italic text-lg hidden md:block"
          style={{ color: 'rgba(240,234,224,0.45)', letterSpacing: '0.01em' }}
        >
          Mutual Non-Disclosure Agreement
        </h1>

        <button
          onClick={handlePrint}
          className="header-btn text-xs tracking-[0.18em] uppercase px-5 py-2"
        >
          Download PDF
        </button>
      </header>

      {/* ── Content ── */}
      <div className="flex flex-1 overflow-hidden print:overflow-visible print:h-auto">

        {/* Left – AI chat */}
        <div
          className="w-[42%] overflow-hidden print:hidden"
          style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}
        >
          <NDAChat fields={formData} onFieldsUpdate={handleFieldsUpdate} />
        </div>

        {/* Right – live preview */}
        <div
          className="w-[58%] flex flex-col overflow-hidden print:w-full print:overflow-visible print:h-auto"
          style={{ background: '#080D18' }}
        >
          <NDAPreview data={formData} />
        </div>

      </div>
    </div>
  );
}
