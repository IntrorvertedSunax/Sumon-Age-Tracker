
import React, { useState, useEffect } from 'react';
import AgeTimer from './components/AgeTimer';
import BirthdayCard from './components/BirthdayCard';
import { getLastBirthday, getNextBirthday, getMilestoneBirthday, formatDate, calculatePreciseAge } from './utils/dateUtils';
import { generateAgeInsight } from './services/geminiService';
import { CalendarIcon, PlusIcon, XMarkIcon, UserIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface UserData {
  name: string;
  birthDate: Date;
}

const DEFAULT_USER_DATA: UserData = {
  name: "Sumon Hossain",
  birthDate: new Date('1998-10-25T05:30:00')
};

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(() => {
    try {
      const saved = localStorage.getItem('life-tracker-user-data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { name: parsed.name, birthDate: new Date(parsed.birthDate) };
      }
      return DEFAULT_USER_DATA;
    } catch (e) { return DEFAULT_USER_DATA; }
  });

  const [formName, setFormName] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('00:00');
  const [now, setNow] = useState(new Date());
  const [insight, setInsight] = useState<string | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  const [milestones, setMilestones] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('life-tracker-milestones');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestoneInput, setNewMilestoneInput] = useState('');

  useEffect(() => {
    if (milestones.length > 0) {
      localStorage.setItem('life-tracker-milestones', JSON.stringify(milestones));
    }
  }, [milestones]);

  useEffect(() => {
    if (userData) {
      const fetchInsight = async () => {
        setIsInsightLoading(true);
        const age = calculatePreciseAge(userData.birthDate);
        const text = await generateAgeInsight(age.years, age.months);
        setInsight(text);
        setIsInsightLoading(false);
      };
      const timer = setTimeout(fetchInsight, 1000);
      return () => clearTimeout(timer);
    }
  }, [userData?.birthDate]);

  useEffect(() => {
    if (userData && milestones.length === 0) {
      const nextBday = getNextBirthday(userData.birthDate);
      const nextAge = nextBday.getFullYear() - userData.birthDate.getFullYear();
      let first = nextAge;
      while (first % 5 !== 0) first++;
      setMilestones([first, first + 10].sort((a, b) => a - b));
    }
  }, [userData, milestones.length]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDate) return;
    const combinedDateString = `${formDate}T${formTime}:00`;
    const newBirthDate = new Date(combinedDateString);
    if (isNaN(newBirthDate.getTime())) return;
    const newData = { name: formName, birthDate: newBirthDate };
    localStorage.removeItem('life-tracker-milestones');
    setMilestones([]);
    setUserData(newData);
    localStorage.setItem('life-tracker-user-data', JSON.stringify(newData));
  };

  const handleReset = () => {
    if (confirm("Reset profile?")) {
      localStorage.clear();
      setUserData(null);
      setMilestones([]);
      setInsight(null);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#fcfcfd]">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-3xl bg-teal-50 flex items-center justify-center text-teal-600 mb-6 shadow-sm ring-1 ring-teal-100">
              <CalendarIcon className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Chronos</h1>
          </div>
          <form onSubmit={handleOnboardingSubmit} className="space-y-6">
            <input type="text" required placeholder="Full Name" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-800 font-semibold focus:ring-2 focus:ring-teal-500/10 outline-none transition-all placeholder:text-slate-300" />
            <input type="date" required value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-800 font-semibold focus:ring-2 focus:ring-teal-500/10 outline-none transition-all" />
            <input type="time" required value={formTime} onChange={(e) => setFormTime(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-800 font-semibold focus:ring-2 focus:ring-teal-500/10 outline-none transition-all" />
            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-black transition-all uppercase tracking-[0.2em] text-[10px]">Initialize</button>
          </form>
        </div>
      </div>
    );
  }

  const birthDate = userData.birthDate;
  const nextBirthday = getNextBirthday(birthDate);
  const lastBirthday = getLastBirthday(birthDate);
  const nextBirthdayProgress = ((now.getTime() - lastBirthday.getTime()) / (nextBirthday.getTime() - lastBirthday.getTime())) * 100;

  return (
    <div className="min-h-screen text-slate-900 p-4 lg:p-6 font-sans selection:bg-teal-100 max-w-[1400px] mx-auto overflow-x-hidden">
      <header className="flex flex-col md:flex-row items-center justify-between mb-6 lg:mb-8 gap-4">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={handleReset}>
          <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-teal-500">
            <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{userData.name}</h1>
            <p className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full mt-1 inline-block">{formatDate(userData.birthDate)}</p>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-xl px-6 py-2 rounded-2xl shadow-sm border border-white">
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5 block">Universal Time</span>
           <span className="text-lg font-black text-slate-900 font-mono tracking-tighter leading-none tabular-nums">{now.toLocaleTimeString()}</span>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-sm border border-slate-50">
            <AgeTimer birthDate={birthDate} theme="teal" />
          </section>

          <section className="bg-indigo-50/50 rounded-[1.5rem] p-5 border border-indigo-100/50 flex items-start gap-3">
            <div className="p-2 bg-indigo-500 rounded-xl text-white shrink-0">
              <SparklesIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-0.5">AI Perspective</h4>
              <p className="text-xs md:text-sm text-slate-600 font-medium leading-tight">
                {isInsightLoading ? "Syncing..." : insight || "Gathering insights..."}
              </p>
            </div>
          </section>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <section>
            <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-3 px-2">Next Milestone</h2>
            <BirthdayCard 
              title="Target Birthday" 
              date={nextBirthday} 
              showCountdown 
              age={nextBirthday.getFullYear() - birthDate.getFullYear()} 
              theme="teal" 
              progress={nextBirthdayProgress}
            />
          </section>

          <section>
            <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-3 px-2">Projections</h2>
            <div className="grid grid-cols-1 gap-3">
              {milestones.map((age) => {
                const milestoneDate = getMilestoneBirthday(birthDate, age);
                const totalSpan = milestoneDate.getTime() - birthDate.getTime();
                const elapsed = now.getTime() - birthDate.getTime();
                const milestoneProgress = Math.min(100, Math.max(0, (elapsed / totalSpan) * 100));

                return (
                  <BirthdayCard 
                    key={age} 
                    title={`Level ${age}`} 
                    date={milestoneDate} 
                    age={age} 
                    theme="indigo" 
                    showCountdown 
                    progress={milestoneProgress}
                    onRemove={() => setMilestones(m => m.filter(v => v !== age))} 
                  />
                );
              })}
              
              {!isAddingMilestone ? (
                <button onClick={() => setIsAddingMilestone(true)} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xs hover:bg-white hover:text-teal-500 hover:border-teal-200 transition-all">
                  <PlusIcon className="w-4 h-4" /> Add Milestone
                </button>
              ) : (
                <div className="bg-white rounded-xl border border-teal-100 p-2 flex gap-2 animate-in fade-in duration-200">
                  <input type="number" value={newMilestoneInput} onChange={e => setNewMilestoneInput(e.target.value)} autoFocus placeholder="Age" className="flex-grow bg-slate-50 rounded-lg px-3 font-bold text-sm outline-none" />
                  <button onClick={() => {
                    const age = parseInt(newMilestoneInput);
                    if (age && !milestones.includes(age)) setMilestones(prev => [...prev, age].sort((a, b) => a - b));
                    setIsAddingMilestone(false);
                  }} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-xs">Add</button>
                  <button onClick={() => setIsAddingMilestone(false)} className="bg-slate-100 text-slate-500 px-3 py-2 rounded-lg font-bold"><XMarkIcon className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
