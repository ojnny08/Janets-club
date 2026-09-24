import {
    collection,
    getDocs,
    doc,
    addDoc,
    setDoc,
    deleteDoc,
    serverTimestamp,
    type Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'

export type EventType = 'dusa' | 'meeting'

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
    dusa: 'DUSA Events',
    meeting: 'Department of Economics',
}

export type AppEvent = {
    id: string
    title: string
    date: string
    endDate?: string
    startTime?: string
    endTime?: string
    location?: string
    description?: string
    type?: EventType
    createdAt?: Timestamp
}

export type AppEventInput = Omit<AppEvent, 'id' | 'createdAt'>

const eventsCol = collection(db, 'events')

export async function getEvents(): Promise<AppEvent[]> {
    const snap = await getDocs(eventsCol)
    const events = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AppEvent)
    return events.sort((a, b) => a.date.localeCompare(b.date))
}

export async function addEvent(data: AppEventInput): Promise<string> {
    const ref = await addDoc(eventsCol, { ...data, createdAt: serverTimestamp() })
    return ref.id
}

export async function saveEvent(id: string, data: AppEventInput): Promise<void> {
    await setDoc(doc(db, 'events', id), data, { merge: true })
}

export async function removeEvent(id: string): Promise<void> {
    await deleteDoc(doc(db, 'events', id))
}

// Short label for lists/rows, e.g. "Wed, Sep 24, 2026".
export function formatEventDate(date: string): string {
    if (!date) return ''
    const d = new Date(date + 'T00:00:00')
    return d.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

// Convert a 24h 'HH:mm' string to a 12h label, e.g. '18:00' -> '6:00 PM'.
export function formatTime(time?: string): string {
    if (!time || !/^\d{2}:\d{2}$/.test(time)) return ''
    const h24 = parseInt(time.slice(0, 2), 10)
    const minute = time.slice(3, 5)
    const meridiem = h24 < 12 ? 'AM' : 'PM'
    const hour12 = h24 % 12 === 0 ? 12 : h24 % 12
    return `${hour12}:${minute} ${meridiem}`
}

// Full date + time label for event details, e.g.
// "Thursday, September 24, 2026 · 6:00 PM–8:00 PM" (or "· All day").
export function formatEventWhen(e: Pick<AppEvent, 'date' | 'startTime' | 'endTime'>): string {
    if (!e.date) return ''
    const d = new Date(e.date + 'T00:00:00')
    const dateLabel = d.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    })
    if (!e.startTime) return `${dateLabel} · All day`
    const time = e.endTime
        ? `${formatTime(e.startTime)}–${formatTime(e.endTime)}`
        : formatTime(e.startTime)
    return `${dateLabel} · ${time}`
}

// Local-time 'YYYY-MM-DD'. Date#toISOString() formats in UTC, which lands on
// the wrong day for anyone not on/behind GMT.
export function toISODate(d: Date): string {
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${month}-${day}`
}

export function todayISO(): string {
    return toISODate(new Date())
}

// The subset of an event the details modal shows.
export type EventDetails = Pick<
    AppEvent,
    'title' | 'date' | 'endDate' | 'startTime' | 'endTime' | 'location' | 'description'
>

export function toEventDetails(e: AppEvent): EventDetails {
    return {
        title: e.title,
        date: e.date,
        endDate: e.endDate,
        startTime: e.startTime,
        endTime: e.endTime,
        location: e.location,
        description: e.description,
    }
}

// Shape FullCalendar expects: ISO start/end strings, with the details kept in
// extendedProps so a click can open the modal without another lookup.
export function toCalendarEvent(e: AppEvent) {
    const allDay = !e.startTime
    let end: string | undefined
    if (allDay) {
        if (e.endDate) {
            // FullCalendar treats an all-day end as exclusive.
            const d = new Date(e.endDate + 'T00:00:00')
            d.setDate(d.getDate() + 1)
            end = toISODate(d)
        }
    } else if (e.endTime) {
        end = `${e.date}T${e.endTime}`
    }
    const { title, ...details } = toEventDetails(e)
    return {
        id: e.id,
        title,
        start: allDay ? e.date : `${e.date}T${e.startTime}`,
        end,
        allDay,
        extendedProps: details,
    }
}

// 24h 'HH:mm' split into the parts the admin time dropdowns edit.
export type TimeParts = { hour: string; minute: string; meridiem: string }

export function parseTime(value: string): TimeParts {
    if (!/^\d{2}:\d{2}$/.test(value)) return { hour: '', minute: '', meridiem: '' }
    const h24 = parseInt(value.slice(0, 2), 10)
    return {
        hour: String(h24 % 12 === 0 ? 12 : h24 % 12),
        minute: value.slice(3, 5),
        meridiem: h24 < 12 ? 'AM' : 'PM',
    }
}

// Inverse of parseTime; '' until every part is chosen.
export function buildTime({ hour, minute, meridiem }: TimeParts): string {
    if (!hour || !minute || !meridiem) return ''
    let h = parseInt(hour, 10) % 12
    if (meridiem === 'PM') h += 12
    return `${String(h).padStart(2, '0')}:${minute}`
}

export const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1))
export const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
