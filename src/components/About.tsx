import logo from '../assets/duesa-logo-circle.png'

export default function About() {
    return (
        <section
            id="about"
            className="scroll-mt-20 px-6 py-28 md:px-16 lg:px-24"
        >
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-14 md:flex-row md:items-center md:gap-20">
                <img
                    src={logo}
                    alt="DUESA crest"
                    className="h-64 w-64 shrink-0 md:h-72 md:w-72"
                />

                <div className="max-w-prose md:text-left">
                    <h2 className="text-4xl font-bold text-ink md:text-5xl">
                        About Us
                    </h2>

                    <p className="mt-4 text-lg text-ink-muted">
                        Words Words Words Words Words Words Words Words Words
                        Words Words Words Words Words Words Words Words Words
                        Words Words Words Words Words Words Words Words Words
                        Words Words Words Words Words Words Words Words Words
                        Words Words Words Words
                    </p>
                </div>
            </div>
        </section>
    )
}
