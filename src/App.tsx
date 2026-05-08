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
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/* ──────────────────────────── Types ──────────────────────────────────────── */

interface SpeechStep {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  caution?: string;
}

interface Speech {
  id: string;
  name: string;
  campaign: string;
  type?: 'standard' | 'retention';
  steps: SpeechStep[];
  objections: { id: string; trigger: string; response: string }[];
}

/* ──────────────────────── Retention static data ─────────────────────────── */

const RETENTION_CHECKLISTS = [
  {
    id: 'deal',
    title: 'Información del Deal',
    items: [
      { id: 'c1', text: 'Nombre completo y cómo prefiere que lo llamen' },
      { id: 'c2', text: 'Leer notas del Deal completo: notas de Main page + notas del módulo de etapa en la que se encuentra el proyecto — identificar tono de la cancelación (frustración, duda, presión económica)' },
      { id: 'c3', text: 'Motivo de Closed Lost en CRM — si es "Other", revisar detalles en las notas del Main page' },
      { id: 'c4', text: 'Nombre del consultor (verificar si tiene Sales Assist — cuando hay Sales Assist usualmente indica que fue el cerrador o asistió en la venta)' },
      { id: 'c5', text: 'Fecha del cierre — calcular cuántos días han pasado' },
    ],
  },
  {
    id: 'ntp',
    title: 'Sección Pre Ingeniería — ENG Findings / NTP',
    items: [
      { id: 'n1', text: 'Tamaño del sistema (kW) cotizado al cliente' },
      { id: 'n2', text: 'Número de paneles, modelo de inversor o batería si aplica' },
      { id: 'n3', text: 'Estimado de ahorro mensual o anual documentado por el técnico' },
      { id: 'n4', text: 'Visita de pre ingeniería — revisar ENG Findings en módulo de Pre Eng o NTP (detalles de techo, condiciones del hogar, hallazgos técnicos)' },
      { id: 'n5', text: 'Condiciones especiales del hogar (sombra, tipo de techo, HOA)' },
    ],
  },
  {
    id: 'financiamiento',
    title: 'Financiamiento',
    items: [
      { id: 'f1', text: 'Banco o financiera trabajada (GoodLeap, Mosaic, Sunlight, etc.)' },
      { id: 'f2', text: '¿Fue aprobado? ¿En qué etapa quedó el financiamiento?' },
      { id: 'f3', text: 'Cuota mensual estimada y plazo del contrato' },
      { id: 'f4', text: '¿Hubo problema con co-aplicante o documentación?' },
    ],
  },
];

const RETENTION_WARNINGS = [
  'Notas con queja directa contra Windmar o el vendedor → escalar a supervisor primero.',
  'Motivo DQ-Mobile Home o HOA sin resolución → verificar con operaciones si el impedimento sigue activo.',
  'Canceló hace menos de 30 días → esperar al menos 2 semanas antes del primer contacto.',
];

interface RetentionRebate {
  id: string;
  label: string;
  title: string;
  badge: 'amber' | 'red' | 'blue';
  warning?: string;
  steps: { title: string; text: string }[];
  closing: string;
}

const RETENTION_REBATES: RetentionRebate[] = [
  {
    id: 'economico',
    label: 'Precio / económico',
    title: 'Economics Not Compelling — precio o retorno no convenció',
    badge: 'amber',
    steps: [
      { title: 'Validar', text: '"Entiendo, el aspecto económico es lo más importante en una decisión así."' },
      { title: 'Anclar al sistema', text: '"El sistema diseñado para su hogar era de [X kW] — ahorro estimado de [$ del NTP] al mes, prácticamente reemplazando lo que hoy paga de luz."' },
      { title: 'Cambiar perspectiva', text: '"No es si el sistema cuesta — es comparar lo que paga hoy a la eléctrica versus la cuota del panel. Casi siempre el panel sale más barato mes a mes."' },
      { title: 'Urgencia real', text: '"Los incentivos federales del 30% ITC están vigentes este año. Esperar puede costar más."' },
    ],
    closing: '"Le propongo una reunión sin compromiso con nuestro especialista para que le haga el análisis actualizado de su factura. ¿Le parece bien el [día] o prefiere [otro día]?"',
  },
  {
    id: 'cambioMente',
    label: 'Cambió de opinión',
    title: 'Customer Changed Their Mind',
    badge: 'amber',
    warning: '"Cambió de opinión" casi nunca es el motivo real. Hay que excavar — detrás casi siempre hay precio, duda técnica o experiencia con el vendedor.',
    steps: [
      { title: 'Sin presión', text: '"Está bien, ese tipo de decisiones merecen reflexión, es completamente válido."' },
      { title: 'Excavar el motivo real', text: '"Solo por curiosidad, ¿hubo algo específico que le hizo reconsiderarlo? A veces hay preguntas que quedan sin respuesta…"' },
      { title: 'Con la respuesta, aplicar rebate correspondiente', text: 'Precio, duda técnica o experiencia con el vendedor.' },
    ],
    closing: '"¿Estaría dispuesto a escuchar una presentación nueva, sin compromiso, para tener toda la información antes de decidir definitivamente?"',
  },
  {
    id: 'noFunding',
    label: 'No aprobado / No Funding',
    title: 'No Funding — no aprobado en financiamiento',
    badge: 'red',
    steps: [
      { title: 'Empatía inmediata', text: '"Sabemos que ese proceso puede ser frustrante, lo entendemos perfectamente."' },
      { title: 'Explorar cambios', text: '"¿Ha habido algún cambio en su situación crediticia o de empleo desde entonces?"' },
      { title: 'Alternativas concretas', text: '"[Banco del NTP] fue la primera opción, pero también GoodLeap, Mosaic y opciones de lease con cero inicial."' },
      { title: 'Co-aplicante', text: '"En algunos casos, agregar un co-aplicante resuelve la aprobación. ¿Tiene esa posibilidad?"' },
    ],
    closing: '"15 minutos con nuestro especialista en financiamiento — sin costo, sin compromiso — para ver si hoy existe una opción que antes no estaba disponible. ¿Le agendamos?"',
  },
  {
    id: 'competencia',
    label: 'Competencia mejor precio',
    title: 'Competition Better Pricing',
    badge: 'amber',
    steps: [
      { title: 'Validar sin atacar', text: '"Es bueno que haya comparado — eso demuestra que es un consumidor informado."' },
      { title: 'Indagar la oferta', text: '"¿Qué tamaño de sistema le ofrecieron y con qué garantías?"' },
      { title: 'Diferenciar con contexto', text: '"No todos los precios bajos incluyen mantenimiento propio, garantías de producción y servicio local. Eso marca la diferencia a los 5 y 10 años."' },
      { title: 'Si aún no firmó', text: '"Antes de decidir, ¿le parece bien una segunda opinión con nosotros? Así compara manzanas con manzanas."' },
    ],
    closing: '"20 minutos con nuestro especialista para presentarle una propuesta actualizada y explicarle las diferencias punto a punto. ¿Cuándo tiene disponibilidad?"',
  },
  {
    id: 'misinformed',
    label: 'Se sintió mal informado',
    title: 'Customer Feels Misinformed',
    badge: 'red',
    warning: 'El más delicado. Nunca defender al vendedor anterior. El cliente debe sentir que Windmar reconoce el problema y actúa diferente.',
    steps: [
      { title: 'Disculpa genuina', text: '"En nombre de Windmar le pido disculpas si sintió que la información no fue clara. Eso no es lo que queremos para nuestros clientes."' },
      { title: 'Dar el control', text: '"¿Me podría contar qué fue lo que le generó esa sensación? Quiero entenderlo bien."' },
      { title: 'Nuevo comienzo', text: '"Lo que le propongo es empezar de cero, con un especialista diferente, que responde todas sus preguntas antes de cualquier firma."' },
    ],
    closing: '"Este consultor no tiene prisa — su único objetivo es que usted entienda cada aspecto antes de decidir. ¿Le damos esa oportunidad?"',
  },
  {
    id: 'noResponde',
    label: 'No respondía antes',
    title: 'Customer Non-Responsive (ahora sí atendió)',
    badge: 'blue',
    steps: [
      { title: 'No mencionar intentos previos', text: '"Qué gusto poder hablar con usted hoy."' },
      { title: 'Mensaje de valor', text: '"Su expediente estaba activo y quería asegurarme de que si tuvo alguna duda, hoy tenga la oportunidad de resolverla."' },
      { title: 'Sin presión', text: '"¿El tema de energía solar sigue siendo algo que le interesaría explorar, o ya tomó una decisión diferente?"' },
    ],
    closing: '"Con gusto le agendamos una visita sin costo donde un especialista evalúa su hogar y le muestra lo que podría ahorrarse. ¿Le parece bien?"',
  },
  {
    id: 'finance',
    label: 'No completó financiamiento',
    title: "Didn't complete Finance WC / Recurring payment",
    badge: 'amber',
    steps: [
      { title: 'Punto de abandono', text: '"El proceso quedó en la parte del financiamiento. ¿Fue la documentación o el proceso en línea lo que no se pudo completar?"' },
      { title: 'Si fue documentación', text: '"Hoy tenemos coordinadores que acompañan al cliente paso a paso — ya no tiene que hacerlo solo."' },
      { title: 'Si fue recurring payment', text: '"Podemos retomarlo desde donde quedó — el banco guarda el expediente. ¿Le gustaría que verificáramos si su caso sigue activo?"' },
    ],
    closing: '"Le conecto con nuestra coordinadora de financiamiento para retomar el proceso en una sola llamada. ¿Prefiere que le transfiera ahora o agenda una cita presencial?"',
  },
  {
    id: 'hardship',
    label: 'Dificultad financiera',
    title: 'Financial Hardship',
    badge: 'red',
    steps: [
      { title: 'Máxima empatía, cero presión', text: '"Entiendo perfectamente, las circunstancias cambian y es completamente comprensible."' },
      { title: 'Evaluar cambio', text: '"¿Ha mejorado su situación desde entonces?" — Si sigue difícil, agradecer y marcar seguimiento en 60–90 días.' },
      { title: 'Si mejoró', text: '"El solar ayuda precisamente en esos momentos — reduce ese gasto fijo y libera dinero cada mes."' },
      { title: 'Sin inicial', text: '"Tenemos opciones con cero dinero de inicio y cuotas frecuentemente menores a la factura actual de luz."' },
    ],
    closing: '"No le pido ningún compromiso hoy. Solo 15 minutos con nuestro especialista para ver si los números hacen sentido en su situación actual. ¿Le agendamos sin presión?"',
  },
];

/* ──────────────────────────── Default speeches ───────────────────────────── */

const DEFAULT_SPEECHES: Speech[] = [
  {
    id: 'freedom-forever',
    name: 'Campaña Freedom Forever',
    campaign: 'Telemercadeo',
    steps: [
      {
        id: '1',
        title: '1 · Apertura',
        subtitle: 'Conexión directa + empatía inmediata',
        content: '"Buenos días/tardes, ¿estoy hablando con [nombre del titular]?\n\n[nombre del titular], le saluda [nombre del asesor] de parte de Windmar Home Solar.\n\nEstamos contactando a propietarios en el área de [ciudad] que tienen un sistema solar en su casa, ya que muchos de ellos están en una situación que puede estar afectando su inversión — y queremos asegurarnos de que usted esté protegido.\n\nLo que queremos es enviar a uno de nuestros consultores locales a revisar su sistema, sin costo y sin compromiso."',
      },
      {
        id: '2',
        title: '2 · Desarrollo',
        subtitle: 'Revelar la situación con claridad y empatía',
        content: '"El motivo de mi llamada es que la empresa que instaló su sistema solar declaró quiebra recientemente.\n\n¿Usted ya había escuchado algo sobre esto?\n\n(Espera la respuesta del cliente)\n\nSi dice SÍ: "Entiendo, y es una situación muy preocupante para muchos propietarios. Lo que esto significa en la práctica es que hoy su sistema puede estar operando sin garantía activa ni soporte técnico — si algo falla, ya no hay nadie de esa compañía a quien llamar. Usted hizo una inversión importante y merece tener respaldo real."\n\nSi dice NO: "Le cuento, porque es importante que lo sepa. Freedom Forever, la empresa que le instaló las placas, entró en quiebra — lo que significa que ya no existe como compañía operativa. Eso deja su sistema sin garantías activas y sin soporte técnico. Si hoy falla el inversor, el monitoreo o cualquier componente, no habría a quién recurrir. Usted invirtió demasiado como para quedarse sin respaldo."',
        caution: 'La pregunta es clave: genera conciencia y convierte el monólogo en conversación. Escucha la respuesta antes de continuar.',
      },
      {
        id: '3',
        title: '3 · Propuesta de valor',
        subtitle: 'La cita como solución — sin vender productos',
        content: '"Lo que queremos hacer es enviar a uno de nuestros consultores certificados directamente a su casa — sin costo, sin compromiso.\n\nÉl va a revisar el estado actual de su sistema, verificar que todo esté funcionando como debe, y explicarle con claridad cuáles son sus opciones según lo que encuentre.\n\nLa visita es simplemente para que usted sepa exactamente cómo está su sistema y tenga una empresa real que lo respalde."',
        caution: 'No menciones productos en la llamada. Las soluciones las presenta el consultor en la visita.',
      },
      {
        id: '4',
        title: '4 · Cierre de cita',
        subtitle: 'Dos técnicas de cierre',
        content: 'CIERRE A — DOBLE ALTERNATIVA\n"Para coordinar la visita, ¿qué le queda mejor — mañana a las 10 am o mejor en la tarde a las 4 pm?"\n\nCIERRE B — URGENCIA REAL\n"Tenemos un consultor cubriendo su área esta semana y los espacios se están llenando rápido. Quiero asegurarle su lugar — ¿qué día de esta semana es el mejor para usted?"',
        caution: 'Al confirmar: nombre completo · dirección exacta · teléfono · horario preferido. Repite todos los datos en voz alta antes de colgar.',
      },
      {
        id: '5',
        title: '5 · Cierre final',
        subtitle: 'Confirmación y despedida',
        content: '"Perfecto, [nombre del titular]. Queda confirmada su visita el [dia] en horas de la [horario] en [direccion].\n\nNuestro consultor le va a llamar el día anterior para confirmarle la hora exacta. Si necesita comunicarse con nosotros antes, con gusto le atendemos.\n\nFue un placer hablar con usted — y quédese tranquilo/a, con Windmar usted está en buenas manos."',
      },
    ],
    objections: [
      { id: 'o1', trigger: 'No me interesa', response: '"No le pido que compre nada. Solo 30 minutos para saber el estado real de un sistema que usted ya pagó. Si todo está bien, perfecto — pero mejor saberlo antes de que sea un problema mayor."' },
      { id: 'o2', trigger: 'No tengo dinero', response: '"La visita no tiene ningún costo — nada que firmar, nada que pagar. Nuestro consultor va, revisa y le da un panorama completo. Lo que decida después es totalmente su decisión."' },
      { id: 'o3', trigger: 'Mi sistema está bien', response: '"Me alegra. Pero con Freedom Forever fuera del mercado, si mañana falla algo — inversor, monitoreo, garantía — ya no hay a quién llamar. La visita es para tener respaldo antes de necesitarlo."' },
      { id: 'o4', trigger: '¿Son legítimos?', response: '"Windmar lleva más de 15 años en Florida — búsquenos en Google ahora mismo. Nuestro consultor llega con identificación completa. Queremos ganarnos su confianza, no dársela por sentada."' },
    ],
  },
  {
    id: 'retencion-closed-lost',
    name: 'Retención — Closed Lost',
    campaign: 'Retención Mar–Abr 2026',
    type: 'retention',
    steps: [],
    objections: [],
  },
];

/* ──────────────────────────── App root ───────────────────────────────────── */

export default function App() {
  const [activeMode, setActiveMode] = useState<'agent' | 'manager'>('agent');
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [speechToEdit, setSpeechToEdit] = useState<Speech | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('windmar_dark') === 'true');

  useEffect(() => {
    localStorage.setItem('windmar_dark', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('windmar_speeches');
      if (saved) {
        const parsed: Speech[] = JSON.parse(saved);
        const hasRetention = parsed.some(s => s.id === 'retencion-closed-lost');
        if (!hasRetention) parsed.push(DEFAULT_SPEECHES[1]);
        setSpeeches(parsed);
      } else {
        setSpeeches(DEFAULT_SPEECHES);
        localStorage.setItem('windmar_speeches', JSON.stringify(DEFAULT_SPEECHES));
      }
    } catch {
      setSpeeches(DEFAULT_SPEECHES);
      localStorage.setItem('windmar_speeches', JSON.stringify(DEFAULT_SPEECHES));
    }
    setIsLoaded(true);
  }, []);

  const updateSpeeches = (newSpeeches: Speech[]) => {
    setSpeeches(newSpeeches);
    localStorage.setItem('windmar_speeches', JSON.stringify(newSpeeches));
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
          <p className="text-wh-grey font-bold animate-pulse uppercase tracking-widest text-xs">Cargando Windmar Console...</p>
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
          <p className="text-[10px] text-wh-grey font-bold tracking-wide uppercase tracking-[0.15em]">Florida Call Center</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <motion.button
            onClick={() => setDarkMode(d => !d)}
            whileTap={{ scale: 0.9 }}
            className="relative w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-wh-grey dark:text-slate-300 hover:border-wh-blue/40 dark:hover:border-wh-blue/40 hover:text-wh-blue dark:hover:text-wh-blue transition-all"
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
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
              Modo Asesor
            </button>
            <button
              onClick={() => setActiveMode('manager')}
              className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeMode === 'manager'
                  ? 'bg-white dark:bg-slate-700 text-wh-blue shadow-md'
                  : 'text-wh-grey hover:text-wh-black dark:hover:text-slate-200'
              }`}
            >
              Líder Comercial
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
  const [selectedSpeechId, setSelectedSpeechId] = useState(speeches[0]?.id || '');
  const [variables, setVariables] = useState<Record<string, string>>({
    'nombre del titular': '', 'nombre del asesor': '', ciudad: '', direccion: '', dia: '', horario: '',
  });
  const [showObjections, setShowObjections] = useState(false);

  useEffect(() => {
    if (!selectedSpeechId && speeches.length > 0) setSelectedSpeechId(speeches[0].id);
  }, [speeches, selectedSpeechId]);

  const selectedSpeech = speeches.find(s => s.id === selectedSpeechId);
  const isRetention = selectedSpeech?.type === 'retention';

  const replaceVariables = (text: string) => {
    let t = text;
    (Object.entries(variables) as [string, string][]).forEach(([key, value]) => {
      const replacement = value || `[${key}]`;
      t = t.replace(new RegExp(`\\[${key}\\]`, 'gi'), replacement);
    });
    return t;
  };

  if (!selectedSpeech) return <div>No hay guiones disponibles.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left column */}
      <div className={`${isRetention ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-6`}>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-wh-black mb-2 flex items-center gap-2 uppercase tracking-wider">
              <FileText size={16} className="text-wh-blue" /> Seleccionar Estrategia
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
                <User size={16} className="text-wh-blue" /> Datos de la llamada
              </h3>
              <div className="grid gap-3">
                <div>
                  <label className="text-[10px] font-bold text-wh-grey uppercase ml-1">Nombre del Titular</label>
                  <input type="text" placeholder="Ej: Juan Perez" value={variables['nombre del titular']}
                    onChange={e => setVariables({ ...variables, 'nombre del titular': e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-wh-grey uppercase ml-1">Tu Nombre</label>
                    <input type="text" placeholder="Tu nombre" value={variables['nombre del asesor']}
                      onChange={e => setVariables({ ...variables, 'nombre del asesor': e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-wh-grey uppercase ml-1">Ciudad</label>
                    <input type="text" placeholder="Ej: Orlando" value={variables['ciudad']}
                      onChange={e => setVariables({ ...variables, ciudad: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {isRetention && (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider mb-1">Campaña activa</p>
                <p className="text-sm font-bold text-emerald-800">Closed Lost · Mar–Abr 2026</p>
                <p className="text-xs text-emerald-700 mt-2 leading-relaxed">
                  Guía con checklist de Zoho, script de apertura v4, rebates por motivo y cierre de cita.
                </p>
              </div>
              <div className="flex items-center gap-2 p-3 bg-wh-blue/5 rounded-xl border border-wh-blue/15">
                <ClipboardList size={15} className="text-wh-blue shrink-0" />
                <p className="text-xs text-wh-blue font-semibold">Completa el Pre-llamada antes de marcar</p>
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
              <MessageSquare size={18} /> Manejo de Objeciones
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
                <h4 className="text-sm font-bold text-wh-orange uppercase tracking-wide">Objeciones Comunes</h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const text = selectedSpeech.objections.map(o => `CLIENTE: ${o.trigger}\nRESPUESTA: ${o.response}`).join('\n\n');
                      navigator.clipboard.writeText(text).catch(() => {});
                    }}
                    className="flex items-center gap-1.5 px-2 py-1 bg-wh-orange/10 text-wh-orange text-[10px] font-bold rounded-md hover:bg-wh-orange/20 transition-all border border-wh-orange/20"
                  >
                    <Copy size={12} /> COPIAR TODO
                  </button>
                  <div className="bg-wh-orange/20 text-wh-orange p-1 rounded-md"><AlertCircle size={14} /></div>
                </div>
              </div>
              <div className="space-y-3">
                {selectedSpeech.objections.map(obj => (
                  <div key={obj.id} className="group">
                    <p className="text-[10px] font-bold text-wh-black opacity-50 uppercase mb-1">Si dice: "{obj.trigger}"</p>
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
                        <Pencil size={14} /> Editar
                      </button>
                    )}
                    <button onClick={() => navigator.clipboard.writeText(replaceVariables(step.content)).catch(() => {})}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-all flex items-center gap-2 text-xs font-semibold">
                      <Copy size={14} /> Copiar
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

const RETENTION_TABS: { id: RetentionTab; label: string; Icon: React.ElementType }[] = [
  { id: 'preCall',     label: 'Pre-llamada', Icon: ClipboardList },
  { id: 'apertura',   label: 'Apertura',    Icon: Phone         },
  { id: 'objeciones', label: 'Rebates',     Icon: ShieldCheck   },
  { id: 'cierre',     label: 'Cierre',      Icon: CalendarCheck },
];

function RetentionSpeechView() {
  const [activeTab, setActiveTab] = useState<RetentionTab>('preCall');
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [activeRebate, setActiveRebate] = useState('economico');

  const toggleCheck = (id: string) =>
    setChecked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const totalItems = RETENTION_CHECKLISTS.reduce((s, g) => s + g.items.length, 0);
  const progress = Math.round((checked.size / totalItems) * 100);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-wh-darkblue rounded-2xl p-5 text-white flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-1">Speech de Retención · v4</p>
          <h2 className="text-lg font-bold">Flujo directo sin pausas</h2>
          <p className="text-xs text-white/70 mt-1">Primero el cliente, después la empresa. Un solo objetivo: lograr el primer micro-sí.</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-bold text-white/60 uppercase mb-1">Pre-llamada</p>
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
          {activeTab === 'preCall'     && <RetentionPreCallTab    checked={checked} onToggle={toggleCheck} />}
          {activeTab === 'apertura'   && <RetentionAperturaTab   />}
          {activeTab === 'objeciones' && <RetentionObjecionesTab activeRebate={activeRebate} onSelect={setActiveRebate} />}
          {activeTab === 'cierre'     && <RetentionCierreTab     />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Pre-llamada ─────────────────────────────────────────────────────────── */

function RetentionPreCallTab({ checked, onToggle }: { checked: Set<string>; onToggle: (id: string) => void }) {
  return (
    <div className="space-y-4">
      {RETENTION_CHECKLISTS.map(group => (
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
          Señales de alerta — verificar antes de llamar
        </p>
        <div className="space-y-3">
          {RETENTION_WARNINGS.map((w, i) => (
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
  const copy = (text: string) => navigator.clipboard.writeText(text).catch(() => {});

  const parte1Script = `"Buenos días/tardes, ¿podría hablar con [Nombre]?

…[Nombre], qué gusto. Mi nombre es [Tu nombre], le llamo de parte de Windmar Home.

Me comunico con usted para asegurarme personalmente de que fue bien atendido y recibió un buen servicio de parte de nuestra compañía.

¿Me puede hablar de su experiencia? ¿Me puede compartir cómo fue su proceso?"`;

  const parte2Script = `"Gracias por compartirlo conmigo. Entiendo que el proceso no pudo continuar en su momento, y quería confirmar si ha habido algún cambio en su situación o si le quedó alguna duda sin respuesta."`;

  const listeningPhrases = [
    '"Entiendo perfectamente, eso tiene mucho sentido…"',
    '"Gracias por contarme eso, es muy importante saberlo…"',
    '"¿Y aparte de eso, hubo algún otro aspecto que le generó duda?"',
    '"Le escucho. Precisamente por eso le llamamos hoy…"',
  ];

  return (
    <div className="space-y-5">

      {/* Info estratégica */}
      <div className="flex items-start gap-3 p-4 bg-wh-blue/5 rounded-2xl border border-wh-blue/20">
        <AlertCircle size={16} className="text-wh-blue mt-0.5 shrink-0" />
        <p className="text-sm text-wh-blue leading-relaxed">
          <strong>Principio de la apertura:</strong> Hacer una pausa después del saludo y dejar que el cliente cuente su experiencia. Esto le da la oportunidad de expresarse — mientras habla, el asesor toma nota indirectamente de sus preocupaciones para luego entrar a la parte de recuperar o retener.
        </p>
      </div>

      {/* Fase 1 — Saludo + pregunta de experiencia */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 overflow-hidden">
        <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg">Fase 1</span>
            <div>
              <h3 className="font-bold text-emerald-900">Saludo + pregunta de experiencia</h3>
              <p className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">Representante de retención</p>
            </div>
          </div>
          <button onClick={() => copy(parte1Script)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all">
            <Copy size={12} /> Copiar
          </button>
        </div>
        <div className="p-6">
          <div className="border-l-4 border-emerald-400 bg-emerald-50/40 rounded-r-2xl px-5 py-4">
            <p className="text-sm leading-loose text-emerald-900 italic whitespace-pre-line font-medium">{parte1Script}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {['🎙 Tono cálido y seguro', '🚫 Sin mencionar cancelación directamente', '⏸ Pausa intencional después de preguntar'].map(p => (
              <span key={p} className="text-[11px] px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-wh-grey font-medium">{p}</span>
            ))}
          </div>
          <div className="mt-5 border-t border-slate-100 pt-5 space-y-3">
            <p className="text-[10px] font-black text-wh-blue uppercase tracking-widest">Por qué funciona así</p>
            {[
              { n: '1', text: '"Me comunico para asegurarme de que fue bien atendido" — el cliente no siente que lo llaman a venderle. Transmite atención individual.' },
              { n: '2', text: 'Preguntar por su experiencia abre la conversación: el cliente habla, el asesor escucha y toma nota mental de sus preocupaciones reales.' },
              { n: '3', text: 'Dejar que responda permite identificar el motivo real — que puede diferir del registrado en el CRM.' },
            ].map(item => (
              <div key={item.n} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[11px] font-bold text-wh-grey shrink-0 mt-0.5">{item.n}</span>
                <p className="text-sm text-wh-black leading-relaxed">{item.text}</p>
              </div>
            ))}
            <p className="text-xs text-wh-grey italic mt-2">
              Si atiende otra persona: <em className="font-medium">"¿Podría indicarme el mejor momento para hablar con él/ella? Es una llamada breve de seguimiento de Windmar Home."</em>
            </p>
          </div>
        </div>
      </div>

      {/* Pausa — Dejar que responda */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <ChevronRight size={24} className="rotate-90 text-slate-300" />
          <div className="flex items-center gap-3 px-6 py-3 bg-wh-darkblue rounded-2xl border border-wh-darkblue/80 shadow-md">
            <span className="text-lg">⏸</span>
            <div>
              <p className="text-white font-black text-sm tracking-wide">DEJAR QUE RESPONDA</p>
              <p className="text-white/70 text-[10px] font-medium">Escuchar sin interrumpir · Tomar nota de las preocupaciones</p>
            </div>
          </div>
          <ChevronRight size={24} className="rotate-90 text-slate-300" />
        </div>
      </div>

      {/* Fase 2 — Respuesta después de escuchar */}
      <div className="bg-white rounded-2xl shadow-sm border border-wh-blue/30 overflow-hidden">
        <div className="p-4 bg-wh-blue/5 border-b border-wh-blue/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-wh-blue text-white text-[11px] font-bold rounded-lg">Fase 2</span>
            <div>
              <h3 className="font-bold text-wh-darkblue">Acuse + pivote a situación actual</h3>
              <p className="text-[10px] text-wh-grey font-semibold uppercase tracking-wider">Representante de retención · después de escuchar</p>
            </div>
          </div>
          <button onClick={() => copy(parte2Script)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-wh-blue text-white text-xs font-bold rounded-lg hover:bg-wh-darkblue transition-all">
            <Copy size={12} /> Copiar
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="border-l-4 border-wh-blue bg-slate-50 rounded-r-2xl px-5 py-4">
            <p className="text-sm leading-loose text-wh-black italic font-medium">{parte2Script}</p>
          </div>
          <p className="text-xs text-wh-grey">Con esta frase se reconoce lo que dijo el cliente, se valida su situación y se abre la puerta para detectar si algo cambió o si quedó una duda sin resolver — sin presionar.</p>
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <p className="text-[10px] font-black text-wh-blue uppercase tracking-widest mb-3">Frases de escucha activa — durante la conversación</p>
            {listeningPhrases.map((frase, i) => (
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
          <p className="font-bold text-wh-darkblue text-sm">Motivo identificado →</p>
          <p className="text-xs text-wh-grey mt-1">Con lo que expresó el cliente, aplica el rebate correspondiente en la pestaña siguiente. El posicionamiento de marca no va aquí — va al cierre.</p>
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
  const rebate = RETENTION_REBATES.find(r => r.id === activeRebate)!;
  const copy = (text: string) => navigator.clipboard.writeText(text).catch(() => {});

  return (
    <div className="space-y-5">
      <p className="text-xs text-wh-grey font-semibold">Selecciona el motivo real que expresó el cliente:</p>

      <div className="flex flex-wrap gap-2">
        {RETENTION_REBATES.map(r => (
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
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-3">Cierre sugerido</p>
                <div className="border-l-4 border-emerald-400 bg-emerald-50/40 rounded-r-2xl px-5 py-4 flex items-start justify-between gap-4">
                  <p className="text-sm leading-loose text-emerald-900 italic font-medium flex-1">{rebate.closing}</p>
                  <button onClick={() => copy(rebate.closing)} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all shrink-0" title="Copiar cierre">
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
  const copy = (text: string) => navigator.clipboard.writeText(text).catch(() => {});

  const brandScript = `"Le cuento que Windmar lleva más de 15 años aquí en Florida, y lo que más valoran nuestros clientes no es la instalación en sí — es que no desaparecemos después. Garantías de producción reales, mantenimiento incluido y un equipo local que responde cuando lo necesita.

Por eso vale la pena que hable 20 minutos con nuestro especialista."`;

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-4 bg-wh-blue/5 rounded-2xl border border-wh-blue/20">
        <AlertCircle size={16} className="text-wh-blue mt-0.5 shrink-0" />
        <p className="text-sm text-wh-blue font-semibold">
          <strong>Aquí va el posicionamiento de marca.</strong> El cliente ya escuchó el rebate y mostró apertura. Ahora las garantías y los 15 años cierran — no abren.
        </p>
      </div>

      {/* Brand bridge */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg">Puente marca → cita</span>
            <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-[10px] font-bold rounded">reubicado v3</span>
          </div>
          <button onClick={() => copy(brandScript)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-wh-blue text-white text-xs font-bold rounded-lg hover:bg-wh-darkblue transition-all">
            <Copy size={12} /> Copiar
          </button>
        </div>
        <div className="p-6">
          <p className="text-xs text-wh-grey mb-4">Usar justo antes de ofrecer la cita, cuando el cliente ya mostró interés:</p>
          <div className="border-l-4 border-violet-400 bg-violet-50/30 rounded-r-2xl px-5 py-4">
            <p className="text-sm leading-loose text-violet-900 italic font-medium whitespace-pre-line">{brandScript}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {['⏱ Aprox. 15 seg', '✓ Solo cuando hay apertura', '→ Fluye directo al cierre'].map(p => (
              <span key={p} className="text-[11px] px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-wh-grey font-medium">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Double alternative */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg">Cierre</span>
            <h3 className="font-bold text-wh-darkblue">Doble alternativa — nunca "sí o no"</h3>
          </div>
          <button onClick={() => copy('"¿Le viene mejor una cita el martes por la mañana o prefiere el jueves por la tarde?"')}
            className="p-2 text-slate-400 hover:text-wh-blue rounded-lg transition-all"><Copy size={14} /></button>
        </div>
        <div className="p-6">
          <div className="border-l-4 border-wh-blue bg-slate-50 rounded-r-2xl px-5 py-4">
            <p className="text-sm leading-loose text-wh-black italic font-medium">
              "¿Le viene mejor una cita el <strong>martes por la mañana</strong> o prefiere el <strong>jueves por la tarde</strong>?"
            </p>
          </div>
          <p className="text-xs text-wh-grey mt-3">Nunca preguntar "¿Le gustaría una cita?" — da opción de decir no. Siempre dos opciones concretas.</p>
        </div>
      </div>

      {/* Think about it */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-amber-50 border-b border-amber-100">
          <span className="px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 text-[11px] font-bold rounded-lg">"Tengo que pensarlo"</span>
        </div>
        <div className="p-6">
          <div className="border-l-4 border-amber-400 bg-amber-50/40 rounded-r-2xl px-5 py-4">
            <p className="text-sm leading-loose text-amber-900 italic font-medium">
              "Claro, es una decisión importante. ¿Qué es específicamente lo que necesita pensar? A veces con la información correcta se aclara todo en la misma llamada."
            </p>
          </div>
          <p className="text-xs text-wh-grey mt-3">Objetivo: identificar la objeción real detrás del "me lo pienso" y atenderla antes de colgar.</p>
        </div>
      </div>

      {/* Accepted appointment */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 overflow-hidden">
        <div className="p-4 bg-emerald-50 border-b border-emerald-100">
          <span className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg">Si el cliente acepta la cita</span>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {[
              'Confirmar nombre, dirección y teléfono de contacto.',
              'Informar nombre del consultor que visitará si ya está asignado.',
              'Avisar que recibirá confirmación por mensaje de texto.',
              'Registrar en Zoho: actualizar Deal, cambiar status y agregar nota detallada.',
            ].map((s, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-sm text-wh-black leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
          <div className="border-l-4 border-emerald-400 bg-emerald-50/40 rounded-r-2xl px-5 py-4">
            <p className="text-sm leading-loose text-emerald-900 italic font-medium">
              "Perfecto, [Nombre]. Queda agendada su cita para el [día y hora]. Le llegará un mensaje de confirmación. Fue un placer hablar con usted, ¡hasta pronto!"
            </p>
          </div>
        </div>
      </div>

      {/* Hard rejection */}
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
        <div className="p-4 bg-red-50 border-b border-red-100">
          <span className="px-3 py-1 bg-red-600 text-white text-[11px] font-bold rounded-lg">Si el cliente rechaza definitivamente</span>
        </div>
        <div className="p-6 space-y-3">
          {[
            { t: 'Nunca discutir', c: '"Está bien, lo respeto completamente."' },
            { t: 'Puerta abierta', c: '"Si en algún momento su situación cambia, no dude en contactarnos. Seguiremos aquí."' },
            { t: 'Registrar en Zoho', c: 'Motivo detallado. Marcar para no volver a contactar si lo solicitó.' },
          ].map((item, i) => (
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
          Nota obligatoria en Zoho — cada llamada
        </p>
        <p className="text-xs text-wh-grey mb-4">Documentar siempre, incluso si no hubo respuesta:</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { l: 'Resultado',            v: 'Contactó / No contestó / Buzón' },
            { l: 'Motivo real expresado', v: 'Lo que dijo el cliente'         },
            { l: 'Próxima acción',        v: 'Cita / Callback / Descartar'    },
            { l: 'Fecha próximo intento', v: 'DD/MM/YYYY'                     },
          ].map(f => (
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
  const [editingSpeech, setEditingSpeech] = useState<Speech | null>(initialEditSpeech || null);
  const [previewSpeech, setPreviewSpeech] = useState<Speech | null>(null);

  useEffect(() => {
    if (initialEditSpeech) setEditingSpeech(initialEditSpeech);
  }, [initialEditSpeech]);

  const handleClose = () => { setEditingSpeech(null); if (onEditHandled) onEditHandled(); };

  const handleDelete = (id: string) => {
    if (id === 'retencion-closed-lost') return;
    if (confirm('¿Estás seguro de eliminar este guion?')) onUpdate(speeches.filter(s => s.id !== id));
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
    id: Date.now().toString(), name: 'Nuevo Guion', campaign: 'General',
    steps: [{ id: '1', title: 'Apertura', subtitle: 'Introducción del asesor', content: '"Hola [nombre del titular]..." ' }],
    objections: [],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-wh-darkblue">Tus Estrategias Comerciales</h2>
        <button onClick={createNew} className="bg-wh-blue text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
          <Plus size={20} /> Crear Nuevo Speach
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {speeches.map(s => {
          const isRetention = s.type === 'retention';
          return (
            <div key={s.id} className={`bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all space-y-4 ${isRetention ? 'border-emerald-200' : 'border-wh-lightblue/20'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-black uppercase text-white px-2 py-0.5 rounded ${isRetention ? 'bg-emerald-600' : 'bg-wh-blue'}`}>
                    {s.campaign}
                  </span>
                  <h3 className="text-lg font-bold text-wh-black mt-2">{s.name}</h3>
                  <p className="text-xs text-wh-grey font-bold uppercase tracking-widest">
                    {isRetention ? '4 Fases · Checklist + Rebates' : `${s.steps.length} Pasos · ${s.objections.length} Objeciones`}
                  </p>
                </div>
                <div className="flex gap-1 items-start">
                  {!isRetention && (
                    <>
                      <button onClick={() => setEditingSpeech(s)} className="p-2 text-wh-teslagrey hover:text-wh-blue hover:bg-slate-100 rounded-lg transition-all">
                        <Settings size={18} />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="p-2 text-wh-teslagrey hover:text-red-500 hover:bg-slate-100 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                  {isRetention && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg">Guía interactiva</span>
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
                Ver Estructura
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
                    <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">Guía Interactiva — 4 Fases</h4>
                    {[
                      { icon: '📋', title: 'Pre-llamada',  desc: 'Checklist de Zoho CRM + señales de alerta antes de marcar.' },
                      { icon: '📞', title: 'Apertura v4',  desc: 'Flujo directo sin pausas. Saludo, propósito empático y sondeo.' },
                      { icon: '🛡', title: 'Rebates',      desc: '8 motivos de Closed Lost con pasos y cierre sugerido.' },
                      { icon: '📅', title: 'Cierre',       desc: 'Posicionamiento de marca, doble alternativa y manejo del "me lo pienso".' },
                    ].map((phase, i) => (
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
                      <h4 className="text-xs font-black text-wh-blue uppercase tracking-widest border-l-4 border-wh-blue pl-3">Pasos del Guion</h4>
                      {previewSpeech.steps.map((step, i) => (
                        <div key={step.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-bold text-wh-blue uppercase mb-1">Paso {i + 1}: {step.title}</p>
                          <p className="text-sm text-wh-black font-medium leading-relaxed italic opacity-80 line-clamp-3">{step.content}</p>
                        </div>
                      ))}
                    </div>
                    {previewSpeech.objections.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-wh-orange uppercase tracking-widest border-l-4 border-wh-orange pl-3">Objeciones Gestionadas</h4>
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
                {previewSpeech.type !== 'retention' ? (
                  <button onClick={() => { setEditingSpeech(previewSpeech); setPreviewSpeech(null); }}
                    className="px-8 py-2 bg-wh-blue text-white rounded-xl font-bold text-sm shadow-md flex items-center gap-2">
                    <Pencil size={14} /> Editar esta estructura
                  </button>
                ) : (
                  <button onClick={() => setPreviewSpeech(null)} className="px-8 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md">
                    Cerrar
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
                <h3 className="text-xl font-bold">Editar Estrategia: {editingSpeech.name}</h3>
                <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-all"><X size={24} /></button>
              </div>
              <form onSubmit={handleSave} className="overflow-y-auto p-8 space-y-8 flex-grow">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nombre del Guion</label>
                    <input type="text" value={editingSpeech.name} onChange={e => setEditingSpeech({ ...editingSpeech, name: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none" placeholder="Ej: Campaña Mayo" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Campaña / Tags</label>
                    <input type="text" value={editingSpeech.campaign} onChange={e => setEditingSpeech({ ...editingSpeech, campaign: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none" placeholder="Ej: Florida Solar" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-wh-blue">Pasos del Guion</h4>
                    <button type="button"
                      onClick={() => setEditingSpeech({ ...editingSpeech, steps: [...editingSpeech.steps, { id: Date.now().toString(), title: `Paso ${editingSpeech.steps.length + 1}`, subtitle: '', content: '' }] })}
                      className="text-xs font-bold bg-wh-blue/10 text-wh-blue px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Plus size={14} /> Añadir Paso
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
                            onChange={e => { const ns = [...editingSpeech.steps]; ns[idx].title = e.target.value; setEditingSpeech({ ...editingSpeech, steps: ns }); }}
                            className="p-2 border-b border-wh-lightblue/30 focus:border-wh-blue transition-all outline-none font-bold text-sm text-wh-darkblue" placeholder="Título del Paso" />
                          <input type="text" value={step.subtitle}
                            onChange={e => { const ns = [...editingSpeech.steps]; ns[idx].subtitle = e.target.value; setEditingSpeech({ ...editingSpeech, steps: ns }); }}
                            className="p-2 border-b border-wh-lightblue/30 focus:border-wh-blue transition-all outline-none text-sm text-wh-grey font-medium" placeholder="Propósito / Subtítulo" />
                        </div>
                        <textarea value={step.content}
                          onChange={e => { const ns = [...editingSpeech.steps]; ns[idx].content = e.target.value; setEditingSpeech({ ...editingSpeech, steps: ns }); }}
                          rows={4} className="w-full p-4 bg-slate-50 rounded-xl text-wh-black text-sm focus:ring-2 focus:ring-wh-blue outline-none border border-transparent"
                          placeholder='Usa [variable] para insertar campos dinámicos.' />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-wh-orange">Manejo de Objeciones</h4>
                    <button type="button"
                      onClick={() => setEditingSpeech({ ...editingSpeech, objections: [...editingSpeech.objections, { id: Date.now().toString(), trigger: '', response: '' }] })}
                      className="text-xs font-bold bg-wh-orange/10 text-wh-orange px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-wh-orange/20 transition-all">
                      <Plus size={14} /> Añadir Objeción
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
                            onChange={e => { const no = [...editingSpeech.objections]; no[idx].trigger = e.target.value; setEditingSpeech({ ...editingSpeech, objections: no }); }}
                            className="w-full p-2 bg-white border border-wh-orange/20 rounded-lg text-sm font-bold text-wh-orange outline-none focus:ring-1 focus:ring-wh-orange"
                            placeholder="Lo que dice el cliente (ej: No tengo dinero)" />
                          <textarea value={obj.response}
                            onChange={e => { const no = [...editingSpeech.objections]; no[idx].response = e.target.value; setEditingSpeech({ ...editingSpeech, objections: no }); }}
                            rows={2} className="w-full p-3 bg-white border border-wh-orange/20 rounded-lg text-wh-black text-sm outline-none focus:ring-1 focus:ring-wh-orange"
                            placeholder="Tu respuesta sugerida..." />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={handleClose} className="px-6 py-2.5 rounded-xl font-bold text-wh-grey hover:bg-slate-200 transition-all">Cancelar</button>
                <button onClick={handleSave} className="px-8 py-2.5 bg-wh-blue text-white rounded-xl font-bold shadow-lg shadow-wh-blue/20 flex items-center gap-2">
                  <Save size={18} /> Guardar Estrategia
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
