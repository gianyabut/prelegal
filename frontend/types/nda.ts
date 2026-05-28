export interface PartyInfo {
  printName: string;
  title: string;
  company: string;
  noticeAddress: string;
  date: string;
}

export type MNDATermOption = '1' | '2' | '3' | 'indefinite';
export type ConfidentialityTermOption = '1' | '2' | '3' | 'perpetual';

export interface NDAFormData {
  purpose: string;
  effectiveDate: string;
  mndaTerm: MNDATermOption;
  termOfConfidentiality: ConfidentialityTermOption;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
  party1: PartyInfo;
  party2: PartyInfo;
}

export const defaultNDAFormData: NDAFormData = {
  purpose:
    'Evaluating whether to enter into a business relationship with the other party.',
  effectiveDate: '',
  mndaTerm: '1',
  termOfConfidentiality: '1',
  governingLaw: '',
  jurisdiction: '',
  modifications: '',
  party1: { printName: '', title: '', company: '', noticeAddress: '', date: '' },
  party2: { printName: '', title: '', company: '', noticeAddress: '', date: '' },
};
