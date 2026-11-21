import { useRef, useState } from "react"
import { isAxiosError } from "axios"
import { Button } from "@/components/ui/button"
import { Credenza, CredenzaContent, CredenzaHeader, CredenzaTitle, CredenzaDescription, CredenzaFooter } from "@/components/ui/credenza"
import { toast } from "@/components/ui/toast"
import { useDeletePortfolioRecord, type PortfolioDeletion } from "@/features/portfolio/api/portfolio/delete-portfolio.api"

type Selection = { input: PortfolioDeletion; name: string }

export function usePortfolioDeletion() {
  const [selection, setSelection] = useState<Selection | null>(null)
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLElement | null>(null)
  const fallback = useRef<HTMLDivElement | null>(null)
  const cancel = useRef<HTMLButtonElement | null>(null)
  const succeeded = useRef(false)
  const submitting = useRef(false)
  const mutation = useDeletePortfolioRecord()

  function requestDelete(input: PortfolioDeletion, name: string, returnFocus?: HTMLElement | null) {
    trigger.current = returnFocus ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null)
    succeeded.current = false
    mutation.reset()
    setSelection({ input, name })
    setOpen(true)
  }

  async function submit() {
    if (!selection || submitting.current) return
    submitting.current = true
    try {
      const result = await mutation.mutateAsync(selection.input)
      succeeded.current = true
      setOpen(false)
      if (selection.input.kind === "property") {
        const heading = document.querySelector<HTMLElement>("main h1, main h2, main")
        if (heading) { heading.tabIndex = -1; heading.focus() }
      }
      toast.add({
        type: result.refreshed ? "success" : "warning",
        title: `${selection.input.kind === "building use" ? "Building use" : selection.input.kind[0].toUpperCase() + selection.input.kind.slice(1)} deleted`,
        description: result.refreshed ? undefined : "Deletion succeeded, but refreshed data could not be loaded. Refresh the view; do not delete again.",
      })
    } catch {
      // The mutation error remains visible in the confirmation.
    } finally {
      submitting.current = false
    }
  }

  const status = isAxiosError(mutation.error) ? mutation.error.response?.status : undefined
  const error = status === 403 ? "You no longer have permission to delete this record."
    : status === 404 ? "This record was not found. Cancel and refresh the view."
    : "Could not delete this record. Check your connection and try again."

  const confirmation = (
    <>
      <Credenza open={open} onOpenChange={(next, details) => {
        if (submitting.current) { details.cancel(); return }
        setOpen(next)
      }}>
        <CredenzaContent
          showCloseButton={!mutation.isPending}
          initialFocus={cancel}
          finalFocus={() => succeeded.current ? fallback.current : trigger.current}
        >
          <CredenzaHeader>
            <CredenzaTitle>Delete {selection?.input.kind}?</CredenzaTitle>
            <CredenzaDescription>
              Permanently delete {selection?.name}?
              {selection?.input.kind === "meter" && " All readings associated with this meter will also be deleted."}
              {selection?.input.kind === "property" && " All associated meters, readings, and building uses will also be deleted for everyone with access."}
              {" This cannot be undone."}
            </CredenzaDescription>
          </CredenzaHeader>
          {mutation.isError && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <CredenzaFooter>
            <Button ref={cancel} variant="outline" disabled={mutation.isPending} onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={mutation.isPending || status === 403 || status === 404} onClick={() => void submit()}>
              {mutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </>
  )
  return { requestDelete, confirmation, successFocus: fallback, isDeleteOpen: open }
}
