import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function DownloadPage() {
  return (
    <PageShell activePath="/download">
      <section className="glass-panel float-up rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Download</p>
        <h1 className="headline-glow mt-3 text-xl font-bold sm:text-3xl lg:text-4xl">Install Your ChatView Stack</h1>
        <p className="mt-4 max-w-3xl text-(--muted)">
          Grab the extension and the mobile app, connect to your API, and start running coding prompts from anywhere.
        </p>

        <div className="mt-5 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-2">
          <article className="feature-card p-5">
            <h2 className="text-xl font-semibold">VS Code Extension</h2>
            <p className="mt-2 text-sm text-(--muted)">
              Install ChatView Relay and keep your coding sessions synced with your phone.
            </p>
            <Link
              className="mt-5 inline-flex rounded-xl bg-(--accent) px-4 py-2 text-sm font-semibold text-black"
              href="https://marketplace.visualstudio.com/items?itemName=doculearn.chatview-relay"
              target="_blank"
              rel="noopener noreferrer"
            >
              Install extension
            </Link>
          </article>

          <article className="feature-card p-5">
            <h2 className="text-xl font-semibold">Android Mobile App</h2>
            <p className="mt-2 text-sm text-(--muted)">
              Install from Google Play to send prompts and control sessions from your phone.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Link
                className="inline-flex rounded-xl bg-(--accent) px-4 py-2 text-sm font-semibold text-black"
                href="https://play.google.com/store/apps/details?id=com.chatviewmobile"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get it on Google Play
              </Link>
            </div>
          </article>
        </div>
      </section>
    </PageShell>
  );
}
