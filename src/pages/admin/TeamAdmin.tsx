import { useEffect, useState } from 'react'
import { LuChevronDown } from 'react-icons/lu'
import logo from '../../assets/DUESA.png'
import {
    getTeam,
    addMember,
    saveMember,
    removeMember,
    type Member,
    type MemberInput,
} from '../../lib/team'
import { getRoles, type Role } from '../../lib/roles'
import { uploadImage } from '../../lib/storage'

const EMPTY: MemberInput = {
    roleId: '',
    name: '',
    program: '',
    year: '',
    imageUrl: '',
}

export default function TeamAdmin() {
    const [members, setMembers] = useState<Member[]>([])
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)

    const [editing, setEditing] = useState<Member | 'new' | null>(null)

    const load = () =>
        Promise.all([getTeam(), getRoles()])
            .then(([m, r]) => {
                setMembers(m)
                setRoles(r)
            })
            .catch(console.error)
            .finally(() => setLoading(false))

    useEffect(() => {
        load()
    }, [])

    if (loading) return <p className="text-ink-muted">Loading team…</p>

    // Roles in hierarchy order, then an "Unassigned" bucket for members
    // whose role is missing or was deleted.
    const groups: { key: string; label: string; members: Member[] }[] = [
        ...roles.map((r) => ({
            key: r.id,
            label: r.name,
            members: members.filter((m) => m.roleId === r.id),
        })),
        {
            key: 'unassigned',
            label: 'Unassigned',
            members: members.filter((m) => !roles.some((r) => r.id === m.roleId)),
        },
    ].filter((g) => g.members.length > 0)

    return (
        <div>
            <div className="mb-6 flex flex-col items-start">
                <h3 className="text-2xl font-semibold text-brand-deep">Team members</h3>
                <button
                    type="button"
                    onClick={() => setEditing('new')}
                    className="rounded-lg bg-brand px-4 py-2 font-semibold text-white"
                >
                    Add member
                </button>
            </div>

            {roles.length === 0 ? (
                <p className="text-ink-muted">
                    No roles yet. Add roles in the Roles section first, then assign members to them.
                </p>
            ) : members.length === 0 ? (
                <p className="text-ink-muted">No members yet. Add the first one.</p>
            ) : (
                <div className="flex flex-col gap-8">
                    {groups.map((g) => (
                        <div key={g.key}>
                            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
                                {g.label}
                            </h4>
                            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                                {g.members.map((m) => (
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
                                        <span className="mt-3 font-semibold text-ink">
                                            {m.name || '(no name)'}
                                        </span>
                                        <span className="text-sm text-ink-muted">{g.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editing && (
                <MemberEditor
                    member={editing === 'new' ? null : editing}
                    roles={roles}
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
    roles,
    onClose,
    onSaved,
}: {
    member: Member | null
    roles: Role[]
    onClose: () => void
    onSaved: () => void
}) {
    const [form, setForm] = useState<MemberInput>(
        member
            ? {
                  roleId: member.roleId ?? '',
                  name: member.name,
                  program: member.program,
                  year: member.year,
                  imageUrl: member.imageUrl ?? '',
              }
            : EMPTY,
    )
    const [file, setFile] = useState<File | null>(null)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const set = (field: keyof MemberInput, value: string) =>
        setForm((f) => ({ ...f, [field]: value }))

    const handleSave = async () => {
        setBusy(true)
        setError(null)
        try {
            let imageUrl = form.imageUrl
            if (file) imageUrl = await uploadImage(file, 'team')

            const data: MemberInput = { ...form, imageUrl }
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
                    <label className="flex flex-col gap-1 text-sm text-ink-muted">
                        Role
                        <div className="relative">
                            <select
                                value={form.roleId}
                                onChange={(e) => set('roleId', e.target.value)}
                                className="peer w-full appearance-none rounded-lg border border-line px-2 py-2 pr-10 text-ink outline-none focus:border-brand-deep"
                            >
                                <option value="">role</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                            <LuChevronDown
                                aria-hidden
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted transition-transform duration-200 peer-focus:rotate-180"
                            />
                        </div>
                    </label>
                    <Field
                        label="Program"
                        value={form.program}
                        onChange={(v) => set('program', v)}
                    />
                    <Field label="Year" value={form.year} onChange={(v) => set('year', v)} />
                    <label className="flex flex-col gap-1 text-sm text-ink-muted">
                        Photo
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            className="cursor-pointer text-sm text-ink-muted file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-line file:bg-gray-200 file:px-3 file:py-1.5 file:text-sm file:text-ink hover:file:bg-gray-300"
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
                className="rounded-lg border border-line px-2 py-2 text-ink outline-none focus:border-brand-deep"
            />
        </label>
    )
}
