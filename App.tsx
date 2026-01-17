
import React, { useState, useEffect } from 'react';
import AgeTimer from './components/AgeTimer';
import BirthdayCard from './components/BirthdayCard';
import { getLastBirthday, getNextBirthday, getMilestoneBirthday, formatDate } from './utils/dateUtils';
import { CalendarIcon, PlusIcon, XMarkIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';

interface UserData {
  name: string;
  birthDate: Date;
}

const DEFAULT_USER_DATA: UserData = {
  name: "Sumon Hossain",
  birthDate: new Date('1998-10-25T05:30:00')
};

const App: React.FC = () => {
  // State for User Data (Name & Birth Date)
  const [userData, setUserData] = useState<UserData | null>(() => {
    try {
      const saved = localStorage.getItem('life-tracker-user-data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name,
          birthDate: new Date(parsed.birthDate)
        };
      }
      return DEFAULT_USER_DATA;
    } catch (e) {
      return DEFAULT_USER_DATA;
    }
  });

  // Form State for Initial Setup
  const [formName, setFormName] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('00:00');

  const [now, setNow] = useState(new Date());

  // Dynamic Milestones State
  const [milestones, setMilestones] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('life-tracker-milestones');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("Failed to parse milestones from local storage", e);
      return [];
    }
  });

  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestoneInput, setNewMilestoneInput] = useState('');

  // Persist milestones
  useEffect(() => {
    if (milestones.length > 0) {
      localStorage.setItem('life-tracker-milestones', JSON.stringify(milestones));
    }
  }, [milestones]);

  // Handle default milestone generation based on User Data
  useEffect(() => {
    if (userData && milestones.length === 0) {
      const nextBday = getNextBirthday(userData.birthDate);
      const nextAge = nextBday.getFullYear() - userData.birthDate.getFullYear();
      
      let firstMilestone = nextAge;
      while (firstMilestone % 5 !== 0) {
        firstMilestone++;
      }
      
      const initialMilestones = [firstMilestone, firstMilestone + 10];
      
      if (nextAge <= 50 && !initialMilestones.includes(50)) {
        initialMilestones.push(50);
      }
      
      setMilestones(initialMilestones.sort((a, b) => a - b));
    }
  }, [userData, milestones.length]);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDate) return;

    const combinedDateString = `${formDate}T${formTime}:00`;
    const newBirthDate = new Date(combinedDateString);

    if (isNaN(newBirthDate.getTime())) {
      alert("Please enter a valid date and time.");
      return;
    }

    const newData = { name: formName, birthDate: newBirthDate };
    
    localStorage.removeItem('life-tracker-milestones');
    setMilestones([]);

    setUserData(newData);
    localStorage.setItem('life-tracker-user-data', JSON.stringify(newData));
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data and profile?")) {
      localStorage.removeItem('life-tracker-user-data');
      localStorage.removeItem('life-tracker-milestones');
      setUserData(null);
      setMilestones([]);
      setFormName('');
      setFormDate('');
      setFormTime('00:00');
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans selection:bg-teal-200">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 animate-in fade-in zoom-in duration-300">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white mb-4">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Create Profile</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Enter your details to track your age</p>
          </div>

          <form onSubmit={handleOnboardingSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Your Name</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                <input 
                  type="text" 
                  required
                  placeholder="Sumon Hossain"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:font-normal"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Birth Date</label>
              <div className="relative group">
                <CalendarIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                <input 
                  type="date" 
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Birth Time</label>
              <div className="relative group">
                <ClockIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                <input 
                  type="time" 
                  required
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    );
  }

  const birthDate = userData.birthDate;
  const lastBirthday = getLastBirthday(birthDate);
  const nextBirthday = getNextBirthday(birthDate);
  
  const lastBirthdayAge = lastBirthday.getFullYear() - birthDate.getFullYear();
  const nextBirthdayAge = nextBirthday.getFullYear() - birthDate.getFullYear();

  const totalYearDuration = nextBirthday.getTime() - lastBirthday.getTime();
  const timeElapsedInYear = now.getTime() - lastBirthday.getTime();
  const nextBirthdayProgress = (timeElapsedInYear / totalYearDuration) * 100;

  const addMilestone = () => {
    const age = parseInt(newMilestoneInput);
    if (age && !isNaN(age) && age > 0 && !milestones.includes(age)) {
      setMilestones(prev => [...prev, age].sort((a, b) => a - b));
      setNewMilestoneInput('');
      setIsAddingMilestone(false);
    }
  };

  const removeMilestone = (ageToRemove: number) => {
    setMilestones(prev => prev.filter(m => m !== ageToRemove));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans selection:bg-teal-200">
      
      <header className="sticky top-2 z-50 max-w-fit mx-auto mb-10">
        <div className="absolute -inset-2 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 rounded-full blur-md opacity-25"></div>
        <div className="relative bg-white flex items-center gap-4 px-6 py-3 pr-10 rounded-full shadow-xl shadow-slate-200/60 ring-1 ring-slate-100/80">
           <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white shrink-0 relative overflow-hidden">
             <CalendarIcon className="w-7 h-7" />
           </div>
           <div className="flex flex-col gap-0.5" onClick={handleReset} style={{cursor: 'pointer'}}>
              <h1 className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{userData.name}</h1>
              <div className="flex items-center gap-2">
                 <span className="bg-gradient-to-r from-teal-400 to-emerald-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full tracking-widest shadow-lg shadow-teal-500/20 uppercase">
                    {formatDate(userData.birthDate)}
                 </span>
              </div>
           </div>
        </div>
      </header>

      <main className="max-w-3xl lg:max-w-6xl mx-auto pb-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Age Timer */}
          <div className="lg:sticky lg:top-28 space-y-6">
            <section>
              <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 relative overflow-hidden transition-all hover:shadow-md">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400"></div>
                <AgeTimer birthDate={birthDate} theme="teal" />
              </div>
            </section>
          </div>

          {/* Right Column: History & Milestones */}
          <div className="space-y-6">
            
            {/* Last & Next Birthday Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-4 px-2 mb-3 opacity-50">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Birthday Timeline</span>
                 <div className="h-px bg-slate-300 flex-grow"></div>
              </div>
              
              <BirthdayCard 
                title="Last Birthday" 
                date={lastBirthday} 
                showCountdown={false} 
                age={lastBirthdayAge}
                theme="blue"
                progress={100}
              />

              <BirthdayCard 
                title="Next Birthday" 
                date={nextBirthday} 
                showCountdown={true} 
                age={nextBirthdayAge}
                theme="orange"
                progress={nextBirthdayProgress}
              />
            </section>

            {/* Other Milestones Section */}
            <section className="space-y-3">
               <div className="flex items-center gap-4 px-2 opacity-50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Future Milestones</span>
                  <div className="h-px bg-slate-300 flex-grow"></div>
               </div>
               
               {milestones.map((milestoneAge) => {
                 const date = getMilestoneBirthday(birthDate, milestoneAge);
                 const totalLife = date.getTime() - birthDate.getTime();
                 const elapsedLife = now.getTime() - birthDate.getTime();
                 const progress = Math.min(100, Math.max(0, (elapsedLife / totalLife) * 100));
                 
                 return (
                   <BirthdayCard 
                    key={milestoneAge}
                    title={`${milestoneAge}th Birthday`} 
                    date={date} 
                    showCountdown={true} 
                    age={milestoneAge}
                    theme="indigo"
                    progress={progress}
                    onRemove={() => removeMilestone(milestoneAge)}
                  />
                 );
               })}

               <div className="pt-1">
                  {!isAddingMilestone ? (
                    <button 
                        onClick={() => setIsAddingMilestone(true)}
                        className="w-full py-3 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 text-xs font-bold uppercase tracking-widest hover:border-teal-400 hover:text-teal-500 hover:bg-teal-50/50 transition-all flex items-center justify-center gap-2 group"
                    >
                        <PlusIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Add Milestone
                    </button>
                  ) : (
                    <div className="bg-white p-2 sm:p-3 rounded-2xl border border-teal-200 shadow-lg shadow-teal-500/10 flex gap-3 items-center animate-in fade-in zoom-in duration-200">
                        <input 
                            type="number" 
                            value={newMilestoneInput}
                            onChange={(e) => setNewMilestoneInput(e.target.value)}
                            placeholder="Target Age"
                            className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-700 font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && addMilestone()}
                        />
                        <button 
                            onClick={addMilestone}
                            className="bg-teal-500 text-white px-6 py-2 rounded-xl font-bold text-xs hover:bg-teal-600 transition-colors shadow-md shadow-teal-500/20"
                        >
                            Add
                        </button>
                        <button 
                            onClick={() => setIsAddingMilestone(false)}
                            className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                  )}
               </div>
            </section>
          </div>

        </div>

      </main>
    </div>
  );
};

export default App;
