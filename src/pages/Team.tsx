import { useEffect, useState } from 'react'
import logo from '../assets/duesa-logo-circle.png'
import { getTeam, type Member } from '../lib/team'
import { getRoles, type Role } from '../lib/roles'

export default function Team() {
    const [members, setMembers] = useState<Member[]>([])
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([getTeam(), getRoles()])
            .then(([m, r]) => {
                setMembers(m)
                setRoles(r)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    // One section per role, in hierarchy order. Roles with no members are
    // skipped; members with a missing/deleted role are not shown publicly.
    const sections = roles
        .map((r) => ({
            role: r,
            members: members.filter((m) => m.roleId === r.id),
        }))
        .filter((s) => s.members.length > 0)

    return (
        <section className="scroll-mt-20 px-6 py-20 md:px-16 lg:px-24">
            <div className="mx-auto max-w-6xl">
                <h2 className="text-center text-4xl font-bold text-brand-deep md:text-5xl">
                    Meet The Team
                </h2>

                {loading ? (
                    <p className="mt-16 text-center text-ink-muted">Loading team…</p>
                ) : sections.length === 0 ? (
                    <p className="mt-16 text-center text-ink-muted">No team members yet.</p>
                ) : (
                    <div className="mt-16 flex flex-col gap-20">
                        {sections.map(({ role, members }) => (
                            <div key={role.id}>
                                <h3 className="text-center text-2xl font-bold text-brand-deep md:text-3xl">
                                    {role.name}
                                </h3>
                                <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
                                    {members.map((person) => (
                                        <div
                                            key={person.id}
                                            className="flex flex-col p-8 text-center"
                                        >
                                            <img
                                                src={person.imageUrl || logo}
                                                alt=""
                                                className="mx-auto h-48 w-48 rounded-full object-cover ring-4 ring-sky-brand/60"
                                            />
                                            <div className="mt-6 flex flex-col">
                                                <h4 className="text-2xl font-semibold text-brand">
                                                    {person.name}
                                                </h4>
                                                <div className="text-base text-ink-muted">
                                                    {person.program}
                                                </div>
                                                <div className="text-base text-ink-muted">
                                                    {person.year}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
