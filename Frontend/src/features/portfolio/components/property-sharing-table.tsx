import { useState } from "react"
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
import type { PropertyUser } from "@/features/portfolio/services/property.service"

export function PropertySharingTable({
  users,
  propertyName,
  currentUserId,
  canManage,
  onRemove,
}: {
  users: PropertyUser[]
  propertyName: string
  currentUserId?: string
  canManage: boolean
  onRemove: (user: PropertyUser) => void
}) {
  const [requestedPage, setPage] = useState(0)
  const pageCount = Math.max(1, Math.ceil(users.length / 10))
  const page = Math.min(requestedPage, pageCount - 1)
  const rows = users.slice(page * 10, (page + 1) * 10)
  return (
    <Card className="gap-0 overflow-hidden rounded-2xl py-0">
      <Table>
        <TableCaption className="sr-only">
          Users with access to {propertyName}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="h-16 pl-6">
              User
            </TableHead>
            <TableHead scope="col" className="pr-6 text-right">
              Access
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((user) => {
            const name =
              [user.firstName, user.lastName].filter(Boolean).join(" ") ||
              user.email
            const isSelf = user.userId === currentUserId
            return (
              <TableRow key={user.userId}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3 py-2">
                    <Avatar>
                      <AvatarFallback>
                        {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
                        {user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {name}
                        {isSelf ? " (you)" : ""}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  {canManage && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={users.length <= 1}
                      onClick={() => onRemove(user)}
                      aria-label={
                        isSelf
                          ? "Leave property"
                          : `Remove access for ${user.email}`
                      }
                    >
                      {isSelf ? "Leave property" : "Remove access"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="p-6 text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
        <p className="text-sm text-muted-foreground">
          {users.length === 1
            ? "The last authorized user cannot be removed."
            : `${users.length} users`}{" "}
          · Page {page + 1} of {pageCount}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === pageCount - 1}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
