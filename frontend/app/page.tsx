import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col prelegal-landing">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 md:px-14 py-6 print:hidden nav-bar">
        <span className="font-display font-light tracking-[0.18em] uppercase text-sm brand-wordmark">
          Prelegal
        </span>
        <Link href="/create" className="text-xs tracking-[0.15em] uppercase nav-link">
          Open Tool →
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 md:px-14 text-center">

        <p className="animate-fade-up category-label text-[10px] font-sans font-medium uppercase tracking-[0.35em] mb-8">
          Legal Documents
        </p>

        <h1 className="animate-fade-up animate-delay-1 font-display font-light hero-heading mb-8">
          Mutual
          <br />
          <em className="hero-heading-em">Non&#8209;Disclosure</em>
          <br />
          Agreement
        </h1>

        <div className="animate-fade-up animate-delay-2 gold-rule w-12 mb-8" />

        <p className="animate-fade-up animate-delay-2 hero-description font-sans font-light leading-relaxed mb-12 max-w-md">
          Generate professionally formatted Mutual NDAs in minutes.
          Fill in the key details, preview the live document, and
          download a print-ready PDF — all in your browser.
        </p>

        <div className="animate-fade-up animate-delay-3">
          <Link href="/create" className="cta-button text-xs tracking-[0.25em] uppercase font-medium px-10 py-4 inline-block">
            Draft Your NDA
          </Link>
        </div>

        <div className="animate-fade-up animate-delay-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-16 feature-chips">
          {['Common Paper MNDA v1.0', 'CC BY 4.0', 'No account required', 'Download as PDF'].map(
            (f, i) => (
              <span key={f} className="flex items-center gap-1.5 text-[0.75rem]">
                {i > 0 && <span className="hidden sm:inline gold-dot">·</span>}
                {f}
              </span>
            )
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 md:px-14 py-5 text-center footer-bar">
        <p className="text-xs footer-text">
          Built on the{' '}
          <a
            href="https://commonpaper.com/standards/mutual-nda/1.0"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Common Paper
          </a>{' '}
          open standard.
        </p>
      </footer>
    </div>
  );
}
