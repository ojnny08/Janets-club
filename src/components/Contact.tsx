import { FaInstagram, FaLinkedin } from 'react-icons/fa'
import { SiGmail } from 'react-icons/si'
import { useLocation } from 'react-router-dom'
import logo from '../assets/DUESA.png'

const EMAIL = 'duesa@gmail.com'

const socials = [
    { label: 'Instagram', href: 'https://instagram.com/duesa', Icon: FaInstagram },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/duesa', Icon: FaLinkedin },
    { label: 'Email', href: `mailto:${EMAIL}`, Icon: SiGmail },
]

export default function Contact() {
    const { pathname } = useLocation()
    if (pathname.startsWith('/admin')) return null

    return (
        <footer
            className="scroll-mt-20 px-6 py-16 text-white md:px-16 lg:px-24"
        >
            <div className="mx-auto flex max-w-6xl flex-col items-center text-center md:items-center md:gap-4 md:text-left">
                <img
                    src={logo}
                    alt="DUESA crest"
                    className="h-25 w-25 shrink-0 rounded-full object-cover md:h-25 md:w-25"
                />
                <p className="mt-2 text-lg md:text-xl"></p>
                    <ul className=" flex items-center justify-center gap-8 md:justify-start">
                        {socials.map(({ label, href, Icon }) => (
                            <li key={label}>
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="text-brand-deep transition-colors duration-200 hover:text-sky-brand"
                                >
                                    <Icon className="h-7 w-7" aria-hidden />
                                </a>
                            </li>
                        ))}
                    </ul>
            </div>
        </footer>
    )
}
