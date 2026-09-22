import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { gameArticles } from '@/lib/game-articles';

export const dynamicParams = false;
export function generateStaticParams() { return gameArticles.map(article => ({ slug: article.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = gameArticles.find(item => item.slug === slug);
  if (!article) notFound();
  return { title: article.title, description: article.description, alternates: { canonical: `/blog/${slug}` },
    openGraph: { title: article.title, description: article.description, type: 'article', url: `/blog/${slug}`, publishedTime: '2026-09-22T00:00:00Z' },
    twitter: { card: 'summary_large_image', title: article.title, description: article.description } };
}

export default async function GameArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = gameArticles.find(item => item.slug === slug);
  if (!article) notFound();
  return <main className="min-h-screen bg-[#f5f7f2] px-5 py-8 text-[#192c2c]">
    <article className="mx-auto max-w-3xl">
      <nav className="mb-10 flex flex-wrap justify-between gap-4 border-b border-[#cbd7d3] pb-5 text-sm"><Link href="/">ChatView</Link><Link href="/blog">All articles</Link><Link href="/games/ship-it">Play Ship It</Link></nav>
      <header><p className="text-sm text-[#4c6664]"><time dateTime="2026-09-22">22 September 2026</time> / {article.readMinutes} min read / ChatView</p><h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">{article.title}</h1><p className="mt-6 text-lg leading-8 text-[#4c6664]">{article.description}</p></header>
      <Link href="/games/ship-it" className="my-8 inline-flex rounded border border-[#192c2c] bg-[#192c2c] px-5 py-3 font-semibold text-[#d7f26b]">Play the founder board game</Link>
      {article.sections.map(section => <section key={section.title} className="mb-9"><h2 className="mb-4 text-2xl font-semibold">{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph.slice(0, 55)} className="mb-4 text-base leading-8">{paragraph}</p>)}</section>)}
      {slug === 'vibe-coding-startup-checklist' && <section id="board-rules" className="mb-9 scroll-mt-6"><h2 className="mb-4 text-2xl font-semibold">Ship It: board rules</h2><p className="mb-4 leading-8">Start with ten runway tokens and two actions per week. Visit each workspace at most once per week: interview for evidence, build for progress and debt, review for quality and less debt, share for reach, or freelance for runway. Support adds evidence and quality; after release it also adds a retained customer.</p><p className="mb-4 leading-8">Each puzzle attempt costs one action. Meet its listed resource requirements first. A correct answer spends only resources marked as spent; an incorrect answer costs the action but keeps your resources. Hints are free. Ending a week discards unused actions, costs one runway, refreshes workspaces, and applies the event shown on the board.</p><p className="mb-4 leading-8">Clear all six checkpoints by the end of week twelve, before runway reaches zero. Release earns the first customer; support brings the other two needed for the final checkpoint. The journal records your decisions. Refreshing the page starts over.</p><p className="mb-4 leading-8">This original worker-placement and logic-puzzle game is a simplified learning simulation. Real customer retention is not guaranteed by providing support, and real startups do not follow a fixed event calendar. The puzzles are original and are not affiliated with CS50 or adapted from its Puzzle Day materials.</p></section>}
      <section className="border-t border-[#cbd7d3] pt-6"><h2 className="text-xl font-semibold">References & next steps</h2><ul className="mt-4 space-y-3">{article.sources.map(source => <li key={source.url}><a href={source.url} className="underline underline-offset-4">{source.title}</a></li>)}{gameArticles.filter(item => item.slug !== slug).map(item => <li key={item.slug}><Link href={`/blog/${item.slug}`} className="underline underline-offset-4">{item.title}</Link></li>)}<li><Link href="/games/ship-it" className="underline underline-offset-4">Play Ship It: the free founder board game</Link></li><li><Link href="/download" className="underline underline-offset-4">Explore ChatView for mobile access to coding agents</Link></li></ul></section>
    </article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: article.title, description: article.description, datePublished: '2026-09-22T00:00:00Z', dateModified: '2026-09-22T00:00:00Z', mainEntityOfPage: `https://chat-view.xyz/blog/${slug}`, author: { '@type': 'Organization', name: 'ChatView', url: 'https://chat-view.xyz' } }) }} />
  </main>;
}