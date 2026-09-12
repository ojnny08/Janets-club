import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/useAuth'

type Props = {
    onClose: () => void
}

type FieldProps = {
    label: string
    type: 'email' | 'password'
    value: string
    onChange: (value: string) => void
    autoComplete: string
    autoFocus?: boolean
}

function Field({ label, type, value, onChange, autoComplete, autoFocus }: FieldProps) {
    return (
        <label className="flex flex-col gap-1 text-sm font-medium text-ink-muted">
            {label}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
                autoFocus={autoFocus}
                autoComplete={autoComplete}
                className="rounded-lg border border-line px-3 py-2 text-base font-normal text-brand-deep outline-none focus:border-brand-deep"
            />
        </label>
    )
}

export default function LoginDropdown({ onClose }: Props) {
    const { login, error, clearError } = useAuth()
    const panelRef = useRef<HTMLDivElement>(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const close = useCallback(() => {
        clearError()
        onClose()
    }, [clearError, onClose])

    useEffect(() => {
        const onPointerDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.closest('[data-login-toggle]')) return
            if (!panelRef.current?.contains(target)) close()
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close()
        }
        document.addEventListener('mousedown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('mousedown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [close])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        const ok = await login(email, password)
        setSubmitting(false)
        setPassword('')
        if (ok) {
            setEmail('')
            close()
        }
    }

    return (
        <div
            ref={panelRef}
            className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-line bg-white shadow-lg"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
                <Field
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    autoComplete="username"
                    autoFocus
                />
                <Field
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    autoComplete="current-password"
                />

                {error && (
                    <p role="alert" className="text-sm text-red-600">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-1 rounded-full bg-brand-deep px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                    {submitting ? 'Signing in…' : 'Sign in'}
                </button>
            </form>
        </div>
    )
}
