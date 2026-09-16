import * as React from "react"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { cn } from "@/lib/shadcn"

import { paths } from "@/config/paths"
import { useUser } from "@/hooks/use-user"
import { Head } from "@/components/seo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LayoutProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  title: string
}

export const AuthLayout = ({
  children,
  title,
  className,
  ...props
}: LayoutProps) => {
  const user = useUser()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirectTo")

  const navigate = useNavigate()

  useEffect(() => {
    if (user.data) {
      navigate(redirectTo ? redirectTo : paths.app.dashboard.getHref(), {
        replace: true,
      })
    }
  }, [user.data, navigate, redirectTo])

  return (
    <>
      <Head title={title} />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                {/* <CardDescription>
              Enter your email below to login to your account
            </CardDescription> */}
              </CardHeader>
              <CardContent>{children}</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
