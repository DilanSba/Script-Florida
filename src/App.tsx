/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Settings,
  Copy,
  MessageSquare,
  AlertCircle,
  User,
  Save,
  Trash2,
  X,
  FileText,
  Pencil,
  CheckCircle2,
  Circle,
  ChevronRight,
  TriangleAlert,
  Phone,
  ClipboardList,
  ShieldCheck,
  CalendarCheck,
  Moon,
  Sun,
  Languages,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './context/LanguageContext';
import {
  UI,
  getDefaultSpeeches,
  getRetentionChecklists,
  getRetentionWarnings,
  getRetentionRebates,
  getAperturaScripts,
  getBrandScript,
  DEFAULT_SPEECH_IDS,
} from './i18n/translations';
import type { Speech, SpeechStep, RetentionRebate } from './i18n/translations';

/* ──────────────────────────── App root ───────────────────────────────────── */

export default function App() {
  const { lang, setLang } = useLanguage();
  const t = UI[lang];

  const [activeMode, setActiveMode] = useState<'agent' | 'manager'>('agent');
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [speechToEdit, setSpeechToEdit] = useState<Speech | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('windmar_dark') === 'true');

  useEffect(() => {
    localStorage.setItem('windmar_dark', String(darkMode));
  }, [darkMode]);

  /* Load speeches: always use fresh defaults for built-in IDs, keep custom ones */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('windmar_speeches');
      if (saved) {
        const parsed: Speech[] = JSON.parse(saved);
        const custom = parsed.filter(s => !(DEFAULT_SPEECH_IDS as readonly string[]).includes(s.id));
        setSpeeches([...getDefaultSpeeches(lang), ...custom]);
      } else {
        const defaults = getDefaultSpeeches(lang);
        setSpeeches(defaults);
        localStorage.setItem('windmar_speeches', JSON.stringify(defaults));
      }
    } catch {
      setSpeeches(getDefaultSpeeches(lang));
    }
    setIsLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* When language changes, refresh default speeches while preserving custom ones */
  useEffect(() => {
    if (!isLoaded) return;
    setSpeeches(prev => {
      const custom = prev.filter(s => !(DEFAULT_SPEECH_IDS as readonly string[]).includes(s.id));
      return [...getDefaultSpeeches(lang), ...custom];
    });
  }, [lang, isLoaded]);

  const updateSpeeches = (newSpeeches: Speech[]) => {
    setSpeeches(newSpeeches);
    const custom = newSpeeches.filter(s => !(DEFAULT_SPEECH_IDS as readonly string[]).includes(s.id));
    localStorage.setItem('windmar_speeches', JSON.stringify(custom));
  };

  const handleQuickEdit = (speech: Speech) => {
    setSpeechToEdit(speech);
    setActiveMode('manager');
  };

  if (!isLoaded) {
    return (
      <div className={`min-h-screen bg-slate-50 flex items-center justify-center${darkMode ? ' dark' : ''}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-wh-blue/20 border-t-wh-blue rounded-full animate-spin"></div>
          <p className="text-wh-grey font-bold animate-pulse uppercase tracking-widest text-xs">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 pb-12${darkMode ? ' dark' : ''}`}>
      <nav className="bg-white dark:bg-slate-900 border-b border-wh-lightblue/30 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="https://i.postimg.cc/3NvQhzx3/Windmar-logo-FL.png"
            alt="Windmar Solar Florida"
            className="h-10 w-auto object-contain"
          />
          <p className="text-[10px] text-wh-grey font-bold tracking-wide uppercase tracking-[0.15em]">{t.headerSub}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <motion.button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            whileTap={{ scale: 0.9 }}
            className="relative flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-wh-grey dark:text-slate-300 hover:border-wh-blue/40 dark:hover:border-wh-blue/40 hover:text-wh-blue dark:hover:text-wh-blue transition-all text-xs font-bold tracking-widest"
            title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          >
            <Languages size={14} />
            <span>{lang === 'es' ? 'EN' : 'ES'}</span>
          </motion.button>

          {/* Dark mode toggle */}
          <motion.button
            onClick={() => setDarkMode(d => !d)}
            whileTap={{ scale: 0.9 }}
            className="relative w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-wh-grey dark:text-slate-300 hover:border-wh-blue/40 dark:hover:border-wh-blue/40 hover:text-wh-blue dark:hover:text-wh-blue transition-all"
            title={darkMode ? t.darkModeOn : t.darkModeOff}
          >
            <AnimatePresence mode="wait" initial={false}>
              {darkMode ? (
                <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex">
                  <Sun size={17} />
                </motion.span>
              ) : (
                <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex">
                  <Moon size={17} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mode switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveMode('agent')}
              className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeMode === 'agent'
                  ? 'bg-white dark:bg-slate-700 text-wh-blue shadow-md'
                  : 'text-wh-grey hover:text-wh-black dark:hover:text-slate-200'
              }`}
            >
              {t.modeAgent}
            </button>
            <button
              onClick={() => setActiveMode('manager')}
              className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeMode === 'manager'
                  ? 'bg-white dark:bg-slate-700 text-wh-blue shadow-md'
                  : 'text-wh-grey hover:text-wh-black dark:hover:text-slate-200'
              }`}
            >
              {t.modeManager}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          {activeMode === 'agent' ? (
            <motion.div key="agent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AgentView speeches={speeches} onEditRequested={handleQuickEdit} />
            </motion.div>
          ) : (
            <motion.div key="manager" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ManagerView
                speeches={speeches}
                onUpdate={updateSpeeches}
                initialEditSpeech={speechToEdit}
                onEditHandled={() => setSpeechToEdit(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ──────────────────────────── Agent view ─────────────────────────────────── */

function AgentView({ speeches, onEditRequested }: { speeches: Speech[]; onEditRequested?: (s: Speech) => void }) {
  const { lang } = useLanguage();
  const t = UI[lang];

  const [selectedSpeechId, setSelectedSpeechId] = useState(speeches[0]?.id || '');
  const [variables, setVariables] = useState<Record<string, string>>({
    'nombre del titular': '', homeowner: '', 'nombre del asesor': '', advisor: '',
    ciudad: '', city: '', direccion: '', address: '', dia: '', day: '', horario: '', time: '',
  });
  const [showObjections, setShowObjections] = useState(false);

  useEffect(() => {
    if (!selectedSpeechId && speeches.length > 0) setSelectedSpeechId(speeches[0].id);
  }, [speeches, selectedSpeechId]);

  const selectedSpeech = speeches.find(s => s.id === selectedSpeechId);
  const isRetention = selectedSpeech?.type === 'retention';

  const replaceVariables = (text: string) => {
    let t2 = text;
    const map: Record<string, string> = {
      'nombre del titular': variables['nombre del titular'] || variables['homeowner'],
      homeowner: variables['homeowner'] || variables['nombre del titular'],
      'nombre del asesor': variables['nombre del asesor'] || variables['advisor'],
      advisor: variables['advisor'] || variables['nombre del asesor'],
      ciudad: variables['ciudad'] || variables['city'],
      city: variables['city'] || variables['ciudad'],
      direccion: variables['direccion'] || variables['address'],
      address: variables['address'] || variables['direccion'],
      dia: variables['dia'] || variables['day'],
      day: variables['day'] || variables['dia'],
      horario: variables['horario'] || variables['time'],
      time: variables['time'] || variables['horario'],
    };
    Object.entries(map).forEach(([key, value]) => {
      const replacement = value || `[${key}]`;
      t2 = t2.replace(new RegExp(`\\[${key}\\]`, 'gi'), replacement);
    });
    return t2;
  };

  /* Holder / advisor / city variable keys per lang */
  const holderKey = lang === 'es' ? 'nombre del titular' : 'homeowner';
  const advisorKey = lang === 'es' ? 'nombre del asesor' : 'advisor';
  const cityKey    = lang === 'es' ? 'ciudad' : 'city';

  if (!selectedSpeech) return <div>{t.noneAvailable}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left column */}
      <div className={`${isRetention ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-6`}>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-wh-black mb-2 flex items-center gap-2 uppercase tracking-wider">
              <FileText size={16} className="text-wh-blue" /> {t.selectStrategy}
            </label>
            <select
              value={selectedSpeechId}
              onChange={e => { setSelectedSpeechId(e.target.value); setShowObjections(false); }}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none text-wh-black font-semibold"
            >
              {speeches.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {!isRetention && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-wh-black flex items-center gap-2 uppercase tracking-wider">
                <User size={16} className="text-wh-blue" /> {t.callData}
              </h3>
              <div className="grid gap-3">
                <div>
                  <label className="text-[10px] font-bold text-wh-grey uppercase ml-1">{t.holderName}</label>
                  <input type="text" placeholder={t.holderPlaceholder} value={variables[holderKey]}
                    onChange={e => setVariables({ ...variables, [holderKey]: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-wh-grey uppercase ml-1">{t.yourName}</label>
                    <input type="text" placeholder={t.yourNamePlaceholder} value={variables[advisorKey]}
                      onChange={e => setVariables({ ...variables, [advisorKey]: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-wh-grey uppercase ml-1">{t.city}</label>
                    <input type="text" placeholder={t.cityPlaceholder} value={variables[cityKey]}
                      onChange={e => setVariables({ ...variables, [cityKey]: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {isRetention && (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider mb-1">{t.activeCampaign}</p>
                <p className="text-sm font-bold text-emerald-800">{t.closedLostCampaign}</p>
                <p className="text-xs text-emerald-700 mt-2 leading-relaxed">{t.retentionDesc}</p>
              </div>
              <div className="flex items-center gap-2 p-3 bg-wh-blue/5 rounded-xl border border-wh-blue/15">
                <ClipboardList size={15} className="text-wh-blue shrink-0" />
                <p className="text-xs text-wh-blue font-semibold">{t.preCallReminder}</p>
              </div>
            </div>
          )}

          {!isRetention && (
            <button
              onClick={() => setShowObjections(!showObjections)}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl ${
                showObjections ? 'bg-wh-orange/10 text-wh-orange border border-wh-orange/30' : 'bg-wh-blue text-white'
              }`}
            >
              <MessageSquare size={18} /> {t.objections}
            </button>
          )}
        </div>

        <AnimatePresence>
          {!isRetention && showObjections && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="bg-wh-orange/5 rounded-2xl border border-wh-orange/20 p-5 space-y-4 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-wh-orange uppercase tracking-wide">{t.commonObjections}</h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const text = selectedSpeech.objections.map(o => `${t.ifClientSays} "${o.trigger}"\n${o.response}`).join('\n\n');
                      navigator.clipboard.writeText(text).catch(() => {});
                    }}
                    className="flex items-center gap-1.5 px-2 py-1 bg-wh-orange/10 text-wh-orange text-[10px] font-bold rounded-md hover:bg-wh-orange/20 transition-all border border-wh-orange/20"
                  >
                    <Copy size={12} /> {t.copyAll}
                  </button>
                  <div className="bg-wh-orange/20 text-wh-orange p-1 rounded-md"><AlertCircle size={14} /></div>
                </div>
              </div>
              <div className="space-y-3">
                {selectedSpeech.objections.map(obj => (
                  <div key={obj.id} className="group">
                    <p className="text-[10px] font-bold text-wh-black opacity-50 uppercase mb-1">{t.ifClientSays} "{obj.trigger}"</p>
                    <div className="p-3 bg-white border border-wh-orange/10 rounded-lg text-sm text-wh-black italic relative">
                      {obj.response}
                      <button
                        onClick={() => navigator.clipboard.writeText(obj.response).catch(() => {})}
                        className="absolute top-2 right-2 p-1 text-slate-300 hover:text-wh-blue opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right column */}
      <div className={`${isRetention ? 'lg:col-span-9' : 'lg:col-span-8'} space-y-6`}>
        {isRetention ? (
          <RetentionSpeechView />
        ) : (
          selectedSpeech.steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
              className="group relative"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-wh-blue/10 text-wh-blue flex items-center justify-center font-bold text-sm">{idx + 1}</div>
                    <div>
                      <h3 className="font-bold text-wh-darkblue">{step.title}</h3>
                      <p className="text-xs text-wh-grey font-medium uppercase tracking-wider">{step.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {onEditRequested && (
                      <button onClick={() => onEditRequested(selectedSpeech)}
                        className="p-2 text-wh-grey hover:text-wh-blue hover:bg-wh-blue/5 rounded-lg transition-all flex items-center gap-2 text-xs font-semibold">
                        <Pencil size={14} /> {t.editBtn}
                      </button>
                    )}
                    <button onClick={() => navigator.clipboard.writeText(replaceVariables(step.content)).catch(() => {})}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-all flex items-center gap-2 text-xs font-semibold">
                      <Copy size={14} /> {t.copyBtn}
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-lg text-wh-black leading-relaxed whitespace-pre-wrap font-medium">
                    {replaceVariables(step.content).split('\n').map((line, i) => (
                      <p key={i} className={line.startsWith('(') ? 'text-wh-grey italic text-base mt-2' : 'mb-4'}>{line}</p>
                    ))}
                  </div>
                </div>
                {step.caution && (
                  <div className="px-8 py-3 bg-wh-orange/5 border-t border-wh-orange/10 flex items-center gap-3">
                    <AlertCircle size={18} className="text-wh-orange" />
                    <p className="text-xs text-wh-orange font-bold uppercase tracking-wider">{step.caution}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

/* ──────────────────── Retention Speech View ─────────────────────────────── */

type RetentionTab = 'preCall' | 'apertura' | 'objeciones' | 'cierre';

function RetentionSpeechView() {
  const { lang } = useLanguage();
  const t = UI[lang];
  const [activeTab, setActiveTab] = useState<RetentionTab>('preCall');
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [activeRebate, setActiveRebate] = useState('economico');

  const toggleCheck = (id: string) =>
    setChecked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const checklists = getRetentionChecklists(lang);
  const totalItems = checklists.reduce((s, g) => s + g.items.length, 0);
  const progress = Math.round((checked.size / totalItems) * 100);

  const RETENTION_TABS: { id: RetentionTab; label: string; Icon: React.ElementType }[] = [
    { id: 'preCall',     label: t.tabLabels.preCall,    Icon: ClipboardList },
    { id: 'apertura',   label: t.tabLabels.apertura,   Icon: Phone         },
    { id: 'objeciones', label: t.tabLabels.objeciones, Icon: ShieldCheck   },
    { id: 'cierre',     label: t.tabLabels.cierre,     Icon: CalendarCheck },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-wh-darkblue rounded-2xl p-5 text-white flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-1">{t.retentionV4}</p>
          <h2 className="text-lg font-bold">{t.retentionTitle}</h2>
          <p className="text-xs text-white/70 mt-1">{t.retentionSubtitle}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-bold text-white/60 uppercase mb-1">{t.preCallProgress}</p>
          <p className="text-2xl font-black">{progress}%</p>
          <div className="w-24 h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {RETENTION_TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              activeTab === id
                ? 'bg-wh-blue text-white border-wh-blue shadow-md shadow-wh-blue/20'
                : 'bg-white text-wh-grey border-slate-200 hover:border-wh-blue/40 hover:text-wh-darkblue'
            }`}
          >
            <Icon size={15} />
            {label}
            {id === 'preCall' && checked.size > 0 && (
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === id ? 'bg-white/20 text-white' : 'bg-wh-blue/10 text-wh-blue'
              }`}>
                {checked.size}/{totalItems}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
          {activeTab === 'preCall'     && <RetentionPreCallTab    checked={checked} onToggle={toggleCheck} totalItems={totalItems} />}
          {activeTab === 'apertura'   && <RetentionAperturaTab   />}
          {activeTab === 'objeciones' && <RetentionObjecionesTab activeRebate={activeRebate} onSelect={setActiveRebate} />}
          {activeTab === 'cierre'     && <RetentionCierreTab     />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Pre-llamada ─────────────────────────────────────────────────────────── */

function RetentionPreCallTab({ checked, onToggle, totalItems }: { checked: Set<string>; onToggle: (id: string) => void; totalItems: number }) {
  const { lang } = useLanguage();
  const t = UI[lang];
  const checklists = getRetentionChecklists(lang);
  const warnings   = getRetentionWarnings(lang);

  return (
    <div className="space-y-4">
      {checklists.map(group => (
        <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-[10px] font-black text-wh-blue uppercase tracking-widest mb-4 border-l-4 border-wh-blue pl-3">{group.title}</p>
          <div className="space-y-2">
            {group.items.map(item => (
              <button
                key={item.id}
                onClick={() => onToggle(item.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                  checked.has(item.id) ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-transparent hover:border-slate-200'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {checked.has(item.id)
                    ? <CheckCircle2 size={18} className="text-emerald-600" />
                    : <Circle size={18} className="text-slate-300" />}
                </div>
                <span className={`text-sm leading-relaxed ${checked.has(item.id) ? 'text-emerald-800 font-medium line-through decoration-emerald-400' : 'text-wh-black'}`}>
                  {item.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-5">
        <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-4 border-l-4 border-amber-500 pl-3">
          {t.alertsTitle}
        </p>
        <div className="space-y-3">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <TriangleAlert size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-800">{w}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Apertura ────────────────────────────────────────────────────────────── */

function RetentionAperturaTab() {
  const { lang } = useLanguage();
  const t = UI[lang];
  const scripts = getAperturaScripts(lang);
  const copy = (text: string) => navigator.clipboard.writeText(text).catch(() => {});

  return (
    <div className="space-y-5">
      {/* Info estratégica */}
      <div className="flex items-start gap-3 p-4 bg-wh-blue/5 rounded-2xl border border-wh-blue/20">
        <AlertCircle size={16} className="text-wh-blue mt-0.5 shrink-0" />
        <p className="text-sm text-wh-blue leading-relaxed">
          <strong>{lang === 'es' ? 'Principio de la apertura:' : 'Opening principle:'}</strong> {t.aperturaInfo.replace(/^[^:]+:\s*/, '')}
        </p>
      </div>

      {/* Fase 1 */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 overflow-hidden">
        <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg">{lang === 'es' ? 'Fase 1' : 'Phase 1'}</span>
            <div>
              <h3 className="font-bold text-emerald-900">{t.phase1Title}</h3>
              <p className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">{t.phase1Sub}</p>
            </div>
          </div>
          <button onClick={() => copy(scripts.parte1)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all">
            <Copy size={12} /> {t.copyBtn}
          </button>
        </div>
        <div className="p-6">
          <div className="border-l-4 border-emerald-400 bg-emerald-50/40 rounded-r-2xl px-5 py-4">
            <p className="text-sm leading-loose text-emerald-900 italic whitespace-pre-line font-medium">{scripts.parte1}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {scripts.toneChips.map(p => (
              <span key={p} className="text-[11px] px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-wh-grey font-medium">{p}</span>
            ))}
          </div>
          <div className="mt-5 border-t border-slate-100 pt-5 space-y-3">
            <p className="text-[10px] font-black text-wh-blue uppercase tracking-widest">{t.whyItWorks}</p>
            {[t.phase1Why1, t.phase1Why2, t.phase1Why3].map((text, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[11px] font-bold text-wh-grey shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-sm text-wh-black leading-relaxed">{text}</p>
              </div>
            ))}
            <p className="text-xs text-wh-grey italic mt-2">
              {t.phase1OtherPerson} <em className="font-medium">{t.phase1OtherScript}</em>
            </p>
          </div>
        </div>
      </div>

      {/* Pausa */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <ChevronRight size={24} className="rotate-90 text-slate-300" />
          <div className="flex items-center gap-3 px-6 py-3 bg-wh-darkblue rounded-2xl border border-wh-darkblue/80 shadow-md">
            <span className="text-lg">⏸</span>
            <div>
              <p className="text-white font-black text-sm tracking-wide">{t.waitLabel}</p>
              <p className="text-white/70 text-[10px] font-medium">{t.waitSub}</p>
            </div>
          </div>
          <ChevronRight size={24} className="rotate-90 text-slate-300" />
        </div>
      </div>

      {/* Fase 2 */}
      <div className="bg-white rounded-2xl shadow-sm border border-wh-blue/30 overflow-hidden">
        <div className="p-4 bg-wh-blue/5 border-b border-wh-blue/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-wh-blue text-white text-[11px] font-bold rounded-lg">{lang === 'es' ? 'Fase 2' : 'Phase 2'}</span>
            <div>
              <h3 className="font-bold text-wh-darkblue">{t.phase2Title}</h3>
              <p className="text-[10px] text-wh-grey font-semibold uppercase tracking-wider">{t.phase2Sub}</p>
            </div>
          </div>
          <button onClick={() => copy(scripts.parte2)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-wh-blue text-white text-xs font-bold rounded-lg hover:bg-wh-darkblue transition-all">
            <Copy size={12} /> {t.copyBtn}
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="border-l-4 border-wh-blue bg-slate-50 rounded-r-2xl px-5 py-4">
            <p className="text-sm leading-loose text-wh-black italic font-medium">{scripts.parte2}</p>
          </div>
          <p className="text-xs text-wh-grey">{t.phase2Desc}</p>
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <p className="text-[10px] font-black text-wh-blue uppercase tracking-widest mb-3">{t.activeListening}</p>
            {scripts.listening.map((frase, i) => (
              <div key={i} className="flex items-start gap-3">
                <ChevronRight size={14} className="text-wh-blue mt-0.5 shrink-0" />
                <p className="text-sm text-wh-black italic">{frase}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ir a Rebates */}
      <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-bold text-wh-darkblue text-sm">{t.motiveIdentified}</p>
          <p className="text-xs text-wh-grey mt-1">{t.motiveDesc}</p>
        </div>
        <ChevronRight size={20} className="text-amber-500 shrink-0" />
      </div>
    </div>
  );
}

/* ── Rebates / Objeciones ────────────────────────────────────────────────── */

const BADGE_STYLES: Record<string, string> = {
  amber: 'bg-amber-50 text-amber-700 border border-amber-200',
  red:   'bg-red-50 text-red-700 border border-red-200',
  blue:  'bg-wh-blue/10 text-wh-blue border border-wh-blue/20',
};

function RetentionObjecionesTab({ activeRebate, onSelect }: { activeRebate: string; onSelect: (id: string) => void }) {
  const { lang } = useLanguage();
  const t = UI[lang];
  const rebates = getRetentionRebates(lang);
  const rebate = rebates.find(r => r.id === activeRebate) ?? rebates[0];
  const copy = (text: string) => navigator.clipboard.writeText(text).catch(() => {});

  return (
    <div className="space-y-5">
      <p className="text-xs text-wh-grey font-semibold">{t.selectReason}</p>

      <div className="flex flex-wrap gap-2">
        {rebates.map(r => (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              activeRebate === r.id
                ? 'bg-wh-blue text-white border-wh-blue shadow-md'
                : 'bg-white text-wh-grey border-slate-200 hover:border-wh-blue/40'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={rebate.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <span className={`px-3 py-1 rounded-lg text-[11px] font-bold ${BADGE_STYLES[rebate.badge]}`}>{rebate.title}</span>
            </div>
            <div className="p-6 space-y-4">
              {rebate.warning && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <TriangleAlert size={16} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-800">{rebate.warning}</p>
                </div>
              )}
              <div className="space-y-3">
                {rebate.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="w-6 h-6 rounded-full bg-wh-blue/10 border border-wh-blue/20 flex items-center justify-center text-[11px] font-bold text-wh-blue shrink-0 mt-0.5">{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-wh-grey uppercase tracking-wider mb-1">{step.title}</p>
                      <p className="text-sm text-wh-black leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-3">{t.suggestedClosing}</p>
                <div className="border-l-4 border-emerald-400 bg-emerald-50/40 rounded-r-2xl px-5 py-4 flex items-start justify-between gap-4">
                  <p className="text-sm leading-loose text-emerald-900 italic font-medium flex-1">{rebate.closing}</p>
                  <button onClick={() => copy(rebate.closing)} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all shrink-0" title={t.copyBtn}>
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Cierre ──────────────────────────────────────────────────────────────── */

function RetentionCierreTab() {
  const { lang } = useLanguage();
  const t = UI[lang];
  const brandScript = getBrandScript(lang);
  const copy = (text: string) => navigator.clipboard.writeText(text).catch(() => {});

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-4 bg-wh-blue/5 rounded-2xl border border-wh-blue/20">
        <AlertCircle size={16} className="text-wh-blue mt-0.5 shrink-0" />
        <p className="text-sm text-wh-blue font-semibold">
          <strong>{lang === 'es' ? 'Aquí va el posicionamiento de marca.' : 'This is where brand positioning goes.'}</strong> {t.cierreInfo.replace(/^[^.]+\.\s*/, '')}
        </p>
      </div>

      {/* Brand bridge */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg">{t.bridgeLabel}</span>
            <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-[10px] font-bold rounded">{t.bridgeRelocated}</span>
          </div>
          <button onClick={() => copy(brandScript)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-wh-blue text-white text-xs font-bold rounded-lg hover:bg-wh-darkblue transition-all">
            <Copy size={12} /> {t.copyBtn}
          </button>
        </div>
        <div className="p-6">
          <p className="text-xs text-wh-grey mb-4">{t.bridgeDesc}</p>
          <div className="border-l-4 border-violet-400 bg-violet-50/30 rounded-r-2xl px-5 py-4">
            <p className="text-sm leading-loose text-violet-900 italic font-medium whitespace-pre-line">{brandScript}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {t.bridgeTips.map(p => (
              <span key={p} className="text-[11px] px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-wh-grey font-medium">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Double alternative */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg">{lang === 'es' ? 'Cierre' : 'Close'}</span>
            <h3 className="font-bold text-wh-darkblue">{t.doubleAltTitle}</h3>
          </div>
          <button onClick={() => copy(t.doubleAltScript.replace(/<\/?b>/g, ''))}
            className="p-2 text-slate-400 hover:text-wh-blue rounded-lg transition-all"><Copy size={14} /></button>
        </div>
        <div className="p-6">
          <div className="border-l-4 border-wh-blue bg-slate-50 rounded-r-2xl px-5 py-4">
            <p className="text-sm leading-loose text-wh-black italic font-medium" dangerouslySetInnerHTML={{ __html: t.doubleAltScript }} />
          </div>
          <p className="text-xs text-wh-grey mt-3">{t.doubleAltNote}</p>
        </div>
      </div>

      {/* Think about it */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-amber-50 border-b border-amber-100">
          <span className="px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 text-[11px] font-bold rounded-lg">{t.thinkAboutLabel}</span>
        </div>
        <div className="p-6">
          <div className="border-l-4 border-amber-400 bg-amber-50/40 rounded-r-2xl px-5 py-4">
            <p className="text-sm leading-loose text-amber-900 italic font-medium">{t.thinkAboutScript}</p>
          </div>
          <p className="text-xs text-wh-grey mt-3">{t.thinkAboutNote}</p>
        </div>
      </div>

      {/* Accepted appointment */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 overflow-hidden">
        <div className="p-4 bg-emerald-50 border-b border-emerald-100">
          <span className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg">{t.appointAccepted}</span>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {t.appointSteps.map((s, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-sm text-wh-black leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
          <div className="border-l-4 border-emerald-400 bg-emerald-50/40 rounded-r-2xl px-5 py-4">
            <p className="text-sm leading-loose text-emerald-900 italic font-medium">{t.appointScript}</p>
          </div>
        </div>
      </div>

      {/* Hard rejection */}
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
        <div className="p-4 bg-red-50 border-b border-red-100">
          <span className="px-3 py-1 bg-red-600 text-white text-[11px] font-bold rounded-lg">{t.hardReject}</span>
        </div>
        <div className="p-6 space-y-3">
          {t.hardRejectSteps.map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">{i + 1}</span>
              <div>
                <p className="text-[10px] font-black text-wh-grey uppercase tracking-wider mb-0.5">{item.t}</p>
                <p className="text-sm text-wh-black italic">{item.c}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zoho note */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <p className="text-[10px] font-black text-wh-blue uppercase tracking-widest mb-4 border-l-4 border-wh-blue pl-3">
          {t.zohoNote}
        </p>
        <p className="text-xs text-wh-grey mb-4">{t.zohoDesc}</p>
        <div className="grid grid-cols-2 gap-3">
          {t.zohoFields.map(f => (
            <div key={f.l} className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-wh-grey font-semibold mb-1">{f.l}</p>
              <p className="text-sm font-bold text-wh-darkblue">{f.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── Manager view ───────────────────────────────── */

function ManagerView({ speeches, onUpdate, initialEditSpeech, onEditHandled }: {
  speeches: Speech[];
  onUpdate: (s: Speech[]) => void;
  initialEditSpeech?: Speech | null;
  onEditHandled?: () => void;
}) {
  const { lang } = useLanguage();
  const t = UI[lang];

  const [editingSpeech, setEditingSpeech] = useState<Speech | null>(initialEditSpeech || null);
  const [previewSpeech, setPreviewSpeech] = useState<Speech | null>(null);

  useEffect(() => {
    if (initialEditSpeech) setEditingSpeech(initialEditSpeech);
  }, [initialEditSpeech]);

  const handleClose = () => { setEditingSpeech(null); if (onEditHandled) onEditHandled(); };

  const handleDelete = (id: string) => {
    if ((DEFAULT_SPEECH_IDS as readonly string[]).includes(id)) return;
    if (confirm(t.deleteConfirm)) onUpdate(speeches.filter(s => s.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpeech) return;
    const index = speeches.findIndex(s => s.id === editingSpeech.id);
    if (index > -1) {
      const ns = [...speeches]; ns[index] = editingSpeech; onUpdate(ns);
    } else {
      onUpdate([...speeches, editingSpeech]);
    }
    handleClose();
  };

  const createNew = () => setEditingSpeech({
    id: Date.now().toString(),
    name: t.newSpeechName,
    campaign: t.newSpeechCampaign,
    steps: [{ id: '1', title: t.newSpeechStep, subtitle: t.newSpeechStepSub, content: t.newSpeechContent }],
    objections: [],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-wh-darkblue">{t.strategies}</h2>
        <button onClick={createNew} className="bg-wh-blue text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
          <Plus size={20} /> {t.createNew}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {speeches.map(s => {
          const isRetention = s.type === 'retention';
          const isDefault = (DEFAULT_SPEECH_IDS as readonly string[]).includes(s.id);
          return (
            <div key={s.id} className={`bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all space-y-4 ${isRetention ? 'border-emerald-200' : 'border-wh-lightblue/20'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-black uppercase text-white px-2 py-0.5 rounded ${isRetention ? 'bg-emerald-600' : 'bg-wh-blue'}`}>
                    {s.campaign}
                  </span>
                  <h3 className="text-lg font-bold text-wh-black mt-2">{s.name}</h3>
                  <p className="text-xs text-wh-grey font-bold uppercase tracking-widest">
                    {isRetention ? t.phases4 : `${s.steps.length} ${t.stepsLabel} · ${s.objections.length} ${t.objCount}`}
                  </p>
                </div>
                <div className="flex gap-1 items-start">
                  {!isRetention && !isDefault && (
                    <>
                      <button onClick={() => setEditingSpeech(s)} className="p-2 text-wh-teslagrey hover:text-wh-blue hover:bg-slate-100 rounded-lg transition-all">
                        <Settings size={18} />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="p-2 text-wh-teslagrey hover:text-red-500 hover:bg-slate-100 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                  {!isRetention && !isDefault && null}
                  {isRetention && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg">{t.interactiveGuide}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setPreviewSpeech(s)}
                className={`w-full py-2 text-sm font-bold rounded-xl transition-all border ${
                  isRetention
                    ? 'text-emerald-700 bg-white border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                    : 'text-wh-blue bg-white border-wh-blue/20 hover:bg-wh-blue hover:text-white'
                }`}
              >
                {t.viewStructure}
              </button>
            </div>
          );
        })}
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {previewSpeech && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-lg font-bold text-wh-darkblue">{previewSpeech.name}</h3>
                  <p className="text-[10px] font-bold text-wh-grey uppercase tracking-widest">{previewSpeech.campaign}</p>
                </div>
                <button onClick={() => setPreviewSpeech(null)} className="p-2 hover:bg-slate-200 rounded-full transition-all"><X size={20} /></button>
              </div>
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {previewSpeech.type === 'retention' ? (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">{t.interactive4phases}</h4>
                    {t.previewPhases.map((phase, i) => (
                      <div key={i} className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                        <span className="text-xl">{phase.icon}</span>
                        <div>
                          <p className="text-sm font-bold text-emerald-900">{phase.title}</p>
                          <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">{phase.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-wh-blue uppercase tracking-widest border-l-4 border-wh-blue pl-3">{t.guionSteps}</h4>
                      {previewSpeech.steps.map((step, i) => (
                        <div key={step.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-bold text-wh-blue uppercase mb-1">{lang === 'es' ? 'Paso' : 'Step'} {i + 1}: {step.title}</p>
                          <p className="text-sm text-wh-black font-medium leading-relaxed italic opacity-80 line-clamp-3">{step.content}</p>
                        </div>
                      ))}
                    </div>
                    {previewSpeech.objections.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-wh-orange uppercase tracking-widest border-l-4 border-wh-orange pl-3">{t.managedObj}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {previewSpeech.objections.map(obj => (
                            <div key={obj.id} className="p-3 bg-wh-orange/5 rounded-xl border border-wh-orange/10">
                              <p className="text-[10px] font-bold text-wh-orange uppercase mb-1 tracking-tighter">"{obj.trigger}"</p>
                              <p className="text-[11px] text-wh-black opacity-70 italic line-clamp-2">{obj.response}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                {previewSpeech.type !== 'retention' && !(DEFAULT_SPEECH_IDS as readonly string[]).includes(previewSpeech.id) ? (
                  <button onClick={() => { setEditingSpeech(previewSpeech); setPreviewSpeech(null); }}
                    className="px-8 py-2 bg-wh-blue text-white rounded-xl font-bold text-sm shadow-md flex items-center gap-2">
                    <Pencil size={14} /> {t.editStructure}
                  </button>
                ) : (
                  <button onClick={() => setPreviewSpeech(null)} className={`px-8 py-2 ${previewSpeech.type === 'retention' ? 'bg-emerald-600' : 'bg-wh-blue'} text-white rounded-xl font-bold text-sm shadow-md`}>
                    {t.close}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editingSpeech && editingSpeech.type !== 'retention' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 className="text-xl font-bold">{t.editStrategy} {editingSpeech.name}</h3>
                <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-all"><X size={24} /></button>
              </div>
              <form onSubmit={handleSave} className="overflow-y-auto p-8 space-y-8 flex-grow">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{t.speechName}</label>
                    <input type="text" value={editingSpeech.name} onChange={e => setEditingSpeech({ ...editingSpeech, name: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none" placeholder={t.speechNamePlaceholder} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{t.campaign}</label>
                    <input type="text" value={editingSpeech.campaign} onChange={e => setEditingSpeech({ ...editingSpeech, campaign: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none" placeholder={t.campaignPlaceholder} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-wh-blue">{t.speechSteps}</h4>
                    <button type="button"
                      onClick={() => setEditingSpeech({ ...editingSpeech, steps: [...editingSpeech.steps, { id: Date.now().toString(), title: `${lang === 'es' ? 'Paso' : 'Step'} ${editingSpeech.steps.length + 1}`, subtitle: '', content: '' }] })}
                      className="text-xs font-bold bg-wh-blue/10 text-wh-blue px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Plus size={14} /> {t.addStep}
                    </button>
                  </div>
                  <div className="space-y-6">
                    {editingSpeech.steps.map((step, idx) => (
                      <div key={step.id} className="relative p-6 border border-wh-lightblue/20 rounded-2xl bg-white shadow-sm group">
                        <button type="button"
                          onClick={() => setEditingSpeech({ ...editingSpeech, steps: editingSpeech.steps.filter(s => s.id !== step.id) })}
                          className="absolute -top-2 -right-2 p-1.5 bg-white border border-slate-200 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                          <Trash2 size={14} />
                        </button>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <input type="text" value={step.title}
                            onChange={e => { const ns = [...editingSpeech.steps]; ns[idx] = { ...ns[idx], title: e.target.value }; setEditingSpeech({ ...editingSpeech, steps: ns }); }}
                            className="p-2 border-b border-wh-lightblue/30 focus:border-wh-blue transition-all outline-none font-bold text-sm text-wh-darkblue" placeholder={t.stepTitlePlaceholder} />
                          <input type="text" value={step.subtitle}
                            onChange={e => { const ns = [...editingSpeech.steps]; ns[idx] = { ...ns[idx], subtitle: e.target.value }; setEditingSpeech({ ...editingSpeech, steps: ns }); }}
                            className="p-2 border-b border-wh-lightblue/30 focus:border-wh-blue transition-all outline-none text-sm text-wh-grey font-medium" placeholder={t.stepSubtitlePlaceholder} />
                        </div>
                        <textarea value={step.content}
                          onChange={e => { const ns = [...editingSpeech.steps]; ns[idx] = { ...ns[idx], content: e.target.value }; setEditingSpeech({ ...editingSpeech, steps: ns }); }}
                          rows={4} className="w-full p-4 bg-slate-50 rounded-xl text-wh-black text-sm focus:ring-2 focus:ring-wh-blue outline-none border border-transparent"
                          placeholder={t.stepContentPlaceholder} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-wh-orange">{t.objHandling}</h4>
                    <button type="button"
                      onClick={() => setEditingSpeech({ ...editingSpeech, objections: [...editingSpeech.objections, { id: Date.now().toString(), trigger: '', response: '' }] })}
                      className="text-xs font-bold bg-wh-orange/10 text-wh-orange px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-wh-orange/20 transition-all">
                      <Plus size={14} /> {t.addObj}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {editingSpeech.objections.map((obj, idx) => (
                      <div key={obj.id} className="relative p-6 border border-wh-orange/10 rounded-2xl bg-wh-orange/5 group">
                        <button type="button"
                          onClick={() => setEditingSpeech({ ...editingSpeech, objections: editingSpeech.objections.filter(o => o.id !== obj.id) })}
                          className="absolute -top-2 -right-2 p-1.5 bg-white border border-slate-200 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                          <Trash2 size={14} />
                        </button>
                        <div className="space-y-3">
                          <input type="text" value={obj.trigger}
                            onChange={e => { const no = [...editingSpeech.objections]; no[idx] = { ...no[idx], trigger: e.target.value }; setEditingSpeech({ ...editingSpeech, objections: no }); }}
                            className="w-full p-2 bg-white border border-wh-orange/20 rounded-lg text-sm font-bold text-wh-orange outline-none focus:ring-1 focus:ring-wh-orange"
                            placeholder={t.objTriggerPlaceholder} />
                          <textarea value={obj.response}
                            onChange={e => { const no = [...editingSpeech.objections]; no[idx] = { ...no[idx], response: e.target.value }; setEditingSpeech({ ...editingSpeech, objections: no }); }}
                            rows={2} className="w-full p-3 bg-white border border-wh-orange/20 rounded-lg text-wh-black text-sm outline-none focus:ring-1 focus:ring-wh-orange"
                            placeholder={t.objResponsePlaceholder} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={handleClose} className="px-6 py-2.5 rounded-xl font-bold text-wh-grey hover:bg-slate-200 transition-all">{t.cancel}</button>
                <button onClick={handleSave} className="px-8 py-2.5 bg-wh-blue text-white rounded-xl font-bold shadow-lg shadow-wh-blue/20 flex items-center gap-2">
                  <Save size={18} /> {t.save}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
