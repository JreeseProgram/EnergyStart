import { useRef, type RefObject } from "react"
import { Plus, EllipsisVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { DialogTrigger, createDialogHandle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"

type MeterDialogHandle = ReturnType<typeof createDialogHandle<EnergyMeter>>

export function EnergyMeterActions({
  meter,
  readingDialog,
  historyDialog,
  editDialog,
  returnFocusRef,
}: {
  meter: EnergyMeter
  readingDialog: MeterDialogHandle
  historyDialog: MeterDialogHandle
  editDialog: MeterDialogHandle
  returnFocusRef: RefObject<HTMLElement | null>
}) {
  const menuTrigger = useRef<HTMLButtonElement | null>(null)

  function openFromMenu(dialog: MeterDialogHandle) {
    returnFocusRef.current = menuTrigger.current
    dialog.openWithPayload(meter)
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2 whitespace-nowrap">
        <DialogTrigger
          handle={readingDialog}
          payload={meter}
          render={<Button variant="outline" size="sm" />}
          disabled={!meter.inUse}
          aria-label={`Add reading for ${meter.meterName || "Unnamed meter"}`}
        >
          <Plus /> Add reading
        </DialogTrigger>
        <DropdownMenu>
          <DropdownMenuTrigger
            ref={menuTrigger}
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for ${meter.meterName || "Unnamed meter"}`}
              />
            }
          >
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            finalFocus={() =>
              historyDialog.isOpen || editDialog.isOpen
                ? false
                : menuTrigger.current
            }
          >
            <DropdownMenuItem onClick={() => openFromMenu(historyDialog)}>
              View readings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openFromMenu(editDialog)}>
              Edit meter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!meter.inUse && (
        <p className="max-w-48 text-right text-xs text-muted-foreground">
          Activate this meter to add readings.
        </p>
      )}
    </div>
  )
}
