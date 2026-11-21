export { DashboardLayout } from "@/components/layouts/dashboard-layout"

export function ContentHeader({
  title,
  description,
  action,
}: {
  header?: React.ReactNode
  title?: string | React.ReactNode
  description?: string
  action?: React.ReactNode
}) {
  return (
    <>
      {title && (
        <div className="flex min-h-11 min-w-0 flex-wrap items-center justify-between gap-3 pt-2">
          <div className="min-w-0 break-words">
            {typeof title === "string" ? (
              <h1 className="text-2xl font-bold">{title}</h1>
            ) : (
              <>{title}</>
            )}
            {description && (
              <span className="text-sm text-muted-foreground">
                {description}
              </span>
            )}
          </div>
          {action}
        </div>
      )}
    </>
  )
}
