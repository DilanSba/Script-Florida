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
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
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
  steps: SpeechStep[];
  objections: {
    id: string;
    trigger: string;
    response: string;
  }[];
}

// Constants
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
        caution: 'La pregunta es clave: genera conciencia y convierte el monólogo en conversación. Escucha la respuesta antes de continuar.'
      },
      {
        id: '3',
        title: '3 · Propuesta de valor',
        subtitle: 'La cita como solución — sin vender productos',
        content: '"Lo que queremos hacer es enviar a uno de nuestros consultores certificados directamente a su casa — sin costo, sin compromiso.\n\nÉl va a revisar el estado actual de su sistema, verificar que todo esté funcionando como debe, y explicarle con claridad cuáles son sus opciones según lo que encuentre.\n\nLa visita es simplemente para que usted sepa exactamente cómo está su sistema y tenga una empresa real que lo respalde."',
        caution: 'No menciones productos en la llamada. Las soluciones las presenta el consultor en la visita.'
      },
      {
        id: '4',
        title: '4 · Cierre de cita',
        subtitle: 'Dos técnicas de cierre',
        content: 'CIERRE A — DOBLE ALTERNATIVA\n"Para coordinar la visita, ¿qué le queda mejor — mañana a las 10 am o mejor en la tarde a las 4 pm?"\n\nCIERRE B — URGENCIA REAL\n"Tenemos un consultor cubriendo su área esta semana y los espacios se están llenando rápido. Quiero asegurarle su lugar — ¿qué día de esta semana es el mejor para usted?"',
        caution: 'Al confirmar: nombre completo · dirección exacta · teléfono · horario preferido. Repite todos los datos en voz alta antes de colgar.'
      },
      {
        id: '5',
        title: '5 · Cierre final',
        subtitle: 'Confirmación y despedida',
        content: '"Perfecto, [nombre del titular]. Queda confirmada su visita el [dia] en horas de la [horario] en [direccion].\n\nNuestro consultor le va a llamar el día anterior para confirmarle la hora exacta. Si necesita comunicarse con nosotros antes, con gusto le atendemos.\n\nFue un placer hablar con usted — y quédese tranquilo/a, con Windmar usted está en buenas manos."',
      }
    ],
    objections: [
      { id: 'o1', trigger: 'No me interesa', response: '"No le pido que compre nada. Solo 30 minutos para saber el estado real de un sistema que usted ya pagó. Si todo está bien, perfecto — pero mejor saberlo antes de que sea un problema mayor."' },
      { id: 'o2', trigger: 'No tengo dinero', response: '"La visita no tiene ningún costo — nada que firmar, nada que pagar. Nuestro consultor va, revisa y le da un panorama completo. Lo que decida después es totalmente su decisión."' },
      { id: 'o3', trigger: 'Mi sistema está bien', response: '"Me alegra. Pero con Freedom Forever fuera del mercado, si mañana falla algo — inversor, monitoreo, garantía — ya no hay a quién llamar. La visita es para tener respaldo antes de necesitarlo."' },
      { id: 'o4', trigger: '¿Son legítimos?', response: '"Windmar lleva más de 15 años en Florida — búsquenos en Google ahora mismo. Nuestro consultor llega con identificación completa. Queremos ganarnos su confianza, no dársela por sentada."' }
    ]
  }
];

export default function App() {
  const [activeMode, setActiveMode] = useState<'agent' | 'manager'>('agent');
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [speechToEdit, setSpeechToEdit] = useState<Speech | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('windmar_speeches');
      if (saved) {
        setSpeeches(JSON.parse(saved));
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-wh-blue/20 border-t-wh-blue rounded-full animate-spin"></div>
          <p className="text-wh-grey font-bold animate-pulse uppercase tracking-widest text-xs">Cargando Windmar Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Navigation */}
      <nav className="bg-white border-b border-wh-lightblue/30 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="https://i.postimg.cc/3NvQhzx3/Windmar-logo-FL.png"
            alt="Windmar Solar Florida"
            className="h-10 w-auto object-contain"
          />
          <p className="text-[10px] text-wh-grey font-bold tracking-wide uppercase tracking-[0.15em]">Florida Call Center</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
          <button
            onClick={() => setActiveMode('agent')}
            className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeMode === 'agent'
                ? 'bg-white text-wh-blue shadow-md border-transparent'
                : 'text-wh-grey hover:text-wh-black border-transparent'
            }`}
          >
            Modo Asesor
          </button>
          <button
            onClick={() => setActiveMode('manager')}
            className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeMode === 'manager'
                ? 'bg-white text-wh-blue shadow-md border-transparent'
                : 'text-wh-grey hover:text-wh-black border-transparent'
            }`}
          >
            Líder Comercial
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          {activeMode === 'agent' ? (
            <motion.div
              key="agent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AgentView
                speeches={speeches}
                onEditRequested={handleQuickEdit}
              />
            </motion.div>
          ) : (
            <motion.div
              key="manager"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
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

function AgentView({ speeches, onEditRequested }: { speeches: Speech[], onEditRequested?: (s: Speech) => void }) {
  const [selectedSpeechId, setSelectedSpeechId] = useState(speeches[0]?.id || '');
  const [variables, setVariables] = useState<Record<string, string>>({
    'nombre del titular': '',
    'nombre del asesor': '',
    'ciudad': '',
    'direccion': '',
    'dia': '',
    'horario': ''
  });
  const [showObjections, setShowObjections] = useState(false);

  useEffect(() => {
    if (!selectedSpeechId && speeches.length > 0) {
      setSelectedSpeechId(speeches[0].id);
    }
  }, [speeches, selectedSpeechId]);

  const selectedSpeech = speeches.find(s => s.id === selectedSpeechId);

  const replaceVariables = (text: string) => {
    let newText = text;
    Object.entries(variables).forEach(([key, value]) => {
      const displayValue = value || `[${key}]`;
      const regex = new RegExp(`\\[${key}\\]`, 'gi');
      newText = newText.replace(regex, displayValue);
    });
    return newText;
  };

  if (!selectedSpeech) return <div>No hay guiones disponibles.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Config */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-wh-black mb-2 flex items-center gap-2 uppercase tracking-wider">
              <FileText size={16} className="text-wh-blue" /> Seleccionar Estrategia
            </label>
            <select
              value={selectedSpeechId}
              onChange={(e) => setSelectedSpeechId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none text-wh-black font-semibold"
            >
              {speeches.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-wh-black flex items-center gap-2 uppercase tracking-wider">
              <User size={16} className="text-wh-blue" /> Datos de la llamada
            </h3>
            <div className="grid gap-3">
              <div>
                <label className="text-[10px] font-bold text-wh-grey uppercase ml-1">Nombre del Titular</label>
                <input
                  type="text"
                  placeholder="Ej: Juan Perez"
                  value={variables['nombre del titular']}
                  onChange={e => setVariables({...variables, 'nombre del titular': e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-wh-grey uppercase ml-1">Tu Nombre</label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={variables['nombre del asesor']}
                    onChange={e => setVariables({...variables, 'nombre del asesor': e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-wh-grey uppercase ml-1">Ciudad</label>
                  <input
                    type="text"
                    placeholder="Ej: Orlando"
                    value={variables['ciudad']}
                    onChange={e => setVariables({...variables, 'ciudad': e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowObjections(!showObjections)}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl ${
              showObjections ? 'bg-wh-orange/10 text-wh-orange border border-wh-orange/30' : 'bg-wh-blue text-white'
            }`}
          >
            <MessageSquare size={18} />
            Manejo de Objeciones
          </button>
        </div>

        {/* Floating Objections Panel */}
        <AnimatePresence>
          {showObjections && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-wh-orange/5 rounded-2xl border border-wh-orange/20 p-5 space-y-4 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-wh-orange uppercase tracking-wide">Objeciones Comunes</h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const text = selectedSpeech.objections.map(obj => `CLIENTE: ${obj.trigger}\nRESPUESTA: ${obj.response}`).join('\n\n');
                      navigator.clipboard.writeText(text).catch(() => {});
                    }}
                    className="flex items-center gap-1.5 px-2 py-1 bg-wh-orange/10 text-wh-orange text-[10px] font-bold rounded-md hover:bg-wh-orange/20 transition-all border border-wh-orange/20"
                    title="Copiar todas las objeciones"
                  >
                    <Copy size={12} />
                    COPIAR TODO
                  </button>
                  <div className="bg-wh-orange/20 text-wh-orange p-1 rounded-md">
                    <AlertCircle size={14} />
                  </div>
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

      {/* Right Column: Script Content */}
      <div className="lg:col-span-8 space-y-6">
        {selectedSpeech.steps.map((step, idx) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-wh-blue/10 text-wh-blue flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-wh-darkblue">{step.title}</h3>
                    <p className="text-xs text-wh-grey font-medium uppercase tracking-wider">{step.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onEditRequested && (
                    <button
                      onClick={() => onEditRequested(selectedSpeech)}
                      className="p-2 text-wh-grey hover:text-wh-blue hover:bg-wh-blue/5 rounded-lg transition-all flex items-center gap-2 text-xs font-semibold"
                      title="Editar esta estrategia"
                    >
                      <Pencil size={14} /> Editar
                    </button>
                  )}
                  <button
                    onClick={() => navigator.clipboard.writeText(replaceVariables(step.content)).catch(() => {})}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-all flex items-center gap-2 text-xs font-semibold"
                  >
                    <Copy size={14} /> Copiar
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="text-lg text-wh-black leading-relaxed whitespace-pre-wrap font-medium">
                  {replaceVariables(step.content).split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('(') ? 'text-wh-grey italic text-base mt-2' : 'mb-4'}>
                      {line}
                    </p>
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
        ))}
      </div>
    </div>
  );
}

function ManagerView({ speeches, onUpdate, initialEditSpeech, onEditHandled }: {
  speeches: Speech[],
  onUpdate: (s: Speech[]) => void,
  initialEditSpeech?: Speech | null,
  onEditHandled?: () => void
}) {
  const [editingSpeech, setEditingSpeech] = useState<Speech | null>(initialEditSpeech || null);
  const [previewSpeech, setPreviewSpeech] = useState<Speech | null>(null);

  useEffect(() => {
    if (initialEditSpeech) {
      setEditingSpeech(initialEditSpeech);
    }
  }, [initialEditSpeech]);

  const handleClose = () => {
    setEditingSpeech(null);
    if (onEditHandled) onEditHandled();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este guion?')) {
      onUpdate(speeches.filter(s => s.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpeech) return;

    const index = speeches.findIndex(s => s.id === editingSpeech.id);
    if (index > -1) {
      const newSpeeches = [...speeches];
      newSpeeches[index] = editingSpeech;
      onUpdate(newSpeeches);
    } else {
      onUpdate([...speeches, editingSpeech]);
    }
    handleClose();
  };

  const createNew = () => {
    setEditingSpeech({
      id: Date.now().toString(),
      name: 'Nuevo Guion',
      campaign: 'General',
      steps: [
        { id: '1', title: 'Apertura', subtitle: 'Introducción del asesor', content: '"Hola [nombre del titular]..." ' }
      ],
      objections: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-wh-darkblue">Tus Estrategias Comerciales</h2>
        <button
          onClick={createNew}
          className="bg-wh-blue text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={20} /> Crear Nuevo Speach
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {speeches.map(s => (
          <div key={s.id} className="bg-white p-6 rounded-2xl border border-wh-lightblue/20 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-white bg-wh-blue px-2 py-0.5 rounded ml-auto">
                  {s.campaign}
                </span>
                <h3 className="text-lg font-bold text-wh-black mt-2">{s.name}</h3>
                <p className="text-xs text-wh-grey font-bold uppercase tracking-widest">{s.steps.length} Pasos · {s.objections.length} Objeciones</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingSpeech(s)}
                  className="p-2 text-wh-teslagrey hover:text-wh-blue hover:bg-slate-100 rounded-lg transition-all"
                >
                  <Settings size={18} />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-2 text-wh-teslagrey hover:text-red-500 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <button
              onClick={() => setPreviewSpeech(s)}
              className="w-full py-2 text-sm font-bold text-wh-blue bg-white border border-wh-blue/20 rounded-xl hover:bg-wh-blue hover:text-white transition-all"
            >
              Ver Estructura
            </button>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewSpeech && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-lg font-bold text-wh-darkblue">{previewSpeech.name}</h3>
                  <p className="text-[10px] font-bold text-wh-grey uppercase tracking-widest">{previewSpeech.campaign}</p>
                </div>
                <button onClick={() => setPreviewSpeech(null)} className="p-2 hover:bg-slate-200 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-wh-blue uppercase tracking-widest border-l-4 border-wh-blue pl-3">Pasos del Guion</h4>
                  {previewSpeech.steps.map((step, i) => (
                    <div key={step.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-wh-blue uppercase mb-1">Paso {i+1}: {step.title}</p>
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
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                <button
                  onClick={() => {
                    setEditingSpeech(previewSpeech);
                    setPreviewSpeech(null);
                  }}
                  className="px-8 py-2 bg-wh-blue text-white rounded-xl font-bold text-sm shadow-md flex items-center gap-2"
                >
                  <Pencil size={14} /> Editar esta estructura
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingSpeech && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 className="text-xl font-bold">Editar Estrategia: {editingSpeech.name}</h3>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="overflow-y-auto p-8 space-y-8 flex-grow">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nombre del Guion</label>
                    <input
                      type="text"
                      value={editingSpeech.name}
                      onChange={e => setEditingSpeech({...editingSpeech, name: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none"
                      placeholder="Ej: Campaña Mayo"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Campaña / Tags</label>
                    <input
                      type="text"
                      value={editingSpeech.campaign}
                      onChange={e => setEditingSpeech({...editingSpeech, campaign: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wh-blue transition-all outline-none"
                      placeholder="Ej: Florida Solar"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-wh-blue">Pasos del Guion</h4>
                    <button
                      type="button"
                      onClick={() => setEditingSpeech({
                        ...editingSpeech,
                        steps: [...editingSpeech.steps, { id: Date.now().toString(), title: `Paso ${editingSpeech.steps.length+1}`, subtitle: '', content: '' }]
                      })}
                      className="text-xs font-bold bg-wh-blue/10 text-wh-blue px-3 py-1.5 rounded-full flex items-center gap-1"
                    >
                      <Plus size={14} /> Añadir Paso
                    </button>
                  </div>

                  <div className="space-y-6">
                    {editingSpeech.steps.map((step, idx) => (
                      <div key={step.id} className="relative p-6 border border-wh-lightblue/20 rounded-2xl bg-white shadow-sm group">
                        <button
                          type="button"
                          onClick={() => setEditingSpeech({
                            ...editingSpeech,
                            steps: editingSpeech.steps.filter(s => s.id !== step.id)
                          })}
                          className="absolute -top-2 -right-2 p-1.5 bg-white border border-slate-200 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <input
                            type="text"
                            value={step.title}
                            onChange={e => {
                              const newSteps = [...editingSpeech.steps];
                              newSteps[idx].title = e.target.value;
                              setEditingSpeech({...editingSpeech, steps: newSteps});
                            }}
                            className="p-2 border-b border-wh-lightblue/30 focus:border-wh-blue transition-all outline-none font-bold text-sm text-wh-darkblue"
                            placeholder="Título del Paso"
                          />
                          <input
                            type="text"
                            value={step.subtitle}
                            onChange={e => {
                              const newSteps = [...editingSpeech.steps];
                              newSteps[idx].subtitle = e.target.value;
                              setEditingSpeech({...editingSpeech, steps: newSteps});
                            }}
                            className="p-2 border-b border-wh-lightblue/30 focus:border-wh-blue transition-all outline-none text-sm text-wh-grey font-medium"
                            placeholder="Propósito / Subtítulo"
                          />
                        </div>
                        <textarea
                          value={step.content}
                          onChange={e => {
                            const newSteps = [...editingSpeech.steps];
                            newSteps[idx].content = e.target.value;
                            setEditingSpeech({...editingSpeech, steps: newSteps});
                          }}
                          rows={4}
                          className="w-full p-4 bg-slate-50 rounded-xl text-wh-black text-sm focus:ring-2 focus:ring-wh-blue outline-none border border-transparent focus:border-transparent"
                          placeholder='Usa [variable] para insertar campos dinámicos. Ej: "Hola [nombre]..." '
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-wh-orange">Manejo de Objeciones</h4>
                    <button
                      type="button"
                      onClick={() => setEditingSpeech({
                        ...editingSpeech,
                        objections: [...editingSpeech.objections, { id: Date.now().toString(), trigger: '', response: '' }]
                      })}
                      className="text-xs font-bold bg-wh-orange/10 text-wh-orange px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-wh-orange/20 transition-all"
                    >
                      <Plus size={14} /> Añadir Objeción
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {editingSpeech.objections.map((obj, idx) => (
                      <div key={obj.id} className="relative p-6 border border-wh-orange/10 rounded-2xl bg-wh-orange/5 group">
                        <button
                          type="button"
                          onClick={() => setEditingSpeech({
                            ...editingSpeech,
                            objections: editingSpeech.objections.filter(o => o.id !== obj.id)
                          })}
                          className="absolute -top-2 -right-2 p-1.5 bg-white border border-slate-200 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={obj.trigger}
                            onChange={e => {
                              const newObjs = [...editingSpeech.objections];
                              newObjs[idx].trigger = e.target.value;
                              setEditingSpeech({...editingSpeech, objections: newObjs});
                            }}
                            className="w-full p-2 bg-white border border-wh-orange/20 rounded-lg text-sm font-bold text-wh-orange outline-none focus:ring-1 focus:ring-wh-orange"
                            placeholder="Lo que dice el cliente (ej: No tengo dinero)"
                          />
                          <textarea
                            value={obj.response}
                            onChange={e => {
                              const newObjs = [...editingSpeech.objections];
                              newObjs[idx].response = e.target.value;
                              setEditingSpeech({...editingSpeech, objections: newObjs});
                            }}
                            rows={2}
                            className="w-full p-3 bg-white border border-wh-orange/20 rounded-lg text-wh-black text-sm outline-none focus:ring-1 focus:ring-wh-orange"
                            placeholder="Tu respuesta sugerida..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl font-bold text-wh-grey hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-2.5 bg-wh-blue text-white rounded-xl font-bold shadow-lg shadow-wh-blue/20 flex items-center gap-2"
                >
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
