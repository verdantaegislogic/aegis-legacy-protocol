"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { Plus, X } from "lucide-react"
import {
  createSignalEntryAction,
  initialSignalActionState,
} from "@/app/actions"

export function SignalEntryModal() {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [state, formAction, pending] = useActionState(createSignalEntryAction, initialSignalActionState)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (state.ok) {
      setOpen(false)
    }
  }, [state.ok])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Plus className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">New Signal Entry</span>
        <span className="sm:hidden">New signal</span>
      </button>
      <dialog
        ref={dialogRef}
        onCancel={() => setOpen(false)}
        className="w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/70"
      >
        <div className="flex items-start justify-between border-b border-border p-5 sm:p-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Telemetry intake</p>
            <h2 className="mt-2 text-xl font-medium">New Signal Entry</h2>
            <p className="mt-1 text-sm text-muted-foreground">Add a signal to the protocol ledger.</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Close signal entry form">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <form action={formAction} className="flex flex-col gap-5 p-5 sm:p-6">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">Title</span>
            <input name="title" required maxLength={120} className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none ring-primary/40 placeholder:text-muted-foreground focus:ring-2" placeholder="e.g. Edge node handshake" />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">Category</span>
            <select name="category" required defaultValue="" className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2">
              <option value="" disabled>Select a category</option>
              <option>Communication</option>
              <option>Security</option>
              <option>Infrastructure</option>
              <option>Verification</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">Details</span>
            <textarea name="details" required maxLength={1000} rows={4} className="resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none ring-primary/40 placeholder:text-muted-foreground focus:ring-2" placeholder="Describe the observed telemetry signal..." />
          </label>
          {state.message && <p role="status" className={state.ok ? "text-sm text-primary" : "text-sm text-destructive"}>{state.message}</p>}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" disabled={pending} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-wait disabled:opacity-60">{pending ? "Logging signal..." : "Log signal"}</button>
          </div>
        </form>
      </dialog>
    </>
  )
}
