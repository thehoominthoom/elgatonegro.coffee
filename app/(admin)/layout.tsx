import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — El Gato Negro',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      afterSignOutUrl="/sign-in"
      appearance={{
        variables: {
          colorPrimary: '#b43620',
          // Flip card interior to light so text/inputs read against a lifted surface.
          // Page bg stays dark via the sign-in page's own wrapper.
          colorBackground: '#faf5f4',
          colorInputBackground: '#ffffff',
          colorInputText: '#2a201d',
          colorText: '#2a201d',
          colorTextSecondary: 'rgba(42, 32, 29, 0.6)',
          colorDanger: '#b43620',
          borderRadius: '2px',
          fontSize: '15px',
          fontFamily: 'var(--font-outfit), sans-serif',
        },
        elements: {
          // ── Sign-in card (Fix #10) ─────────────────────────────
          card: 'bg-brand-grey shadow-lg border border-brand-black/10 p-8',
          headerTitle: 'text-brand-black',
          headerSubtitle: 'text-brand-black/60',
          formFieldLabel: 'text-brand-black',
          formFieldInput:
            'text-base py-3 bg-white border-brand-black/15 text-brand-black',
          formButtonPrimary:
            'text-sm uppercase tracking-widest font-bold bg-[#b43620] hover:bg-[#d09324] text-brand-grey',
          footerActionLink: 'text-[#b43620] hover:text-[#d09324]',
          socialButtonsBlockButton:
            'bg-white border border-brand-black/15 text-brand-black hover:bg-brand-grey',
          dividerLine: 'bg-brand-black/10',
          dividerText: 'text-brand-black/50',
          formResendCodeLink: 'text-[#b43620] hover:text-[#d09324]',
          identityPreviewText: 'text-brand-black',
          identityPreviewEditButton: 'text-[#b43620]',

          // ── UserButton pop-out (Fix #11) ───────────────────────
          userButtonPopoverCard:
            'bg-brand-grey shadow-xl border border-brand-black/10',
          userButtonPopoverActionButton:
            'text-brand-black hover:bg-brand-black/5',
          userButtonPopoverActionButtonText: 'text-brand-black',
          userButtonPopoverActionButtonIcon: 'text-brand-black/60',
          userButtonPopoverFooter:
            'bg-brand-grey border-t border-brand-black/10',
          userButtonPopoverMain: 'bg-brand-grey',
          userPreviewMainIdentifier: 'text-brand-black',
          userPreviewSecondaryIdentifier: 'text-brand-black/60',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
