type Category = 'DUESA' | 'Faculty'

type ScheduleEvent = {
    title: string
    day: number
    category: Category
    deadline?: boolean
}

const events: ScheduleEvent[] = [
    { title: 'Event 1', day: 4, category: 'DUESA' },
    { title: 'Event 2', day: 12, category: 'DUESA' },
    { title: 'Deadline', day: 19, category: 'DUESA', deadline: true },
    { title: 'Event 1', day: 9, category: 'Faculty' },
    { title: 'Event 2', day: 23, category: 'Faculty' },
    { title: 'Deadline', day: 27, category: 'Faculty', deadline: true },
]

const dotColor = (e: ScheduleEvent) =>
    e.deadline ? '#D64545' : e.category === 'DUESA' ? '#2F5DA8' : '#F5A623'

const groups: Category[] = ['DUESA', 'Faculty']

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function Schedule() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const monthName = now.toLocaleString('default', { month: 'long' })
    const today = now.getDate()

    const firstWeekday = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells: (number | null)[] = []
    for (let i = 0; i < firstWeekday; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)

    const eventsForDay = (day: number) => events.filter((e) => e.day === day)

    return (
        <section
            className="scroll-mt-20 px-6 py-28 md:px-16 lg:px-24"
        >
            <div className="mx-auto max-w-6xl">
                <h2 className="text-center text-4xl font-bold text-ink md:text-5xl">
                    Schedule
                </h2>

                <div className="mt-16 grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-16">
                    <div>
                        <h3 className="text-2xl font-semibold text-ink">
                            Upcoming Dates
                        </h3>

                        <div className="mt-8 space-y-8">
                            {groups.map((group) => (
                                <div key={group}>
                                    <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                                        {group}
                                    </h4>
                                    <ul className="mt-3 space-y-2">
                                        {events
                                            .filter((e) => e.category === group)
                                            .map((e, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-center gap-3 text-lg text-ink-muted"
                                                >
                                                    <span
                                                        aria-hidden
                                                        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                                                        style={{ backgroundColor: dotColor(e) }}
                                                    />
                                                    {e.title}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold text-ink">This Month</h3>

                        <div className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-sky-soft">
                            <div className="mb-4 text-base font-semibold text-brand-deep">
                                {monthName} {year}
                            </div>
                            <div className="grid grid-cols-7 overflow-hidden rounded-lg border border-line">
                                {WEEKDAYS.map((d, i) => (
                                    <div
                                        key={`h-${i}`}
                                        className="border-b border-line py-2 text-center text-xs font-semibold uppercase tracking-wide text-ink-muted"
                                    >
                                        {d}
                                    </div>
                                ))}
                                {cells.map((day, i) => {
                                    const dayEvents = day ? eventsForDay(day) : []
                                    const isToday =
                                        day === today &&
                                        now.getMonth() === month &&
                                        now.getFullYear() === year
                                    return (
                                        <div
                                            key={i}
                                            className={`relative aspect-square border border-line p-1.5 ${
                                                day ? '' : 'bg-sky-tint/60'
                                            }`}
                                        >
                                            {day && (
                                                <span
                                                    className={`text-xs ${
                                                        isToday
                                                            ? 'inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand font-semibold text-white'
                                                            : 'text-ink-muted'
                                                    }`}
                                                >
                                                    {day}
                                                </span>
                                            )}
                                            {dayEvents.length > 0 && (
                                                <div className="absolute inset-x-0 bottom-1.5 flex flex-wrap justify-center gap-1">
                                                    {dayEvents.map((e, j) => (
                                                        <span
                                                            key={j}
                                                            title={`${e.category}: ${e.title}`}
                                                            className="h-2 w-2 rounded-full"
                                                            style={{ backgroundColor: dotColor(e) }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Legend */}
                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted">
                                <span className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#2F5DA8' }} />
                                    DUESA
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#F5A623' }} />
                                    Faculty
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#D64545' }} />
                                    Deadline
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
