import { useEffect, useState } from 'react'
import { getLinks, LINK_CATEGORIES, type UsefulLink } from '../lib/links'

export default function UsefulLinks() {
    const [links, setLinks] = useState<UsefulLink[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getLinks()
            .then(setLinks)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    return (
        <section
            className="scroll-mt-20 px-6 py-20 md:px-16 lg:px-24"
        >
            <div className="mx-auto max-w-6xl grid grid-cols-2">
                {LINK_CATEGORIES.map(({ key, label }) => (
                    <div key={key}>
                        <h2 className="mt-4 text-center text-3xl font-bold text-brand-deep md:text-4xl">
                            {label}
                        </h2>
                        <div className="mt-4 flex flex-col items-center gap-4">
                            {loading ? (
                                <p className="text-ink-muted">Loading…</p>
                            ) : (
                                links
                                    .filter((l) => l.category === key)
                                    .map((l) => (
                                        <a
                                            key={l.id}
                                            href={l.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block w-fit rounded-lg bg-card px-4 py-3 "
                                        >
                                            {l.label}
                                        </a>
                                    ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
