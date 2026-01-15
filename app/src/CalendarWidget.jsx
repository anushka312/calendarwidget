import bgImage from '../src/assets/bg.jpg';
import { useState } from 'react';

export default function CalendarWidget({ view }) {
    const [currentView, setCurrentView] = useState(view || 'weekly');
    const now = new Date();

    const date = now.toLocaleDateString('en-US', {
        day: 'numeric',
    })
    const month = now.toLocaleDateString('en-US', {
        month: 'long',
    })

    const days = [
        { label: 'Mon', date: 16 },
        { label: 'Tue', date: 17 },
        { label: 'Wed', date: 18 },
        { label: 'Thu', date: 19 },
        { label: 'Fri', date: 20 },
        { label: 'Sat', date: 21 },
        { label: 'Sun', date: 22 },
    ];


    return (
        <div className="relative flex h-screen w-full items-center justify-center">

            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            ></div>


            <div className="relative z-10 w-96 h-96 rounded-3xl overflow-hidden backdrop-blur-lg">

                <div className="absolute inset-0 bg-slate-200/20"></div>


                <div className="relative z-10 flex px-7 p-3 top-3">

                    <div className="relative flex w-64 bg-white/20 backdrop-blur-md rounded-lg p-1">

                        <div
                            className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-md bg-slate-200 text-black font-medium backdrop-blur-md transition-transform duration-300 ease-in-out"
                            style={{
                                transform:
                                    currentView === 'weekly'
                                        ? 'translateX(0)'
                                        : 'translateX(100%)',
                            }}
                        ></div>


                        {/* Weekly */}
                        <button
                            onClick={() => setCurrentView('weekly')}
                            className="relative z-10 w-1/2 py-2 text-black"
                        >
                            Weekly
                        </button>

                        {/* Monthly */}
                        <button
                            onClick={() => setCurrentView('monthly')}
                            className="relative z-10 w-1/2 py-2 text-black"
                        >
                            Monthly
                        </button>

                    </div>
                </div>


                <div className="px-7 py-5 m-1 text-[60px] items-center justify-between flex text-white">
                    <span>{month}</span>
                    <span>{date}</span>
                </div>


                <div className="relative w-72 h-36 overflow-hidden">
                    <div className='absolute left-1/2 top-full w-72 h-72 rounded-full bg-white/10'
                    style={{ transform: 'translateX(-50%'}}>
                        
                    </div>
                </div>

            </div>
        </div>
    );
}
