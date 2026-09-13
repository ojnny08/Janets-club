import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

export async function uploadImage(file: File, folder: string): Promise<string> {
    const path = `${folder}/${crypto.randomUUID()}-${file.name}`
    const fileRef = ref(storage, path)
    await uploadBytes(fileRef, file)
    return getDownloadURL(fileRef)
}
