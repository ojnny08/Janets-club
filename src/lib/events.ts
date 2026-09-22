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

export type AppEvent = {
    id: string
    title: string
    date: string 
    endDate?: string 
    startTime?: string 
    endTime?: string 
    location?: string
    description?: string
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
