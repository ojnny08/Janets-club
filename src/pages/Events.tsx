import { useEffect, useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg } from '@fullcalendar/core'
import {
    getEvents,
    formatEventWhen,
    formatEventDate,
    formatTime,
    toCalendarEvent,
    toEventDetails,
    todayISO,
    type AppEvent,
    type EventDetails,
    type EventType,
} from '../lib/events'

export default function Events() {
    const [events, setEvents] = useState<AppEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<EventDetails | null>(null)

    useEffect(() => {
        getEvents()
            .then(setEvents)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const calendarEvents = useMemo(() => events.map(toCalendarEvent), [events])

    const openEvent = (e: AppEvent) => setSelected(toEventDetails(e))

    const handleEventClick = (arg: EventClickArg) => {
        const details = arg.event.extendedProps as Omit<EventDetails, 'title'>
        setSelected({ title: arg.event.title, ...details })
    }

    const upcoming = useMemo(() => {
        const today = todayISO()
        const future = events.filter((e) => e.date >= today)
        return {
            dusa: future.filter((e) => (e.type ?? 'dusa') !== 'meeting'),
            meeting: future.filter((e) => e.type === 'meeting'),
        } satisfies Record<EventType, AppEvent[]>
    }, [events])

    return (
        <section className="px-6 py-16 md:px-16 lg:px-24">
            <h1 className="mb-8 text-center text-3xl font-bold text-brand-deep md:text-4xl">
                Events
            </h1>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
                <aside className="rounded-2xl p-4 md:p-6">
                    <h2 className="text-xl font-bold text-brand-deep">
                        Upcoming Dates
                    </h2>
                    {loading ? (
                        <p className="mt-4 text-sm text-ink-muted">Loading…</p>
                    ) : (
                        <div className="mt-4 flex flex-col gap-6">
                            <UpcomingSection
                                title="DUSA Events"
                                events={upcoming.dusa}
                                onSelect={openEvent}
                            />
                            <UpcomingSection
                                title="Department of Economics"
                                events={upcoming.meeting}
                                onSelect={openEvent}
                            />
                        </div>
                    )}
                </aside>
                <div className="rounded-lg bg-white p-4 md:p-6">
                    {loading ? (
                        <p className="py-16 text-center text-ink-muted">
                            Loading events…
                        </p>
                    ) : (
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'prev,today,next title',
                                center: '',
                                right: '',
                            }}
                            aspectRatio={1.8}
                            events={calendarEvents}
                            eventClick={handleEventClick}
                            eventDisplay="list-item"
                            displayEventTime={false}
                            dayMaxEvents={3}
                        />
                    )}
                </div>
            </div>

            {selected && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="w-full max-w-md rounded-2xl bg-white p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-semibold text-brand-deep">
                            {selected.title}
                        </h3>
                        <p className="mt-2 text-sm font-medium text-ink">
                            Date: {formatEventWhen(selected)}
                        </p>
                        {selected.location && (
                            <p className="mt-2 text-sm text-ink-muted">
                                Location: {selected.location}
                            </p>
                        )}
                        {selected.description && (
                            <p className="mt-2 text-sm text-ink">
                                Details: {selected.description}
                            </p>
                        )}
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                className="rounded-lg bg-brand px-4 py-2 font-semibold text-white"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

function UpcomingSection({
    title,
    events,
    onSelect,
}: {
    title: string
    events: AppEvent[]
    onSelect: (e: AppEvent) => void
}) {
    return (
        <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-brand">
                {title}
            </h3>
            {events.length === 0 ? (
                <p className="mt-2 text-sm text-ink-muted">
                    No upcoming {title.toLowerCase()}.
                </p>
            ) : (
                <ul className="mt-2 flex flex-col gap-2">
                    {events.map((e) => (
                        <li key={e.id} className="flex gap-2">
                            <span className="mt-[3px] text-brand" aria-hidden="true">
                                •
                            </span>
                            <button
                                type="button"
                                onClick={() => onSelect(e)}
                                className="flex flex-1 flex-col items-start rounded-lg px-1 py-1 text-left hover:bg-sky-tint"
                            >
                                <span className="font-semibold text-ink">
                                    {e.title}
                                </span>
                                <span className="text-sm text-ink-muted">
                                    {formatEventDate(e.date)}
                                    {e.startTime ? ` · ${formatTime(e.startTime)}` : ''}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
