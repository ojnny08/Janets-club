import { useEffect, useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg } from '@fullcalendar/core'
import { getEvents, formatEventWhen, type AppEvent } from '../lib/events'

type SelectedEvent = {
    title: string
    date: string
    endDate?: string
    startTime?: string
    endTime?: string
    location?: string
    description?: string
}

export default function Events() {
    const [events, setEvents] = useState<AppEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<SelectedEvent | null>(null)

    useEffect(() => {
        getEvents()
            .then(setEvents)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const calendarEvents = useMemo(
        () =>
            events.map((e) => {
                const allDay = !e.startTime
                const start = allDay ? e.date : `${e.date}T${e.startTime}`
                let end: string | undefined
                if (allDay) {
                    if (e.endDate) {
                        const d = new Date(e.endDate + 'T00:00:00')
                        d.setDate(d.getDate() + 1)
                        end = d.toISOString().slice(0, 10)
                    }
                } else if (e.endTime) {
                    end = `${e.date}T${e.endTime}`
                }
                return {
                    id: e.id,
                    title: e.title,
                    start,
                    end,
                    allDay,
                    extendedProps: {
                        date: e.date,
                        endDate: e.endDate,
                        startTime: e.startTime,
                        endTime: e.endTime,
                        location: e.location,
                        description: e.description,
                    },
                }
            }),
        [events],
    )

    const handleEventClick = (arg: EventClickArg) => {
        const p = arg.event.extendedProps as Omit<SelectedEvent, 'title'>
        setSelected({ title: arg.event.title, ...p })
    }

    return (
        <section className="px-6 py-16 md:px-16 lg:px-24">
            <h1 className="mb-8 text-center text-3xl font-bold text-brand-deep md:text-4xl">
                Events
            </h1>

            <div className="mx-auto max-w-5xl rounded-2xl bg-white p-4 shadow-sm md:p-6">
                {loading ? (
                    <p className="py-16 text-center text-ink-muted">Loading events…</p>
                ) : (
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,today,next title',
                            center: '',
                            right: '',
                        }}
                        height="auto"
                        events={calendarEvents}
                        eventClick={handleEventClick}
                        eventDisplay="block"
                        dayMaxEvents={3}
                    />
                )}
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
                            {formatEventWhen(selected)}
                        </p>
                        {selected.location && (
                            <p className="mt-1 text-sm text-ink-muted">
                                {selected.location}
                            </p>
                        )}
                        {selected.description && (
                            <p className="mt-3 whitespace-pre-line text-ink">
                                {selected.description}
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
