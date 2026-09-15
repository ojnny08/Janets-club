import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/duesa-logo-circle.png'
import { useAuth } from '../context/useAuth'
import LoginDropdown from './LoginDropdown'

const links = [
    { label: 'About', to: '/about' },
    { label: 'Members', to: '/team' },
    { label: 'Alumni', to: '/alumni' },
]

export default function NavBar() {
    const { user, loading, logout, isAdmin } = useAuth()
    const [loginOpen, setLoginOpen] = useState(false)

    return (
        <header className="absolute inset-x-0 top-0 z-50 mx-4 mt-2 rounded-xl bg-brand-deep">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-8 px-6 md:px-10">
                <NavLink to="/" className="flex flex-1 items-center gap-3">
                    <span className="text-xl font-bold tracking-wide text-white">
                        DUESA
                    </span>
                </NavLink>

                <ul className="hidden flex-1 items-center justify-center gap-8 md:flex">
                    {links.map(({ label, to }) => (
                        <li key={to}>
                            <NavLink
                                to={to}
                                className={({ isActive }) =>
                                    isActive
                                        ? 'text-base font-semibold text-white'
                                        : 'text-base font-medium text-white'
                                }
                            >
                                {label}
                            </NavLink>
                        </li>
                    ))}
                    {isAdmin && (
                        <li>
                            <NavLink
                                to="/admin"
                                className={({ isActive }) =>
                                    isActive
                                        ? 'text-base font-semibold text-white'
                                        : 'text-base font-medium text-white'
                                }
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
                        className="px-5 py-2 text-base font-semibold text-white disabled:opacity-50"
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
