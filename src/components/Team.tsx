import logo from '../assets/duesa-logo-circle.png'

const executives = [
    { role: 'Role', name: 'Name', program: 'Program', year: 'Year' },
    { role: 'Role', name: 'Name', program: 'Program', year: 'Year' },
    { role: 'Role', name: 'Name', program: 'Program', year: 'Year' },
]

export default function Team() {
    return (
        <section
            id="team"
            className="scroll-mt-20 px-6 py-28 md:px-16 lg:px-24"
        >
            <div className="mx-auto max-w-6xl">
                <h2 className="text-center text-4xl font-bold text-ink md:text-5xl">
                    Executives
                </h2>

                <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
                    {executives.map((person, i) => (
                        <div key={i} className="flex flex-col">
                            <img
                                src={logo}
                                alt=""
                                className="mx-auto h-48 w-48 rounded-full ring-4 ring-sky-soft"
                            />
                            <div className="mt-6 flex flex-col">
                                <h3 className="text-2xl font-semibold text-ink">
                                    {person.role}
                                </h3>
                                <div className="mt-2 text-lg text-ink">{person.name}</div>
                                <div className="text-base text-ink-muted">{person.program}</div>
                                <div className="text-base text-ink-muted">{person.year}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
