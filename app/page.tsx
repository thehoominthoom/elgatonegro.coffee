export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8 space-y-4">
      <div className="bg-brand-orange text-brand-grey p-4 shadow-polaroid">
        brand-orange + shadow-polaroid
      </div>
      <div className="bg-brand-yellow text-brand-black p-4 shadow-polaroid">
        brand-yellow
      </div>
      <div className="bg-brand-black text-brand-grey p-4 shadow-polaroid">
        brand-black
      </div>
      <div className="bg-brand-grey text-brand-black p-4 shadow-polaroid border">
        brand-grey
      </div>
      <div className="bg-brand-green text-brand-grey p-4 shadow-polaroid">
        brand-green
      </div>
    </div>
  );
}
