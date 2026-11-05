import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  EllipsisVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type {
  Property,
  PropertyAssignment,
} from "@/features/portfolio/models/property.models"

export function PropertySharingTable({
  property,
  canManage,
  onRemove,
}: {
  property: Property
  canManage: boolean
  onRemove: (assignment: PropertyAssignment) => void
}) {
  const [requestedPage, setPage] = useState(0)
  const pageCount = Math.max(1, Math.ceil(property.assignments.length / 10))
  const page = Math.min(requestedPage, pageCount - 1)
  const rows = property.assignments.slice(page * 10, (page + 1) * 10)
  return (
    <Card className="gap-0 overflow-hidden rounded-2xl py-0">
      <Table>
        <TableCaption className="sr-only">
          Users with access to {property.name}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="h-16 pl-6">
              User
            </TableHead>
            <TableHead scope="col" className="w-48 text-right">
              Assigned
            </TableHead>
            <TableHead scope="col" className="w-16">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((assignment) => {
            const { user } = assignment
            const name =
              [user.firstName, user.lastName].filter(Boolean).join(" ") ||
              user.email
            return (
              <TableRow key={user.id}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3 py-2">
                    <Avatar>
                      <AvatarFallback>
                        {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
                        {user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  <time dateTime={assignment.assignedAt}>
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(assignment.assignedAt))}
                  </time>
                </TableCell>
                <TableCell>
                  {canManage && (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Actions for ${user.email}`}
                          />
                        }
                      >
                        <EllipsisVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onRemove(assignment)}
                        >
                          Remove access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="h-40 text-center">
                <p className="font-medium">No shared users yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {canManage
                    ? "Add a registered user to share this property."
                    : "Only the owner has access to this property."}
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CardFooter className="justify-end gap-4 border-t py-4 text-sm">
        <span>
          Rows per page{" "}
          <span className="ml-2 rounded-lg border px-3 py-1">10</span>
        </span>
        <span aria-live="polite">
          Page {page + 1} of {pageCount}
        </span>
        <div className="flex gap-2">
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
        </div>
      </CardFooter>
    </Card>
  )
}
