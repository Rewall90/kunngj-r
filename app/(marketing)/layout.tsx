export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* Header will go here */}
      <main>{children}</main>
      {/* Footer will go here */}
    </div>
  )
}
