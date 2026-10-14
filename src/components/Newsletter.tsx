import { useEffect, useState } from 'react'
import {
    getNewsletter,
    type Newsletter
} from '../lib/newsletter'

const today =new Date().toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
})

export default function Newsletter() {
    const [newsletter, setNewsletter] = useState<Newsletter | null>(null);

    useEffect(() => {
        getNewsletter().then(setNewsletter).catch(console.error);
    },[])

    return (
        <section className='scroll-mt-20 px-6 py-16 md:px-16 lg:px-24'>
            <div className='mx-auto max-w-3xl bg-white p-4 font-serif text-ink md:p-8'>
                <header className='text-center'>
                    <h1 className='text-3xl font-black uppercase text-brand-deep md:text-5xl'>
                        Newsletter
                    </h1>
                    <div className='mt-4 flex items-center justify-between border-y-4 border-double border-brand-deep py-2 text-xs uppercase tracking-widest text-ink-muted md:text-sm'>
                        <span>{today}</span>
                        <span className='hidden sm:inline'>Halifax, Nova Scotia</span>
                        <span>Dalhousie</span>
                    </div>
                </header>

                {newsletter ? (
                    <article className='mt-8'>
                        <h2 className='text-center text-2xl font-bold leading-tight text-brand-deep md:text-4xl'>
                            {newsletter.title}
                        </h2>
                        <div className='mx-auto mt-4 w-24 border-t border-brand-deep' />
                        {newsletter.body && (
                            <p className='mt-6 whitespace-pre-line text-justify leading-relaxed hyphens-auto first-letter:float-left first-letter:mr-2 first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.85] first-letter:text-brand-deep'>
                                {newsletter.body}
                            </p>
                        )}
                    </article>
                ) : (
                    <p className='py-8 text-center italic text-ink-muted'>…</p>
                )}
            </div>
        </section>
    )
}
