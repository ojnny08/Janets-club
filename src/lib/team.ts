import {
    collection,
    getDocs,
    doc,
    addDoc,
    setDoc,
    deleteDoc,
    query,
    orderBy,
} from 'firebase/firestore'
import { db } from './firebase'

export type Member = {
    id: string
    role: string
    name: string
    program: string
    year: string
    imageUrl?: string
    order: number
}

export type MemberInput = Omit<Member, 'id'>

const teamCol = collection(db, 'team')

export async function getTeam(): Promise<Member[]> {
    const snap = await getDocs(query(teamCol, orderBy('order')))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Member)
}

export async function addMember(data: MemberInput): Promise<string> {
    const ref = await addDoc(teamCol, data)
    return ref.id
}

export async function saveMember(id: string, data: MemberInput): Promise<void> {
    await setDoc(doc(db, 'team', id), data)
}

export async function removeMember(id: string): Promise<void> {
    await deleteDoc(doc(db, 'team', id))
}
