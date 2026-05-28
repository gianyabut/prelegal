import { describe, it, expect } from 'vitest';
import {
  getMndaTermLabel,
  getConfidentialityTermLabel,
  getMndaTermText,
  getConfidentialityTermText,
  formatDisplayDate,
  resolveStandardTerms,
} from '@/lib/nda-template';
import { defaultNDAFormData } from '@/types/nda';
import type { NDAFormData } from '@/types/nda';

// Fully-filled base fixture for substitution tests
const base: NDAFormData = {
  ...defaultNDAFormData,
  purpose: 'evaluating a potential business partnership',
  effectiveDate: '2026-05-28',
  mndaTerm: '1',
  termOfConfidentiality: '1',
  governingLaw: 'Delaware',
  jurisdiction: 'New Castle, Delaware',
};

// ─── getMndaTermLabel ────────────────────────────────────────────────────────

describe('getMndaTermLabel', () => {
  it('returns "1 year" (singular) for "1"', () => {
    expect(getMndaTermLabel('1')).toBe('1 year');
  });

  it('returns "2 years" (plural) for "2"', () => {
    expect(getMndaTermLabel('2')).toBe('2 years');
  });

  it('returns "3 years" (plural) for "3"', () => {
    expect(getMndaTermLabel('3')).toBe('3 years');
  });

  it('returns "Until terminated" for "indefinite"', () => {
    expect(getMndaTermLabel('indefinite')).toBe('Until terminated');
  });
});

// ─── getConfidentialityTermLabel ─────────────────────────────────────────────

describe('getConfidentialityTermLabel', () => {
  it('returns "1 year" (singular) for "1"', () => {
    expect(getConfidentialityTermLabel('1')).toBe('1 year');
  });

  it('returns "2 years" (plural) for "2"', () => {
    expect(getConfidentialityTermLabel('2')).toBe('2 years');
  });

  it('returns "3 years" (plural) for "3"', () => {
    expect(getConfidentialityTermLabel('3')).toBe('3 years');
  });

  it('returns "In perpetuity" for "perpetual"', () => {
    expect(getConfidentialityTermLabel('perpetual')).toBe('In perpetuity');
  });
});

// ─── getMndaTermText ─────────────────────────────────────────────────────────

describe('getMndaTermText', () => {
  it('produces "1 year from Effective Date" for "1"', () => {
    expect(getMndaTermText('1')).toBe('1 year from Effective Date');
  });

  it('produces "2 years from Effective Date" for "2"', () => {
    expect(getMndaTermText('2')).toBe('2 years from Effective Date');
  });

  it('produces "3 years from Effective Date" for "3"', () => {
    expect(getMndaTermText('3')).toBe('3 years from Effective Date');
  });

  it('produces termination wording for "indefinite"', () => {
    expect(getMndaTermText('indefinite')).toBe(
      'until terminated in accordance with the terms of the MNDA'
    );
  });
});

// ─── getConfidentialityTermText ───────────────────────────────────────────────

describe('getConfidentialityTermText', () => {
  it('includes "1 year from Effective Date" for "1"', () => {
    const text = getConfidentialityTermText('1');
    expect(text).toContain('1 year from Effective Date');
  });

  it('includes trade-secret carve-out for year terms', () => {
    const text = getConfidentialityTermText('1');
    expect(text).toContain('trade secret');
  });

  it('pluralises "2 years" for "2"', () => {
    expect(getConfidentialityTermText('2')).toContain('2 years from Effective Date');
  });

  it('pluralises "3 years" for "3"', () => {
    expect(getConfidentialityTermText('3')).toContain('3 years from Effective Date');
  });

  it('returns exactly "in perpetuity" for "perpetual"', () => {
    expect(getConfidentialityTermText('perpetual')).toBe('in perpetuity');
  });
});

// ─── formatDisplayDate ────────────────────────────────────────────────────────

describe('formatDisplayDate', () => {
  it('formats a standard ISO date to long US format', () => {
    expect(formatDisplayDate('2026-05-28')).toBe('May 28, 2026');
  });

  it('returns empty string for empty input', () => {
    expect(formatDisplayDate('')).toBe('');
  });

  it('handles January (month 1, single digit)', () => {
    expect(formatDisplayDate('2026-01-05')).toBe('January 5, 2026');
  });

  it('handles December (month 12)', () => {
    expect(formatDisplayDate('2025-12-31')).toBe('December 31, 2025');
  });

  it('handles leap-year date (Feb 29)', () => {
    expect(formatDisplayDate('2024-02-29')).toBe('February 29, 2024');
  });

  it('does not shift the date due to timezone (parses as local date parts)', () => {
    // Using explicit year/month/day split avoids UTC midnight → previous-day shift
    expect(formatDisplayDate('2026-01-01')).toBe('January 1, 2026');
  });

  it('handles a date at year boundary', () => {
    expect(formatDisplayDate('2025-01-01')).toBe('January 1, 2025');
  });
});

// ─── resolveStandardTerms ─────────────────────────────────────────────────────

describe('resolveStandardTerms', () => {
  // Placeholder replacement

  it('replaces {{Purpose}} in all occurrences', () => {
    const terms = resolveStandardTerms({ ...base, purpose: 'UNIQUE_PURPOSE_XYZ' });
    expect(terms).toContain('UNIQUE_PURPOSE_XYZ');
    expect(terms).not.toContain('{{Purpose}}');
    // Purpose appears in sections 1 and 2 (twice in section 2)
    const count = (terms.match(/UNIQUE_PURPOSE_XYZ/g) ?? []).length;
    expect(count).toBeGreaterThanOrEqual(2);
  });

  it('replaces {{Effective Date}}', () => {
    const terms = resolveStandardTerms({ ...base, effectiveDate: '2026-05-28' });
    expect(terms).toContain('May 28, 2026');
    expect(terms).not.toContain('{{Effective Date}}');
  });

  it('replaces {{MNDA Term}} for "1 year"', () => {
    const terms = resolveStandardTerms({ ...base, mndaTerm: '1' });
    expect(terms).toContain('1 year from Effective Date');
    expect(terms).not.toContain('{{MNDA Term}}');
  });

  it('replaces {{MNDA Term}} for indefinite', () => {
    const terms = resolveStandardTerms({ ...base, mndaTerm: 'indefinite' });
    expect(terms).toContain('until terminated in accordance with the terms of the MNDA');
    expect(terms).not.toContain('{{MNDA Term}}');
  });

  it('replaces {{Term of Confidentiality}} for "1 year"', () => {
    const terms = resolveStandardTerms({ ...base, termOfConfidentiality: '1' });
    expect(terms).not.toContain('{{Term of Confidentiality}}');
    expect(terms).toContain('1 year from Effective Date');
  });

  it('replaces {{Term of Confidentiality}} for "2 years"', () => {
    const terms = resolveStandardTerms({ ...base, termOfConfidentiality: '2' });
    expect(terms).toContain('2 years from Effective Date');
    expect(terms).not.toContain('{{Term of Confidentiality}}');
  });

  it('replaces {{Term of Confidentiality}} for "3 years"', () => {
    const terms = resolveStandardTerms({ ...base, termOfConfidentiality: '3' });
    expect(terms).toContain('3 years from Effective Date');
    expect(terms).not.toContain('{{Term of Confidentiality}}');
  });

  it('replaces {{Term of Confidentiality}} for perpetual', () => {
    const terms = resolveStandardTerms({ ...base, termOfConfidentiality: 'perpetual' });
    expect(terms).toContain('in perpetuity');
    expect(terms).not.toContain('{{Term of Confidentiality}}');
  });

  it('replaces {{Governing Law}}', () => {
    const terms = resolveStandardTerms({ ...base, governingLaw: 'California' });
    expect(terms).toContain('State of California');
    expect(terms).not.toContain('{{Governing Law}}');
  });

  it('replaces {{Jurisdiction}}', () => {
    const terms = resolveStandardTerms({ ...base, jurisdiction: 'San Francisco, California' });
    expect(terms).toContain('San Francisco, California');
    expect(terms).not.toContain('{{Jurisdiction}}');
  });

  // Fallback placeholders for empty fields

  it('uses [Purpose] fallback when purpose is empty', () => {
    const terms = resolveStandardTerms({ ...base, purpose: '' });
    expect(terms).toContain('[Purpose]');
  });

  it('uses [Effective Date] fallback when effectiveDate is empty', () => {
    const terms = resolveStandardTerms({ ...base, effectiveDate: '' });
    expect(terms).toContain('[Effective Date]');
  });

  it('uses [Governing Law] fallback when governingLaw is empty', () => {
    const terms = resolveStandardTerms({ ...base, governingLaw: '' });
    expect(terms).toContain('[Governing Law]');
  });

  it('uses [Jurisdiction] fallback when jurisdiction is empty', () => {
    const terms = resolveStandardTerms({ ...base, jurisdiction: '' });
    expect(terms).toContain('[Jurisdiction]');
  });

  // Grammar correctness

  it('does not produce "such Delaware" (uses "such State" instead)', () => {
    const terms = resolveStandardTerms({ ...base, governingLaw: 'Delaware' });
    expect(terms).not.toContain('such Delaware');
    expect(terms).toContain('such State');
  });

  it('does not produce "such California" (uses "such State" instead)', () => {
    const terms = resolveStandardTerms({ ...base, governingLaw: 'California' });
    expect(terms).not.toContain('such California');
    expect(terms).toContain('such State');
  });

  // No unreplaced tokens

  it('leaves no unreplaced {{…}} tokens for a fully-filled form', () => {
    const terms = resolveStandardTerms(base);
    expect(terms).not.toMatch(/\{\{[^}]+\}\}/);
  });

  it('leaves no unreplaced {{…}} tokens even when optional fields are empty', () => {
    const terms = resolveStandardTerms({ ...defaultNDAFormData, effectiveDate: '2026-01-01' });
    expect(terms).not.toMatch(/\{\{[^}]+\}\}/);
  });

  // Structural integrity

  it('output starts with "# Standard Terms" heading', () => {
    const terms = resolveStandardTerms(base);
    expect(terms.trimStart()).toMatch(/^# Standard Terms/);
  });

  it('contains all 11 numbered sections', () => {
    const terms = resolveStandardTerms(base);
    const headings = [
      'Introduction',
      'Use and Protection of Confidential Information',
      'Exceptions',
      'Disclosures Required by Law',
      'Term and Termination',
      'Return or Destruction of Confidential Information',
      'Proprietary Rights',
      'Disclaimer',
      'Governing Law and Jurisdiction',
      'Equitable Relief',
      'General',
    ];
    for (const heading of headings) {
      expect(terms).toContain(`**${heading}**`);
    }
  });

  it('contains the CC BY 4.0 attribution line', () => {
    const terms = resolveStandardTerms(base);
    expect(terms).toContain('CC BY 4.0');
    expect(terms).toContain('Common Paper');
  });

  it('is deterministic — same input always produces same output', () => {
    const a = resolveStandardTerms(base);
    const b = resolveStandardTerms(base);
    expect(a).toBe(b);
  });

  it('handles purpose text containing replacement metacharacters safely', () => {
    // $& re-inserts the matched string; $$ is a literal $; $1 references a capture group
    const tricky = 'testing $& and $$ and $1 and (parens) and [brackets]';
    const terms = resolveStandardTerms({ ...base, purpose: tricky });
    expect(terms).toContain(tricky);
  });
});
