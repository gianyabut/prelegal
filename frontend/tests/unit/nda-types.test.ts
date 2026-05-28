import { describe, it, expect } from 'vitest';
import { defaultNDAFormData } from '@/types/nda';

describe('defaultNDAFormData', () => {
  it('has a non-empty default purpose', () => {
    expect(defaultNDAFormData.purpose).toBeTruthy();
    expect(defaultNDAFormData.purpose.length).toBeGreaterThan(10);
  });

  it('has an empty effectiveDate (set lazily at runtime to avoid SSR mismatch)', () => {
    expect(defaultNDAFormData.effectiveDate).toBe('');
  });

  it('defaults mndaTerm to "1"', () => {
    expect(defaultNDAFormData.mndaTerm).toBe('1');
  });

  it('defaults termOfConfidentiality to "1"', () => {
    expect(defaultNDAFormData.termOfConfidentiality).toBe('1');
  });

  it('defaults governingLaw to empty string', () => {
    expect(defaultNDAFormData.governingLaw).toBe('');
  });

  it('defaults jurisdiction to empty string', () => {
    expect(defaultNDAFormData.jurisdiction).toBe('');
  });

  it('defaults modifications to empty string', () => {
    expect(defaultNDAFormData.modifications).toBe('');
  });

  it('party1 has all fields initialised to empty strings', () => {
    const p = defaultNDAFormData.party1;
    expect(p.printName).toBe('');
    expect(p.title).toBe('');
    expect(p.company).toBe('');
    expect(p.noticeAddress).toBe('');
    expect(p.date).toBe('');
  });

  it('party2 has all fields initialised to empty strings', () => {
    const p = defaultNDAFormData.party2;
    expect(p.printName).toBe('');
    expect(p.title).toBe('');
    expect(p.company).toBe('');
    expect(p.noticeAddress).toBe('');
    expect(p.date).toBe('');
  });

  it('party1 and party2 are separate objects (not same reference)', () => {
    expect(defaultNDAFormData.party1).not.toBe(defaultNDAFormData.party2);
  });

  it('mndaTerm is one of the valid union values', () => {
    expect(['1', '2', '3', 'indefinite']).toContain(defaultNDAFormData.mndaTerm);
  });

  it('termOfConfidentiality is one of the valid union values', () => {
    expect(['1', '2', '3', 'perpetual']).toContain(defaultNDAFormData.termOfConfidentiality);
  });
});
