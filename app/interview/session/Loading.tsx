import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Spinner />
      <p className="mt-4 text-gray-600">Loading interview session...</p>
    </div>
  );
}
