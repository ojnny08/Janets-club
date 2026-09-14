import { useEffect, useState } from 'react'
import { LuPencil, LuTrash2, LuCheck, LuX, LuArrowUp, LuArrowDown } from 'react-icons/lu'
import {
    getRoles,
    addRole,
    renameRole,
    removeRole,
    moveRole,
    type Role,
} from '../../lib/roles'

export default function RolesAdmin() {
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)
    const [newName, setNewName] = useState('')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [editingId, setEditingId] = useState<string | null>(null)
    const [draft, setDraft] = useState('')

    const load = () =>
        getRoles()
            .then(setRoles)
            .catch(console.error)
            .finally(() => setLoading(false))

    useEffect(() => {
        load()
    }, [])

    const run = async (fn: () => Promise<void>) => {
        setBusy(true)
        setError(null)
        try {
            await fn()
            await load()
        } catch (err) {
            console.error(err)
            setError('Action failed. Make sure you are signed in as admin.')
        } finally {
            setBusy(false)
        }
    }

    const handleAdd = () => {
        const name = newName.trim()
        if (!name) return
        run(async () => {
            await addRole(name)
            setNewName('')
        })
    }

    const startEdit = (role: Role) => {
        setEditingId(role.id)
        setDraft(role.name)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setDraft('')
    }

    const handleRename = (role: Role) => {
        const name = draft.trim()
        if (!name || name === role.name) return cancelEdit()
        run(async () => {
            await renameRole(role.id, name)
            cancelEdit()
        })
    }

    const handleDelete = (role: Role) => {
        if (!confirm(`Delete the "${role.name}" role? Members keep their info but become Unassigned.`))
            return
        run(() => removeRole(role.id))
    }

    if (loading) return <p className="text-ink-muted">Loading roles…</p>

    return (
        <div>
            <h3 className="mb-2 text-2xl font-semibold text-brand-deep">Roles</h3>
            <div className="mb-6 flex gap-3">
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="New role name (e.g. Director)"
                    className="flex-1 rounded-lg border border-line px-3 py-2 text-ink outline-none focus:border-brand-deep"
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={busy || !newName.trim()}
                    className="rounded-lg bg-brand px-4 py-2 font-semibold text-white disabled:opacity-50"
                >
                    + Add role
                </button>
            </div>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            {roles.length === 0 ? (
                <p className="text-ink-muted">Add the first one above.</p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {roles.map((role, i) => (
                        <li
                            key={role.id}
                            className="flex items-center justify-between rounded-xl border border-line px-4 py-3"
                        >
                            {editingId === role.id ? (
                                <input
                                    autoFocus
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleRename(role)
                                        if (e.key === 'Escape') cancelEdit()
                                    }}
                                    disabled={busy}
                                    className="mr-3 min-w-0 flex-1 rounded-lg border border-line px-2 py-1 font-semibold text-ink outline-none focus:border-brand-deep"
                                />
                            ) : (
                                <span className="font-semibold text-ink">{role.name}</span>
                            )}
                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => run(() => moveRole(roles, role.id, -1))}
                                    disabled={busy || editingId === role.id || i === 0}
                                    className="rounded-lg px-2 py-1 text-ink-muted hover:bg-sky-tint disabled:opacity-30"
                                    aria-label="Move up"
                                >
                                    <LuArrowUp />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => run(() => moveRole(roles, role.id, 1))}
                                    disabled={busy || editingId === role.id || i === roles.length - 1}
                                    className="rounded-lg px-2 py-1 text-ink-muted hover:bg-sky-tint disabled:opacity-30"
                                    aria-label="Move down"
                                >
                                    <LuArrowDown />
                                </button>
                                {editingId === role.id ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleRename(role)}
                                            disabled={busy || !draft.trim()}
                                            className="ml-2 rounded-lg px-2 py-1 text-brand hover:bg-sky-tint disabled:opacity-30"
                                            aria-label="Save name"
                                            title="Save"
                                        >
                                            <LuCheck />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            disabled={busy}
                                            className="rounded-lg px-2 py-1 text-ink-muted hover:bg-sky-tint disabled:opacity-30"
                                            aria-label="Cancel rename"
                                            title="Cancel"
                                        >
                                            <LuX />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => startEdit(role)}
                                            disabled={busy}
                                            className="ml-2 rounded-lg px-2 py-1 text-ink-muted hover:bg-sky-tint disabled:opacity-30"
                                            aria-label="Rename role"
                                            title="Rename"
                                        >
                                            <LuPencil />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(role)}
                                            disabled={busy}
                                            className="rounded-lg px-2 py-1 text-red-600 hover:bg-sky-tint disabled:opacity-30"
                                            aria-label="Delete role"
                                            title="Delete"
                                        >
                                            <LuTrash2 />
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
