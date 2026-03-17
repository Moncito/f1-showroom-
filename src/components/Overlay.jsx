import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import StatsPanel from './StatsPanel'
import { useIntroAnimation } from '../hooks/useIntroAnimation'

export default function Overlay({ car, index, total, onPrev, onNext, isTransitioning }) {
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const teamRef = useRef()
    const nameRef = useRef()
    const hintRef = useRef()
    const prevBtnRef = useRef()
    const nextBtnRef = useRef()
    const leftNumRef = useRef()
    const rightNumRef = useRef()
    const titleRef = useRef()
    const dotsRef = useRef()
    const numberRef = useRef()
    const statsPanelRef = useRef()

    // ── Intro animation on first load ────────────────────────────────────
    useIntroAnimation(
        {
            titleRef,
            dotsRef,
            teamRef,
            nameRef,
            hintRef,
            leftNumRef,
            rightNumRef,
            numberRef,
            statsPanelRef,
        },
        isFirstLoad
    )

    // Mark intro as complete after it plays
    useEffect(() => {
        if (isFirstLoad) {
            const timer = setTimeout(() => setIsFirstLoad(false), 2000)
            return () => clearTimeout(timer)
        }
    }, [isFirstLoad])

    // ── Text animations on car switch ────────────────────────────────────
    useEffect(() => {
        if (isTransitioning) {
            // Fade out current content (very fast)
            gsap.to([teamRef.current, nameRef.current, hintRef.current], {
                opacity: 0,
                duration: 0.25,
                ease: 'power2.in',
            })

            // Ghost numbers fade out
            gsap.to([leftNumRef.current, rightNumRef.current], {
                opacity: 0,
                duration: 0.3,
            })
        } else {
            // Staggered animation in for new car
            const tl = gsap.timeline()

            // Team line + name slide in
            tl.fromTo(
                teamRef.current,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' },
                0
            )

            // Car name slide in (removed scale for performance)
            tl.fromTo(
                nameRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
                '-=0.2'
            )

            // Hint text fade in
            tl.fromTo(
                hintRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: 'power2.out' },
                '-=0.15'
            )

            // Ghost numbers fade in
            tl.fromTo(
                [leftNumRef.current, rightNumRef.current],
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: 'power2.out' },
                0
            )
        }
    }, [isTransitioning, index])

    // ── Button hover & click effects ─────────────────────────────────────
    const handleButtonHover = (ref, isHovering) => {
        gsap.to(ref, {
            scale: isHovering ? 1.12 : 1,
            duration: 0.3,
            ease: 'power2.out',
        })
    }

    const handleButtonClick = (ref, callback) => {
        gsap.timeline()
            .to(ref, { scale: 0.92, duration: 0.08 })
            .to(ref, { scale: 1.12, duration: 0.12 })
        callback()
    }

    const contentStyle = {
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'translateY(8px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
    }

    return (
        <div className="w-full h-full flex flex-col justify-between p-8 select-none">

            {/* ── Stats Panel (Top Right) ──────────────────────────────── */}
            <StatsPanel
                ref={statsPanelRef}
                car={car}
                isTransitioning={isTransitioning}
            />

            {/* ── Top bar ─────────────────────────────────── */}
            <div className="flex justify-between items-center" style={contentStyle}>
                <span
                    ref={titleRef}
                    className="text-white text-sm font-medium tracking-[0.25em] uppercase"
                    style={{ letterSpacing: '0.25em' }}
                >
                    F1 Showroom
                </span>

                {/* Car index dots */}
                <div ref={dotsRef} className="flex gap-2 items-center">
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
                ref={leftNumRef}
                className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ ...contentStyle }}
            >
                <span
                    style={{
                        fontSize: 128,
                        fontWeight: 900,
                        color: 'transparent',
                        WebkitTextStroke: `2px ${car.color}CC`,
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
                ref={rightNumRef}
                className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ ...contentStyle }}
            >
                <span
                    style={{
                        fontSize: 128,
                        fontWeight: 900,
                        color: 'transparent',
                        WebkitTextStroke: `2px rgba(255,255,255,0.25)`,
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
                    <div ref={teamRef} className="flex items-center gap-2 mb-3">
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
                        ref={nameRef}
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
                        ref={hintRef}
                        className="mt-3 text-xs uppercase tracking-widest"
                        style={{ color: 'rgba(255,255,255,0.25)' }}
                    >
                        Drag to explore
                    </p>
                </div>

                {/* Nav */}
                <div className="flex gap-3 pointer-events-auto">
                    <button
                        ref={prevBtnRef}
                        onClick={() => handleButtonClick(prevBtnRef.current, onPrev)}
                        onMouseEnter={() => handleButtonHover(prevBtnRef.current, true)}
                        onMouseLeave={() => handleButtonHover(prevBtnRef.current, false)}
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
                    >
                        ←
                    </button>
                    <button
                        ref={nextBtnRef}
                        onClick={() => handleButtonClick(nextBtnRef.current, onNext)}
                        onMouseEnter={() => handleButtonHover(nextBtnRef.current, true)}
                        onMouseLeave={() => handleButtonHover(nextBtnRef.current, false)}
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
                    >
                        →
                    </button>
                </div>

            </div>
        </div>
    )
}