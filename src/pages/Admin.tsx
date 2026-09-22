import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import AdminNavBar, { type Section } from '../components/AdminNavBar'
import TeamAdmin from './admin/TeamAdmin'
import RolesAdmin from './admin/RolesAdmin'
import AboutAdmin from './admin/AboutAdmin'
import LinksAdmin from './admin/LinksAdmin'
import EventsAdmin from './admin/EventsAdmin'

export default function Admin() {
    const { isAdmin, loading } = useAuth()
    const [active, setActive] = useState<Section>('team')

    if (loading) return <p className="p-20 text-center text-ink-muted">Loading…</p>
    if (!isAdmin) return <Navigate to="/" replace />

    return (
        <div className="flex min-h-[calc(100dvh-5rem)] flex-col md:flex-row">
            <AdminNavBar active={active} onSelect={setActive} />

            <div className="flex min-w-0 flex-1 flex-col px-6 py-10 md:px-10">
                {active === 'team' && <TeamAdmin />}
                {active === 'roles' && <RolesAdmin />}
                {active === 'alumni' && (
                    <p className="text-ink-muted">Alumni management — coming soon.</p>
                )}
                {active === 'about' && <AboutAdmin />}
                {active === 'links' && <LinksAdmin />}
                {active === 'events' && <EventsAdmin />}
            </div>
        </div>
    )
}
