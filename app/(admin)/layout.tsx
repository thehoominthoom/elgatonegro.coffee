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
          colorBackground: '#2a201d',
          colorInputBackground: '#352b28',
          colorInputText: '#faf5f4',
          colorText: '#faf5f4',
          colorTextSecondary: 'rgba(250, 245, 244, 0.6)',
          colorDanger: '#b43620',
          borderRadius: '2px',
          fontSize: '15px',
          fontFamily: 'var(--font-outfit), sans-serif',
        },
        elements: {
          card: 'shadow-none',
          formFieldInput: 'text-base py-3',
          formButtonPrimary:
            'text-sm uppercase tracking-widest font-bold bg-[#b43620] hover:bg-[#d09324]',
          footerActionLink: 'text-[#b43620] hover:text-[#d09324]',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
