import logo from '../assets/duesa-logo-circle.png'

const links = [
    { label: 'About', href: '#about' },
    { label: 'Meet the Team', href: '#team' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Hiring & Elections', href: '#hiring' },
    { label: 'Contact', href: '#contact' },
]

export default function NavBar() {
    return (
        <header className="fixed top-0 inset-x-0 z-50 border-b border-line/80 bg-sky-tint/85 backdrop-blur-md">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-8 px-6 md:px-10">
                <a href="#top" className="flex items-center gap-3 shrink-0">
                    <img src={logo} alt="" className="h-12 w-12" />
                    <span className="text-xl font-bold tracking-wide text-brand-deep">
                        DUESA
                    </span>
                </a>

                <ul className="hidden items-center gap-8 md:flex">
                    {links.map(({ label, href }) => (
                        <li key={href}>
                            <a
                                href={href}
                                className="text-base font-medium text-ink-muted"
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    )
}
