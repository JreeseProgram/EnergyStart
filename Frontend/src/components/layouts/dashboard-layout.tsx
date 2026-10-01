import { SidebarProvider } from "@/components/ui/sidebar"

export function DashboardLayout({
  children,
  topbar,
}: {
  children: React.ReactNode
  topbar: React.ReactNode
}) {
  return (
    <SidebarProvider
      className="flex-col"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <header className="sticky top-0 z-30 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-card px-3 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">{topbar}</div>
      </header>
      {children}
    </SidebarProvider>
  )
}
