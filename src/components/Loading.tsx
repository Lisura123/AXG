import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="mb-6 animate-float">
        <img
          src="/axg logo.png"
          alt="AXG Logo"
          className="h-20 w-auto"
        />
      </div>
      <Loader2 className="w-12 h-12 animate-spin text-[#404040]" />
      <p className="mt-4 text-gray-600 text-sm animate-pulse">Loading...</p>
    </div>
  );
}
