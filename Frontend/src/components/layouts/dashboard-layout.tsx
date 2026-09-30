import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "cn"

export function DashboardLayout({
  children,
  sidebar,
  topbar,
}: {
  children: React.ReactNode
  sidebar?: React.ReactNode
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
      <div className="flex flex-1 **:data-[slot=sidebar-container]:top-(--header-height) **:data-[slot=sidebar-container]:h-[calc(100svh-var(--header-height))]">
        {sidebar}
        <main className="flex min-w-0 flex-1 flex-col bg-background">
          <div
            className={cn(
              "@container/main mx-auto flex w-full flex-1 flex-col gap-2 px-4 py-6 sm:px-6 lg:px-10 lg:py-8",
              sidebar && "container"
            )}
          >
            {sidebar && <SidebarTrigger className="shrink-0 md:hidden" />}
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
