'use client';

import { useState } from 'react';
import { NDAForm } from '@/components/nda-form';
import { NDAPreview } from '@/components/nda-preview';
import { NDAFormData, defaultNDAFormData } from '@/types/nda';

export default function CreatePage() {
  const [formData, setFormData] = useState<NDAFormData>(() => ({
    ...defaultNDAFormData,
    effectiveDate: new Date().toISOString().split('T')[0],
  }));

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left panel – form */}
      <div className="w-1/2 overflow-y-auto border-r print:hidden">
        <NDAForm data={formData} onChange={setFormData} />
      </div>

      {/* Right panel – live preview */}
      <div className="w-1/2 flex flex-col overflow-hidden bg-muted/30 print:w-full print:overflow-visible print:bg-white">
        <NDAPreview data={formData} />
      </div>
    </div>
  );
}
