import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/DUESA.png'
import { useAuth } from '../context/useAuth'
import LoginDropdown from './LoginDropdown'

const links = [
    { label: 'About', to: '/about' },
    { label: 'Team', to: '/team' },
    { label: 'Spotlight', to: '/alumni' },
]

export default function NavBar() {
    const { user, loading, logout, isAdmin } = useAuth()
    const [loginOpen, setLoginOpen] = useState(false)

    return (
        <header className="absolute inset-x-0 top-0 z-50 mx-4 mt-2 rounded-xl bg-card">
            <nav className="mx-auto flex h-20 max-w-7xl items-center text-brand-deep justify-between gap-8 px-6 md:px-2">
                <NavLink to="/" className="flex flex-1 items-center gap-3">
                    <img
                        src={logo}
                        alt="DUESA logo"
                        className="h-14 w-14 rounded-full object-cover"
                    />
                </NavLink>

                <ul className="hidden flex-1 items-center justify-center gap-8 md:flex">
                    {links.map(({ label, to }) => (
                        <li key={to}>
                            <NavLink
                                to={to}
                            >
                                {label}
                            </NavLink>
                        </li>
                    ))}
                    {isAdmin && (
                        <li>
                            <NavLink
                                to="/admin"
                            >
                                Admin
                            </NavLink>
                        </li>
                    )}
                </ul>

                <div className="relative flex flex-1 justify-end">
                    <button
                        type="button"
                        data-login-toggle
                        onClick={user ? logout : () => setLoginOpen((o) => !o)}
                        disabled={loading}
                        className="px-5 py-2 text-base font-semibold disabled:opacity-50"
                    >
                        {loading ? '...' : user ? 'Admin Account' : 'Admin Login'}
                    </button>

                    {loginOpen && !user && (
                        <LoginDropdown onClose={() => setLoginOpen(false)} />
                    )}
                </div>
            </nav>
        </header>
    )
}
