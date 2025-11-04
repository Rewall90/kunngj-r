import { Header } from '@/components/layout/Header'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>{children}</main>
      {/* Footer will go here */}
    </div>
  )
}
