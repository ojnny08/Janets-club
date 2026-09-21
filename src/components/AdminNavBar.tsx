import type { IconType } from 'react-icons'
import { LuUsers, LuLayers, LuGraduationCap, LuInfo, LuLink } from 'react-icons/lu'

export type Section = 'team' | 'roles' | 'alumni' | 'about' | 'links'

export const SECTIONS: { key: Section; label: string; icon: IconType }[] = [
    { key: 'team', label: 'Team', icon: LuUsers },
    { key: 'roles', label: 'Roles', icon: LuLayers },
    { key: 'alumni', label: 'Alumni', icon: LuGraduationCap },
    { key: 'about', label: 'About', icon: LuInfo },
    { key: 'links', label: 'Links', icon: LuLink },
]

type Props = {
    active: Section
    onSelect: (section: Section) => void
}

export default function AdminNavBar({ active, onSelect }: Props) {
    return (
        <nav
            aria-label="Admin sections"
            className="m-2 shrink-0 rounded-xl bg-brand-deep p-4 md:mx-4 md:w-60 md:p-6"
        >
            <h2 className="px-3 pb-6 text-2xl font-bold text-white">Admin</h2>
            <ul className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
                {SECTIONS.map(({ key, label, icon: Icon }) => (
                    <li key={key}>
                        <button
                            type="button"
                            onClick={() => onSelect(key)}
                            aria-current={active === key ? 'page' : undefined}
                            className={`flex w-full items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-left font-semibold transition-colors ${
                                active === key
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <Icon className="text-lg" aria-hidden />
                            {label}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
