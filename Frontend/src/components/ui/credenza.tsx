import * as React from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { cn } from "cn"
import { XIcon } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import * as Dialog from "@/components/ui/dialog"
import * as Drawer from "@/components/ui/drawer"

const CredenzaContext = React.createContext<boolean | null>(null)
function useCredenza() {
  const mobile = React.useContext(CredenzaContext)
  if (mobile === null)
    throw new Error("Credenza parts must be used within Credenza.")
  return mobile
}

export function Credenza<T>({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onOpenChangeComplete,
  ...props
}: DrawerPrimitive.Root.Props<T>) {
  const mobile = useIsMobile()
  const [uncontrolledOpen, setOpen] = React.useState(defaultOpen)
  const open = controlledOpen ?? uncontrolledOpen
  const [presentation, setPresentation] = React.useState(mobile)
  const [active, setActive] = React.useState(open)
  // Keep the same tree through closing so forms and focus survive a resize.
  if (open && !active) setActive(true)
  if (!open && !active && presentation !== mobile) setPresentation(mobile)
  const shared = {
    ...props,
    open,
    onOpenChange: (
      next: boolean,
      details: DrawerPrimitive.Root.ChangeEventDetails
    ) => {
      onOpenChange?.(next, details)
      if (!details.isCanceled && controlledOpen === undefined) setOpen(next)
    },
    onOpenChangeComplete: (next: boolean) => {
      if (!next) setActive(false)
      onOpenChangeComplete?.(next)
    },
  }
  return (
    <CredenzaContext.Provider value={presentation}>
      {presentation ? (
        <Drawer.Drawer {...shared} showSwipeHandle />
      ) : (
        <Dialog.Dialog {...shared} />
      )}
    </CredenzaContext.Provider>
  )
}

// Base UI uses the same trigger implementation and store for both primitives.
// A drawer handle also satisfies the dialog handle contract.
export function CredenzaTrigger<T>(props: DrawerPrimitive.Trigger.Props<T>) {
  return <Drawer.DrawerTrigger {...props} />
}
export const createCredenzaHandle = DrawerPrimitive.createHandle

export function CredenzaContent({
  className,
  dialogClassName,
  children,
  showCloseButton = true,
  ...props
}: Omit<
  React.ComponentProps<typeof Dialog.DialogContent>,
  "render" | "style" | "className"
> & {
  dialogClassName?: string
  className?: string
  style?: React.CSSProperties
}) {
  const mobile = useCredenza()
  if (!mobile)
    return (
      <Dialog.DialogContent
        {...props}
        showCloseButton={showCloseButton}
        className={cn(
          "max-h-[85dvh] overflow-y-auto",
          className,
          dialogClassName
        )}
      >
        {children}
      </Dialog.DialogContent>
    )
  return (
    <Drawer.DrawerContent {...props}>
      <div
        className={cn(
          "relative grid min-h-0 gap-6 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
          className
        )}
      >
        {children}
        {showCloseButton && (
          <Drawer.DrawerClose
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-2 right-2"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </Drawer.DrawerClose>
        )}
      </div>
    </Drawer.DrawerContent>
  )
}

export function CredenzaClose(
  props: React.ComponentProps<typeof Dialog.DialogClose>
) {
  const Component = useCredenza() ? Drawer.DrawerClose : Dialog.DialogClose
  return <Component {...props} />
}
export function CredenzaHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const Component = useCredenza() ? Drawer.DrawerHeader : Dialog.DialogHeader
  return (
    <Component
      {...props}
      className={cn("gap-2 p-0 pr-8 text-left", className)}
    />
  )
}
export function CredenzaFooter({
  className,
  children,
  showCloseButton = false,
  ...props
}: React.ComponentProps<typeof Dialog.DialogFooter>) {
  const Component = useCredenza() ? Drawer.DrawerFooter : Dialog.DialogFooter
  return (
    <Component {...props} className={cn("m-0 p-0", className)}>
      {children}
      {showCloseButton && (
        <CredenzaClose render={<Button variant="outline" />}>
          Close
        </CredenzaClose>
      )}
    </Component>
  )
}
export function CredenzaTitle(
  props: React.ComponentProps<typeof Dialog.DialogTitle>
) {
  const Component = useCredenza() ? Drawer.DrawerTitle : Dialog.DialogTitle
  return <Component {...props} />
}
export function CredenzaDescription(
  props: React.ComponentProps<typeof Dialog.DialogDescription>
) {
  const Component = useCredenza()
    ? Drawer.DrawerDescription
    : Dialog.DialogDescription
  return <Component {...props} />
}
