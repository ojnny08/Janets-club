import { Link } from "react-router-dom"
import logo from "../assets/duesa-logo-circle.png"
import Schedule from "../components/Schedule"


export default function Home() {
    return (
        <main>
            <section className="relative flex min-h-[calc(100dvh-5rem)] items-center overflow-hidden px-6 md:px-16 lg:px-24">
                <div className="relative mx-auto text-center max-w-4xl">
                    <img src={logo} alt="DUESA logo" className="mx-auto mb-6 w-65 h-65" />
                    <h1 className="text-2xl font-bold text-brand-deep md:text-2xl lg:text-4xl">
                        Dalhousie Undergraduate Economics Student Association
                    </h1>
                    <p className="mx-auto max-w-xl pt-4 text-ink-muted">We welcome all Dalhousie students interested in Economics to join!</p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link to="/about" className="bg-brand-deep px-6 py-3 font-semibold text-white">
                            About Us
                        </Link>
                        <Link to="/team" className="bg-brand-deep px-6 py-3 font-semibold text-white">
                            Meet the Team
                        </Link>
                        <Link to="/alumni" className="bg-brand-deep px-6 py-3 font-semibold text-white">
                            Alumni
                        </Link>
                    </div>
                </div>
            </section>

            <Schedule />
        </main>
    )
}
