import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Crosshair, Battery, Wifi, Navigation } from 'lucide-react';

export function HUD() {
  const [time, setTime] = useState('');
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().substring(11, 19) + ':' + Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0'));
    };
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-[100vh] pointer-events-none z-50 text-cyan-400 font-mono text-xs select-none">
      {/* Top Left - REC — pushed below nav on mobile */}
      <div className="absolute top-[72px] left-4 sm:top-8 sm:left-8 flex items-center gap-2">
        <motion.div 
          animate={{ opacity: [1, 0, 1] }} 
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_#ff0000]"
        />
        <span className="text-red-500 font-bold tracking-widest text-sm">REC</span>
        <span className="ml-2 opacity-70">{time}</span>
      </div>

      {/* Top Right - Status — pushed below nav on mobile, hidden on xs */}
      <div className="absolute top-[72px] right-4 sm:top-8 sm:right-8 flex flex-col items-end gap-2 opacity-80">
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Wifi size={14} className="text-cyan-400" />
            <span>98%</span>
          </div>
          <div className="flex items-center gap-1">
            <Navigation size={14} className="text-cyan-400" />
            <span>12 GPS</span>
          </div>
          <div className="flex items-center gap-1">
            <Battery size={16} className="text-cyan-400" />
            <span>82%</span>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div>ALT: 1,240FT</div>
          <div>SPD: 34 MPH</div>
        </div>
      </div>

      {/* Center Reticle — hidden on mobile to reduce clutter */}
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
        <Crosshair size={120} strokeWidth={1} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-cyan-400/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-[400px] bg-cyan-400/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[2px] bg-cyan-400/20" />
      </div>

      {/* Bottom Left - Settings — hidden on mobile */}
      <div className="hidden sm:flex absolute bottom-8 left-8 opacity-70 flex-col gap-1">
        <div>ISO 400</div>
        <div>F/2.8</div>
        <div>1/1000</div>
        <div>4K 60FPS</div>
      </div>

      {/* Bottom Right - Coordinates — hidden on mobile */}
      <div className="hidden sm:block absolute bottom-8 right-8 text-right opacity-70">
        <div>LAT: 34.0522° N</div>
        <div>LON: 118.2437° W</div>
        <div className="mt-1 flex items-center justify-end gap-1">
          <div className="h-1 w-24 bg-cyan-400/20 rounded-full overflow-hidden">
            <div className="h-full w-[80%] bg-cyan-400 shadow-[0_0_10px_#00f3ff]" />
          </div>
          <span className="ml-2">SIG</span>
        </div>
      </div>

      {/* Corner Brackets — hidden on mobile */}
      <div className="hidden sm:block absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-cyan-400/50" />
      <div className="hidden sm:block absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-cyan-400/50" />
      <div className="hidden sm:block absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-cyan-400/50" />
      <div className="hidden sm:block absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-cyan-400/50" />
    </div>
  );
}