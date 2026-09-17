import { Link } from "react-router-dom"
import logo from "../assets/DUESA.png"
import campus from "../assets/janet background.jpg"
import Schedule from "../components/Schedule"
import SignUp from "../components/SignUp"


export default function Home() {
    return (
        <main>
            <section
                className="relative -mt-24 flex min-h-dvh items-center overflow-hidden bg-cover bg-center px-6 pt-24 md:px-16 lg:px-24"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(219,235,252,0.55), rgba(219,235,252,0.62)), url(${campus})`,
                }}
            >
                <div className="relative mx-auto text-center max-w-4xl">
                    <img src={logo} alt="DUESA logo" className="mx-auto mb-6 h-65 w-65 rounded-full object-cover" />
                    <h1 className="text-2xl font-bold text-brand-deep md:text-2xl lg:text-4xl">
                        Dalhousie Undergraduate Economics Student Association
                    </h1>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link to="/about" className="bg-brand-deep px-6 py-3 font-semibold text-white">
                            About Us
                        </Link>
                        <Link to="/team" className="bg-brand-deep px-6 py-3 font-semibold text-white">
                            Team
                        </Link>
                        <Link to="/alumni" className="bg-brand-deep px-6 py-3 font-semibold text-white">
                            Spotlight
                        </Link>
                    </div>
                </div>
            </section>
  
            <Schedule />
            <SignUp />
        </main>
    )
}
