import logo from '../assets/duesa-logo-circle.png'  
export default function About() {
    return (
        <section className="min-h-dvh flex items-center px-6 md:px-52">
            <div className="flex flex-col md:flex-row gap-16 max-w-5xl">
                <img src={logo} alt="DUESA" className="w-80 h-80 shrink-0"/>
                <div className="max-w-prose text-center md:text-left">
                    <h1 className="text-3xl font-bold">About Us</h1>
                    <p>boi</p>
                </div>
            </div>
        </section>
    )
}