import React, { useState, useEffect } from 'react';
import { formatDate, getFormattedDurationUntil } from '../utils/dateUtils';
import { ClockIcon, TrashIcon } from '@heroicons/react/24/outline';

export type ThemeColor = 'teal' | 'orange' | 'purple' | 'blue' | 'rose' | 'indigo' | 'lime';

interface BirthdayCardProps {
  title: string;
  date: Date;
  showCountdown?: boolean;
  age?: number;
  theme: ThemeColor;
  progress?: number; // 0 to 100
  onRemove?: () => void;
}

const themeStyles: Record<ThemeColor, { 
  border: string; 
  iconBg: string; 
  iconColor: string; 
  label: string; 
  progressFill: string;
  gradient: string;
  highlightBadge: string;
}> = {
  teal: {
    border: 'border-teal-200',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    label: 'text-teal-600',
    progressFill: 'bg-teal-200/60',
    gradient: 'from-teal-400 via-emerald-400 to-cyan-400',
    highlightBadge: 'bg-teal-50 text-teal-700 border-teal-200'
  },
  orange: {
    border: 'border-orange-200',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    label: 'text-orange-600',
    progressFill: 'bg-orange-200/60',
    gradient: 'from-orange-400 via-amber-400 to-yellow-400',
    highlightBadge: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  purple: {
    border: 'border-purple-200',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    label: 'text-purple-600',
    progressFill: 'bg-purple-200/60',
    gradient: 'from-purple-400 via-fuchsia-400 to-pink-400',
    highlightBadge: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  blue: {
    border: 'border-blue-200',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    label: 'text-blue-600',
    progressFill: 'bg-blue-200/60',
    gradient: 'from-blue-400 via-indigo-400 to-violet-400',
    highlightBadge: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  rose: {
    border: 'border-rose-200',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    label: 'text-rose-600',
    progressFill: 'bg-rose-200/60',
    gradient: 'from-rose-400 via-pink-400 to-red-400',
    highlightBadge: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  indigo: {
    border: 'border-indigo-200',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    label: 'text-indigo-600',
    progressFill: 'bg-indigo-200/60',
    gradient: 'from-indigo-400 via-violet-400 to-purple-400',
    highlightBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  lime: {
    border: 'border-lime-200',
    iconBg: 'bg-lime-50',
    iconColor: 'text-lime-700',
    label: 'text-lime-700',
    progressFill: 'bg-lime-200/60',
    gradient: 'from-lime-400 via-lime-500 to-green-500',
    highlightBadge: 'bg-lime-50 text-lime-800 border-lime-200'
  }
};

const BirthdayCard: React.FC<BirthdayCardProps> = ({ 
  title, 
  date, 
  showCountdown, 
  age, 
  theme, 
  progress = 0, 
  onRemove
}) => {
  const [timeLeft, setTimeLeft] = useState(showCountdown ? getFormattedDurationUntil(date) : '');
  const styles = themeStyles[theme];

  useEffect(() => {
    if (showCountdown) {
      // Initial update
      setTimeLeft(getFormattedDurationUntil(date));
      
      const timer = setInterval(() => {
        setTimeLeft(getFormattedDurationUntil(date));
      }, 60000); 
      return () => clearInterval(timer);
    }
  }, [date, showCountdown]);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${styles.border} relative overflow-hidden transition-all hover:shadow-md group`}>
      
      {/* Top Gradient Bar */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${styles.gradient}`}></div>

      {/* Progress Background Fill */}
      <div 
        className={`absolute bottom-0 left-0 h-full transition-all duration-1000 ease-out ${styles.progressFill}`} 
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>

      {/* Optional Remove Button */}
      {onRemove && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 z-20 p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
          title="Remove Milestone"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      )}

      {/* Reduced Padding: p-4 md:p-6 (was p-6 md:p-8) */}
      <div className="relative p-4 md:p-6 flex justify-between items-start md:items-center flex-col md:flex-row gap-3 z-10">
        <div>
          <div className="flex items-center flex-wrap gap-2 mb-0.5">
            <h3 className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${styles.label}`}>{title}</h3>
            {age !== undefined && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border tracking-wide ${styles.highlightBadge}`}>
                AGE {age}
              </span>
            )}
          </div>
          {/* Reduced font size: text-xl md:text-2xl (was 2xl/3xl) */}
          <div className="text-xl md:text-2xl font-bold text-slate-900">
            {formatDate(date)}
          </div>
        </div>

        {showCountdown && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-sm bg-white/60 ${styles.border} self-start md:self-center w-full md:w-auto`}>
             <ClockIcon className={`w-4 h-4 shrink-0 ${styles.iconColor}`} />
             <div className="flex flex-col">
                <span className={`text-[9px] font-semibold uppercase tracking-wide leading-none mb-0.5 ${styles.label}`}>Remaining</span>
                <span className={`text-base font-mono font-bold leading-none whitespace-nowrap text-slate-700`}>
                  {timeLeft}
                </span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayCard;