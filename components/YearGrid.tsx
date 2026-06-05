"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildYear,
  formatDate,
  type DayCell,
  type YearModel,
} from "@/lib/year";
import styles from "./YearGrid.module.css";

interface HoverState {
  cell: DayCell;
  x: number;
  y: number;
}

export default function YearGrid() {
  // Compute "today" on the client after mount to avoid hydration mismatch
  // between server time and the visitor's local time.
  const [now, setNow] = useState<Date | null>(null);
  const [hover, setHover] = useState<HoverState | null>(null);

  useEffect(() => {
    setNow(new Date());

    // Roll the grid over at local midnight without a manual refresh.
    const next = new Date();
    next.setHours(24, 0, 1, 0);
    const timer = setTimeout(() => setNow(new Date()), next.getTime() - Date.now());
    return () => clearTimeout(timer);
  }, []);

  const model: YearModel | null = useMemo(
    () => (now ? buildYear(now) : null),
    [now]
  );

  if (!model) {
    return (
      <div className={styles.shell}>
        <div className={styles.booting}>initializing year matrix…</div>
      </div>
    );
  }

  const pct = model.percentComplete;

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>
            <span className={styles.bracket}>[</span>
            {model.year}
            <span className={styles.bracket}>]</span>
            <span className={styles.subtitle}>// year.dots</span>
          </h1>
          <div className={styles.pct}>{pct.toFixed(2)}%</div>
        </div>

        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${pct}%` }}
          />
          <div
            className={styles.progressHead}
            style={{ left: `${pct}%` }}
          />
        </div>

        <div className={styles.stats}>
          <Stat label="DAY" value={`${model.dayOfYear}/${model.totalDays}`} />
          <Stat label="ELAPSED" value={`${model.daysPassed}d`} />
          <Stat label="REMAINING" value={`${model.daysRemaining}d`} accent />
          <Stat
            label="WEEK"
            value={`${Math.ceil(model.dayOfYear / 7)}/53`}
          />
          <Stat label="LEAP" value={model.isLeapYear ? "TRUE" : "FALSE"} />
        </div>
      </header>

      <section className={styles.grid} aria-label="Days of the year">
        {model.months.map((group) => (
          <div className={styles.monthRow} key={group.month}>
            <div className={styles.monthLabel}>{group.label}</div>
            <div className={styles.dots}>
              {group.days.map((cell) => (
                <button
                  key={cell.dayOfYear}
                  type="button"
                  className={`${styles.dot} ${styles[cell.status]}`}
                  aria-label={`${formatDate(cell.date)} — ${cell.status}`}
                  onMouseEnter={(e) =>
                    setHover({
                      cell,
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  onMouseMove={(e) =>
                    setHover({
                      cell,
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  onMouseLeave={() => setHover(null)}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className={styles.legend}>
        <LegendItem className={styles.past} label="elapsed" />
        <LegendItem className={styles.today} label="today" />
        <LegendItem className={styles.future} label="remaining" />
        <div className={styles.legendSpacer} />
        <span className={styles.signature}>each dot = one day</span>
      </footer>

      {hover && (
        <div
          className={styles.tooltip}
          style={{
            transform: `translate(${hover.x + 16}px, ${hover.y + 16}px)`,
          }}
        >
          <div className={styles.tooltipDate}>{formatDate(hover.cell.date)}</div>
          <div className={styles.tooltipMeta}>
            day {hover.cell.dayOfYear} · {hover.cell.status}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={`${styles.statValue} ${accent ? styles.statAccent : ""}`}>
        {value}
      </span>
    </div>
  );
}

function LegendItem({ className, label }: { className: string; label: string }) {
  return (
    <div className={styles.legendItem}>
      <span className={`${styles.legendDot} ${className}`} />
      <span>{label}</span>
    </div>
  );
}
