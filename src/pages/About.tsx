import { useEffect, useState } from "react"
import { getAbout, type About as AboutContent } from "../lib/about"
import SignUp from "../components/SignUp"

export function About() {
    const [about, setAbout] = useState<AboutContent | null>(null)

    useEffect(() => {
        getAbout().then(setAbout).catch(console.error)
    }, [])

    return (
        <>
            <section
                className="scroll-mt-20 px-6 py-20 md:px-16 lg:px-24"
            >
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-center text-center gap-14  md:gap-20">

                    <div className="w-full max-w-prose font-bold text-brand-deep">
                        <h2 className="text-2xl md:text-4xl">
                            {about?.heading || "About Us"}
                        </h2>

                        <p className="mt-4 whitespace-pre-line text-left text-xl">
                            {about?.body}
                        </p>
                    </div>

                     <SignUp />
                </div>
            </section>
        </>

    )
}