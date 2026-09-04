
export default function NavBar() {
    return (
        <section className="fixed top-0 inset-x-0 z-50 p-4 border-b bg-background-bb">
            <div className="flex items-center justify-between">
                <div className="">
                    brand logo
                </div>
                <ul className="flex items-center gap-5 text-lg">
                    <li><a href="#about">About</a></li>
                    <li><a>Meet the team</a></li>
                    <li><a>Schedule</a></li>
                    <li><a>Hiring/Elections</a></li>
                    <li><a>Contact Us</a></li>
                </ul>
            </div>
        </section>
    )
}