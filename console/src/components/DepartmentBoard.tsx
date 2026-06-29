// The v2 DEPARTMENT BOARD: the founder's whole company as department lanes, each with its standing
// and a single move, led by the ONE diagnosed binding constraint. A lane never ranks its own work --
// its move is the top item of the same global, constraint-aware ranking that belongs to the lane, so
// the board is a LENS, never a per-department curriculum. When no constraint is diagnosed the board
// says so loudly rather than presenting generic ranking as if it were a diagnosis.

import { company, type BoardLane } from "../mockData";

const INTENSITY: Record<BoardLane["intensity"], { label: string; cls: string }> = {
  lead: { label: "Lead", cls: "bg-agent-500 text-white" },
  active: { label: "Active", cls: "bg-approve-50 text-approve-700" },
  idle: { label: "Idle", cls: "bg-canvas text-ink-400" },
};

function Lane({ lane, onOpenTask }: { lane: BoardLane; onOpenTask: (id: string) => void }) {
  const tag = INTENSITY[lane.intensity];
  const move = lane.topMove;
  return (
    <div
      className={`flex flex-col rounded-xl border bg-surface p-4 shadow-card ${
        lane.isLead ? "border-agent-300 ring-1 ring-agent-200" : "border-line"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink-900">{lane.department}</span>
        <span className={`rounded-md px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${tag.cls}`}>
          {tag.label}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-canvas">
          <div className="h-full rounded-full bg-approve-500" style={{ width: `${lane.pct}%` }} />
        </div>
        <span className="font-mono text-[10px] tabular text-ink-400">{lane.done}/{lane.total}</span>
      </div>
      <div className="mt-1 flex gap-3 font-mono text-[10px] text-ink-400">
        {lane.ready > 0 && <span className="text-human-600">{lane.ready} ready</span>}
        {lane.blocked > 0 && <span>{lane.blocked} blocked</span>}
        {lane.working > 0 && <span className="text-agent-600">{lane.working} working</span>}
      </div>

      <div className="mt-3 border-t border-line pt-3">
        <div className="font-mono text-[9px] uppercase tracking-wider text-ink-300">
          {lane.isLead ? "Your move" : "Available in this function"}
        </div>
        {move ? (
          <button
            type="button"
            onClick={() => onOpenTask(move.id)}
            className="mt-1 w-full text-left"
          >
            <div className="text-xs font-medium leading-snug text-ink-800 hover:text-ink-950">{move.title}</div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="font-mono text-[9px] text-ink-400">{move.criticalityLabel}</span>
              {move.humanGate && (
                <span className="rounded bg-human-50 px-1 font-mono text-[9px] text-human-700">needs you</span>
              )}
            </div>
          </button>
        ) : (
          <div className="mt-1 text-xs text-ink-300">No ready work in this lane.</div>
        )}
      </div>
    </div>
  );
}

function ConstraintBanner() {
  const c = company.constraint;
  if (!c) return null;
  if (c.missing) {
    return (
      <div className="rounded-xl border border-human-300 bg-human-50 p-4">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-human-500 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-white">
            No constraint
          </span>
          <span className="text-sm font-semibold text-human-800">This ranking is generic. Do not trust it.</span>
        </div>
        <p className="mt-1.5 text-xs text-human-700">
          No binding constraint has been diagnosed, so the board cannot tell which department leads. Run the constraint
          step of /casa-start. {c.defaultLead ? `Showing ${c.defaultLead} as a type default guess only.` : ""}
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-agent-200 bg-agent-50 p-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-mono text-2xs uppercase tracking-wider text-agent-700">Binding constraint</span>
        <span className="text-sm font-semibold text-ink-900">{c.label}</span>
        {c.leadDepartments.length > 0 && (
          <span className="text-xs text-ink-500">
            Lead: <span className="font-medium text-ink-700">{c.leadDepartments.join(", ")}</span>
          </span>
        )}
      </div>
      {c.win && <p className="mt-1 text-xs text-ink-500">Win: {c.win}</p>}
    </div>
  );
}

export function DepartmentBoard({ onOpenTask }: { onOpenTask: (id: string) => void }) {
  const board = company.board || [];
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <div>
          <h1 className="text-lg font-semibold text-ink-900">{company.name || "Your company"}</h1>
          <p className="text-xs text-ink-500">{company.oneLiner}</p>
        </div>

        <ConstraintBanner />

        {board.length === 0 ? (
          <div className="rounded-xl border border-line bg-surface p-8 text-center text-sm text-ink-400">
            No departments yet. Run /casa-start to build the company brain.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {board.map((lane) => (
              <Lane key={lane.department} lane={lane} onOpenTask={onOpenTask} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
