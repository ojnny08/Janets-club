import { useEffect, useState } from 'react'
import {
    getNewsletter,
    saveNewsletter,
    type Newsletter,
} from '../../lib/newsletter'

export default function NewsletterAdmin() {
    const [form, setForm] = useState<Newsletter | null>(null)
    const [busy, setBusy] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getNewsletter().then(setForm).catch(console.error)
    }, [])

    if (!form) return <p className="text-ink-muted">Loading newsletter…</p>

    const set = (field: keyof Newsletter, value: string) =>
        setForm((f) => (f ? { ...f, [field]: value } : f))

    const handleSave = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setBusy(true)
        setError(null)
        setSaved(false)
        try {
            await saveNewsletter(form)
            setSaved(true)
        } catch (err) {
            console.error(err)
            setError('Save failed. Make sure you are signed in as admin.')
        } finally {
            setBusy(false)
        }
    }

    return (
        <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
            <h3 className="mb-6 text-2xl font-semibold text-brand-deep">Newsletter section</h3>

            <div className="flex min-h-0 flex-1 flex-col gap-3">
                <label className="flex flex-col gap-1 text-sm text-ink-muted">
                    Title
                    <input
                        value={form.title}
                        onChange={(e) => set('title', e.target.value)}
                        className="rounded-lg border border-line px-2 py-2 text-ink outline-none focus:border-brand-deep"
                    />
                </label>

                <label className="flex min-h-0 flex-1 flex-col gap-1 text-sm text-ink-muted">
                    Body
                    <textarea
                        value={form.body}
                        onChange={(e) => set('body', e.target.value)}
                        className="min-h-48 flex-1 resize-none rounded-lg border border-line px-2 py-2 text-ink outline-none focus:border-brand-deep"
                    />
                </label>
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            {saved && !error && <p className="mt-3 text-sm text-ink-muted">Saved.</p>}

            <button
                type="submit"
                disabled={busy}
                className="mt-6 self-start rounded-lg bg-brand px-4 py-2 font-semibold text-white disabled:opacity-50"
            >
                {busy ? 'Saving…' : 'Save'}
            </button>
        </form>
    )
}
