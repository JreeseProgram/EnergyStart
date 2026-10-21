import { useId, useState } from "react"
import { Link } from "react-router"
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { paths } from "@/config/paths"
import type { Property } from "@/features/portfolio/models/property.models"
import { PROPERTY_TYPES } from "@/features/portfolio/utils/form-constants"

const pageSizes = [5, 10, 20, 50].map((size) => ({
  label: String(size),
  value: size,
}))

export function PortfolioPropertiesTable({
  properties,
}: {
  properties: Property[]
}) {
  const [pagination, setPagination] = useState({ page: 0, size: 10 })
  const pageSizeId = useId()
  const pageCount = Math.max(1, Math.ceil(properties.length / pagination.size))
  const page = Math.min(pagination.page, pageCount - 1)
  const rows = properties.slice(
    page * pagination.size,
    (page + 1) * pagination.size
  )
  const setPage = (next: number) =>
    setPagination((current) => ({
      ...current,
      page: Math.max(0, Math.min(next, pageCount - 1)),
    }))

  return (
    <Card className="rounded-2xl">
      <CardHeader spacing="between">
        <div>
          <CardTitle>Properties</CardTitle>
          <CardDescription>Portfolio performance by property</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          render={<Link to={paths.app.properties.getHref()} />}
        >
          View all properties <ArrowRight />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption className="sr-only">
            Properties in your portfolio. EUI values are not available yet.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Property</TableHead>
              <TableHead scope="col">Property Type</TableHead>
              <TableHead scope="col" className="text-right">
                Energy Star Score
              </TableHead>
              <TableHead scope="col" className="text-right">
                Site EUI
              </TableHead>
              <TableHead scope="col" className="text-right">
                Source EUI
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="h-12">
                  <Link
                    className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                    to={paths.app.property.root.getHref(property.id)}
                  >
                    {property.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {
                      PROPERTY_TYPES.find(
                        (type) => type.value === property.propertyType
                      )?.label
                    }
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {property.energyStarScore}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  <span aria-label="Not available">—</span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  <span aria-label="Not available">—</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-end gap-6">
        <div className="flex items-center gap-2">
          <label htmlFor={pageSizeId}>Rows per page</label>
          <Select
            items={pageSizes}
            value={pagination.size}
            onValueChange={(size) => {
              if (size !== null) setPagination({ page: 0, size })
            }}
          >
            <SelectTrigger id={pageSizeId} size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span role="status" className="text-sm tabular-nums">
          Page {page + 1} of {pageCount}
        </span>
        <nav aria-label="Properties table pagination" className="flex gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="First page"
            disabled={page === 0}
            onClick={() => setPage(0)}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={page === pageCount - 1}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
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
