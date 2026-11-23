import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { cn } from "cn"

export function SidebarLayout({
  children,
  sidebar,
  mobileNavigation,
}: {
  children: React.ReactNode
  sidebar?: React.ReactNode
  mobileNavigation?: React.ReactNode
}) {
  const { open } = useSidebar()

  return (
    <div className="flex flex-1 **:data-[slot=sidebar-container]:top-(--header-height) **:data-[slot=sidebar-container]:h-[calc(100svh-var(--header-height))]">
      {sidebar}
      <main className="flex min-w-0 flex-1 flex-col bg-background">
        <div
          className={cn(
            "@container/main mx-auto flex w-full flex-1 flex-col gap-2",
            sidebar && "container",
            mobileNavigation && "gap-0 md:gap-2"
          )}
        >
          {sidebar &&
            (mobileNavigation ? (
              <div className="sticky top-(--header-height) z-20 flex h-12 min-w-0 shrink-0 items-center gap-2 border-b bg-background px-4 md:hidden">
                <SidebarTrigger
                  className="size-9 shrink-0"
                  aria-label="Toggle property navigation"
                />
                {mobileNavigation}
              </div>
            ) : (
              <div className="sticky top-(--header-height) z-20 border-b bg-background px-4 py-1 md:hidden">
                <SidebarTrigger aria-label="Toggle property navigation" />
              </div>
            ))}
          {sidebar && !open && (
            <div className="sticky top-(--header-height) z-20 hidden self-start bg-background md:block">
              <SidebarTrigger aria-label="Open property navigation" />
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}
