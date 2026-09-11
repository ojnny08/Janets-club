import { FaInstagram, FaLinkedin } from 'react-icons/fa'
import { SiGmail } from 'react-icons/si'
import logo from '../assets/duesa-logo-circle.png'

const EMAIL = 'duesa@gmail.com'

const socials = [
    { label: 'Instagram', href: 'https://instagram.com/duesa', Icon: FaInstagram },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/duesa', Icon: FaLinkedin },
    { label: 'Email', href: `mailto:${EMAIL}`, Icon: SiGmail },
]

export default function Contact() {
    return (
        <footer
            className="scroll-mt-20 bg-brand-deep px-6 py-16 text-white md:px-16 lg:px-24"
        >
            <div className="mx-auto flex max-w-6xl flex-col items-center text-center md:flex-row md:items-center md:gap-8 md:text-left">
                <img
                    src={logo}
                    alt="DUESA crest"
                    className="h-36 w-36 shrink-0 md:h-44 md:w-44"
                />

                <div>
                    <p className="text-lg md:text-xl">
                        Have questions about events?
                        Need support?
                    </p>
                    <p className="mt-1 text-lg md:text-xl">
                        <span className="font-bold">Email us:</span>{' '}
                        <a
                            href={`mailto:${EMAIL}`}
                            className="underline-offset-4 hover:underline"
                        >
                            {EMAIL}
                        </a>
                    </p>

                    <p className="mt-8 text-lg md:text-xl"></p>
                    <ul className="mt-4 flex items-center justify-center gap-8 md:justify-start">
                        {socials.map(({ label, href, Icon }) => (
                            <li key={label}>
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="text-white transition-colors duration-200 hover:text-sky-brand"
                                >
                                    <Icon className="h-7 w-7" aria-hidden />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    )
}
