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

export type Alumnus = {
    id: string
    name: string
    role: string
    year: string
    imageUrl?: string
    createdAt?: Timestamp
}

export type AlumnusInput = Omit<Alumnus, 'id' | 'createdAt'>

const alumniCol = collection(db, 'alumni')

export async function getAlumni(): Promise<Alumnus[]> {
    const snap = await getDocs(alumniCol)
    const alumni = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Alumnus)
    return alumni.sort(
        (a, b) => (a.createdAt?.toMillis() ?? Infinity) - (b.createdAt?.toMillis() ?? Infinity),
    )
}

export async function addAlumnus(data: AlumnusInput): Promise<string> {
    const ref = await addDoc(alumniCol, { ...data, createdAt: serverTimestamp() })
    return ref.id
}

export async function saveAlumnus(id: string, data: AlumnusInput): Promise<void> {
    await setDoc(doc(db, 'alumni', id), data, { merge: true })
}

export async function removeAlumnus(id: string): Promise<void> {
    await deleteDoc(doc(db, 'alumni', id))
}
