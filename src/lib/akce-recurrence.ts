// src/lib/akce-recurrence.ts
// Čisté funkce pro práci s termínem akce. Žádný I/O, žádný globální čas —
// `now` se vždy předává parametrem (determinismus testů).

export type TerminInput =
  | { druh: 'jednorazova'; zacatek: string; konec?: string | null }
  | {
      druh: 'opakovana';
      dny_v_tydnu: number[]; // 1=po … 7=ne (ISO)
      cas_od: string;        // "HH:MM"
      cas_do?: string | null;
      plati_od: string;      // "YYYY-MM-DD"
      plati_do?: string | null;
    };

const DEN_NAZEV = ['', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobotu', 'neděli'];

/** CZ UTC offset ("+02:00"/"+01:00") pro dané datum dle Europe/Prague. */
function czOffset(date: Date): string {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Prague',
    timeZoneName: 'longOffset',
  });
  const part = fmt.formatToParts(date).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+02:00';
  const m = part.match(/GMT([+-]\d{2}:\d{2})/);
  return m ? m[1] : '+02:00';
}

/** ISO date "YYYY-MM-DD" + "HH:MM" + CZ offset → ISO datetime s offsetem. */
function isoLocal(dateYmd: string, hhmm: string): string {
  const base = new Date(`${dateYmd}T${hhmm}:00`);
  const off = czOffset(base);
  return `${dateYmd}T${hhmm}:00.000${off}`;
}

export function computeNextOccurrence(t: TerminInput, now: Date): string | null {
  if (t.druh === 'jednorazova') {
    const end = t.konec ? new Date(t.konec) : new Date(t.zacatek);
    return end.getTime() >= now.getTime() ? t.zacatek : null;
  }
  const platiOd = new Date(`${t.plati_od}T00:00:00${czOffset(now)}`);
  const platiDo = t.plati_do ? new Date(`${t.plati_do}T23:59:59${czOffset(now)}`) : null;
  for (let i = 0; i < 14; i++) {
    const day = new Date(now.getTime() + i * 86400000);
    const ymd = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Prague', year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(day);
    const wd = czWeekday(day);
    if (!t.dny_v_tydnu.includes(wd)) continue;
    const candidate = isoLocal(ymd, t.cas_od);
    const candDate = new Date(candidate);
    if (candDate.getTime() < now.getTime()) continue;
    if (candDate.getTime() < platiOd.getTime()) continue;
    if (platiDo && candDate.getTime() > platiDo.getTime()) return null;
    return candidate;
  }
  return null;
}

/** ISO weekday 1..7 v Europe/Prague. */
function czWeekday(d: Date): number {
  const name = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Prague', weekday: 'short' }).format(d);
  const map: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  return map[name] ?? 1;
}

export function formatTermin(t: TerminInput): string {
  if (t.druh === 'jednorazova') {
    const d = new Date(t.zacatek);
    const datum = new Intl.DateTimeFormat('cs-CZ', {
      timeZone: 'Europe/Prague', day: 'numeric', month: 'numeric', year: 'numeric',
    }).format(d);
    const cas = new Intl.DateTimeFormat('cs-CZ', {
      timeZone: 'Europe/Prague', hour: 'numeric', minute: '2-digit',
    }).format(d);
    return `${datum} od ${cas}`;
  }
  const dny = t.dny_v_tydnu.map((w) => DEN_NAZEV[w]).join(', ');
  const cas = t.cas_do ? `${stripLeadingZero(t.cas_od)}–${stripLeadingZero(t.cas_do)}` : `od ${stripLeadingZero(t.cas_od)}`;
  return `každou ${dny} ${cas}`;
}

function stripLeadingZero(hhmm: string): string {
  return hhmm.replace(/^0/, '');
}

/** Pro kalendářové zobrazení: nejbližších N výskytů opakované akce. */
export function expandOccurrences(t: TerminInput, now: Date, count = 5): string[] {
  if (t.druh === 'jednorazova') {
    const next = computeNextOccurrence(t, now);
    return next ? [next] : [];
  }
  const out: string[] = [];
  let cursor = now;
  for (let guard = 0; guard < 400 && out.length < count; guard++) {
    const next = computeNextOccurrence(t, cursor);
    if (!next) break;
    out.push(next);
    cursor = new Date(new Date(next).getTime() + 60000);
  }
  return out;
}
