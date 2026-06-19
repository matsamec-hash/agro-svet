// Sdílený HTTP helper: fetch JSON s opakováním na přechodných chybách.
// Některá otevřená API (World Bank) občas vrátí 400/5xx nebo spadne síť — opakuj.

const DELAYS_MS = [500, 1500, 3000];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Stáhne URL jako JSON s opakováním. Při neúspěchu (non-ok odpověď NEBO vyhozená
 * síťová chyba) počká a opakuje až `attempts` pokusů s rostoucí prodlevou.
 * Vrací parsované JSON; po posledním pokusu vyhodí popisnou chybu.
 * fetchImpl umožňuje vstříknout fake fetch v testech.
 */
export async function fetchJsonRetry(url, { attempts = 3, fetchImpl = fetch } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetchImpl(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) await sleep(DELAYS_MS[i] ?? DELAYS_MS[DELAYS_MS.length - 1]);
    }
  }
  throw new Error(`fetchJsonRetry selhal po ${attempts} pokusech (${url}): ${lastErr?.message ?? lastErr}`);
}
