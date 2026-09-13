import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import TeamAdmin from './admin/TeamAdmin'

type Section = 'team' | 'alumni' | 'about'

const ROWS: { key: Section; label: string; hint: string }[] = [
    { key: 'team', label: 'Team', hint: 'Add, edit and remove team members' },
    { key: 'alumni', label: 'Alumni', hint: 'Coming soon' },
    { key: 'about', label: 'About', hint: 'Coming soon' },
]

export default function Admin() {
    const { isAdmin, loading } = useAuth()
    const [active, setActive] = useState<Section | null>(null)

    if (loading) return <p className="p-20 text-center text-ink-muted">Loading…</p>
    if (!isAdmin) return <Navigate to="/" replace />

    return (
        <section className="px-6 py-16 md:px-16 lg:px-24">
            <div className="mx-auto max-w-4xl">
                {active === null ? (
                    <>
                        <h2 className="text-3xl font-bold text-brand-deep">Admin</h2>
                        <ul className="mt-8 flex flex-col gap-3">
                            {ROWS.map((row) => (
                                <li key={row.key}>
                                    <button
                                        type="button"
                                        onClick={() => setActive(row.key)}
                                        className="flex w-full items-center justify-between rounded-xl border border-line px-6 py-5 text-left hover:bg-sky-tint"
                                    >
                                        <span>
                                            <span className="block text-lg font-semibold text-ink">
                                                {row.label}
                                            </span>
                                            <span className="text-sm text-ink-muted">{row.hint}</span>
                                        </span>
                                        <span className="text-ink-muted">→</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={() => setActive(null)}
                            className="mb-6 text-sm font-semibold text-ink-muted"
                        >
                            ← Back
                        </button>
                        {active === 'team' && <TeamAdmin />}
                        {active === 'alumni' && (
                            <p className="text-ink-muted">Alumni management — coming soon.</p>
                        )}
                        {active === 'about' && (
                            <p className="text-ink-muted">About editing — coming soon.</p>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}
