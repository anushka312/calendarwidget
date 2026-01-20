import { useState, useRef, useEffect } from 'react';
import defaultBg from '../src/assets/bg.jpg';

export default function CalendarWidget() {
    const fileInputRef = useRef(null);
    const scrollAccumulator = useRef(0); // For the slow scroll logic

    // --- STATE ---
    const [days, setDays] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [currentView, setCurrentView] = useState('weekly');
    const [notes, setNotes] = useState({});
    const [showSettings, setShowSettings] = useState(false);
    const [bgType, setBgType] = useState('image');
    const [bgImage, setBgImage] = useState(defaultBg);
    const [bgColor, setBgColor] = useState('#1e293b');

    // --- GENERATE DATES ---
    useEffect(() => {
        const arr = [];
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(year, month, i);
            arr.push({
                id: d.toISOString().split('T')[0],
                label: d.toLocaleDateString('en-US', { weekday: 'short' }),
                date: d.getDate(),
                month: d.toLocaleDateString('en-US', { month: 'long' }),
                isToday: d.toDateString() === now.toDateString()
            });
        }
        setDays(arr);
        setSelectedIndex(now.getDate() - 1);
    }, []);

    // --- SLOW SCROLL HANDLER ---
    const handleScroll = (e) => {
        // Higher threshold = slower scroll (more wheel movement needed to change day)
        const threshold = 100;
        scrollAccumulator.current += e.deltaY;

        if (Math.abs(scrollAccumulator.current) >= threshold) {
            const direction = scrollAccumulator.current > 0 ? 1 : -1;
            setSelectedIndex(prev => Math.max(0, Math.min(days.length - 1, prev + direction)));
            scrollAccumulator.current = 0; // Reset after a move
        }
    };

    // --- DIAL MATH (Tightened for Week visibility) ---
    const getDialStyles = (index) => {
        const distance = index - selectedIndex;
        const absDistance = Math.abs(distance);

        // Reduced from 75 to 60 to fit the whole week in the container
        const xOffset = distance * 60;
        const yOffset = absDistance * absDistance * 2.5;
        const scale = 1 - (absDistance * 0.15);
        const opacity = 1 - (absDistance * 0.3);

        return {
            position: 'absolute',
            left: '50%',
            marginLeft: '-24px',
            transform: `translate3d(${xOffset}px, ${yOffset}px, 0) scale(${Math.max(scale, 0.5)})`,
            opacity: Math.max(opacity, 0),
            zIndex: 100 - absDistance,
            transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)', // Smoother easing
            pointerEvents: absDistance > 1 ? 'none' : 'auto'
        };
    };

    return (
        <div className="relative flex h-screen w-full items-center justify-center font-sans overflow-hidden bg-black"
            onWheel={handleScroll}>

            {/* Background */}
            <div className="absolute inset-0 z-0 transition-all duration-1000" style={{
                backgroundImage: bgType === 'image' ? `url(${bgImage})` : 'none',
                backgroundColor: bgColor,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(10px) brightness(0.7)',
                transform: 'scale(1.1)'
            }}></div>

            {/* Glass Card */}
            <div className="relative z-10 w-[400px] h-[650px] rounded-[50px] overflow-hidden backdrop-blur-lg border border-white/20 shadow-2xl flex flex-col bg-gradient-to-b from-white/5 to-black/20 brightness-110">

                {/* Header Section */}
                <div className="flex justify-between items-center px-8 pt-10">
                    <div className="flex bg-black/40 backdrop-blur-xl rounded-xl p-1 w-44 relative border border-white/10">
                        <div className={`absolute h-[calc(100%-8px)] w-[calc(50%-4px)] bg-white/20 rounded-lg transition-all duration-300 ${currentView === 'monthly' ? 'translate-x-full' : 'translate-x-0'}`} />
                        <button onClick={() => setCurrentView('weekly')} className="flex-1 py-1.5 z-10 text-white text-[10px] font-bold uppercase tracking-widest">Week</button>
                        <button onClick={() => setCurrentView('monthly')} className="flex-1 py-1.5 z-10 text-white text-[10px] font-bold uppercase tracking-widest">Month</button>
                    </div>
                    <button onClick={() => setShowSettings(true)} className="text-white/40 hover:text-white transition-all text-xl">⛯</button>
                </div>

                <div className="px-10 pt-10 text-white select-none">
                    <h1 className="text-4xl font-bold tracking-tight">{days[selectedIndex]?.month}</h1>
                    <p className="text-7xl font-thin opacity-30 leading-none mt-2">{days[selectedIndex]?.date}</p>
                </div>

                <div className="relative flex-1 mt-4 overflow-hidden">
                    {currentView === 'weekly' ? (
                        <div className="relative h-64 mt-10">
                            <div className="relative w-full h-full flex items-center justify-center -mt-20">
                                {days.map((day, i) => (
                                    <div key={day.id} onClick={() => setSelectedIndex(i)} style={getDialStyles(i)} className="cursor-pointer group flex flex-col items-center">
                                        <span className={`text-[18px] font-black mb-4 transition-all uppercase ${i === selectedIndex ? 'text-white' : 'text-white/40'}`}>
                                            {day.label}
                                        </span>
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-500
                                            ${i === selectedIndex ? 'bg-white text-black shadow-2xl scale-125' : 'text-white border border-white/5 hover:bg-white/10'}`}>
                                            {day.date}
                                        </div>
                                        {notes[day.id] && <div className={`mt-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white] ${Math.abs(i - selectedIndex) > 3 ? 'opacity-0' : 'opacity-100'}`} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-y-auto no-scrollbar px-8 py-4">
                            <div className="grid grid-cols-7 gap-2">
                                {days.map((day, i) => {
                                    const isSelected = selectedIndex === i;
                                    return (
                                        <div key={day.id} className="contents">
                                            {day.date === 1}
                                            <div onClick={() => setSelectedIndex(i)}
                                                className={`aspect-square flex flex-col items-center justify-center rounded-xl 
                                                transition-[background-color,transform,shadow] duration-200 
                                                ${isSelected ? 'bg-white text-black scale-110 shadow-lg' : 'text-white/60 hover:bg-white/10 border border-transparent'}`}>
                                                <span className="text-md font-bold">{day.date}</span>
                                                {notes[day.id] && <div className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? 'bg-black' : 'bg-white'}`} />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Dynamic Note Input */}
                <div className={`relative group flex flex-col bg-black/40 backdrop-blur-md border-t border-white/5 transition-all duration-500 
    ${currentView === 'weekly' ? 'h-40' : 'h-32'}`}
                >
                    {/* Clear Button - Top Right */}
                    <button
                        onClick={() => setNotes({ ...notes, [days[selectedIndex].id]: "" })}
                        className="absolute top-4 right-6 z-20 opacity-30 er:opacity-40 hover:!opacity-100 transition-opacity text-[10px] font-black uppercase tracking-widest text-white border border-white/20 px-2 py-1 rounded-md"
                    >
                        Clear
                    </button>

                    <textarea
                        key={selectedIndex} // Forces clean state per day
                        value={notes[days[selectedIndex]?.id] || ""}
                        onChange={(e) => setNotes({ ...notes, [days[selectedIndex].id]: e.target.value })}
                        placeholder="Type a note..."
                        className={`w-full bg-transparent border-none text-white focus:outline-none resize-none px-8 py-6 placeholder:text-white/10 transition-all
            ${currentView === 'weekly' ? 'h-full text-lg' : 'h-full text-base'}`}
                    />
                </div>
            </div>

            {showSettings && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
                    <div className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[40px] p-8 shadow-2xl">
                        <h2 className="text-white text-2xl font-bold mb-6">Settings</h2>
                        <div className="space-y-4">
                            <button onClick={() => fileInputRef.current.click()} className="w-full py-4 bg-white/5 text-white rounded-2xl hover:bg-white/10 transition-all text-left px-6 flex justify-between">Upload Image <span>⛶</span></button>
                            <div className="relative w-full h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center px-4 cursor-pointer">
                                <div className="w-6 h-6 rounded-full mr-3" style={{ backgroundColor: bgColor }} />
                                <span className="text-white/80 text-sm">Pick a Color</span>
                                <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); setBgType('color'); }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                            </div>
                            <button onClick={() => setShowSettings(false)} className="w-full py-4 bg-white text-black font-bold rounded-2xl">Done</button>
                        </div>
                        <input type="file" ref={fileInputRef} hidden onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) { setBgImage(URL.createObjectURL(file)); setBgType('image'); }
                        }} />
                    </div>
                </div>
            )}
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        </div>
    );
}