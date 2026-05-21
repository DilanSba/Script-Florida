/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  Calculator,
  Zap,
  MessageCircle,
  Send,
  TrendingUp,
  Smartphone,
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

/* ──────────────────────────── Helpers ───────────────────────────────────── */

const LS_VARS_KEY  = 'windmar_call_vars';
const LS_DARK_KEY  = 'windmar_dark';

const EMPTY_VARS: Record<string, string> = {
  'nombre del titular': '', homeowner: '',
  'nombre del asesor': '',  advisor: '',
  ciudad: '', city: '',
  direccion: '', address: '',
  dia: '', day: '',
  horario: '', time: '',
  phone: '',
  compania: '',
};

function loadVarsFromLS(): Record<string, string> {
  try {
    const saved = localStorage.getItem(LS_VARS_KEY);
    if (saved) return { ...EMPTY_VARS, ...JSON.parse(saved) };
  } catch {}
  return { ...EMPTY_VARS };
}

/* ──────────────────────────── App root ───────────────────────────────────── */

export default function App() {
  const { lang, setLang } = useLanguage();
  const t = UI[lang];

  const [activeMode, setActiveMode] = useState<'agent' | 'manager'>('agent');
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [speechToEdit, setSpeechToEdit] = useState<Speech | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(LS_DARK_KEY) === 'true');

  useEffect(() => {
    localStorage.setItem(LS_DARK_KEY, String(darkMode));
  }, [darkMode]);

  /* Carga los speeches del idioma activo. Se ejecuta cuando cambia `lang`.
     Clave por idioma para preservar ediciones independientes en ES y EN. */
  useEffect(() => {
    const lsKey = `windmar_speeches_${lang}`;
    try {
      const saved = localStorage.getItem(lsKey);
      if (saved) {
        const parsed: Speech[] = JSON.parse(saved);
        // Si hay nuevos speeches default que no estaban guardados aún, los agrega al final.
        const savedIds = new Set(parsed.map(s => s.id));
        const missing  = getDefaultSpeeches(lang).filter(s => !savedIds.has(s.id));
        setSpeeches(missing.length ? [...parsed, ...missing] : parsed);
      } else {
        const defaults = getDefaultSpeeches(lang);
        setSpeeches(defaults);
        localStorage.setItem(lsKey, JSON.stringify(defaults));
      }
    } catch {
      setSpeeches(getDefaultSpeeches(lang));
    }
    setIsLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  /* Guarda TODOS los speeches (default + custom) bajo la clave del idioma activo. */
  const updateSpeeches = (newSpeeches: Speech[]) => {
    setSpeeches(newSpeeches);
    localStorage.setItem(`windmar_speeches_${lang}`, JSON.stringify(newSpeeches));
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
      <nav className="bg-white dark:bg-slate-900 border-b border-wh-lightblue/30 dark:border-slate-800 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="https://i.postimg.cc/3NvQhzx3/Windmar-logo-FL.png"
            alt="Windmar Solar Florida"
            className="h-8 md:h-10 w-auto object-contain"
          />
          <p className="hidden sm:block text-[10px] text-wh-grey font-bold tracking-wide uppercase tracking-[0.15em]">{t.headerSub}</p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <motion.button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            whileTap={{ scale: 0.9 }}
            className="relative flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-wh-grey dark:text-slate-300 hover:border-wh-blue/40 dark:hover:border-wh-blue/40 hover:text-wh-blue dark:hover:text-wh-blue transition-all text-xs font-bold tracking-widest"
            title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          >
            <Languages size={14} />
            <span>{lang === 'es' ? 'EN' : 'ES'}</span>
          </motion.button>

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

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveMode('agent')}
              className={`px-4 md:px-6 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all ${
                activeMode === 'agent'
                  ? 'bg-white dark:bg-slate-700 text-wh-blue shadow-md'
                  : 'text-wh-grey hover:text-wh-black dark:hover:text-slate-200'
              }`}
            >
              {t.modeAgent}
            </button>
            <button
              onClick={() => setActiveMode('manager')}
              className={`px-4 md:px-6 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all ${
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

      <main className="max-w-7xl mx-auto p-3 md:p-8">
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
  const [variables, setVariablesState] = useState<Record<string, string>>(loadVarsFromLS);
  const [showObjections, setShowObjections] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    if (!selectedSpeechId && speeches.length > 0) setSelectedSpeechId(speeches[0].id);
  }, [speeches, selectedSpeechId]);

  const setVariables = (newVars: Record<string, string>) => {
    setVariablesState(newVars);
    localStorage.setItem(LS_VARS_KEY, JSON.stringify(newVars));
  };

  const selectedSpeech = speeches.find(s => s.id === selectedSpeechId);
  const isRetention = selectedSpeech?.type === 'retention';

  const replaceVariables = (text: string) => {
    let t2 = text;
    const map: Record<string, string> = {
      'nombre del titular': variables['nombre del titular'] || variables['homeowner'],
      homeowner:           variables['homeowner'] || variables['nombre del titular'],
      'nombre del asesor': variables['nombre del asesor'] || variables['advisor'],
      advisor:             variables['advisor'] || variables['nombre del asesor'],
      ciudad:              variables['ciudad'] || variables['city'],
      city:                variables['city'] || variables['ciudad'],
      direccion:           variables['direccion'] || variables['address'],
      address:             variables['address'] || variables['direccion'],
      dia:                 variables['dia'] || variables['day'],
      day:                 variables['day'] || variables['dia'],
      horario:             variables['horario'] || variables['time'],
      time:                variables['time'] || variables['horario'],
      telefono:            variables['phone'],
      phone:               variables['phone'],
      compania:            variables['compania'],
      company:             variables['compania'],
      'compania electrica':  variables['compania'],
      'electric company':    variables['compania'],
    };
    Object.entries(map).forEach(([key, value]) => {
      const replacement = value || `[${key}]`;
      t2 = t2.replace(new RegExp(`\\[${key}\\]`, 'gi'), replacement);
    });
    return t2;
  };

  const holderKey  = lang === 'es' ? 'nombre del titular' : 'homeowner';
  const advisorKey = lang === 'es' ? 'nombre del asesor'  : 'advisor';
  const cityKey    = lang === 'es' ? 'ciudad'             : 'city';

  if (!selectedSpeech) return <div>{t.noneAvailable}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 items-start">
      {/* Left column */}
      <div className={`${isRetention ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-4 md:space-y-6`}>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Strategy selector */}
          <div>
            <label className="block text-sm font-bold text-wh-black mb-2 flex items-center gap-2 uppercase tracking-wider">
              <FileText size={16} className="text-wh-blue" /> {t.selectStrategy}
            </label>
            <select
              value={selectedSpeechId}
              onChange={e => { setSelectedSpeechId(e.target.value); setShowObjections(false); }}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none text-wh-black font-semibold text-sm md:text-base"
            >
              {speeches.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Call data inputs */}
          {!isRetention && (
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-sm font-bold text-wh-black flex items-center gap-2 uppercase tracking-wider">
                <User size={16} className="text-wh-blue" /> {t.callData}
              </h3>
              <div className="grid gap-3">
                {/* Client name */}
                <div>
                  <label className="text-[10px] font-bold text-wh-grey uppercase ml-1">{t.holderName}</label>
                  <input type="text" placeholder={t.holderPlaceholder} value={variables[holderKey]}
                    onChange={e => setVariables({ ...variables, [holderKey]: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none text-sm" />
                </div>
                {/* Advisor + City */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-wh-grey uppercase ml-1">{t.yourName}</label>
                    <input type="text" placeholder={t.yourNamePlaceholder} value={variables[advisorKey]}
                      onChange={e => setVariables({ ...variables, [advisorKey]: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-wh-grey uppercase ml-1">{t.city}</label>
                    <input type="text" placeholder={t.cityPlaceholder} value={variables[cityKey]}
                      onChange={e => setVariables({ ...variables, [cityKey]: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none text-sm" />
                  </div>
                </div>
                {/* Electric company */}
                <div>
                  <label className="text-[10px] font-bold text-wh-grey uppercase ml-1">{t.electricCompany}</label>
                  <input
                    type="text"
                    list="electric-companies"
                    placeholder="FPL / Duke Energy"
                    value={variables['compania']}
                    onChange={e => setVariables({ ...variables, compania: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none text-sm"
                  />
                  <datalist id="electric-companies">
                    <option value="FPL (Florida Power & Light)" />
                    <option value="Duke Energy" />
                    <option value="TECO Energy" />
                    <option value="Florida Keys Electric" />
                  </datalist>
                </div>
                {/* Phone */}
                <div>
                  <label className="text-[10px] font-bold text-wh-grey uppercase ml-1">{t.clientPhone}</label>
                  <input
                    type="tel"
                    placeholder="+1 (305) 555-0000"
                    value={variables['phone']}
                    onChange={e => setVariables({ ...variables, phone: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {isRetention && (
            <div className="space-y-3">
              {/* Retention-mode client fields */}
              <h3 className="text-sm font-bold text-wh-black flex items-center gap-2 uppercase tracking-wider">
                <User size={16} className="text-wh-blue" /> {t.callData}
              </h3>
              <div>
                <label className="text-[10px] font-bold text-wh-grey uppercase ml-1">{t.holderName}</label>
                <input type="text" placeholder={t.holderPlaceholder} value={variables[holderKey]}
                  onChange={e => setVariables({ ...variables, [holderKey]: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-wh-grey uppercase ml-1">{t.clientPhone}</label>
                <input type="tel" placeholder="+1 (305) 555-0000" value={variables['phone']}
                  onChange={e => setVariables({ ...variables, phone: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none text-sm" />
              </div>
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
              className={`w-full py-3 md:py-3 min-h-[48px] rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl text-sm md:text-base ${
                showObjections ? 'bg-wh-orange/10 text-wh-orange border border-wh-orange/30' : 'bg-wh-blue text-white'
              }`}
            >
              <MessageSquare size={18} /> {t.objections}
            </button>
          )}
        </div>

        {/* Objections panel */}
        <AnimatePresence>
          {!isRetention && showObjections && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="bg-wh-orange/5 rounded-2xl border border-wh-orange/20 p-4 md:p-5 space-y-4 shadow-sm overflow-hidden"
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
      <div className={`${isRetention ? 'lg:col-span-9' : 'lg:col-span-8'} space-y-4 md:space-y-6`}>
        {isRetention ? (
          <RetentionSpeechView variables={variables} />
        ) : (
          selectedSpeech.steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
              className="group relative"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 md:p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-wh-blue/10 text-wh-blue flex items-center justify-center font-bold text-sm">{idx + 1}</div>
                    <div>
                      <h3 className="font-bold text-wh-darkblue text-sm md:text-base">{step.title}</h3>
                      <p className="text-xs text-wh-grey font-medium uppercase tracking-wider">{step.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    {onEditRequested && (
                      <button onClick={() => onEditRequested(selectedSpeech)}
                        className="p-2 min-h-[40px] text-wh-grey hover:text-wh-blue hover:bg-wh-blue/5 rounded-lg transition-all flex items-center gap-2 text-xs font-semibold">
                        <Pencil size={14} /> <span className="hidden md:inline">{t.editBtn}</span>
                      </button>
                    )}
                    <button onClick={() => navigator.clipboard.writeText(replaceVariables(step.content)).catch(() => {})}
                      className="p-2 min-h-[40px] text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-all flex items-center gap-2 text-xs font-semibold">
                      <Copy size={14} /> <span className="hidden md:inline">{t.copyBtn}</span>
                    </button>
                  </div>
                </div>
                <div className="p-5 md:p-8">
                  <div className="text-base md:text-lg text-wh-black leading-relaxed whitespace-pre-wrap font-medium">
                    {replaceVariables(step.content).split('\n').map((line, i) => (
                      <p key={i} className={line.startsWith('(') ? 'text-wh-grey italic text-sm md:text-base mt-2' : 'mb-4'}>{line}</p>
                    ))}
                  </div>
                </div>
                {step.caution && (
                  <div className="px-5 md:px-8 py-3 bg-wh-orange/5 border-t border-wh-orange/10 flex items-center gap-3">
                    <AlertCircle size={18} className="text-wh-orange shrink-0" />
                    <p className="text-xs text-wh-orange font-bold uppercase tracking-wider">{step.caution}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pain Calculator Widget */}
      <PainCalculatorWidget open={showCalculator} onClose={() => setShowCalculator(false)} lang={lang} />

      {/* Floating calculator button */}
      <motion.button
        onClick={() => setShowCalculator(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-4 md:right-6 z-40 bg-wh-orange text-white pl-3 pr-4 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 hover:shadow-2xl transition-shadow"
        title={lang === 'es' ? 'Calculadora de Aumento' : 'Increase Calculator'}
      >
        <Calculator size={18} />
        <span className="text-sm">{lang === 'es' ? 'Calculadora' : 'Calculator'}</span>
      </motion.button>
    </div>
  );
}

/* ──────────────────────────── Pain Calculator Widget ─────────────────────── */

function PainCalculatorWidget({ open, onClose, lang }: { open: boolean; onClose: () => void; lang: 'es' | 'en' }) {
  const [bill, setBill] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const billNum   = parseFloat(bill.replace(/,/g, '')) || 0;
  const extraYear = billNum * 12 * 0.12;
  const nextYear  = billNum * 12 * 1.12;

  const phrase = lang === 'es'
    ? `"Sr./Sra. Cliente, si no hacemos la auditoría ahora, usted le regalará $${extraYear.toFixed(2)} adicionales a la eléctrica solo este año."`
    : `"Mr./Ms. Client, without the audit today, you'll hand $${extraYear.toFixed(2)} extra to the electric company this year alone."`;

  const months = Array.from({ length: 12 }, (_, i) => {
    const factor = 1 + (0.12 * (i + 1)) / 12;
    return billNum * factor;
  });

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-end sm:items-center justify-center p-3 md:p-4 backdrop-blur-sm" onClick={onClose}>
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-wh-orange to-amber-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="font-black text-base">{lang === 'es' ? 'Calculadora de Aumento' : 'Increase Calculator'}</p>
                  <p className="text-white/80 text-xs">{lang === 'es' ? '12% de incremento anual estimado en FL' : '12% estimated annual increase in FL'}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Bill input */}
              <div>
                <label className="block text-xs font-bold text-wh-grey uppercase tracking-wider mb-2">
                  {lang === 'es' ? 'Último recibo del cliente ($)' : "Client's last bill ($)"}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-wh-grey font-bold text-lg">$</span>
                  <input
                    ref={inputRef}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={bill}
                    onChange={e => setBill(e.target.value)}
                    className="w-full pl-8 pr-4 py-4 text-xl font-bold bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-wh-orange focus:border-wh-orange outline-none transition-all"
                  />
                </div>
              </div>

              {billNum > 0 && (
                <>
                  {/* Results grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                      <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider mb-1">
                        {lang === 'es' ? 'Ahorro proyectado/año' : 'Projected extra/year'}
                      </p>
                      <p className="text-2xl font-black text-amber-700">${extraYear.toFixed(0)}</p>
                      <p className="text-[10px] text-amber-600 mt-0.5">{lang === 'es' ? 'que regalará a la eléctrica' : 'extra to the utility'}</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-center">
                      <p className="text-[10px] font-black text-red-700 uppercase tracking-wider mb-1">
                        {lang === 'es' ? 'Total año siguiente' : 'Next year total'}
                      </p>
                      <p className="text-2xl font-black text-red-700">${nextYear.toFixed(0)}</p>
                      <p className="text-[10px] text-red-600 mt-0.5">{lang === 'es' ? 'vs $' + (billNum * 12).toFixed(0) + ' actuales' : 'vs $' + (billNum * 12).toFixed(0) + ' current'}</p>
                    </div>
                  </div>

                  {/* Mini chart - 12-month bars */}
                  <div>
                    <p className="text-[10px] font-black text-wh-grey uppercase tracking-wider mb-2">
                      {lang === 'es' ? 'Proyección mensual (12 meses)' : 'Monthly projection (12 months)'}
                    </p>
                    <div className="flex items-end gap-1 h-14 bg-slate-50 rounded-xl p-2">
                      {months.map((m, i) => {
                        const pct = (m / months[11]) * 100;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                            <div
                              className="w-full rounded-sm bg-gradient-to-t from-amber-500 to-amber-300 transition-all"
                              style={{ height: `${pct}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] text-wh-grey">{lang === 'es' ? 'Mes 1' : 'Month 1'}</span>
                      <span className="text-[9px] text-wh-grey">{lang === 'es' ? 'Mes 12' : 'Month 12'}</span>
                    </div>
                  </div>

                  {/* Auto-phrase */}
                  <div className="p-4 bg-wh-blue/5 rounded-2xl border border-wh-blue/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-black text-wh-blue uppercase tracking-wider">
                        {lang === 'es' ? 'Frase automática para el agente' : 'Auto-phrase for the agent'}
                      </p>
                      <button
                        onClick={() => navigator.clipboard.writeText(phrase).catch(() => {})}
                        className="flex items-center gap-1 text-[10px] font-bold text-wh-blue hover:bg-wh-blue/10 px-2 py-1 rounded-lg transition-all"
                      >
                        <Copy size={10} /> {lang === 'es' ? 'Copiar' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-sm text-wh-darkblue italic leading-relaxed font-medium">{phrase}</p>
                  </div>
                </>
              )}

              {billNum === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-wh-grey">
                  <Calculator size={32} className="opacity-20 mb-2" />
                  <p className="text-sm">{lang === 'es' ? 'Ingresa el monto del recibo para ver la proyección' : 'Enter the bill amount to see the projection'}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────── Retention Speech View ─────────────────────────────── */

type RetentionTab = 'preCall' | 'apertura' | 'objeciones' | 'cierre' | 'reconfirmacion';

function RetentionSpeechView({ variables }: { variables: Record<string, string> }) {
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
    { id: 'preCall',         label: t.tabLabels.preCall,         Icon: ClipboardList  },
    { id: 'apertura',        label: t.tabLabels.apertura,        Icon: Phone          },
    { id: 'objeciones',      label: t.tabLabels.objeciones,      Icon: ShieldCheck    },
    { id: 'cierre',          label: t.tabLabels.cierre,          Icon: CalendarCheck  },
    { id: 'reconfirmacion',  label: t.tabLabels.reconfirmacion,  Icon: MessageCircle  },
  ];

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <div className="bg-wh-darkblue rounded-2xl p-4 md:p-5 text-white flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-1">{t.retentionV4}</p>
          <h2 className="text-base md:text-lg font-bold">{t.retentionTitle}</h2>
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

      {/* Tabs — scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        {RETENTION_TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-3 md:px-4 py-2.5 min-h-[44px] rounded-xl text-xs md:text-sm font-semibold transition-all border whitespace-nowrap shrink-0 ${
              activeTab === id
                ? id === 'reconfirmacion'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                  : 'bg-wh-blue text-white border-wh-blue shadow-md shadow-wh-blue/20'
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
          {activeTab === 'preCall'        && <RetentionPreCallTab    checked={checked} onToggle={toggleCheck} totalItems={totalItems} />}
          {activeTab === 'apertura'       && <RetentionAperturaTab   />}
          {activeTab === 'objeciones'     && <RetentionObjecionesTab activeRebate={activeRebate} onSelect={setActiveRebate} />}
          {activeTab === 'cierre'         && <RetentionCierreTab     />}
          {activeTab === 'reconfirmacion' && <RetentionReconfirmacionTab variables={variables} />}
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
        <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-5">
          <p className="text-[10px] font-black text-wh-blue uppercase tracking-widest mb-4 border-l-4 border-wh-blue pl-3">{group.title}</p>
          <div className="space-y-2">
            {group.items.map(item => (
              <button
                key={item.id}
                onClick={() => onToggle(item.id)}
                className={`w-full flex items-start gap-3 p-3 min-h-[48px] rounded-xl text-left transition-all ${
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

      <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-4 md:p-5">
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
            className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all">
            <Copy size={12} /> {t.copyBtn}
          </button>
        </div>
        <div className="p-5 md:p-6">
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
            className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] bg-wh-blue text-white text-xs font-bold rounded-lg hover:bg-wh-darkblue transition-all">
            <Copy size={12} /> {t.copyBtn}
          </button>
        </div>
        <div className="p-5 md:p-6 space-y-4">
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

      <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-4 md:p-5 flex items-center justify-between gap-4">
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
            className={`px-3 py-2 min-h-[40px] rounded-xl text-xs font-semibold border transition-all ${
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
            <div className="p-5 md:p-6 space-y-4">
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
            className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] bg-wh-blue text-white text-xs font-bold rounded-lg hover:bg-wh-darkblue transition-all">
            <Copy size={12} /> {t.copyBtn}
          </button>
        </div>
        <div className="p-5 md:p-6">
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
            <h3 className="font-bold text-wh-darkblue text-sm">{t.doubleAltTitle}</h3>
          </div>
          <button onClick={() => copy(t.doubleAltScript.replace(/<\/?b>/g, ''))}
            className="p-2 min-h-[40px] text-slate-400 hover:text-wh-blue rounded-lg transition-all"><Copy size={14} /></button>
        </div>
        <div className="p-5 md:p-6">
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
        <div className="p-5 md:p-6">
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
        <div className="p-5 md:p-6 space-y-4">
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
        <div className="p-5 md:p-6 space-y-3">
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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-5">
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

/* ── Reconfirmación WhatsApp ─────────────────────────────────────────────── */

function RetentionReconfirmacionTab({ variables }: { variables: Record<string, string> }) {
  const { lang } = useLanguage();
  const t = UI[lang];

  const holderKey = lang === 'es' ? 'nombre del titular' : 'homeowner';
  const dayKey    = lang === 'es' ? 'dia'     : 'day';
  const timeKey   = lang === 'es' ? 'horario' : 'time';
  const addrKey   = lang === 'es' ? 'direccion' : 'address';

  const [localPhone, setLocalPhone] = useState(variables['phone'] || '');
  const [localDay,   setLocalDay]   = useState(variables[dayKey]  || '');
  const [localTime,  setLocalTime]  = useState(variables[timeKey] || '');
  const [localAddr,  setLocalAddr]  = useState(variables[addrKey] || '');
  const [sent, setSent] = useState(false);

  const clientName = variables[holderKey] ||
    (lang === 'es' ? '[Nombre del cliente]' : '[Client name]');

  const fill = (val: string, fallback: string) => val || fallback;

  const message = lang === 'es'
    ? `¡Hola ${clientName}! 👋\n\nLe confirmo su cita de auditoría de panel solar con Windmar Home:\n\n📅 Día: ${fill(localDay, '[Día]')}\n⏰ Hora: ${fill(localTime, '[Hora]')}\n📍 Dirección: ${fill(localAddr, '[Dirección]')}\n\nNuestro especialista llegará puntual. Si necesita cambiar algo, avísenos con anticipación.\n\n¡Hasta pronto! ☀️ Windmar Home Solar`
    : `Hello ${clientName}! 👋\n\nConfirming your solar panel audit appointment with Windmar Home:\n\n📅 Date: ${fill(localDay, '[Date]')}\n⏰ Time: ${fill(localTime, '[Time]')}\n📍 Address: ${fill(localAddr, '[Address]')}\n\nOur specialist will be right on time. If you need to make any changes, please let us know in advance.\n\nSee you soon! ☀️ Windmar Home Solar`;

  const sendWhatsApp = () => {
    if (!localPhone) return;
    const clean = localPhone.replace(/\D/g, '');
    const url   = `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const copyMessage = () => navigator.clipboard.writeText(message).catch(() => {});

  const phoneOk = localPhone.replace(/\D/g, '').length >= 10;

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
        <Smartphone size={16} className="text-emerald-700 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold text-emerald-800">
            {lang === 'es' ? 'Confirmación One-Click por WhatsApp' : 'One-Click WhatsApp Confirmation'}
          </p>
          <p className="text-xs text-emerald-700 mt-0.5">
            {lang === 'es'
              ? 'Completa los campos y envía el mensaje de confirmación directamente al cliente.'
              : 'Fill in the fields and send the confirmation message directly to the client.'}
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
        <h3 className="text-[10px] font-black text-wh-blue uppercase tracking-widest border-l-4 border-wh-blue pl-3">
          {lang === 'es' ? 'Datos de la cita' : 'Appointment details'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Phone */}
          <div className="sm:col-span-2">
            <label className="text-[10px] font-bold text-wh-grey uppercase ml-1 flex items-center gap-1 mb-1">
              <Phone size={10} /> {lang === 'es' ? 'Teléfono del cliente (WhatsApp)' : 'Client phone (WhatsApp)'}
            </label>
            <input
              type="tel"
              placeholder="+1 (305) 555-0000"
              value={localPhone}
              onChange={e => setLocalPhone(e.target.value)}
              className={`w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all ${
                localPhone && !phoneOk ? 'border-red-300 bg-red-50' : 'border-slate-200'
              }`}
            />
            {localPhone && !phoneOk && (
              <p className="text-[10px] text-red-500 mt-1 ml-1">
                {lang === 'es' ? 'Mínimo 10 dígitos' : 'Minimum 10 digits'}
              </p>
            )}
          </div>

          {/* Day */}
          <div>
            <label className="text-[10px] font-bold text-wh-grey uppercase ml-1 mb-1 block">
              {lang === 'es' ? 'Día de la cita' : 'Appointment day'}
            </label>
            <input
              type="text"
              placeholder={lang === 'es' ? 'Ej: Lunes 26 de mayo' : 'e.g. Monday May 26'}
              value={localDay}
              onChange={e => setLocalDay(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>

          {/* Time */}
          <div>
            <label className="text-[10px] font-bold text-wh-grey uppercase ml-1 mb-1 block">
              {lang === 'es' ? 'Hora' : 'Time'}
            </label>
            <input
              type="text"
              placeholder={lang === 'es' ? 'Ej: 10:00 AM' : 'e.g. 10:00 AM'}
              value={localTime}
              onChange={e => setLocalTime(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="text-[10px] font-bold text-wh-grey uppercase ml-1 mb-1 block">
              {lang === 'es' ? 'Dirección' : 'Address'}
            </label>
            <input
              type="text"
              placeholder={lang === 'es' ? 'Ej: 123 SW 8th St, Miami FL 33130' : 'e.g. 123 SW 8th St, Miami FL 33130'}
              value={localAddr}
              onChange={e => setLocalAddr(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Message preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-black text-wh-grey uppercase tracking-widest">
            {lang === 'es' ? 'Vista previa del mensaje' : 'Message preview'}
          </p>
          <button onClick={copyMessage} className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-wh-blue hover:bg-wh-blue/10 rounded-lg transition-all">
            <Copy size={10} /> {lang === 'es' ? 'Copiar texto' : 'Copy text'}
          </button>
        </div>
        <div className="p-5">
          {/* WhatsApp bubble style */}
          <div className="bg-[#dcf8c6] rounded-2xl rounded-tl-sm p-4 max-w-sm">
            <p className="text-sm text-[#111] whitespace-pre-line leading-relaxed">{message}</p>
            <p className="text-[10px] text-[#666] mt-2 text-right">12:00 ✓✓</p>
          </div>
        </div>
      </div>

      {/* Send button */}
      <motion.button
        onClick={sendWhatsApp}
        disabled={!phoneOk}
        whileTap={{ scale: phoneOk ? 0.97 : 1 }}
        className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-lg min-h-[56px] ${
          sent
            ? 'bg-emerald-500 text-white shadow-emerald-500/30'
            : phoneOk
              ? 'bg-[#25D366] text-white hover:bg-[#1ebe5a] shadow-[#25D366]/30 hover:shadow-xl'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        {sent ? (
          <>
            <CheckCircle2 size={22} />
            {lang === 'es' ? '¡Abierto en WhatsApp!' : 'Opened in WhatsApp!'}
          </>
        ) : (
          <>
            <Send size={20} />
            {lang === 'es' ? 'Enviar confirmación por WhatsApp' : 'Send WhatsApp confirmation'}
          </>
        )}
      </motion.button>

      {!phoneOk && (
        <p className="text-center text-xs text-wh-grey">
          {lang === 'es' ? 'Ingresa el número de teléfono para habilitar el envío' : 'Enter the phone number to enable sending'}
        </p>
      )}
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

  const handleResetToDefault = () => {
    if (!editingSpeech) return;
    const label = lang === 'es' ? '¿Restaurar el contenido original de este guion? Se perderán los cambios guardados.' : 'Restore this script to its original content? All saved changes will be lost.';
    if (!confirm(label)) return;
    const original = getDefaultSpeeches(lang).find(s => s.id === editingSpeech.id);
    if (original) setEditingSpeech(original);
  };

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
        <h2 className="text-xl md:text-2xl font-bold text-wh-darkblue">{t.strategies}</h2>
        <button onClick={createNew} className="bg-wh-blue text-white px-4 md:px-5 py-2.5 min-h-[48px] rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all text-sm">
          <Plus size={20} /> {t.createNew}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {speeches.map(s => {
          const isRetention = s.type === 'retention';
          const isDefault = (DEFAULT_SPEECH_IDS as readonly string[]).includes(s.id);
          return (
            <div key={s.id} className={`bg-white p-5 md:p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all space-y-4 ${isRetention ? 'border-emerald-200' : 'border-wh-lightblue/20'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-black uppercase text-white px-2 py-0.5 rounded ${isRetention ? 'bg-emerald-600' : 'bg-wh-blue'}`}>
                    {s.campaign}
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-wh-black mt-2">{s.name}</h3>
                  <p className="text-xs text-wh-grey font-bold uppercase tracking-widest">
                    {isRetention ? t.phases4 : `${s.steps.length} ${t.stepsLabel} · ${s.objections.length} ${t.objCount}`}
                  </p>
                </div>
                <div className="flex gap-1 items-start">
                  {!isRetention && (
                    <>
                      <button onClick={() => setEditingSpeech(s)} className="p-2 min-h-[40px] text-wh-teslagrey hover:text-wh-blue hover:bg-slate-100 rounded-lg transition-all" title={lang === 'es' ? 'Editar guion' : 'Edit script'}>
                        <Settings size={18} />
                      </button>
                      {!isDefault && (
                        <button onClick={() => handleDelete(s.id)} className="p-2 min-h-[40px] text-wh-teslagrey hover:text-red-500 hover:bg-slate-100 rounded-lg transition-all" title={lang === 'es' ? 'Eliminar' : 'Delete'}>
                          <Trash2 size={18} />
                        </button>
                      )}
                    </>
                  )}
                  {isRetention && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg">{t.interactiveGuide}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setPreviewSpeech(s)}
                className={`w-full py-2.5 min-h-[44px] text-sm font-bold rounded-xl transition-all border ${
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
              <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-wh-darkblue">{previewSpeech.name}</h3>
                  <p className="text-[10px] font-bold text-wh-grey uppercase tracking-widest">{previewSpeech.campaign}</p>
                </div>
                <button onClick={() => setPreviewSpeech(null)} className="p-2 hover:bg-slate-200 rounded-full transition-all"><X size={20} /></button>
              </div>
              <div className="flex-grow overflow-y-auto p-5 md:p-6 space-y-6">
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
                    className="px-8 py-2.5 min-h-[48px] bg-wh-blue text-white rounded-xl font-bold text-sm shadow-md flex items-center gap-2">
                    <Pencil size={14} /> {t.editStructure}
                  </button>
                ) : (
                  <button onClick={() => setPreviewSpeech(null)} className={`px-8 py-2.5 min-h-[48px] ${previewSpeech.type === 'retention' ? 'bg-emerald-600' : 'bg-wh-blue'} text-white rounded-xl font-bold text-sm shadow-md`}>
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
              <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 className="text-lg md:text-xl font-bold">{t.editStrategy} {editingSpeech.name}</h3>
                <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-all"><X size={24} /></button>
              </div>
              <form onSubmit={handleSave} className="overflow-y-auto p-6 md:p-8 space-y-8 flex-grow">
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
                      <div key={step.id} className="relative p-5 md:p-6 border border-wh-lightblue/20 rounded-2xl bg-white shadow-sm group">
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
                      <div key={obj.id} className="relative p-5 md:p-6 border border-wh-orange/10 rounded-2xl bg-wh-orange/5 group">
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
              <div className="p-5 md:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0 flex-wrap">
                {/* Reset to default — solo para speeches predefinidos */}
                <div>
                  {editingSpeech && (DEFAULT_SPEECH_IDS as readonly string[]).includes(editingSpeech.id) && (
                    <button
                      type="button"
                      onClick={handleResetToDefault}
                      className="px-4 py-2.5 min-h-[48px] rounded-xl font-bold text-amber-600 border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-all text-sm flex items-center gap-2"
                    >
                      <Trash2 size={15} />
                      {lang === 'es' ? 'Restaurar original' : 'Reset to default'}
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={handleClose} className="px-6 py-2.5 min-h-[48px] rounded-xl font-bold text-wh-grey hover:bg-slate-200 transition-all">{t.cancel}</button>
                  <button onClick={handleSave} className="px-8 py-2.5 min-h-[48px] bg-wh-blue text-white rounded-xl font-bold shadow-lg shadow-wh-blue/20 flex items-center gap-2">
                    <Save size={18} /> {t.save}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
