import { useEffect, useState } from 'react'
import logo from '../assets/duesa-logo-circle.png'
import { getTeam, type Member } from '../lib/team'

export default function Team() {
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getTeam()
            .then(setMembers)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    return (
        <section className="scroll-mt-20 px-6 py-20 md:px-16 lg:px-24">
            <div className="mx-auto max-w-6xl">
                <h2 className="text-center text-4xl font-bold text-brand-deep md:text-5xl">
                    Meet The Team
                </h2>

                {loading ? (
                    <p className="mt-16 text-center text-ink-muted">Loading team…</p>
                ) : members.length === 0 ? (
                    <p className="mt-16 text-center text-ink-muted">
                        No team members yet.
                    </p>
                ) : (
                    <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
                        {members.map((person) => (
                            <div key={person.id} className="flex flex-col p-8 text-center">
                                <img
                                    src={person.imageUrl || logo}
                                    alt=""
                                    className="mx-auto h-48 w-48 rounded-full object-cover ring-4 ring-sky-brand/60"
                                />
                                <div className="mt-6 flex flex-col">
                                    <h3 className="text-2xl font-semibold text-brand">
                                        {person.role}
                                    </h3>
                                    <div className="mt-2 text-lg text-ink">{person.name}</div>
                                    <div className="text-base text-ink-muted">
                                        {person.program}
                                    </div>
                                    <div className="text-base text-ink-muted">{person.year}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
