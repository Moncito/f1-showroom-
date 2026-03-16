export default function Overlay({ car, index, total, onPrev, onNext }) {
    return (
        <div className="w-full h-full flex flex-col justify-between p-8 select-none">

            {/* Top bar */}
            <div className="flex justify-between items-center">
                <span className="text-white text-xl font-bold tracking-widest uppercase">
                    F1 Showroom
                </span>
                <span className="text-white/50 text-sm tracking-widest uppercase">
                    {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
            </div>

            {/* Bottom section */}
            <div className="flex justify-between items-end">

                {/* Car info */}
                <div>
                    <p
                        className="text-xs tracking-[0.3em] uppercase mb-2 font-medium"
                        style={{ color: car.color }}
                    >
                        {car.team}
                    </p>
                    <h1 className="text-white text-6xl font-black uppercase leading-none">
                        {car.name}
                    </h1>
                </div>

                {/* Prev / Next buttons */}
                <div className="flex gap-3 pointer-events-auto">
                    <button
                        onClick={onPrev}
                        className="w-12 h-12 rounded-full border border-white/30 text-white 
                       flex items-center justify-center hover:bg-white/10 
                       transition-colors duration-200"
                    >
                        ←
                    </button>
                    <button
                        onClick={onNext}
                        className="w-12 h-12 rounded-full border border-white/30 text-white 
                       flex items-center justify-center hover:bg-white/10 
                       transition-colors duration-200"
                    >
                        →
                    </button>
                </div>

            </div>
        </div>
    )
}