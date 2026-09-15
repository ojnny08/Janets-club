import { useEffect, useState } from 'react'
import { getAbout, saveAbout, type About } from '../../lib/about'

export default function AboutAdmin() {
    const [form, setForm] = useState<About | null>(null)
    const [busy, setBusy] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getAbout().then(setForm).catch(console.error)
    }, [])

    if (!form) return <p className="text-ink-muted">Loading about…</p>

    const set = (field: keyof About, value: string) =>
        setForm((f) => (f ? { ...f, [field]: value } : f))

    const handleSave = async () => {
        setBusy(true)
        setError(null)
        setSaved(false)
        try {
            await saveAbout(form)
            setSaved(true)
        } catch (err) {
            console.error(err)
            setError('Save failed. Make sure you are signed in as admin.')
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <h3 className="mb-6 text-2xl font-semibold text-brand-deep">About section</h3>

            <div className="flex min-h-0 flex-1 flex-col gap-3">
                <label className="flex flex-col gap-1 text-sm text-ink-muted">
                    Heading
                    <input
                        value={form.heading}
                        onChange={(e) => set('heading', e.target.value)}
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
                type="button"
                onClick={handleSave}
                disabled={busy}
                className="mt-6 self-start rounded-lg bg-brand px-4 py-2 font-semibold text-white disabled:opacity-50"
            >
                {busy ? 'Saving…' : 'Save'}
            </button>
        </div>
    )
}
