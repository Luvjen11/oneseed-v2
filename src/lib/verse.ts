export type DailyVerse = {
  text: string
  reference: string
  theme?: string
  version?: string
  source?: string
  sourceUrl?: string
}

export type TranslationOption = 'ourmanna' | 'esv'

const DAILY_CACHE_PREFIX = 'dailyVerse:'
const PREF_KEY = 'verseTranslationPreference'

export function getTranslationPreference(): TranslationOption {
  const stored = localStorage.getItem(PREF_KEY)
  return (stored as TranslationOption) || 'ourmanna'
}

export function setTranslationPreference(pref: TranslationOption): void {
  try {
    localStorage.setItem(PREF_KEY, pref)
  } catch {
    // ignore
  }
}

function getTodayKey(translation: TranslationOption): string {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${DAILY_CACHE_PREFIX}${translation}:${yyyy}-${mm}-${dd}`
}

export function getCachedDailyVerse(translation?: TranslationOption): DailyVerse | null {
  try {
    const key = getTodayKey(translation || getTranslationPreference())
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setCachedDailyVerse(verse: DailyVerse, translation?: TranslationOption): void {
  try {
    const key = getTodayKey(translation || getTranslationPreference())
    localStorage.setItem(key, JSON.stringify(verse))
  } catch {
    // ignore cache errors
  }
}

function buildProxiedUrl(targetUrl: string): string {
  const proxy = (import.meta as any).env?.VITE_CORS_PROXY as string | undefined
  if (!proxy) return targetUrl
  if (proxy.includes('{url}')) return proxy.replace('{url}', encodeURIComponent(targetUrl))
  const sep = proxy.endsWith('/') ? '' : '/'
  return `${proxy}${sep}${encodeURIComponent(targetUrl)}`
}

// Fetch verse of the day from OurManna API (HTTPS, CORS-enabled)
async function fetchFromOurManna(): Promise<DailyVerse> {
  const res = await fetch('https://beta.ourmanna.com/api/v1/get/?format=json')
  if (!res.ok) throw new Error('Failed to fetch verse')
  const json = await res.json()
  const details = json?.verse?.details || json?.verse
  const reference: string = details?.reference || 'John 3:16'
  const text: string = details?.text || 'For God so loved the world...'
  const version: string | undefined = details?.version
  return {
    text,
    reference,
    version,
    theme: 'Verse of the Day',
    source: 'OurManna API',
    sourceUrl: 'https://ourmanna.com',
  }
}

async function fetchReferenceFromOurManna(): Promise<{ reference: string; theme?: string }> {
  const res = await fetch('https://beta.ourmanna.com/api/v1/get/?format=json')
  if (!res.ok) throw new Error('Failed to fetch reference')
  const json = await res.json()
  const details = json?.verse?.details || json?.verse
  const reference: string = details?.reference || 'John 3:16'
  const theme: string | undefined = details?.verseurl ? 'Verse of the Day' : 'Verse of the Day'
  return { reference, theme }
}

async function fetchFromEsv(reference: string): Promise<DailyVerse> {
  const apiKey = (import.meta as any).env?.VITE_ESV_API_KEY as string | undefined
  if (!apiKey) throw new Error('Missing ESV API key')
  const base = 'https://api.esv.org/v3/passage/text/'
  const params = new URLSearchParams({
    q: reference,
    'include-footnotes': 'false',
    'include-verse-numbers': 'false',
    'include-headings': 'false',
    'include-selahs': 'false',
    'indent-poetry': 'false',
    'indent-paragraphs': '0',
  })
  const url = `${base}?${params.toString()}`
  const res = await fetch(buildProxiedUrl(url), {
    headers: { Authorization: `Token ${apiKey}` },
  })
  if (!res.ok) throw new Error('Failed to fetch passage from ESV')
  const json = await res.json()
  const passages: string[] = json?.passages || []
  const text = (passages[0] || '').trim()
  return {
    text: text || reference,
    reference,
    version: 'ESV',
    theme: 'Verse of the Day',
    source: 'ESV API',
    sourceUrl: 'https://api.esv.org',
  }
}

// Fallback static verse
const FALLBACK_VERSE: DailyVerse = {
  text:
    "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
  reference: 'Jeremiah 29:11',
  theme: 'Hope & Future',
}

export async function fetchDailyVerse(options?: { bypassCache?: boolean }): Promise<DailyVerse> {
  const bypassCache = options?.bypassCache ?? false
  const pref = getTranslationPreference()

  if (!bypassCache) {
    const cached = getCachedDailyVerse(pref)
    if (cached) return cached
  }

  try {
    if (pref === 'esv') {
      const apiKey = (import.meta as any).env?.VITE_ESV_API_KEY as string | undefined
      if (!apiKey) throw new Error('Missing ESV API key')
      const { reference, theme } = await fetchReferenceFromOurManna()
      const verse = await fetchFromEsv(reference)
      if (theme) verse.theme = theme
      if (!bypassCache) setCachedDailyVerse(verse, pref)
      return verse
    } else {
      const verse = await fetchFromOurManna()
      if (!bypassCache) setCachedDailyVerse(verse, pref)
      return verse
    }
  } catch {
    // Return cached if exists even on failure
    const cached = getCachedDailyVerse(pref)
    if (cached) return cached
    return FALLBACK_VERSE
  }
}


