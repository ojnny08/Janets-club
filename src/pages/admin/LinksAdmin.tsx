import { useEffect, useState } from 'react'
import { LuChevronDown } from 'react-icons/lu'
import {
    getLinks,
    addLink,
    saveLink,
    removeLink,
    LINK_CATEGORIES,
    type UsefulLink,
    type UsefulLinkInput,
    type LinkCategory,
} from '../../lib/links'

const EMPTY: UsefulLinkInput = {
    label: '',
    url: '',
    category: 'interest',
}

export default function LinksAdmin() {
    const [links, setLinks] = useState<UsefulLink[]>([])
    const [loading, setLoading] = useState(true)

    const [editing, setEditing] = useState<UsefulLink | 'new' | null>(null)

    const load = () =>
        getLinks()
            .then(setLinks)
            .catch(console.error)
            .finally(() => setLoading(false))

    useEffect(() => {
        load()
    }, [])

    if (loading) return <p className="text-ink-muted">Loading links…</p>

    return (
        <div>
            <div className="mb-6 flex flex-col items-start">
                <h3 className="text-2xl font-semibold text-brand-deep">Useful links</h3>
                <button
                    type="button"
                    onClick={() => setEditing('new')}
                    className="rounded-lg bg-brand px-4 py-2 font-semibold text-white"
                >
                    Add link
                </button>
            </div>

            {links.length === 0 ? (
                <p className="text-ink-muted">No links yet. Add the first one.</p>
            ) : (
                <div className="flex flex-col gap-8">
                    {LINK_CATEGORIES.map(({ key, label }) => {
                        const group = links.filter((l) => l.category === key)
                        if (group.length === 0) return null
                        return (
                            <div key={key}>
                                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
                                    {label}
                                </h4>
                                <div className="flex flex-col gap-2">
                                    {group.map((l) => (
                                        <button
                                            key={l.id}
                                            type="button"
                                            onClick={() => setEditing(l)}
                                            className="flex flex-col items-start rounded-xl border border-line px-4 py-3 text-left hover:bg-sky-tint"
                                        >
                                            <span className="font-semibold text-ink">
                                                {l.label || '(no label)'}
                                            </span>
                                            <span className="text-sm text-ink-muted">
                                                {l.url || '(no url)'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {editing && (
                <LinkEditor
                    link={editing === 'new' ? null : editing}
                    onClose={() => setEditing(null)}
                    onSaved={() => {
                        setEditing(null)
                        load()
                    }}
                />
            )}
        </div>
    )
}

function LinkEditor({
    link,
    onClose,
    onSaved,
}: {
    link: UsefulLink | null
    onClose: () => void
    onSaved: () => void
}) {
    const [form, setForm] = useState<UsefulLinkInput>(
        link ? { label: link.label, url: link.url, category: link.category } : EMPTY,
    )
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const set = (field: keyof UsefulLinkInput, value: string) =>
        setForm((f) => ({ ...f, [field]: value }))

    const handleSave = async () => {
        setBusy(true)
        setError(null)
        try {
            if (link) await saveLink(link.id, form)
            else await addLink(form)
            onSaved()
        } catch (err) {
            console.error(err)
            setError('Save failed. Make sure you are signed in as admin.')
            setBusy(false)
        }
    }

    const handleDelete = async () => {
        if (!link) return
        if (!confirm(`Delete ${link.label || 'this link'}?`)) return
        setBusy(true)
        setError(null)
        try {
            await removeLink(link.id)
            onSaved()
        } catch (err) {
            console.error(err)
            setError('Delete failed.')
            setBusy(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-2xl bg-white p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-semibold text-brand-deep">
                    {link ? 'Edit link' : 'Add link'}
                </h3>

                <div className="mt-4 flex flex-col gap-3">
                    <Field label="Label" value={form.label} onChange={(v) => set('label', v)} />
                    <Field
                        label="URL"
                        value={form.url}
                        onChange={(v) => set('url', v)}
                        placeholder="https://"
                    />
                    <label className="flex flex-col gap-1 text-sm text-ink-muted">
                        Column
                        <div className="relative">
                            <select
                                value={form.category}
                                onChange={(e) => set('category', e.target.value as LinkCategory)}
                                className="peer w-full appearance-none rounded-lg border border-line px-2 py-2 pr-10 text-ink outline-none focus:border-brand-deep"
                            >
                                {LINK_CATEGORIES.map((c) => (
                                    <option key={c.key} value={c.key}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                            <LuChevronDown
                                aria-hidden
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted transition-transform duration-200 peer-focus:rotate-180"
                            />
                        </div>
                    </label>
                </div>

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

                <div className="mt-6 flex items-center justify-between gap-3">
                    {link ? (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={busy}
                            className="text-sm font-semibold text-red-600 disabled:opacity-50"
                        >
                            Delete
                        </button>
                    ) : (
                        <span />
                    )}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={busy}
                            className="px-4 py-2 font-semibold text-ink-muted disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={busy}
                            className="rounded-lg bg-brand px-4 py-2 font-semibold text-white disabled:opacity-50"
                        >
                            {busy ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Field({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
}) {
    return (
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
            {label}
            <input
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-lg border border-line px-2 py-2 text-ink outline-none focus:border-brand-deep"
            />
        </label>
    )
}
