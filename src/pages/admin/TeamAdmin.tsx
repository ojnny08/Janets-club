import { useEffect, useState } from 'react'
import logo from '../../assets/duesa-logo-circle.png'
import {
    getTeam,
    addMember,
    saveMember,
    removeMember,
    type Member,
    type MemberInput,
} from '../../lib/team'
import { uploadImage } from '../../lib/storage'

const EMPTY: MemberInput = {
    role: '',
    name: '',
    program: '',
    year: '',
    imageUrl: '',
    order: 0,
}

export default function TeamAdmin() {
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)

    const [editing, setEditing] = useState<Member | 'new' | null>(null)

    const load = () =>
        getTeam()
            .then(setMembers)
            .catch(console.error)
            .finally(() => setLoading(false))

    useEffect(() => {
        load()
    }, [])

    if (loading) return <p className="text-ink-muted">Loading team…</p>

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-brand-deep">Team members</h3>
                <button
                    type="button"
                    onClick={() => setEditing('new')}
                    className="rounded-lg bg-brand px-4 py-2 font-semibold text-white"
                >
                    + Add member
                </button>
            </div>

            {members.length === 0 ? (
                <p className="text-ink-muted">No members yet. Add the first one.</p>
            ) : (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                    {members.map((m) => (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => setEditing(m)}
                            className="flex flex-col items-center rounded-xl border border-line p-4 text-center hover:bg-sky-tint"
                        >
                            <img
                                src={m.imageUrl || logo}
                                alt=""
                                className="h-24 w-24 rounded-full object-cover ring-2 ring-sky-brand/60"
                            />
                            <span className="mt-3 font-semibold text-ink">{m.name || '(no name)'}</span>
                            <span className="text-sm text-ink-muted">{m.role}</span>
                        </button>
                    ))}
                </div>
            )}

            {editing && (
                <MemberEditor
                    member={editing === 'new' ? null : editing}
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

function MemberEditor({
    member,
    onClose,
    onSaved,
}: {
    member: Member | null
    onClose: () => void
    onSaved: () => void
}) {
    const [form, setForm] = useState<MemberInput>(
        member
            ? {
                  role: member.role,
                  name: member.name,
                  program: member.program,
                  year: member.year,
                  imageUrl: member.imageUrl ?? '',
                  order: member.order,
              }
            : EMPTY,
    )
    const [file, setFile] = useState<File | null>(null)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const set = (field: keyof MemberInput, value: string | number) =>
        setForm((f) => ({ ...f, [field]: value }))

    const handleSave = async () => {
        setBusy(true)
        setError(null)
        try {
            let imageUrl = form.imageUrl
            if (file) imageUrl = await uploadImage(file, 'team')

            const data: MemberInput = { ...form, imageUrl, order: Number(form.order) }
            if (member) await saveMember(member.id, data)
            else await addMember(data)
            onSaved()
        } catch (err) {
            console.error(err)
            setError('Save failed. Make sure you are signed in as admin.')
            setBusy(false)
        }
    }

    const handleDelete = async () => {
        if (!member) return
        if (!confirm(`Delete ${member.name || 'this member'}?`)) return
        setBusy(true)
        setError(null)
        try {
            await removeMember(member.id)
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
                    {member ? 'Edit member' : 'Add member'}
                </h3>

                <div className="mt-4 flex flex-col gap-3">
                    <Field label="Name" value={form.name} onChange={(v) => set('name', v)} />
                    <Field label="Role" value={form.role} onChange={(v) => set('role', v)} />
                    <Field
                        label="Program"
                        value={form.program}
                        onChange={(v) => set('program', v)}
                    />
                    <Field label="Year" value={form.year} onChange={(v) => set('year', v)} />
                    <label className="flex flex-col gap-1 text-sm text-ink-muted">
                        Order
                        <input
                            type="number"
                            value={form.order}
                            onChange={(e) => set('order', e.target.value)}
                            className="rounded-lg border border-line px-3 py-2 text-ink"
                        />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-ink-muted">
                        Photo
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            className="text-ink"
                        />
                    </label>
                </div>

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

                <div className="mt-6 flex items-center justify-between gap-3">
                    {member ? (
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
}: {
    label: string
    value: string
    onChange: (v: string) => void
}) {
    return (
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
            {label}
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-lg border border-line px-3 py-2 text-ink"
            />
        </label>
    )
}
