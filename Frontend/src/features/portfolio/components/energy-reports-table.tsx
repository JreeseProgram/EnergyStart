import { useId, useState } from "react"
import {
  createColumnHelper,
  createPaginatedRowModel,
  FlexRender,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  EllipsisVertical,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableCaption,
  TableHeader,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import type { EnergyReport } from "@/features/portfolio/models/energy-report.models"
import {
  reportMonthLabel,
  reportResultLabel,
  reportTypeLabel,
} from "@/features/portfolio/utils/energy-report-labels"
import { meterDate } from "@/features/portfolio/utils/energy-meter-labels"

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})
const helper = createColumnHelper<typeof features, EnergyReport>()
export function EnergyReportsTable({
  reports,
  onOpen,
}: {
  reports: EnergyReport[]
  onOpen: (report: EnergyReport) => void
}) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const sizeId = useId()
  const columns = helper.columns([
    helper.accessor("name", {
      header: "Report",
      cell: ({ row }) => (
        <Button
          variant="link"
          className="h-auto p-0 font-semibold text-foreground underline"
          onClick={() => onOpen(row.original)}
        >
          {row.original.name}
        </Button>
      ),
    }),
    helper.accessor("reportType", {
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline">
          {reportTypeLabel(row.original.reportType)}
        </Badge>
      ),
    }),
    helper.display({
      id: "period",
      header: "Period",
      cell: ({ row }) => (
        <span>
          {reportMonthLabel(row.original.startMonth)} to{" "}
          {reportMonthLabel(row.original.endMonth)}
        </span>
      ),
    }),
    helper.accessor("result", {
      header: "Result",
      cell: ({ row }) => (
        <span className="font-semibold tabular-nums">
          {reportResultLabel(row.original)}
        </span>
      ),
    }),
    helper.accessor("generatedAt", {
      header: "Generated",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {meterDate(row.original.generatedAt)}
        </span>
      ),
    }),
    helper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for ${row.original.name}`}
              />
            }
          >
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onOpen(row.original)}>
              View report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ])
  const table = useTable({
    features,
    data: reports,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getRowId: (row) => row.id,
  })
  return (
    <Card className="rounded-2xl">
      <CardContent>
        {reports.length === 0 ? (
          <div className="flex flex-col gap-2 py-8">
            <h3 className="font-semibold">No reports yet</h3>
            <p className="text-sm text-muted-foreground">
              Generate a simulated report to save a result for this property.
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableCaption className="sr-only">
                Saved simulated reports for the selected property
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
                      <TableCell key={cell.id} className="h-14">
                        <FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <nav
              aria-label="Report table pagination"
              className="flex items-center justify-end gap-3 pt-4 text-sm"
            >
              <label htmlFor={sizeId}>Rows per page</label>
              <Select
                value={String(pagination.pageSize)}
                items={[10, 20, 50].map((size) => ({
                  value: String(size),
                  label: String(size),
                }))}
                onValueChange={(value) => {
                  if (value) table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" id={sizeId}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>
                Page {pagination.pageIndex + 1} of{" "}
                {Math.max(1, table.getPageCount())}
              </span>
              <Button
                size="icon-sm"
                variant="outline"
                aria-label="First page"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.setPageIndex(0)}
              >
                <ChevronsLeft />
              </Button>
              <Button
                size="icon-sm"
                variant="outline"
                aria-label="Previous page"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                <ChevronLeft />
              </Button>
              <Button
                size="icon-sm"
                variant="outline"
                aria-label="Next page"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                <ChevronRight />
              </Button>
              <Button
                size="icon-sm"
                variant="outline"
                aria-label="Last page"
                disabled={!table.getCanNextPage()}
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              >
                <ChevronsRight />
              </Button>
            </nav>
          </>
        )}
      </CardContent>
    </Card>
  )
}
