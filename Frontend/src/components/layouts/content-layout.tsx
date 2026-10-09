import { Head } from "@/components/seo"

export { DashboardLayout } from "./dashboard-layout"

export function ContentLayout({
  children,
  title,
  description,
  action,
}: {
  children: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <>
      <Head title={title} />
      <div className="container mx-auto flex flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="flex items-center justify-between pt-2">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && (
              <span className="text-sm text-muted-foreground">
                {description}
              </span>
            )}
          </div>
          {action}
        </div>
        {children}
      </div>
    </>
  )
}
