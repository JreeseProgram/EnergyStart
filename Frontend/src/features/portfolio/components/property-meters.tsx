import { usePortfolioDeletion } from "@/features/portfolio/hooks/use-portfolio-deletion"
import { useId, useState, useRef } from "react"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { ContentHeader } from "@/components/layouts/content-header"
import type { Property } from "@/features/portfolio/models/property.models"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import { EnergyMeterModal } from "@/features/portfolio/modals/energy-meter.modal"
import { EnergyMeterHistoryModal } from "@/features/portfolio/modals/energy-meter-history.modal"
import { EnergyReadingModal } from "@/features/portfolio/modals/energy-reading.modal"
import { EnergyMeterActions } from "@/features/portfolio/components/energy-meter-actions"
import { CredenzaTrigger, createCredenzaHandle } from "@/components/ui/credenza"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  createColumnHelper,
  createPaginatedRowModel,
  FlexRender,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"

import {
  latestReading,
  meterDate,
  meterTypeLabel,
} from "@/features/portfolio/utils/energy-meter-labels"

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

const helper = createColumnHelper<typeof features, EnergyMeter>()

export function PropertyMeters({
  property,
  meters,
}: {
  property: Property
  meters: EnergyMeter[]
}) {
  const { requestDelete, confirmation, successFocus, isDeleteOpen } = usePortfolioDeletion()
  const [readingDialog] = useState(() => createCredenzaHandle<EnergyMeter>())
  const [historyDialog] = useState(() => createCredenzaHandle<EnergyMeter>())
  const [editDialog] = useState(() => createCredenzaHandle<EnergyMeter>())
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const propertyName = property.name || "Unnamed property"
  const pageSizeId = useId()
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const columns = helper.columns([
    helper.accessor("meterName", {
      header: "Meter",
      cell: ({ row }) => (
        <span className="font-semibold text-foreground">
          {row.original.meterName || "Unnamed meter"}
        </span>
      ),
    }),

    helper.display({
      id: "property",
      header: "Attached to",
      cell: () => property.name,
    }),

    helper.accessor("meterType", {
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline">
          {meterTypeLabel(row.original.meterType)}
        </Badge>
      ),
    }),

    helper.accessor("unitOfMeasure", {
      header: "Units",
      cell: ({ row }) => row.original.unitOfMeasure.replaceAll("_", " "),
    }),

    helper.display({
      id: "latest",
      header: "Latest reading",
      cell: ({ row }) => {
        const latest = latestReading(row.original)
        if (!latest)
          return <span className="text-muted-foreground">No readings</span>
        return (
          <div className="tabular-nums">
            {latest.usage.toLocaleString("en-US")} {row.original.unitOfMeasure}
            <div className="text-xs text-muted-foreground">
              {meterDate(latest.date)}
            </div>
          </div>
        )
      },
    }),

    helper.accessor("inUse", {
      header: "Status",
      cell: ({ row }) => (row.original.inUse ? "Active" : "Inactive"),
    }),

    helper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <EnergyMeterActions
          meter={row.original}
          isDeleteOpen={isDeleteOpen}
          onDelete={(meter, trigger) => requestDelete(
            { kind: "meter", propertyId: property.id, energyMeterId: meter.meterId },
            meter.meterName || "Unnamed meter", trigger
          )}
          readingDialog={readingDialog}
          historyDialog={historyDialog}
          editDialog={editDialog}
          returnFocusRef={returnFocusRef}
        />
      ),
    }),
  ])

  const pageIndex = Math.min(pagination.pageIndex, Math.max(0, Math.ceil(meters.length / pagination.pageSize) - 1))
  const table = useTable({
    features,
    data: meters,
    columns,
    state: { pagination: { ...pagination, pageIndex } },
    onPaginationChange: setPagination,
    getRowId: (row) => row.meterId,
  })

  return (
    <>
      {confirmation}
      <EnergyReadingModal handle={readingDialog} propertyName={propertyName} />

      <EnergyMeterHistoryModal
        handle={historyDialog}
        propertyName={propertyName}
        finalFocus={returnFocusRef}
      />

      <EnergyMeterModal
        propertyId={property.id}
        handle={editDialog}
        finalFocus={returnFocusRef}
      />

      <ContentHeader
        title="Energy meters"
        description={`${meters.length} ${meters.length === 1 ? "meter" : "meters"} measuring ${property.name}. Add monthly usage using Add reading on a meter.`}
        action={
          <EnergyMeterModal propertyId={property.id}>
            <CredenzaTrigger render={<Button />}>
              Add meter <Plus className="size-4" />
            </CredenzaTrigger>
          </EnergyMeterModal>
        }
      />

      <Card ref={successFocus} tabIndex={-1} aria-label="Energy meters" className="rounded-2xl">
        <CardContent>
          {meters.length === 0 ? (
            <div className="flex flex-col items-start gap-3 py-8">
              <h3 className="font-semibold">No energy meters yet</h3>
              <p className="text-sm text-muted-foreground">
                Add a meter, choose its units, then record usage for this
                property.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableCaption className="sr-only">
                  Energy meters belonging to {property.name}
                </TableCaption>
                <TableHeader>
                  {table.getHeaderGroups().map((group) => (
                    <TableRow key={group.id}>
                      {group.headers.map((header) => (
                        <TableHead scope="col" key={header.id}>
                          {header.isPlaceholder ? null : (
                            <FlexRender header={header} />
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getAllCells().map((cell) => (
                        <TableCell className="h-14" key={cell.id}>
                          <FlexRender cell={cell} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex flex-wrap items-center justify-end gap-4 pt-4 text-sm">
                <label htmlFor={pageSizeId}>Rows per page</label>
                <Select
                  items={[10, 20, 50].map((value) => ({
                    value: String(value),
                    label: String(value),
                  }))}
                  value={String(pagination.pageSize)}
                  onValueChange={(value) => {
                    if (value) table.setPageSize(Number(value))
                  }}
                >
                  <SelectTrigger id={pageSizeId} size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50].map((value) => (
                      <SelectItem key={value} value={String(value)}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span>
                  Page {pageIndex + 1} of{" "}
                  {Math.max(1, table.getPageCount())}
                </span>

                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Previous page"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                >
                  <ChevronLeft />
                </Button>

                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Next page"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                >
                  <ChevronRight />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}
