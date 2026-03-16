import { useEffect } from 'react'
import gsap from 'gsap'

export function useIntroAnimation(refs, isFirstLoad = true) {
    useEffect(() => {
        if (!isFirstLoad) return

        // Set will-change for performance
        const elements = [
            refs.titleRef?.current,
            refs.dotsRef?.current,
            refs.teamRef?.current,
            refs.nameRef?.current,
            refs.hintRef?.current,
            refs.leftNumRef?.current,
            refs.rightNumRef?.current,
            refs.statsPanelRef?.current,
        ].filter(Boolean)

        elements.forEach((el) => {
            if (el) el.style.willChange = 'transform, opacity'
        })

        const tl = gsap.timeline({ paused: false })

        // ── Title slide in (GPU-accelerated) ─────────────────────────────
        if (refs.titleRef?.current) {
            tl.fromTo(
                refs.titleRef.current,
                { opacity: 0, x: -40 },
                { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
                0
            )
        }

        // ── Dots fade in (no stagger to reduce overhead) ──────────────────
        if (refs.dotsRef?.current) {
            tl.fromTo(
                refs.dotsRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: 'power2.out' },
                0.1
            )
        }

        // ── Team name slide in ───────────────────────────────────────────
        if (refs.teamRef?.current) {
            tl.fromTo(
                refs.teamRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
                0.3
            )
        }

        // ── Car name slide in ────────────────────────────────────────────
        if (refs.nameRef?.current) {
            tl.fromTo(
                refs.nameRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
                0.4
            )
        }

        // ── Ghost numbers fade in (opacity only) ─────────────────────────
        if (refs.leftNumRef?.current && refs.rightNumRef?.current) {
            tl.fromTo(
                [refs.leftNumRef.current, refs.rightNumRef.current],
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: 'power2.out' },
                0.3
            )
        }

        // ── Stats panel fade in ──────────────────────────────────────────
        if (refs.statsPanelRef?.current) {
            tl.fromTo(
                refs.statsPanelRef.current,
                { opacity: 0, y: -15 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
                0.5
            )
        }

        // ── Hint text fade in ────────────────────────────────────────────
        if (refs.hintRef?.current) {
            tl.fromTo(
                refs.hintRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.6, ease: 'power2.inOut' },
                1.2
            )
        }

        // Remove will-change after animation completes for better performance
        tl.add(() => {
            elements.forEach((el) => {
                if (el) el.style.willChange = 'auto'
            })
        })

        // Total timeline duration: ~1.8 seconds (much faster)
    }, [isFirstLoad])
}
