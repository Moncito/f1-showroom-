export default function Overlay({ car, index, total, onPrev, onNext, isTransitioning }) {

    const contentStyle = {
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'translateY(8px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
    }

    return (
        <div className="w-full h-full flex flex-col justify-between p-8 select-none">

            {/* ── Top bar ─────────────────────────────────── */}
            <div className="flex justify-between items-center" style={contentStyle}>
                <span
                    className="text-white text-sm font-medium tracking-[0.25em] uppercase"
                    style={{ letterSpacing: '0.25em' }}
                >
                    F1 Showroom
                </span>

                {/* Car index dots */}
                <div className="flex gap-2 items-center">
                    {Array.from({ length: total }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: i === index ? 20 : 5,
                                height: 5,
                                borderRadius: 99,
                                background: i === index ? car.color : 'rgba(255,255,255,0.25)',
                                transition: 'all 0.4s ease',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* ── Decorative side numbers ─────────────────── */}
            {/* Left */}
            <div
                className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ ...contentStyle }}
            >
                <span
                    style={{
                        fontSize: 128,
                        fontWeight: 900,
                        color: 'transparent',
                        WebkitTextStroke: `1px ${car.color}22`,
                        lineHeight: 1,
                        userSelect: 'none',
                        fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    {String(index + 1).padStart(2, '0')}
                </span>
            </div>

            {/* Right — shows next car number */}
            <div
                className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ ...contentStyle }}
            >
                <span
                    style={{
                        fontSize: 128,
                        fontWeight: 900,
                        color: 'transparent',
                        WebkitTextStroke: `1px rgba(255,255,255,0.06)`,
                        lineHeight: 1,
                        userSelect: 'none',
                        fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    {String((index + 1) % total + 1).padStart(2, '0')}
                </span>
            </div>

            {/* ── Bottom section ──────────────────────────── */}
            <div className="flex justify-between items-end" style={contentStyle}>

                {/* Car info */}
                <div style={{ maxWidth: '55%' }}>

                    {/* Team name */}
                    <div className="flex items-center gap-2 mb-3">
                        <div
                            style={{
                                width: 28,
                                height: 2,
                                background: car.color,
                                borderRadius: 1,
                                transition: 'background 0.5s ease',
                            }}
                        />
                        <p
                            className="text-xs tracking-[0.3em] uppercase font-medium"
                            style={{ color: car.color, transition: 'color 0.5s ease' }}
                        >
                            {car.team}
                        </p>
                    </div>

                    {/* Car name */}
                    <h1
                        className="text-white uppercase leading-none"
                        style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                            fontWeight: 900,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {car.name}
                    </h1>

                    {/* Subtle hint */}
                    <p
                        className="mt-3 text-xs uppercase tracking-widest"
                        style={{ color: 'rgba(255,255,255,0.25)' }}
                    >
                        Drag to explore
                    </p>
                </div>

                {/* Nav */}
                <div className="flex gap-3 pointer-events-auto">
                    <button
                        onClick={onPrev}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 99,
                            border: '1px solid rgba(255,255,255,0.18)',
                            background: 'rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            color: 'white',
                            fontSize: 18,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s ease, border-color 0.2s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.14)'
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
                        }}
                    >
                        ←
                    </button>
                    <button
                        onClick={onNext}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 99,
                            border: `1px solid ${car.color}55`,
                            background: `${car.color}18`,
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            color: 'white',
                            fontSize: 18,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s ease, border-color 0.2s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = `${car.color}35`
                            e.currentTarget.style.borderColor = `${car.color}99`
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = `${car.color}18`
                            e.currentTarget.style.borderColor = `${car.color}55`
                        }}
                    >
                        →
                    </button>
                </div>

            </div>
        </div>
    )
}