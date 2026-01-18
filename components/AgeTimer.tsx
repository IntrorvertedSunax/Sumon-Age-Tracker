
import React, { useEffect, useState } from 'react';
import { AgeDetail, calculatePreciseAge, formatDate } from '../utils/dateUtils.ts';
import { ThemeColor } from './BirthdayCard.tsx';

interface AgeTimerProps {
  birthDate: Date;
  theme: ThemeColor;
}

const themeColors: Record<ThemeColor, string> = {
    teal: 'text-teal-500',
    orange: 'text-orange-500',
    purple: 'text-purple-500',
    blue: 'text-blue-500',
    rose: 'text-rose-500',
    indigo: 'text-indigo-500',
    lime: 'text-lime-600',
};

const strokeColors: Record<ThemeColor, string> = {
    teal: 'stroke-teal-500',
    orange: 'stroke-orange-500',
    purple: 'stroke-purple-500',
    blue: 'stroke-blue-500',
    rose: 'stroke-rose-500',
    indigo: 'stroke-indigo-500',
    lime: 'stroke-lime-500',
};

const bgColors: Record<ThemeColor, string> = {
    teal: 'bg-teal-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    rose: 'bg-rose-500',
    indigo: 'bg-indigo-500',
    lime: 'bg-lime-500',
};

const glowStyles: Record<ThemeColor, string> = {
    teal: 'shadow-[0_0_30px_-5px_rgba(20,184,166,0.4)]',
    orange: 'shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)]',
    purple: 'shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)]',
    blue: 'shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)]',
    rose: 'shadow-[0_0_30px_-5px_rgba(244,63,94,0.4)]',
    indigo: 'shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)]',
    lime: 'shadow-[0_0_30px_-5px_rgba(132,204,22,0.4)]',
};

const ResponsiveCircularUnit: React.FC<{ 
    value: number; 
    maxValue: number; 
    label: string; 
    theme: ThemeColor;
    textSize?: string;
    strokeWidth?: number;
}> = ({ value, maxValue, label, theme, textSize, strokeWidth = 8 }) => {
    const radius = 45;
    const circumference = radius * 2 * Math.PI;
    const progress = Math.min(value / maxValue, 1);
    const dashOffset = circumference - progress * circumference;
    const valueTextClass = textSize || "text-base lg:text-lg";

    return (
        <div className="relative w-full h-full flex items-center justify-center group">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-slate-100" />
                <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" className={`transition-all duration-1000 ease-linear ${strokeColors[theme]}`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`${valueTextClass} font-bold text-slate-700 font-mono tracking-tighter`}>
                    {value.toString().padStart(2, '0')}
                </span>
                <span className={`text-[0.5rem] lg:text-[0.6rem] uppercase font-bold tracking-widest ${themeColors[theme]} opacity-80 mt-0.5`}>
                    {label}
                </span>
            </div>
        </div>
    );
};

const AgeTimer: React.FC<AgeTimerProps> = ({ birthDate, theme }) => {
  const [age, setAge] = useState<AgeDetail>(calculatePreciseAge(birthDate));
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
      setAge(calculatePreciseAge(birthDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [birthDate]);

  const bgColorClass = bgColors[theme] || 'bg-teal-500';
  const glowClass = glowStyles[theme];

  return (
    <div className="w-full">
      <div className="flex flex-col justify-start items-start mb-2 pb-1 border-b border-slate-100 gap-0.5">
         <span className={`text-[10px] font-bold uppercase tracking-widest ${themeColors[theme]}`}>Present Date</span>
         <span className="text-base lg:text-lg font-bold text-slate-800">{formatDate(currentDate)}</span>
      </div>

      <div className="flex justify-start w-full mb-1">
         <span className={`text-[10px] font-bold uppercase tracking-widest ${themeColors[theme]}`}>Live Age</span>
      </div>

      <div className="flex flex-col gap-4 lg:gap-6 pb-2">
        <div className="flex flex-col items-center justify-center py-2">
             <div className={`w-24 h-24 lg:w-32 lg:h-32 rounded-full ${bgColorClass} flex items-center justify-center ${glowClass}`}>
                 <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl lg:text-5xl text-white font-black tracking-tighter leading-none mb-0.5">
                        {age.years}
                    </span>
                    <span className={`text-[0.6rem] font-bold uppercase tracking-widest text-white/90`}>
                        Years
                    </span>
                 </div>
             </div>
        </div>

        <div className="flex flex-col items-center gap-2 md:grid md:grid-cols-5 md:gap-3 w-full px-1">
            <div className="grid grid-cols-2 gap-2 w-[60%] mx-auto md:w-full md:contents">
                <div className="aspect-square"><ResponsiveCircularUnit value={age.months} maxValue={12} label="MOS" theme="blue" strokeWidth={10} /></div>
                <div className="aspect-square"><ResponsiveCircularUnit value={age.days} maxValue={daysInMonth} label="DAYS" theme="purple" strokeWidth={10} /></div>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full md:contents">
                <div className="aspect-square"><ResponsiveCircularUnit value={age.hours} maxValue={24} label="HRS" theme="rose" strokeWidth={10} /></div>
                <div className="aspect-square"><ResponsiveCircularUnit value={age.minutes} maxValue={60} label="MIN" theme="orange" strokeWidth={10} /></div>
                <div className="aspect-square"><ResponsiveCircularUnit value={age.seconds} maxValue={60} label="SEC" theme="lime" strokeWidth={10} /></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AgeTimer;
