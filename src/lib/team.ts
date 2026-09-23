import {
    collection,
    getDocs,
    doc,
    addDoc,
    setDoc,
    deleteDoc,
    serverTimestamp,
    type Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'

export type Member = {
    id: string
    roleId?: string
    name: string
    title?: string
    program: string
    year: string
    imageUrl?: string
    createdAt?: Timestamp
}

export type MemberInput = Omit<Member, 'id' | 'createdAt'>

const teamCol = collection(db, 'team')

export async function getTeam(): Promise<Member[]> {
    const snap = await getDocs(teamCol)
    const members = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Member)
    return members.sort(
        (a, b) => (a.createdAt?.toMillis() ?? Infinity) - (b.createdAt?.toMillis() ?? Infinity),
    )
}

export async function addMember(data: MemberInput): Promise<string> {
    const ref = await addDoc(teamCol, { ...data, createdAt: serverTimestamp() })
    return ref.id
}

export async function saveMember(id: string, data: MemberInput): Promise<void> {
    await setDoc(doc(db, 'team', id), data, { merge: true })
}

export async function removeMember(id: string): Promise<void> {
    await deleteDoc(doc(db, 'team', id))
}
