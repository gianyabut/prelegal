# Manual Test Plan — Prelegal Mutual NDA Creator

Perform these checks on `http://localhost:3000` after running `npm run dev`.  
Mark each row ✅ Pass / ❌ Fail / ⚠️ Partial.

---

## 1. Landing Page (`/`)

| # | Step | Expected result |
|---|------|-----------------|
| 1.1 | Open `/` in a browser | Page loads; dark navy background; no layout shift |
| 1.2 | Read hero heading | "Mutual / *Non-Disclosure* / Agreement" in large serif font |
| 1.3 | Hover the "Open Tool →" nav link | Text brightens (colour transition, ~0.2 s) |
| 1.4 | Hover the "Draft Your NDA" CTA button | Button fills with gold background; text turns dark |
| 1.5 | Click "Draft Your NDA" | Navigates to `/create` |
| 1.6 | Click browser back | Returns to `/`; page re-renders correctly |
| 1.7 | Click "Open Tool →" nav link | Navigates to `/create` |
| 1.8 | Resize window to 375 px width (mobile) | Heading scales down; layout remains readable; no horizontal scroll |
| 1.9 | Check footer | "Common Paper" link opens `commonpaper.com` in a new tab |
| 1.10 | View page source / DevTools Elements | No `script` errors in Console |

---

## 2. Create Page — Layout (`/create`)

| # | Step | Expected result |
|---|------|-----------------|
| 2.1 | Open `/create` | Split-screen: form on the left (~42 %), live preview on the right (~58 %) |
| 2.2 | Check header | "← PRELEGAL" on left; italic "Mutual Non-Disclosure Agreement" in centre; "DOWNLOAD PDF" on right |
| 2.3 | Click "← PRELEGAL" | Returns to landing page |
| 2.4 | Scroll the form panel | Form scrolls independently; preview stays fixed |
| 2.5 | Scroll the preview panel | Preview scrolls independently; form stays fixed |
| 2.6 | Resize window to 768 px | Form still visible; no overlap |

---

## 3. Create Page — Form Defaults

| # | Step | Expected result |
|---|------|-----------------|
| 3.1 | Open `/create` fresh | Purpose textarea pre-filled with "Evaluating whether to enter into a business relationship with the other party." |
| 3.2 | Check Effective Date field | Defaults to today's date in the browser's locale format |
| 3.3 | Check MNDA Term select | Shows "1 year" as the selected option |
| 3.4 | Check Term of Confidentiality select | Shows "1 year" as the selected option |
| 3.5 | Check Governing Law, Jurisdiction | Both empty; placeholder text visible |
| 3.6 | Check Party 1 / Party 2 fields | All empty; placeholders visible |

---

## 4. Create Page — Live Preview Sync

| # | Step | Expected result |
|---|------|-----------------|
| 4.1 | Clear Purpose and type "joint venture evaluation" | Preview purpose section immediately shows "joint venture evaluation" |
| 4.2 | Change Effective Date to 2030-12-25 | Preview shows "December 25, 2030" |
| 4.3 | Change MNDA Term to "2 years" | Preview MNDA Term checkbox: "Expires 2 years from Effective Date" is checked |
| 4.4 | Change MNDA Term to "Until terminated" | Preview: second checkbox (indefinite) becomes checked; first is unchecked |
| 4.5 | Change Term of Confidentiality to "In perpetuity" | Preview: "In perpetuity" checkbox is checked |
| 4.6 | Type "Texas" in Governing Law | Preview section shows "Texas"; Standard Terms section 9 reads "State of Texas" |
| 4.7 | Verify section 9 grammar | The phrase reads "…laws of the State of Texas, without regard to the conflict of laws provisions of such State." (NOT "such Texas") |
| 4.8 | Type "Austin, TX" in Jurisdiction | Preview section 9 shows "Austin, TX" |
| 4.9 | Type in Modifications field | Preview MNDA Modifications section shows the typed text |
| 4.10 | Type Party 1 Print Name "Alice Johnson" | Signature block shows "Alice Johnson" |
| 4.11 | Type Party 2 Company "Beta Corp" | Signature block shows "Beta Corp" |
| 4.12 | Fill Party 1 Signing Date | Date appears formatted in the signature block |
| 4.13 | Clear Purpose entirely | Preview shows "Not specified" in italic |
| 4.14 | Clear Governing Law | Preview shows underline blank (not garbled text) |

---

## 5. Create Page — Standard Terms Content

| # | Step | Expected result |
|---|------|-----------------|
| 5.1 | Scroll to bottom of preview | All 11 numbered sections visible (Introduction through General) |
| 5.2 | Read section 1 | Contains the filled Purpose wording in the text |
| 5.3 | Read section 2 | Contains the filled Purpose wording in two places |
| 5.4 | Read section 5 | Contains the effective date, MNDA term, and confidentiality term wording |
| 5.5 | Read section 9 | Contains the governing law and jurisdiction wording |
| 5.6 | Check CC BY 4.0 attribution | Attribution line visible at bottom with link to creativecommons.org |

---

## 6. Download PDF / Print

| # | Step | Expected result |
|---|------|-----------------|
| 6.1 | Click "DOWNLOAD PDF" button | Browser print dialog opens |
| 6.2 | In print preview, switch to "All pages" | **More than 1 page** is shown (typically 4 pages for a fully filled NDA) |
| 6.3 | Inspect print preview — page 1 | Shows cover page: Purpose, Effective Date, MNDA Term, Term of Confidentiality, Governing Law, Signature blocks |
| 6.4 | Inspect print preview — page 2+ | Shows Standard Terms, all 11 sections, fully rendered |
| 6.5 | Check headers/footers in print preview | No browser chrome leaking into the document |
| 6.6 | Check background colour in print | Document background is white (not navy) |
| 6.7 | Check form panel in print | Form panel is completely absent from the print output |
| 6.8 | Check "Live Preview" label in print | Label is absent from the print output |
| 6.9 | Save as PDF | PDF file downloads; opens with correct page count |
| 6.10 | Verify PDF text is selectable | Can select and copy text from the PDF (not a rasterised image) |

---

## 7. Edge Cases

| # | Step | Expected result |
|---|------|-----------------|
| 7.1 | Open `/create` and immediately click "DOWNLOAD PDF" | Print dialog opens; preview renders with defaults (no blank white page) |
| 7.2 | Enter very long purpose text (500+ chars) | Preview wraps cleanly; no overflow; print still shows all pages |
| 7.3 | Enter special characters in purpose: `<script>alert(1)</script>` | Text rendered as literal string in preview — no alert fired (XSS safe) |
| 7.4 | Enter special characters: `$1 (parens) [brackets]` | Text appears verbatim in preview; no garbling |
| 7.5 | Reload the page mid-edit | Form resets to defaults (no persistence expected — client-side only) |
| 7.6 | Open two tabs to `/create` simultaneously | Both tabs operate independently with no shared state |
| 7.7 | Navigate: `/create` → `/` → `/create` (back/forward) | Create page re-initialises with defaults |
| 7.8 | Disable JavaScript and open `/` | Should still render static HTML (Next.js SSR) |

---

## 8. Accessibility

| # | Step | Expected result |
|---|------|-----------------|
| 8.1 | Tab through all form fields | Focus moves in logical order; all fields reachable by keyboard |
| 8.2 | Focus a text input | Gold underline highlight appears on the focused field |
| 8.3 | Focus a select | Select shows focus indicator |
| 8.4 | Run browser accessibility audit (Lighthouse or axe DevTools) | No critical accessibility errors |
| 8.5 | Check all labels | Every input has an associated `<label>` with matching `htmlFor` / `id` |

---

## 9. Cross-browser

| # | Browser | Pass? |
|---|---------|-------|
| 9.1 | Chrome (latest) | |
| 9.2 | Firefox (latest) | |
| 9.3 | Safari / WebKit | |
| 9.4 | Edge (Chromium) | |

---

## Sign-off

| Tester | Date | Build | Notes |
|--------|------|-------|-------|
|        |      |       |       |
