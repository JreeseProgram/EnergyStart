import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { ButtonProps } from "@base-ui/react"
import { useIsMutating } from "@tanstack/react-query"
import { cn } from "cn"

export function SubmitButton({ children, className, ...props }: ButtonProps) {
  const isMutating = Boolean(useIsMutating())
  return (
    <Button
      disabled={isMutating}
      className={cn("relative isolate", className)}
      type="submit"
      {...props}
    >
      <div className={cn(isMutating && "invisible")}>{children}</div>
      {isMutating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </Button>
  )
}
