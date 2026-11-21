import { cn } from "cn"
import { Head } from "@/components/seo"

export { DashboardLayout } from "@/components/layouts/dashboard-layout"

export function ContentLayout({
  children,
  seo,
  compactMobileTop = false,
}: {
  children: React.ReactNode
  seo?: { title?: string }
  compactMobileTop?: boolean
}) {
  return (
    <>
      {seo?.title && <Head title={seo.title} />}
      <div
        className={cn(
          "container mx-auto flex min-h-screen w-full min-w-0 flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-10 lg:px-8",
          compactMobileTop && "pt-3"
        )}
      >
        {children}
      </div>
    </>
  )
}
