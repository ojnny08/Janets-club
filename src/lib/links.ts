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

export type LinkCategory = 'interest' | 'degree'

export const LINK_CATEGORIES: { key: LinkCategory; label: string }[] = [
    { key: 'interest', label: 'Interest Links' },
    { key: 'degree', label: 'Degree Planning' },
]

export type UsefulLink = {
    id: string
    label: string
    url: string
    category: LinkCategory
    createdAt?: Timestamp
}

export type UsefulLinkInput = Omit<UsefulLink, 'id' | 'createdAt'>

const linksCol = collection(db, 'links')

export async function getLinks(): Promise<UsefulLink[]> {
    const snap = await getDocs(linksCol)
    const links = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as UsefulLink)
    return links.sort(
        (a, b) => (a.createdAt?.toMillis() ?? Infinity) - (b.createdAt?.toMillis() ?? Infinity),
    )
}

export async function addLink(data: UsefulLinkInput): Promise<string> {
    const ref = await addDoc(linksCol, { ...data, createdAt: serverTimestamp() })
    return ref.id
}

export async function saveLink(id: string, data: UsefulLinkInput): Promise<void> {
    await setDoc(doc(db, 'links', id), data, { merge: true })
}

export async function removeLink(id: string): Promise<void> {
    await deleteDoc(doc(db, 'links', id))
}
