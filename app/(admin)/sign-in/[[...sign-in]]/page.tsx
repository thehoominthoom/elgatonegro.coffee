import { SignIn } from '@clerk/nextjs';

export default function AdminSignInPage() {
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-2xl uppercase tracking-tight text-brand-grey">
            El Gato Negro
          </h1>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-brand-grey/50 mt-2">
            Admin Dashboard
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
