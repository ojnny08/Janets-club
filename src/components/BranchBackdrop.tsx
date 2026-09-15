function Branch({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 400 400"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* main limb */}
            <path d="M-20 4C48 26 104 54 152 96c48 42 86 96 118 158" strokeWidth="9" />

            {/* first fork — upper */}
            <path d="M152 96c34-6 66-22 92-46" strokeWidth="5" />
            <path d="M244 50c14 6 30 7 46 4" strokeWidth="2.5" />
            <path d="M216 68c6 16 6 32 1 47" strokeWidth="2.5" />

            {/* second fork — lower */}
            <path d="M96 48c-4 34-18 64-40 88" strokeWidth="5" />
            <path d="M56 136c-16 2-31 9-43 20" strokeWidth="2.5" />
            <path d="M78 96c-18-4-34-12-47-25" strokeWidth="2.5" />

            {/* third fork — mid */}
            <path d="M206 158c30 10 62 12 93 6" strokeWidth="4" />
            <path d="M299 164c10 12 16 27 18 43" strokeWidth="2" />
            <path d="M252 168c2 14 0 27-6 39" strokeWidth="2" />

            {/* trailing twigs off the tip */}
            <path d="M248 226c22 6 40 20 52 40" strokeWidth="2.5" />
            <path d="M270 254c14-6 29-9 44-8" strokeWidth="1.8" />

            {/* leaves */}
            <g fill="currentColor" stroke="none" opacity="0.9">
                <ellipse cx="290" cy="52" rx="13" ry="6" transform="rotate(-18 290 52)" />
                <ellipse cx="219" cy="118" rx="12" ry="6" transform="rotate(72 219 118)" />
                <ellipse cx="12" cy="158" rx="13" ry="6" transform="rotate(24 12 158)" />
                <ellipse cx="32" cy="70" rx="12" ry="6" transform="rotate(-40 32 70)" />
                <ellipse cx="318" cy="208" rx="12" ry="6" transform="rotate(64 318 208)" />
                <ellipse cx="245" cy="208" rx="11" ry="5.5" transform="rotate(80 245 208)" />
                <ellipse cx="315" cy="247" rx="12" ry="6" transform="rotate(-12 315 247)" />
                <ellipse cx="301" cy="267" rx="11" ry="5.5" transform="rotate(48 301 267)" />
            </g>
        </svg>
    )
}

export default function BranchBackdrop() {
    const corner = "w-[clamp(14rem,29vw,27rem)] aspect-square"

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden text-slate-400/45
                       [mask-image:radial-gradient(120%_120%_at_50%_50%,transparent_28%,black_68%)]"
        >
            {/* top-left */}
            <Branch className={`absolute -left-16 -top-20 ${corner}`} />

            {/* top-right (mirrored) */}
            <Branch className={`absolute -right-16 -top-24 ${corner} -scale-x-100`} />

            {/* bottom-left (flipped vertically) */}
            <Branch className={`absolute -bottom-20 -left-20 ${corner} -scale-y-100`} />

            {/* bottom-right (rotated 180deg) */}
            <Branch className={`absolute -bottom-16 -right-16 ${corner} rotate-180`} />
        </div>
    )
}
