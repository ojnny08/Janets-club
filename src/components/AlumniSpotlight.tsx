import logo from '../assets/duesa-logo-circle.png'

const alumni = [
    { name: 'Alumni Name', role: 'Role, Organization', year: 'Class of 20XX' },
    { name: 'Alumni Name', role: 'Role, Organization', year: 'Class of 20XX' },
    { name: 'Alumni Name', role: 'Role, Organization', year: 'Class of 20XX' },
]

export default function AlumniSpotlight() {
    return (
        <section
            id="alumni"
            className="scroll-mt-20 px-6 py-28 md:px-16 lg:px-24"
        >
            <div className="mx-auto max-w-6xl">
                <h2 className="mt-4 text-center text-4xl font-bold text-ink md:text-5xl">
                    Alumni Spotlight
                </h2>

                <ul className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {alumni.map((person, i) => (
                        <li
                            key={i}
                            className="flex flex-col items-center bg-white p-10 text-center"
                        >
                            <img
                                src={logo}
                                alt=""
                                className="h-32 w-32 rounded-full ring-4 ring-sky-soft"
                            />
                            <h3 className="mt-6 text-2xl font-semibold text-ink">
                                {person.name}
                            </h3>
                            <p className="mt-2 text-base text-ink-muted">{person.role}</p>
                            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                                {person.year}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
