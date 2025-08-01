
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Spinner />
      <p className="mt-4 text-gray-600">Loading interview session...</p>
    </div>
  );
}
function Spinner() {
  return (
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  );
}