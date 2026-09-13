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

export type Alumnus = {
    id: string
    name: string
    role: string
    year: string
    imageUrl?: string
    order: number
}

export type AlumnusInput = Omit<Alumnus, 'id'>

const alumniCol = collection(db, 'alumni')

export async function getAlumni(): Promise<Alumnus[]> {
    const snap = await getDocs(query(alumniCol, orderBy('order')))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Alumnus)
}

export async function addAlumnus(data: AlumnusInput): Promise<string> {
    const ref = await addDoc(alumniCol, data)
    return ref.id
}

export async function saveAlumnus(id: string, data: AlumnusInput): Promise<void> {
    await setDoc(doc(db, 'alumni', id), data)
}

export async function removeAlumnus(id: string): Promise<void> {
    await deleteDoc(doc(db, 'alumni', id))
}
