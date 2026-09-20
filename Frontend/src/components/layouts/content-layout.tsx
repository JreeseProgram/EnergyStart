import { Head } from "@/components/seo"

export { DashboardLayout } from "./dashboard-layout"

export function ContentLayout({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <>
      <Head title={title} />
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {children}
      </div>
    </>
  )
}
