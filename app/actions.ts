"use server"

export type SignalActionState = {
  ok: boolean
  message: string
}

export const initialSignalActionState: SignalActionState = {
  ok: false,
  message: "",
}

export async function createSignalEntryAction(
  _previousState: SignalActionState,
  formData: FormData,
): Promise<SignalActionState> {
  const title = String(formData.get("title") ?? "").trim()
  const category = String(formData.get("category") ?? "").trim()
  const details = String(formData.get("details") ?? "").trim()

  if (!title || !category || !details) {
    return { ok: false, message: "Complete all signal fields before submitting." }
  }

  console.log("[v0] New telemetry signal", {
    title,
    category,
    details,
    receivedAt: new Date().toISOString(),
  })

  return { ok: true, message: "Signal entry logged to the protocol ledger." }
}

