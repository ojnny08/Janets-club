import { useEffect, useState } from 'react'
import {
    getEvents,
    addEvent,
    saveEvent,
    removeEvent,
    formatEventDate,
    formatTime,
    type AppEvent,
    type AppEventInput,
} from '../../lib/events'

const EMPTY: AppEventInput = {
    title: '',
    date: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
}

export default function EventsAdmin() {
    const [events, setEvents] = useState<AppEvent[]>([])
    const [loading, setLoading] = useState(true)

    const [editing, setEditing] = useState<AppEvent | 'new' | null>(null)

    const load = () =>
        getEvents()
            .then(setEvents)
            .catch(console.error)
            .finally(() => setLoading(false))

    useEffect(() => {
        load()
    }, [])

    if (loading) return <p className="text-ink-muted">Loading events…</p>

    return (
        <div>
            <div className="mb-6 flex flex-col items-start">
                <h3 className="text-2xl font-semibold text-brand-deep">Events</h3>
                <button
                    type="button"
                    onClick={() => setEditing('new')}
                    className="rounded-lg bg-brand px-4 py-2 font-semibold text-white"
                >
                    Add event
                </button>
            </div>

            {events.length === 0 ? (
                <p className="text-ink-muted">No events yet. Add the first one.</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {events.map((e) => (
                        <button
                            key={e.id}
                            type="button"
                            onClick={() => setEditing(e)}
                            className="flex flex-col items-start rounded-xl border border-line px-4 py-3 text-left hover:bg-sky-tint"
                        >
                            <span className="font-semibold text-ink">
                                {e.title || '(no title)'}
                            </span>
                            <span className="text-sm text-ink-muted">
                                {formatEventDate(e.date) || '(no date)'}
                                {e.startTime ? ` · ${formatTime(e.startTime)}` : ''}
                                {e.location ? ` · ${e.location}` : ''}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {editing && (
                <EventEditor
                    event={editing === 'new' ? null : editing}
                    onClose={() => setEditing(null)}
                    onSaved={() => {
                        setEditing(null)
                        load()
                    }}
                />
            )}
        </div>
    )
}

function EventEditor({
    event,
    onClose,
    onSaved,
}: {
    event: AppEvent | null
    onClose: () => void
    onSaved: () => void
}) {
    const [form, setForm] = useState<AppEventInput>(
        event
            ? {
                  title: event.title,
                  date: event.date,
                  endDate: event.endDate ?? '',
                  startTime: event.startTime ?? '',
                  endTime: event.endTime ?? '',
                  location: event.location ?? '',
                  description: event.description ?? '',
              }
            : EMPTY,
    )
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const set = (field: keyof AppEventInput, value: string) =>
        setForm((f) => ({ ...f, [field]: value }))

    const handleSave = async () => {
        if (!form.title.trim() || !form.date) {
            setError('Title and date are required.')
            return
        }
        setBusy(true)
        setError(null)
        try {
            if (event) await saveEvent(event.id, form)
            else await addEvent(form)
            onSaved()
        } catch (err) {
            console.error(err)
            setError('Save failed. Make sure you are signed in as admin.')
            setBusy(false)
        }
    }

    const handleDelete = async () => {
        if (!event) return
        if (!confirm(`Delete ${event.title || 'this event'}?`)) return
        setBusy(true)
        setError(null)
        try {
            await removeEvent(event.id)
            onSaved()
        } catch (err) {
            console.error(err)
            setError('Delete failed.')
            setBusy(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-2xl bg-white p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-semibold text-brand-deep">
                    {event ? 'Edit event' : 'Add event'}
                </h3>

                <div className="mt-4 flex flex-col gap-3">
                    <Field
                        label="Title"
                        value={form.title}
                        onChange={(v) => set('title', v)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <Field
                            label="Date"
                            type="date"
                            value={form.date}
                            onChange={(v) => set('date', v)}
                        />
                        <Field
                            label="End date (optional)"
                            type="date"
                            value={form.endDate ?? ''}
                            onChange={(v) => set('endDate', v)}
                        />
                    </div>
                    <TimeSelect
                        label="Start time (leave blank = all day)"
                        value={form.startTime ?? ''}
                        onChange={(v) => set('startTime', v)}
                    />
                    <TimeSelect
                        label="End time (optional)"
                        value={form.endTime ?? ''}
                        onChange={(v) => set('endTime', v)}
                    />
                    <Field
                        label="Location (optional)"
                        value={form.location ?? ''}
                        onChange={(v) => set('location', v)}
                    />
                    <label className="flex flex-col gap-1 text-sm text-ink-muted">
                        Description (optional)
                        <textarea
                            value={form.description ?? ''}
                            rows={3}
                            onChange={(e) => set('description', e.target.value)}
                            className="rounded-lg border border-line px-2 py-2 text-ink outline-none focus:border-brand-deep"
                        />
                    </label>
                </div>

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

                <div className="mt-6 flex items-center justify-between gap-3">
                    {event ? (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={busy}
                            className="text-sm font-semibold text-red-600 disabled:opacity-50"
                        >
                            Delete
                        </button>
                    ) : (
                        <span />
                    )}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={busy}
                            className="px-4 py-2 font-semibold text-ink-muted disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={busy}
                            className="rounded-lg bg-brand px-4 py-2 font-semibold text-white disabled:opacity-50"
                        >
                            {busy ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Hour / minute / AM-PM dropdowns that read and write a 24h 'HH:mm' string.
function parseTime(value: string) {
    if (!/^\d{2}:\d{2}$/.test(value)) return { hour: '', minute: '', meridiem: '' }
    const h24 = parseInt(value.slice(0, 2), 10)
    return {
        hour: String(h24 % 12 === 0 ? 12 : h24 % 12),
        minute: value.slice(3, 5),
        meridiem: h24 < 12 ? 'AM' : 'PM',
    }
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

function TimeSelect({
    label,
    value,
    onChange,
}: {
    label: string
    value: string
    onChange: (v: string) => void
}) {
    const [parts, setParts] = useState(() => parseTime(value))

    const update = (next: typeof parts) => {
        setParts(next)
        if (next.hour && next.minute && next.meridiem) {
            let h = parseInt(next.hour, 10) % 12
            if (next.meridiem === 'PM') h += 12
            onChange(`${String(h).padStart(2, '0')}:${next.minute}`)
        } else {
            onChange('')
        }
    }

    const selectClass =
        'flex-1 rounded-lg border border-line px-2 py-2 text-ink outline-none focus:border-brand-deep'

    return (
        <div className="flex flex-col gap-1 text-sm text-ink-muted">
            {label}
            <div className="flex items-center gap-2">
                <select
                    value={parts.hour}
                    onChange={(e) => update({ ...parts, hour: e.target.value })}
                    className={selectClass}
                >
                    <option value="">Hr</option>
                    {HOURS.map((h) => (
                        <option key={h} value={h}>
                            {h}
                        </option>
                    ))}
                </select>
                <span className="font-semibold text-ink">:</span>
                <select
                    value={parts.minute}
                    onChange={(e) => update({ ...parts, minute: e.target.value })}
                    className={selectClass}
                >
                    <option value="">Min</option>
                    {MINUTES.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
                <select
                    value={parts.meridiem}
                    onChange={(e) => update({ ...parts, meridiem: e.target.value })}
                    className={selectClass}
                >
                    <option value="">—</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
        </div>
    )
}

function Field({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
}: {
    label: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
    type?: string
}) {
    return (
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
            {label}
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-lg border border-line px-2 py-2 text-ink outline-none focus:border-brand-deep"
            />
        </label>
    )
}
