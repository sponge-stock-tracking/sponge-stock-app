export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            <p>© 2025 Sünger Takip Sistemi. Tüm hakları saklıdır.</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md font-medium">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
