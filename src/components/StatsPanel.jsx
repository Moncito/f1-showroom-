import { useEffect, useRef, forwardRef } from 'react'
import gsap from 'gsap'

const StatsPanel = forwardRef(({ car, isTransitioning }, ref) => {
    const panelRef = ref || useRef()

    useEffect(() => {
        if (isTransitioning) {
            gsap.to(panelRef.current, {
                opacity: 0,
                y: -10,
                duration: 0.35,
                ease: 'power2.in',
            })
        } else {
            gsap.fromTo(
                panelRef.current,
                { opacity: 0, y: -10 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    delay: 0.2,
                }
            )
        }
    }, [isTransitioning])

    const statEntries = Object.entries(car.stats)
    const topStats = statEntries.slice(0, 2)
    const bottomStats = statEntries.slice(2, 4)

    const StatBox = ({ label, value }) => (
        <div className="stat-box border border-white/10 rounded p-3 text-center">
            <div className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">
                {label}
            </div>
            <div
                className="text-lg font-bold"
                style={{ color: car.color }}
            >
                {value}
            </div>
        </div>
    )

    return (
        <div
            ref={panelRef}
            className="absolute top-16 right-8 text-white pointer-events-auto"
            style={{
                minWidth: '220px',
            }}
        >
            {/* Driver Info */}
            <div className="mb-6 text-right">
                <div
                    className="text-5xl font-black leading-none mb-1"
                    style={{
                        color: '#FFFFFF',
                        textShadow: `
                            0px 0px 10px ${car.color},
                            0px 0px 20px ${car.color},
                            2px 2px 4px ${car.color},
                            -2px -2px 4px ${car.color},
                            2px -2px 4px ${car.color},
                            -2px 2px 4px ${car.color},
                            4px 4px 12px rgba(0,0,0,0.8)
                        `,
                        letterSpacing: '0.05em'
                    }}
                >
                    {car.number}
                </div>
                <div className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">
                    Driver
                </div>
                <div className="text-sm font-semibold">
                    {car.driver}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="space-y-1">
                {/* Top row */}
                <div className="grid grid-cols-2 gap-1">
                    {topStats.map(([key, value]) => (
                        <StatBox key={key} label={key} value={value} />
                    ))}
                </div>
                {/* Bottom row */}
                <div className="grid grid-cols-2 gap-1">
                    {bottomStats.map(([key, value]) => (
                        <StatBox key={key} label={key} value={value} />
                    ))}
                </div>
            </div>
        </div>
    )
})

StatsPanel.displayName = 'StatsPanel'
export default StatsPanel
