import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 text-center">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Prelegal
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Mutual NDA Creator</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Fill in the key details and instantly generate a professionally formatted Mutual
          Non-Disclosure Agreement. Download it as a PDF in seconds.
        </p>
      </div>
      <Link href="/create">
        <Button size="lg">Create Mutual NDA</Button>
      </Link>
      <p className="text-xs text-muted-foreground">
        Based on the{' '}
        <a
          href="https://commonpaper.com/standards/mutual-nda/1.0"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Common Paper MNDA v1.0
        </a>{' '}
        — free to use under CC BY 4.0.
      </p>
    </main>
  );
}
