import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          GestionMax Formation
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plateforme de gestion de formations professionnelles
        </p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Se connecter
        </Link>
      </div>
    </main>
  );
}
