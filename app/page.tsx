import { Activity, ArrowUpRight, Bell, ChevronRight, CircleCheck, Radio, ShieldCheck, Wifi } from "lucide-react"

const signals = [
  { label: "Calls screened", value: "12,840", delta: "+8.4%", tone: "positive" },
  { label: "Threats blocked", value: "248", delta: "-12.1%", tone: "positive" },
  { label: "Reality checks", value: "99.98%", delta: "+0.3%", tone: "positive" },
]

const events = [
  { time: "09:42:18", title: "Inbound call screened", detail: "+1 (209) 332-4588 · dropped", status: "Blocked" },
  { time: "09:39:04", title: "Reality signature verified", detail: "stream_7F2A · edge-west-02", status: "Verified" },
  { time: "09:35:51", title: "AI analysis completed", detail: "latency 184ms · confidence 0.97", status: "Clear" },
]

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_25%,transparent)]">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">AEGIS</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Legacy Protocol</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-primary sm:flex">
              <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" /> Systems nominal
            </span>
            <button className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Notifications">
              <Bell className="size-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        <section className="flex flex-1 flex-col gap-8 py-8 lg:py-12">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-primary">Command overview / 09.15.26</p>
              <h1 className="text-3xl font-medium tracking-[-0.04em] sm:text-5xl">Integrity at the edge.</h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">Monitor communication signals, verify reality, and keep legacy channels operating with confidence.</p>
            </div>
            <button className="flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted">
              Open protocol log <ArrowUpRight className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {signals.map((signal) => (
              <article key={signal.label} className="rounded-xl border border-border bg-card/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">{signal.label}</p>
                  <span className="font-mono text-[10px] text-primary">{signal.delta}</span>
                </div>
                <p className="mt-4 font-mono text-2xl tracking-tight">{signal.value}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
            <section className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-start justify-between border-b border-border p-5 sm:p-6">
                <div>
                  <div className="flex items-center gap-2 text-primary"><Activity className="size-4" aria-hidden="true" /><span className="font-mono text-[10px] uppercase tracking-[0.2em]">Live telemetry</span></div>
                  <h2 className="mt-2 text-lg font-medium">Protocol health</h2>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">REF: ALP-2048</span>
              </div>
              <div className="relative min-h-64 overflow-hidden bg-[linear-gradient(rgba(95,221,180,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(95,221,180,0.06)_1px,transparent_1px)] bg-[size:32px_32px] p-5 sm:p-8">
                <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
                <div className="absolute inset-x-1/4 top-[42%] h-16 rounded-[50%] border-t border-primary/80 shadow-[0_-8px_24px_color-mix(in_oklab,var(--primary)_20%,transparent)]" />
                <div className="absolute left-1/4 top-[36%] size-2 rounded-full bg-primary shadow-[0_0_14px_var(--primary)]" />
                <div className="absolute right-1/4 top-[47%] size-2 rounded-full bg-primary shadow-[0_0_14px_var(--primary)]" />
                <div className="absolute bottom-5 left-5 right-5 flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:bottom-8 sm:left-8 sm:right-8"><span>edge-west-02</span><span>signal stable</span></div>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border px-5 py-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:px-6"><span className="flex items-center gap-2"><Wifi className="size-3 text-primary" aria-hidden="true" /> 42 nodes online</span><span className="flex items-center gap-2"><Radio className="size-3 text-primary" aria-hidden="true" /> 184ms avg latency</span></div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Recent activity</p><h2 className="mt-2 text-lg font-medium">Signal ledger</h2></div><button className="text-muted-foreground transition-colors hover:text-foreground" aria-label="View all activity"><ChevronRight className="size-5" aria-hidden="true" /></button></div>
              <div className="mt-6 flex flex-col gap-5">
                {events.map((event) => <div key={event.time} className="flex gap-3"><div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5"><CircleCheck className="size-3.5 text-primary" aria-hidden="true" /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-medium">{event.title}</p><span className="font-mono text-[9px] uppercase tracking-wider text-primary">{event.status}</span></div><p className="mt-1 truncate text-xs text-muted-foreground">{event.detail}</p><p className="mt-1 font-mono text-[10px] text-muted-foreground/70">{event.time} UTC</p></div></div>)}
              </div>
            </section>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-border py-5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>Aegis Legacy Protocol · Core 1.0</span><span>Encrypted channel · node 07</span></footer>
      </div>
    </main>
  )
}
