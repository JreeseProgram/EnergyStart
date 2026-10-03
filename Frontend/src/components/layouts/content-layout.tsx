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
      <div className="container mx-auto flex flex-col gap-4 p-4 md:gap-6 md:p-6">
        {children}
      </div>
    </>
  )
}
