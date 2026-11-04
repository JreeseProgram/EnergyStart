import { useId, useState } from "react"
import {
  createColumnHelper,
  createPaginatedRowModel,
  FlexRender,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"
import { Plus, Pencil, ChevronLeft, ChevronRight } from "lucide-react"
import { ContentHeader } from "@/components/layouts/content-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
import type { Property } from "@/features/portfolio/models/property.models"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import { EnergyMeterModal } from "@/features/portfolio/modals/energy-meter.modal"
import { EnergyMeterDetailsModal } from "@/features/portfolio/modals/energy-meter-details.modal"
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
  const pageSizeId = useId()
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const columns = helper.columns([
    helper.accessor("meterId", {
      header: "Meter",
      cell: ({ row }) => (
        <EnergyMeterDetailsModal
          meter={row.original}
          render={
            <Button
              variant="link"
              className="h-auto justify-start p-0 font-semibold underline"
            />
          }
        >
          {row.original.meterId || "Unnamed meter"}
        </EnergyMeterDetailsModal>
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
              {meterDate(latest.endDate)}
            </div>
          </div>
        )
      },
    }),
    helper.display({
      id: "updated",
      header: "Updated",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {meterDate(row.original.updatedAt ?? row.original.date)}
        </span>
      ),
    }),
    helper.accessor("inUse", {
      header: "Status",
      cell: ({ row }) => (row.original.inUse ? "Active" : "Inactive"),
    }),
    helper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <EnergyMeterModal
          propertyId={property.id}
          meter={row.original}
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Edit ${row.original.meterId || "meter"}`}
            />
          }
        >
          <Pencil className="size-4" />
        </EnergyMeterModal>
      ),
    }),
  ])
  const table = useTable({
    features,
    data: meters,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getRowId: (row) => row.id,
  })

  return (
    <>
      <ContentHeader
        title="Energy meters"
        description={`${meters.length} ${meters.length === 1 ? "meter" : "meters"} measuring ${property.name}`}
        action={
          <EnergyMeterModal propertyId={property.id} render={<Button />}>
            Add meter <Plus className="size-4" />
          </EnergyMeterModal>
        }
      />
      <Card className="rounded-2xl">
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
              <div className="flex items-center justify-end gap-4 pt-4 text-sm">
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
                  Page {pagination.pageIndex + 1} of{" "}
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
      <p className="text-xs text-muted-foreground">
        Prototype meter data. Changes are kept during navigation and may reset
        when the page is refreshed.
      </p>
    </>
  )
}
