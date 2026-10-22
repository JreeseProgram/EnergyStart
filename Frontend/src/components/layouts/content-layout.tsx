import { Head } from "@/components/seo"

export { DashboardLayout } from "./dashboard-layout"

export function ContentLayout({
  children,
  seo,
}: {
  children: React.ReactNode
  seo?: { title?: string }
}) {
  return (
    <>
      {seo?.title && <Head title={seo.title} />}
      <div className="container mx-auto flex min-h-screen flex-col gap-4 p-4 md:gap-6 md:p-6 md:py-10">
        {children}
      </div>
    </>
  )
}
