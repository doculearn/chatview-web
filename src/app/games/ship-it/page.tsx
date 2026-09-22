import type { Metadata } from 'next';
import Link from 'next/link';
import { FounderGame } from '@/components/founder-game';

const title = 'Ship It: A Solo Board Game for Indie Founders';
const description = 'Play a free founder board game. Spend limited runway, solve six original logic puzzles, and learn to scope, vibe code, test, and launch a startup with first customers.';
export const metadata: Metadata = {
  title, description, alternates: { canonical: '/games/ship-it' },
  openGraph: { title, description, url: '/games/ship-it', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export default function ShipItPage() {
  return <main className="min-h-screen bg-[#f5f8f3] text-[#183833]">
    <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
      <nav className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#c4d3cc] py-3 text-sm" aria-label="Game navigation"><Link href="/" className="text-lg font-bold">ChatView <span className="font-normal text-[#526a65]">/ Play</span></Link><Link href="/blog/vibe-coding-startup-checklist">The founder playbook</Link></nav>
      <header className="flex flex-wrap items-end justify-between gap-4 pb-2 pt-7"><div><p className="mb-2 font-mono text-xs text-[#9a4939]">THE INDIE FOUNDER BOARD GAME / SOLO</p><h1 className="text-5xl font-semibold">Ship It<span className="text-[#b44f3d]">.</span></h1></div><p className="max-w-72 text-sm leading-6 text-[#526a65]">Twelve weeks. Two moves at a time.<br />Build something people come back for.</p></header>
      <FounderGame />
      <footer className="flex flex-wrap justify-between gap-4 border-t border-[#c4d3cc] py-6 text-sm text-[#526a65]"><Link href="/">Built by ChatView</Link><Link href="/blog/build-in-public-first-user-feedback">Build in public without the noise</Link><Link href="/download">Take your coding agent with you</Link></footer>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'VideoGame', name: 'Ship It by ChatView', description, url: 'https://chat-view.xyz/games/ship-it', genre: ['Educational', 'Strategy', 'Board game'], gamePlatform: 'Web browser', playMode: 'SinglePlayer', isAccessibleForFree: true, publisher: { '@type': 'Organization', name: 'ChatView' } }) }} />
  </main>;
}