import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export type Newsletter = {
    title: string
    body: string
}

const DEFAULT_NEWSLETTER: Newsletter = { title: 'Newsletter', body: '' }

const newsletterRef = doc(db, 'content', 'newsletter')

export async function getNewsletter(): Promise<Newsletter> {
    const snap = await getDoc(newsletterRef)
    return snap.exists() ? (snap.data() as Newsletter) : DEFAULT_NEWSLETTER
}

export async function saveNewsletter(data: Newsletter): Promise<void> {
    await setDoc(newsletterRef, data)
}
