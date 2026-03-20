import Link from 'next/link';
import { ExternalLink, Bot } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

const tiles = [
  {
    label: 'AI Assistant',
    description: 'Products, orders, inventory — ask anything',
    href: '/assistant',
    internal: true,
    highlight: true,
  },
  {
    label: 'Shopify Admin',
    description: 'Products, orders, inventory',
    href: 'https://admin.shopify.com/store/el-gato-negro-7494',
  },
  {
    label: 'Helcim',
    description: 'POS, in-person transactions',
    href: 'https://my.helcim.com',
  },
  {
    label: 'Sanity Studio',
    description: 'CMS — events, content',
    href: '/studio',
    internal: true,
  },
  {
    label: 'GitHub',
    description: 'Code repository',
    href: 'https://github.com/thehoominthoom/elgatonegro.coffee',
  },
  {
    label: 'Cloudflare',
    description: 'DNS, security, tunnels',
    href: 'https://dash.cloudflare.com',
  },
  {
    label: 'Vercel',
    description: 'Deployments, hosting',
    href: 'https://vercel.com',
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <header className="border-b border-brand-grey/10">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-lg uppercase tracking-tight text-brand-grey">
              El Gato Negro
            </h1>
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-grey/40">
              Admin
            </span>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
              },
            }}
          />
        </div>
      </header>

      {/* Tile grid */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiles.map((tile) => {
            const isHighlight = 'highlight' in tile;
            const tileClassName = `group block bg-brand-black border p-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange ${
              isHighlight
                ? 'border-brand-orange/30 hover:border-brand-orange'
                : 'border-brand-grey/10 hover:border-brand-orange/50'
            }`;
            const content = (
              <>
                <div className="flex items-start justify-between mb-3">
                  <span className="font-sans font-extrabold text-sm uppercase tracking-[0.1em] text-brand-grey">
                    {tile.label}
                  </span>
                  {isHighlight ? (
                    <Bot
                      size={16}
                      className="text-brand-orange/60 group-hover:text-brand-orange transition-colors shrink-0 mt-0.5"
                    />
                  ) : 'internal' in tile ? null : (
                    <ExternalLink
                      size={14}
                      className="text-brand-grey/30 group-hover:text-brand-orange/70 transition-colors shrink-0 mt-0.5"
                    />
                  )}
                </div>
                <p className="font-sans text-xs text-brand-grey/50">
                  {tile.description}
                </p>
              </>
            );

            if ('internal' in tile) {
              return (
                <Link key={tile.label} href={tile.href} className={tileClassName}>
                  {content}
                </Link>
              );
            }

            return (
              <a key={tile.label} href={tile.href} target="_blank" rel="noopener noreferrer" className={tileClassName}>
                {content}
              </a>
            );
          })}
        </div>
      </main>
    </div>
  );
}
