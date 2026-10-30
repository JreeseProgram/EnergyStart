import { useId, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  EllipsisVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardFooter } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { BuildingUse } from "@/features/portfolio/models/building-use.models"
import { PROPERTY_TYPES } from "@/features/portfolio/utils/form-constants"

const pageSizes = [5, 10, 20, 50].map((value) => ({
  value,
  label: String(value),
}))

export function BuildingUsesTable({
  buildingUses,
  onEdit,
}: {
  buildingUses: BuildingUse[]
  onEdit: (buildingUse: BuildingUse) => void
}) {
  const [pagination, setPagination] = useState({ page: 0, size: 10 })
  const pageSizeId = useId()
  const pageCount = Math.max(
    1,
    Math.ceil(buildingUses.length / pagination.size)
  )
  const page = Math.min(pagination.page, pageCount - 1)
  const rows = buildingUses.slice(
    page * pagination.size,
    (page + 1) * pagination.size
  )
  const setPage = (next: number) =>
    setPagination((current) => ({
      ...current,
      page: Math.max(0, Math.min(next, pageCount - 1)),
    }))

  return (
    <Card className="gap-0 overflow-hidden rounded-2xl py-0">
      <Table>
        <TableCaption className="sr-only">
          Building uses for this property
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="h-20 pl-6">
              Use Type
            </TableHead>
            <TableHead scope="col" className="text-right">
              Floor Area
            </TableHead>
            <TableHead scope="col" className="w-44 text-right">
              Status
            </TableHead>
            <TableHead scope="col" className="w-16">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((use) => {
            const label = PROPERTY_TYPES.find(
              (type) => type.value === use.buildingUseType
            )?.label
            return (
              <TableRow key={use.id}>
                <TableCell className="h-20 pl-6">
                  <Button
                    variant="link"
                    className="h-auto p-0 font-semibold text-foreground underline"
                    onClick={() => onEdit(use)}
                  >
                    {label}
                  </Button>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {use.grossFloorArea.toLocaleString("en-US")}{" "}
                  <span className="text-muted-foreground">ft²</span>
                </TableCell>
                <TableCell className="text-right">
                  <Badge className="h-7 bg-emerald-50 px-3 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Complete
                  </Badge>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for ${label}`}
                        />
                      }
                    >
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(use)}>
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
          {buildingUses.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-40 text-center">
                <p className="font-medium">No building uses yet</p>
                <p className="mt-2 text-muted-foreground">
                  Add a building use to describe this property's floor area.
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CardFooter className="justify-end gap-6 border-t px-6 py-6">
        <div className="flex items-center gap-3">
          <label htmlFor={pageSizeId}>Rows per page</label>
          <Select
            items={pageSizes}
            value={pagination.size}
            onValueChange={(size) => {
              if (size !== null) setPagination({ page: 0, size })
            }}
          >
            <SelectTrigger id={pageSizeId} className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span role="status" className="tabular-nums">
          Page {page + 1} of {pageCount}
        </span>
        <nav aria-label="Building uses table pagination" className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="First page"
            disabled={page === 0}
            onClick={() => setPage(0)}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous page"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next page"
            disabled={page === pageCount - 1}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Last page"
            disabled={page === pageCount - 1}
            onClick={() => setPage(pageCount - 1)}
          >
            <ChevronsRight />
          </Button>
        </nav>
      </CardFooter>
    </Card>
  )
}
