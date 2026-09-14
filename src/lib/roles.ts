import {
    collection,
    getDocs,
    doc,
    addDoc,
    setDoc,
    deleteDoc,
} from 'firebase/firestore'
import { db } from './firebase'

export type Role = {
    id: string
    name: string
    order: number
}

const rolesCol = collection(db, 'roles')

export async function getRoles(): Promise<Role[]> {
    const snap = await getDocs(rolesCol)
    const roles = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Role)
    return roles.sort((a, b) => a.order - b.order)
}

export async function addRole(name: string): Promise<string> {
    const existing = await getRoles()
    const order = existing.length ? existing[existing.length - 1].order + 1 : 0
    const ref = await addDoc(rolesCol, { name, order })
    return ref.id
}

export async function renameRole(id: string, name: string): Promise<void> {
    await setDoc(doc(db, 'roles', id), { name }, { merge: true })
}

export async function removeRole(id: string): Promise<void> {
    await deleteDoc(doc(db, 'roles', id))
}

export async function moveRole(roles: Role[], id: string, dir: -1 | 1): Promise<void> {
    const idx = roles.findIndex((r) => r.id === id)
    const swapIdx = idx + dir
    if (idx < 0 || swapIdx < 0 || swapIdx >= roles.length) return
    const a = roles[idx]
    const b = roles[swapIdx]
    await Promise.all([
        setDoc(doc(db, 'roles', a.id), { order: b.order }, { merge: true }),
        setDoc(doc(db, 'roles', b.id), { order: a.order }, { merge: true }),
    ])
}
