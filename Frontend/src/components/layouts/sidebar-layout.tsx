import { SidebarTrigger } from "@/components/ui/sidebar"
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
              <div className="mt-1 flex h-11 min-w-0 shrink-0 items-center gap-2 px-4 md:hidden">
                <SidebarTrigger className="size-9 shrink-0" />
                {mobileNavigation}
              </div>
            ) : (
              <SidebarTrigger className="ml-4 shrink-0 md:hidden" />
            ))}
          {children}
        </div>
      </main>
    </div>
  )
}
