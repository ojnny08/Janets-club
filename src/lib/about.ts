import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export type About = {
    heading: string
    body: string
}

const DEFAULT_ABOUT: About = { heading: 'About Us', body: '' }

const aboutRef = doc(db, 'content', 'about')

export async function getAbout(): Promise<About> {
    const snap = await getDoc(aboutRef)
    return snap.exists() ? (snap.data() as About) : DEFAULT_ABOUT
}

export async function saveAbout(data: About): Promise<void> {
    await setDoc(aboutRef, data)
}
