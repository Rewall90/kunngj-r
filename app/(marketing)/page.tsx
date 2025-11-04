import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6 text-gray-900">
          Velkommen til kunngj-r
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Kirke bulletins og kommunikasjonsplattform. Administrer kunngjøringer, bulletiner og sosiale medier på ett sted.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-[#3692BB] text-white px-8 py-3 rounded-lg hover:bg-[#2d7a9d] transition-colors font-medium text-lg"
          >
            Kom i gang gratis
          </Link>
          <Link
            href="/pricing"
            className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-[#3692BB] hover:text-[#3692BB] transition-colors font-medium text-lg"
          >
            Se priser
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Kraftige funksjoner for din kirke
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#3692BB] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Kunngjøringer</h3>
              <p className="text-gray-600">
                Opprett og administrer kirkekunngjøringer enkelt. Planlegg og publiser automatisk.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#3692BB] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Bulletiner</h3>
              <p className="text-gray-600">
                Bygg vakre mobil-, print- og e-postbulletiner med blokkbasert redigering.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#3692BB] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Sosiale Medier</h3>
              <p className="text-gray-600">
                Planlegg og publiser innlegg til alle sosiale medieplattformer fra ett sted.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
