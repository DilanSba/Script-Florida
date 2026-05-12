export type Lang = 'es' | 'en';

export const DEFAULT_SPEECH_IDS = ['freedom-forever', 'retencion-closed-lost'] as const;

/* ── UI labels ─────────────────────────────────────────────────────────────── */

export const UI = {
  es: {
    loading: 'Cargando Windmar Console...',
    headerSub: 'Florida Call Center',
    darkModeOn: 'Cambiar a modo claro',
    darkModeOff: 'Cambiar a modo oscuro',
    modeAgent: 'Modo Asesor',
    modeManager: 'Líder Comercial',
    selectStrategy: 'Seleccionar Estrategia',
    callData: 'Datos de la llamada',
    holderName: 'Nombre del Titular',
    yourName: 'Tu Nombre',
    city: 'Ciudad',
    holderPlaceholder: 'Ej: Juan Perez',
    yourNamePlaceholder: 'Tu nombre',
    cityPlaceholder: 'Ej: Orlando',
    objections: 'Manejo de Objeciones',
    commonObjections: 'Objeciones Comunes',
    copyAll: 'COPIAR TODO',
    copyBtn: 'Copiar',
    editBtn: 'Editar',
    noneAvailable: 'No hay guiones disponibles.',
    activeCampaign: 'Campaña activa',
    closedLostCampaign: 'Closed Lost · Mar–Abr 2026',
    retentionDesc:
      'Guía con checklist de Zoho, script de apertura v4, rebates por motivo y cierre de cita.',
    preCallReminder: 'Completa el Pre-llamada antes de marcar',
    ifClientSays: 'Si dice:',
    strategies: 'Tus Estrategias Comerciales',
    createNew: 'Crear Nuevo Speach',
    interactiveGuide: 'Guía interactiva',
    viewStructure: 'Ver Estructura',
    phases4: '4 Fases · Checklist + Rebates',
    editStrategy: 'Editar Estrategia:',
    speechName: 'Nombre del Guion',
    campaign: 'Campaña / Tags',
    speechNamePlaceholder: 'Ej: Campaña Mayo',
    campaignPlaceholder: 'Ej: Florida Solar',
    speechSteps: 'Pasos del Guion',
    addStep: 'Añadir Paso',
    stepTitlePlaceholder: 'Título del Paso',
    stepSubtitlePlaceholder: 'Propósito / Subtítulo',
    stepContentPlaceholder: 'Usa [variable] para insertar campos dinámicos.',
    objHandling: 'Manejo de Objeciones',
    addObj: 'Añadir Objeción',
    objTriggerPlaceholder: 'Lo que dice el cliente (ej: No tengo dinero)',
    objResponsePlaceholder: 'Tu respuesta sugerida...',
    cancel: 'Cancelar',
    save: 'Guardar Estrategia',
    guionSteps: 'Pasos del Guion',
    managedObj: 'Objeciones Gestionadas',
    interactive4phases: 'Guía Interactiva — 4 Fases',
    editStructure: 'Editar esta estructura',
    close: 'Cerrar',
    deleteConfirm: '¿Estás seguro de eliminar este guion?',
    newSpeechName: 'Nuevo Guion',
    newSpeechCampaign: 'General',
    newSpeechStep: 'Apertura',
    newSpeechStepSub: 'Introducción del asesor',
    newSpeechContent: '"Hola [nombre del titular]..." ',
    stepsLabel: 'Pasos',
    objCount: 'Objeciones',
    retentionV4: 'Speech de Retención · v4',
    retentionTitle: 'Flujo directo sin pausas',
    retentionSubtitle:
      'Primero el cliente, después la empresa. Un solo objetivo: lograr el primer micro-sí.',
    preCallProgress: 'Pre-llamada',
    alertsTitle: 'Señales de alerta — verificar antes de llamar',
    selectReason: 'Selecciona el motivo real que expresó el cliente:',
    suggestedClosing: 'Cierre sugerido',
    aperturaInfo:
      'Principio de la apertura: Hacer una pausa después del saludo y dejar que el cliente cuente su experiencia. Esto le da la oportunidad de expresarse — mientras habla, el asesor toma nota indirectamente de sus preocupaciones para luego entrar a la parte de recuperar o retener.',
    phase1Title: 'Saludo + pregunta de experiencia',
    phase1Sub: 'Representante de retención',
    whyItWorks: 'Por qué funciona así',
    phase1Why1:
      '"Me comunico para asegurarme de que fue bien atendido" — el cliente no siente que lo llaman a venderle. Transmite atención individual.',
    phase1Why2:
      'Preguntar por su experiencia abre la conversación: el cliente habla, el asesor escucha y toma nota mental de sus preocupaciones reales.',
    phase1Why3:
      'Dejar que responda permite identificar el motivo real — que puede diferir del registrado en el CRM.',
    phase1OtherPerson: 'Si atiende otra persona:',
    phase1OtherScript:
      '"¿Podría indicarme el mejor momento para hablar con él/ella? Es una llamada breve de seguimiento de Windmar Home."',
    waitLabel: 'DEJAR QUE RESPONDA',
    waitSub: 'Escuchar sin interrumpir · Tomar nota de las preocupaciones',
    phase2Title: 'Acuse + pivote a situación actual',
    phase2Sub: 'Representante de retención · después de escuchar',
    phase2Desc:
      'Con esta frase se reconoce lo que dijo el cliente, se valida su situación y se abre la puerta para detectar si algo cambió o si quedó una duda sin resolver — sin presionar.',
    activeListening: 'Frases de escucha activa — durante la conversación',
    motiveIdentified: 'Motivo identificado →',
    motiveDesc:
      'Con lo que expresó el cliente, aplica el rebate correspondiente en la pestaña siguiente. El posicionamiento de marca no va aquí — va al cierre.',
    cierreInfo:
      'Aquí va el posicionamiento de marca. El cliente ya escuchó el rebate y mostró apertura. Ahora las garantías y los 15 años cierran — no abren.',
    bridgeLabel: 'Puente marca → cita',
    bridgeRelocated: 'reubicado v3',
    bridgeDesc: 'Usar justo antes de ofrecer la cita, cuando el cliente ya mostró interés:',
    bridgeTips: ['⏱ Aprox. 15 seg', '✓ Solo cuando hay apertura', '→ Fluye directo al cierre'],
    doubleAltTitle: 'Doble alternativa — nunca "sí o no"',
    doubleAltScript:
      '"¿Le viene mejor una cita el <b>martes por la mañana</b> o prefiere el <b>jueves por la tarde</b>?"',
    doubleAltNote:
      'Nunca preguntar "¿Le gustaría una cita?" — da opción de decir no. Siempre dos opciones concretas.',
    thinkAboutLabel: '"Tengo que pensarlo"',
    thinkAboutScript:
      '"Claro, es una decisión importante. ¿Qué es específicamente lo que necesita pensar? A veces con la información correcta se aclara todo en la misma llamada."',
    thinkAboutNote:
      'Objetivo: identificar la objeción real detrás del "me lo pienso" y atenderla antes de colgar.',
    appointAccepted: 'Si el cliente acepta la cita',
    appointSteps: [
      'Confirmar nombre, dirección y teléfono de contacto.',
      'Informar nombre del consultor que visitará si ya está asignado.',
      'Avisar que recibirá confirmación por mensaje de texto.',
      'Registrar en Zoho: actualizar Deal, cambiar status y agregar nota detallada.',
    ],
    appointScript:
      '"Perfecto, [Nombre]. Queda agendada su cita para el [día y hora]. Le llegará un mensaje de confirmación. Fue un placer hablar con usted, ¡hasta pronto!"',
    hardReject: 'Si el cliente rechaza definitivamente',
    hardRejectSteps: [
      { t: 'Nunca discutir', c: '"Está bien, lo respeto completamente."' },
      { t: 'Puerta abierta', c: '"Si en algún momento su situación cambia, no dude en contactarnos. Seguiremos aquí."' },
      { t: 'Registrar en Zoho', c: 'Motivo detallado. Marcar para no volver a contactar si lo solicitó.' },
    ],
    zohoNote: 'Nota obligatoria en Zoho — cada llamada',
    zohoDesc: 'Documentar siempre, incluso si no hubo respuesta:',
    zohoFields: [
      { l: 'Resultado',             v: 'Contactó / No contestó / Buzón' },
      { l: 'Motivo real expresado', v: 'Lo que dijo el cliente'          },
      { l: 'Próxima acción',        v: 'Cita / Callback / Descartar'     },
      { l: 'Fecha próximo intento', v: 'DD/MM/YYYY'                      },
    ],
    previewPhases: [
      { icon: '📋', title: 'Pre-llamada',  desc: 'Checklist de Zoho CRM + señales de alerta antes de marcar.' },
      { icon: '📞', title: 'Apertura v4',  desc: 'Flujo directo sin pausas. Saludo, propósito empático y sondeo.' },
      { icon: '🛡',  title: 'Rebates',     desc: '8 motivos de Closed Lost con pasos y cierre sugerido.' },
      { icon: '📅', title: 'Cierre',       desc: 'Posicionamiento de marca, doble alternativa y manejo del "me lo pienso".' },
    ],
    tabLabels: {
      preCall:     'Pre-llamada',
      apertura:    'Apertura',
      objeciones:  'Rebates',
      cierre:      'Cierre',
    },
  },

  en: {
    loading: 'Loading Windmar Console...',
    headerSub: 'Florida Call Center',
    darkModeOn: 'Switch to light mode',
    darkModeOff: 'Switch to dark mode',
    modeAgent: 'Agent Mode',
    modeManager: 'Sales Leader',
    selectStrategy: 'Select Strategy',
    callData: 'Call Information',
    holderName: "Homeowner's Name",
    yourName: 'Your Name',
    city: 'City',
    holderPlaceholder: 'e.g. John Smith',
    yourNamePlaceholder: 'Your name',
    cityPlaceholder: 'e.g. Orlando',
    objections: 'Handle Objections',
    commonObjections: 'Common Objections',
    copyAll: 'COPY ALL',
    copyBtn: 'Copy',
    editBtn: 'Edit',
    noneAvailable: 'No scripts available.',
    activeCampaign: 'Active Campaign',
    closedLostCampaign: 'Closed Lost · Mar–Apr 2026',
    retentionDesc:
      'Guide with Zoho checklist, opening script v4, rebates by reason, and appointment close.',
    preCallReminder: 'Complete the Pre-call before dialing',
    ifClientSays: 'If they say:',
    strategies: 'Your Sales Strategies',
    createNew: 'Create New Script',
    interactiveGuide: 'Interactive guide',
    viewStructure: 'View Structure',
    phases4: '4 Phases · Checklist + Rebates',
    editStrategy: 'Edit Strategy:',
    speechName: 'Script Name',
    campaign: 'Campaign / Tags',
    speechNamePlaceholder: 'e.g. May Campaign',
    campaignPlaceholder: 'e.g. Florida Solar',
    speechSteps: 'Script Steps',
    addStep: 'Add Step',
    stepTitlePlaceholder: 'Step Title',
    stepSubtitlePlaceholder: 'Purpose / Subtitle',
    stepContentPlaceholder: 'Use [variable] to insert dynamic fields.',
    objHandling: 'Objection Handling',
    addObj: 'Add Objection',
    objTriggerPlaceholder: "What the customer says (e.g. I don't have money)",
    objResponsePlaceholder: 'Your suggested response...',
    cancel: 'Cancel',
    save: 'Save Strategy',
    guionSteps: 'Script Steps',
    managedObj: 'Managed Objections',
    interactive4phases: 'Interactive Guide — 4 Phases',
    editStructure: 'Edit this structure',
    close: 'Close',
    deleteConfirm: 'Are you sure you want to delete this script?',
    newSpeechName: 'New Script',
    newSpeechCampaign: 'General',
    newSpeechStep: 'Opening',
    newSpeechStepSub: 'Advisor introduction',
    newSpeechContent: '"Hello [homeowner\'s name]..." ',
    stepsLabel: 'Steps',
    objCount: 'Objections',
    retentionV4: 'Retention Script · v4',
    retentionTitle: 'Direct flow, no pauses',
    retentionSubtitle:
      'Customer first, company second. One goal: get the first micro-yes.',
    preCallProgress: 'Pre-call',
    alertsTitle: 'Warning Signs — check before calling',
    selectReason: 'Select the real reason the customer expressed:',
    suggestedClosing: 'Suggested close',
    aperturaInfo:
      'Opening principle: Pause after the greeting and let the customer share their experience. This gives them a chance to express themselves — while they talk, the agent indirectly notes their concerns before moving into recovery or retention.',
    phase1Title: 'Greeting + experience question',
    phase1Sub: 'Retention representative',
    whyItWorks: 'Why this works',
    phase1Why1:
      '"I\'m calling to make sure you were well taken care of" — the customer doesn\'t feel like they\'re being sold to. It conveys individual attention.',
    phase1Why2:
      'Asking about their experience opens the conversation: the customer talks, the agent listens and mentally notes their real concerns.',
    phase1Why3:
      'Letting them respond allows you to identify the real reason — which may differ from what\'s recorded in the CRM.',
    phase1OtherPerson: 'If someone else answers:',
    phase1OtherScript:
      '"Could you let me know the best time to reach him/her? It\'s a brief follow-up call from Windmar Home."',
    waitLabel: 'LET THEM RESPOND',
    waitSub: 'Listen without interrupting · Note their concerns',
    phase2Title: 'Acknowledgment + pivot to current situation',
    phase2Sub: 'Retention representative · after listening',
    phase2Desc:
      'This phrase acknowledges what the customer said, validates their situation, and opens the door to detect whether anything has changed or if there\'s an unanswered question — without pressure.',
    activeListening: 'Active listening phrases — during the conversation',
    motiveIdentified: 'Motive identified →',
    motiveDesc:
      'Based on what the customer expressed, apply the corresponding rebate in the next tab. Brand positioning does not go here — it goes at the close.',
    cierreInfo:
      "This is where brand positioning goes. The customer already heard the rebate and showed openness. Now the warranties and 15 years close — they don't open.",
    bridgeLabel: 'Brand → appointment bridge',
    bridgeRelocated: 'relocated v3',
    bridgeDesc: 'Use just before offering the appointment, when the customer has shown interest:',
    bridgeTips: ['⏱ Approx. 15 sec', '✓ Only when there is openness', '→ Flows directly to close'],
    doubleAltTitle: 'Double alternative — never "yes or no"',
    doubleAltScript:
      '"Would <b>Tuesday morning</b> work better, or would you prefer <b>Thursday afternoon</b>?"',
    doubleAltNote:
      'Never ask "Would you like an appointment?" — it gives them the option to say no. Always offer two concrete choices.',
    thinkAboutLabel: '"I need to think about it"',
    thinkAboutScript:
      '"Of course, it\'s an important decision. What specifically do you need to think about? Sometimes having the right information clears everything up in the same call."',
    thinkAboutNote:
      'Goal: identify the real objection behind "I need to think about it" and address it before hanging up.',
    appointAccepted: 'If the customer accepts the appointment',
    appointSteps: [
      'Confirm name, address, and contact phone number.',
      'Provide the consultant\'s name who will visit, if already assigned.',
      'Let them know they\'ll receive a text confirmation.',
      'Log in Zoho: update Deal, change status, and add a detailed note.',
    ],
    appointScript:
      '"Perfect, [Name]. Your appointment is set for [day and time]. You\'ll receive a confirmation text. It was a pleasure speaking with you — talk soon!"',
    hardReject: 'If the customer firmly declines',
    hardRejectSteps: [
      { t: 'Never argue',    c: '"That\'s perfectly fine, I completely respect that."' },
      { t: 'Open door',      c: '"If your situation ever changes, please don\'t hesitate to reach out. We\'ll be here."' },
      { t: 'Log in Zoho',   c: 'Detailed reason. Mark as do-not-contact if requested.' },
    ],
    zohoNote: 'Mandatory Zoho note — every call',
    zohoDesc: 'Always document, even if there was no answer:',
    zohoFields: [
      { l: 'Result',                v: 'Reached / No answer / Voicemail' },
      { l: 'Real reason expressed', v: 'What the customer said'          },
      { l: 'Next action',           v: 'Appointment / Callback / Discard' },
      { l: 'Date of next attempt',  v: 'MM/DD/YYYY'                      },
    ],
    previewPhases: [
      { icon: '📋', title: 'Pre-call',    desc: 'Zoho CRM checklist + warning signs before dialing.' },
      { icon: '📞', title: 'Opening v4',  desc: 'Direct flow, no pauses. Greeting, empathetic purpose, and discovery.' },
      { icon: '🛡',  title: 'Rebates',    desc: '8 Closed Lost reasons with steps and suggested close.' },
      { icon: '📅', title: 'Close',       desc: 'Brand positioning, double alternative, and handling "I need to think about it".' },
    ],
    tabLabels: {
      preCall:     'Pre-call',
      apertura:    'Opening',
      objeciones:  'Rebates',
      cierre:      'Close',
    },
  },
} as const;

/* ── Default speeches (language-aware) ─────────────────────────────────────── */

export interface SpeechStep {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  caution?: string;
}

export interface Speech {
  id: string;
  name: string;
  campaign: string;
  type?: 'standard' | 'retention';
  steps: SpeechStep[];
  objections: { id: string; trigger: string; response: string }[];
}

export function getDefaultSpeeches(lang: Lang): Speech[] {
  if (lang === 'es') {
    return [
      {
        id: 'freedom-forever',
        name: 'Campaña Freedom Forever',
        campaign: 'Telemercadeo',
        steps: [
          {
            id: '1',
            title: '1 · Apertura',
            subtitle: 'Conexión directa + empatía inmediata',
            content:
              '"Buenos días/tardes, ¿estoy hablando con [nombre del titular]?\n\n[nombre del titular], le saluda [nombre del asesor] de parte de Windmar Home Solar.\n\nEstamos contactando a propietarios en el área de [ciudad] que tienen un sistema solar en su casa, ya que muchos de ellos están en una situación que puede estar afectando su inversión — y queremos asegurarnos de que usted esté protegido.\n\nLo que queremos es enviar a uno de nuestros consultores locales a revisar su sistema, sin costo y sin compromiso."',
          },
          {
            id: '2',
            title: '2 · Desarrollo',
            subtitle: 'Revelar la situación con claridad y empatía',
            content:
              '"El motivo de mi llamada es que la empresa que instaló su sistema solar declaró quiebra recientemente.\n\n¿Usted ya había escuchado algo sobre esto?\n\n(Espera la respuesta del cliente)\n\nSi dice SÍ: "Entiendo, y es una situación muy preocupante para muchos propietarios. Lo que esto significa en la práctica es que hoy su sistema puede estar operando sin garantía activa ni soporte técnico — si algo falla, ya no hay nadie de esa compañía a quien llamar. Usted hizo una inversión importante y merece tener respaldo real."\n\nSi dice NO: "Le cuento, porque es importante que lo sepa. Freedom Forever, la empresa que le instaló las placas, entró en quiebra — lo que significa que ya no existe como compañía operativa. Eso deja su sistema sin garantías activas y sin soporte técnico. Si hoy falla el inversor, el monitoreo o cualquier componente, no habría a quién recurrir. Usted invirtió demasiado como para quedarse sin respaldo."',
            caution:
              'La pregunta es clave: genera conciencia y convierte el monólogo en conversación. Escucha la respuesta antes de continuar.',
          },
          {
            id: '3',
            title: '3 · Propuesta de valor',
            subtitle: 'La cita como solución — sin vender productos',
            content:
              '"Lo que queremos hacer es enviar a uno de nuestros consultores certificados directamente a su casa — sin costo, sin compromiso.\n\nÉl va a revisar el estado actual de su sistema, verificar que todo esté funcionando como debe, y explicarle con claridad cuáles son sus opciones según lo que encuentre.\n\nLa visita es simplemente para que usted sepa exactamente cómo está su sistema y tenga una empresa real que lo respalde."',
            caution: 'No menciones productos en la llamada. Las soluciones las presenta el consultor en la visita.',
          },
          {
            id: '4',
            title: '4 · Cierre de cita',
            subtitle: 'Dos técnicas de cierre',
            content:
              'CIERRE A — DOBLE ALTERNATIVA\n"Para coordinar la visita, ¿qué le queda mejor — mañana a las 10 am o mejor en la tarde a las 4 pm?"\n\nCIERRE B — URGENCIA REAL\n"Tenemos un consultor cubriendo su área esta semana y los espacios se están llenando rápido. Quiero asegurarle su lugar — ¿qué día de esta semana es el mejor para usted?"',
            caution:
              'Al confirmar: nombre completo · dirección exacta · teléfono · horario preferido. Repite todos los datos en voz alta antes de colgar.',
          },
          {
            id: '5',
            title: '5 · Cierre final',
            subtitle: 'Confirmación y despedida',
            content:
              '"Perfecto, [nombre del titular]. Queda confirmada su visita el [dia] en horas de la [horario] en [direccion].\n\nNuestro consultor le va a llamar el día anterior para confirmarle la hora exacta. Si necesita comunicarse con nosotros antes, con gusto le atendemos.\n\nFue un placer hablar con usted — y quédese tranquilo/a, con Windmar usted está en buenas manos."',
          },
        ],
        objections: [
          {
            id: 'o1',
            trigger: 'No me interesa',
            response:
              '"No le pido que compre nada. Solo 30 minutos para saber el estado real de un sistema que usted ya pagó. Si todo está bien, perfecto — pero mejor saberlo antes de que sea un problema mayor."',
          },
          {
            id: 'o2',
            trigger: 'No tengo dinero',
            response:
              '"La visita no tiene ningún costo — nada que firmar, nada que pagar. Nuestro consultor va, revisa y le da un panorama completo. Lo que decida después es totalmente su decisión."',
          },
          {
            id: 'o3',
            trigger: 'Mi sistema está bien',
            response:
              '"Me alegra. Pero con Freedom Forever fuera del mercado, si mañana falla algo — inversor, monitoreo, garantía — ya no hay a quién llamar. La visita es para tener respaldo antes de necesitarlo."',
          },
          {
            id: 'o4',
            trigger: '¿Son legítimos?',
            response:
              '"Windmar lleva más de 15 años en Florida — búsquenos en Google ahora mismo. Nuestro consultor llega con identificación completa. Queremos ganarnos su confianza, no dársela por sentada."',
          },
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
  }

  /* English */
  return [
    {
      id: 'freedom-forever',
      name: 'Freedom Forever Campaign',
      campaign: 'Telemarketing',
      steps: [
        {
          id: '1',
          title: '1 · Opening',
          subtitle: 'Direct connection + immediate empathy',
          content:
            '"Good morning/afternoon, am I speaking with [homeowner\'s name]?\n\n[homeowner\'s name], this is [advisor\'s name] calling on behalf of Windmar Home Solar.\n\nWe\'re reaching out to homeowners in the [city] area who have a solar system on their home, as many of them are in a situation that may be affecting their investment — and we want to make sure you\'re protected.\n\nWhat we\'d like to do is send one of our local consultants to review your system, at no cost and with no commitment."',
        },
        {
          id: '2',
          title: '2 · Development',
          subtitle: 'Reveal the situation with clarity and empathy',
          content:
            '"The reason for my call is that the company that installed your solar system recently filed for bankruptcy.\n\nWere you aware of this?\n\n(Wait for the customer\'s response)\n\nIf YES: "I understand, and it\'s a very concerning situation for many homeowners. In practical terms, your system may now be operating without an active warranty or technical support — if something breaks, there\'s no one from that company left to call. You made a significant investment and you deserve real backing."\n\nIf NO: "Let me share something important with you. Freedom Forever, the company that installed your panels, has filed for bankruptcy — which means they no longer exist as an operating company. That leaves your system without active warranties and without technical support. If the inverter, monitoring, or any component fails today, there would be no one to call. You invested too much to be left without support."',
          caution:
            'The question is key: it creates awareness and turns the monologue into a conversation. Listen to the response before continuing.',
        },
        {
          id: '3',
          title: '3 · Value Proposition',
          subtitle: 'The appointment as the solution — no selling products',
          content:
            '"What we want to do is send one of our certified consultants directly to your home — no cost, no commitment.\n\nHe\'ll review the current state of your system, verify that everything is working as it should, and clearly explain your options based on what he finds.\n\nThe visit is simply so you know exactly how your system is performing and have a real company backing you."',
          caution:
            "Don't mention products on the call. Solutions are presented by the consultant during the visit.",
        },
        {
          id: '4',
          title: '4 · Appointment Close',
          subtitle: 'Two closing techniques',
          content:
            'CLOSE A — DOUBLE ALTERNATIVE\n"To schedule the visit, which works better for you — tomorrow at 10 am or in the afternoon at 4 pm?"\n\nCLOSE B — REAL URGENCY\n"We have a consultant covering your area this week and slots are filling up fast. I want to secure your spot — which day this week works best for you?"',
          caution:
            'When confirming: full name · exact address · phone number · preferred time. Repeat all details out loud before hanging up.',
        },
        {
          id: '5',
          title: '5 · Final Close',
          subtitle: 'Confirmation and farewell',
          content:
            '"Perfect, [homeowner\'s name]. Your visit is confirmed for [day] in the [time] at [address].\n\nOur consultant will call you the day before to confirm the exact time. If you need to reach us before then, we\'re happy to help.\n\nIt was a pleasure speaking with you — and rest assured, with Windmar you\'re in good hands."',
        },
      ],
      objections: [
        {
          id: 'o1',
          trigger: "I'm not interested",
          response:
            '"I\'m not asking you to buy anything. Just 30 minutes to know the real condition of a system you already paid for. If everything\'s fine, great — but better to know before it becomes a bigger problem."',
        },
        {
          id: 'o2',
          trigger: "I don't have money",
          response:
            '"The visit has no cost — nothing to sign, nothing to pay. Our consultant will come, review, and give you a complete picture. Whatever you decide afterward is entirely your choice."',
        },
        {
          id: 'o3',
          trigger: 'My system is fine',
          response:
            '"Glad to hear it. But with Freedom Forever out of the market, if something fails tomorrow — inverter, monitoring, warranty — there\'s no one left to call. The visit is to have backup before you need it."',
        },
        {
          id: 'o4',
          trigger: 'Are you legitimate?',
          response:
            '"Windmar has been in Florida for over 15 years — look us up on Google right now. Our consultant arrives with full identification. We want to earn your trust, not take it for granted."',
        },
      ],
    },
    {
      id: 'retencion-closed-lost',
      name: 'Retention — Closed Lost',
      campaign: 'Retention Mar–Apr 2026',
      type: 'retention',
      steps: [],
      objections: [],
    },
  ];
}

/* ── Retention static data (language-aware) ────────────────────────────────── */

export function getRetentionChecklists(lang: Lang) {
  if (lang === 'es') {
    return [
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
  }

  return [
    {
      id: 'deal',
      title: 'Deal Information',
      items: [
        { id: 'c1', text: 'Full name and how they prefer to be addressed' },
        { id: 'c2', text: 'Read full Deal notes: Main page notes + stage module notes — identify the tone of the cancellation (frustration, doubt, financial pressure)' },
        { id: 'c3', text: 'Closed Lost reason in CRM — if "Other", review details in Main page notes' },
        { id: 'c4', text: "Consultant's name (check if there's a Sales Assist — usually indicates they were the closer or assisted in the sale)" },
        { id: 'c5', text: 'Closing date — calculate how many days have passed' },
      ],
    },
    {
      id: 'ntp',
      title: 'Pre-Engineering Section — ENG Findings / NTP',
      items: [
        { id: 'n1', text: 'System size (kW) quoted to the customer' },
        { id: 'n2', text: 'Number of panels, inverter or battery model if applicable' },
        { id: 'n3', text: 'Estimated monthly or annual savings documented by the technician' },
        { id: 'n4', text: 'Pre-engineering visit — review ENG Findings in Pre Eng or NTP module (roof details, home conditions, technical findings)' },
        { id: 'n5', text: 'Special home conditions (shade, roof type, HOA)' },
      ],
    },
    {
      id: 'financiamiento',
      title: 'Financing',
      items: [
        { id: 'f1', text: 'Bank or lender used (GoodLeap, Mosaic, Sunlight, etc.)' },
        { id: 'f2', text: 'Was it approved? At what stage did the financing stand?' },
        { id: 'f3', text: 'Estimated monthly payment and contract term' },
        { id: 'f4', text: 'Were there issues with a co-applicant or documentation?' },
      ],
    },
  ];
}

export function getRetentionWarnings(lang: Lang): string[] {
  if (lang === 'es') {
    return [
      'Notas con queja directa contra Windmar o el vendedor → escalar a supervisor primero.',
      'Motivo DQ-Mobile Home o HOA sin resolución → verificar con operaciones si el impedimento sigue activo.',
      'Canceló hace menos de 30 días → esperar al menos 2 semanas antes del primer contacto.',
    ];
  }
  return [
    'Notes with a direct complaint against Windmar or the rep → escalate to supervisor first.',
    'DQ-Mobile Home or unresolved HOA reason → check with operations if the obstacle is still active.',
    'Canceled less than 30 days ago → wait at least 2 weeks before first contact.',
  ];
}

export interface RetentionRebate {
  id: string;
  label: string;
  title: string;
  badge: 'amber' | 'red' | 'blue';
  warning?: string;
  steps: { title: string; text: string }[];
  closing: string;
}

export function getRetentionRebates(lang: Lang): RetentionRebate[] {
  if (lang === 'es') {
    return [
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
  }

  /* English rebates */
  return [
    {
      id: 'economico',
      label: 'Price / Economics',
      title: "Economics Not Compelling — price or ROI didn't convince",
      badge: 'amber',
      steps: [
        { title: 'Validate', text: '"I understand — the financial side is the most important part of a decision like this."' },
        { title: 'Anchor to the system', text: '"The system designed for your home was [X kW] — estimated savings of [$ from NTP] per month, essentially replacing what you currently pay your electric company."' },
        { title: 'Shift perspective', text: '"It\'s not whether the system costs — it\'s comparing what you pay the utility today versus the panel payment. The panel almost always comes out cheaper month to month."' },
        { title: 'Real urgency', text: '"The 30% federal ITC incentives are in effect this year. Waiting could cost more."' },
      ],
      closing: '"I\'d like to propose a no-commitment meeting with our specialist for an updated bill analysis. Would [day] or [another day] work better for you?"',
    },
    {
      id: 'cambioMente',
      label: 'Changed Their Mind',
      title: 'Customer Changed Their Mind',
      badge: 'amber',
      warning: '"Changed their mind" is almost never the real reason. Dig deeper — behind it there\'s almost always price, a technical doubt, or an experience with the rep.',
      steps: [
        { title: 'No pressure', text: '"That\'s okay — decisions like this deserve reflection, and that\'s completely valid."' },
        { title: 'Dig for the real reason', text: '"Just out of curiosity, was there something specific that made you reconsider? Sometimes questions get left unanswered…"' },
        { title: 'With the answer, apply the corresponding rebate', text: 'Price, technical doubt, or experience with the rep.' },
      ],
      closing: '"Would you be willing to hear a fresh presentation — no commitment — so you have all the information before making a final decision?"',
    },
    {
      id: 'noFunding',
      label: 'Not Approved / No Funding',
      title: 'No Funding — not approved for financing',
      badge: 'red',
      steps: [
        { title: 'Immediate empathy', text: '"We know that process can be frustrating — we completely understand."' },
        { title: 'Explore changes', text: '"Has there been any change in your credit or employment situation since then?"' },
        { title: 'Concrete alternatives', text: '"[Bank from NTP] was the first option, but we also have GoodLeap, Mosaic, and zero-down lease options."' },
        { title: 'Co-applicant', text: '"In some cases, adding a co-applicant resolves the approval. Is that a possibility for you?"' },
      ],
      closing: '"15 minutes with our financing specialist — no cost, no commitment — to see if there\'s an option available today that wasn\'t before. Shall we schedule that?"',
    },
    {
      id: 'competencia',
      label: 'Competitor Better Price',
      title: 'Competition Better Pricing',
      badge: 'amber',
      steps: [
        { title: 'Validate without attacking', text: '"It\'s great that you compared — that shows you\'re an informed consumer."' },
        { title: 'Probe the offer', text: '"What size system were they offering and what warranties did they include?"' },
        { title: 'Differentiate with context', text: '"Not all low prices include in-house maintenance, production warranties, and local service. That makes a significant difference at 5 and 10 years."' },
        { title: "If they haven't signed yet", text: '"Before you decide, would you be open to a second opinion from us? That way you\'re comparing apples to apples."' },
      ],
      closing: '"20 minutes with our specialist to present an updated proposal and walk you through the differences point by point. When are you available?"',
    },
    {
      id: 'misinformed',
      label: 'Felt Misinformed',
      title: 'Customer Feels Misinformed',
      badge: 'red',
      warning: "The most delicate case. Never defend the previous rep. The customer must feel that Windmar acknowledges the problem and acts differently.",
      steps: [
        { title: 'Genuine apology', text: '"On behalf of Windmar, I sincerely apologize if you felt the information wasn\'t clear. That\'s not what we want for our customers."' },
        { title: 'Give them control', text: '"Could you tell me what specifically gave you that feeling? I want to fully understand it."' },
        { title: 'Fresh start', text: '"What I\'d like to propose is starting over with a different specialist who will answer all your questions before anything is signed."' },
      ],
      closing: '"This consultant has no rush — their only goal is for you to fully understand every aspect before deciding. Will you give us that chance?"',
    },
    {
      id: 'noResponde',
      label: "Wasn't Responding Before",
      title: 'Customer Non-Responsive (now answered)',
      badge: 'blue',
      steps: [
        { title: "Don't mention previous attempts", text: '"So glad I was able to reach you today."' },
        { title: 'Value message', text: '"Your file was still active and I wanted to make sure that if you had any questions, you\'d have the chance to get them answered."' },
        { title: 'No pressure', text: '"Is solar energy still something you\'d be interested in exploring, or have you already made a different decision?"' },
      ],
      closing: '"I\'d be happy to schedule a free visit where a specialist evaluates your home and shows you what you could save. Does that work for you?"',
    },
    {
      id: 'finance',
      label: "Didn't Complete Financing",
      title: "Didn't complete Finance WC / Recurring payment",
      badge: 'amber',
      steps: [
        { title: 'Abandonment point', text: '"The process stopped at the financing step. Was it the documentation or the online process that couldn\'t be completed?"' },
        { title: 'If it was documentation', text: '"Today we have coordinators who guide customers step by step — you don\'t have to do it alone anymore."' },
        { title: 'If it was recurring payment', text: '"We can pick up right where you left off — the bank keeps the file on record. Would you like us to check if your case is still active?"' },
      ],
      closing: '"I\'ll connect you with our financing coordinator to resume the process in a single call. Would you prefer I transfer you now, or would you like to schedule an in-person appointment?"',
    },
    {
      id: 'hardship',
      label: 'Financial Hardship',
      title: 'Financial Hardship',
      badge: 'red',
      steps: [
        { title: 'Maximum empathy, zero pressure', text: '"I completely understand — circumstances change and it\'s entirely understandable."' },
        { title: 'Evaluate change', text: '"Has your situation improved since then?" — If it\'s still difficult, thank them and mark for follow-up in 60–90 days.' },
        { title: 'If improved', text: '"Solar actually helps in those moments — it reduces that fixed expense and frees up money every month."' },
        { title: 'Zero down', text: '"We have options with zero money upfront and payments frequently lower than your current utility bill."' },
      ],
      closing: '"I\'m not asking for any commitment today. Just 15 minutes with our specialist to see if the numbers make sense for your current situation. Shall we schedule it — no pressure?"',
    },
  ];
}

/* ── Retention apertura scripts (language-aware) ───────────────────────────── */

export function getAperturaScripts(lang: Lang) {
  if (lang === 'es') {
    return {
      parte1: `"Buenos días/tardes, ¿podría hablar con [Nombre]?

…[Nombre], qué gusto. Mi nombre es [Tu nombre], le llamo de parte de Windmar Home.

Me comunico con usted para asegurarme personalmente de que fue bien atendido y recibió un buen servicio de parte de nuestra compañía.

¿Me puede hablar de su experiencia? ¿Me puede compartir cómo fue su proceso?"`,
      parte2: `"Gracias por compartirlo conmigo. Entiendo que el proceso no pudo continuar en su momento, y quería confirmar si ha habido algún cambio en su situación o si le quedó alguna duda sin respuesta."`,
      listening: [
        '"Entiendo perfectamente, eso tiene mucho sentido…"',
        '"Gracias por contarme eso, es muy importante saberlo…"',
        '"¿Y aparte de eso, hubo algún otro aspecto que le generó duda?"',
        '"Le escucho. Precisamente por eso le llamamos hoy…"',
      ],
      toneChips: ['🎙 Tono cálido y seguro', '🚫 Sin mencionar cancelación directamente', '⏸ Pausa intencional después de preguntar'],
    };
  }
  return {
    parte1: `"Good morning/afternoon, may I speak with [Name]?

…[Name], so glad I reached you. My name is [Your name], calling on behalf of Windmar Home.

I'm reaching out to personally make sure you were well taken care of and received good service from our company.

Could you tell me about your experience? How did the process go for you?"`,
    parte2: `"Thank you for sharing that with me. I understand the process couldn't continue at that time, and I wanted to confirm whether anything has changed in your situation, or if any questions were left unanswered."`,
    listening: [
      '"I completely understand, that makes a lot of sense…"',
      '"Thank you for telling me that — it\'s very important for me to know…"',
      '"And aside from that, was there any other aspect that raised a concern for you?"',
      '"I hear you. That\'s exactly why we\'re calling today…"',
    ],
    toneChips: ['🎙 Warm and confident tone', '🚫 Do not mention cancellation directly', '⏸ Intentional pause after asking'],
  };
}

/* ── Retention cierre brand script (language-aware) ────────────────────────── */

export function getBrandScript(lang: Lang): string {
  if (lang === 'es') {
    return `"Le cuento que Windmar lleva más de 15 años aquí en Florida, y lo que más valoran nuestros clientes no es la instalación en sí — es que no desaparecemos después. Garantías de producción reales, mantenimiento incluido y un equipo local que responde cuando lo necesita.

Por eso vale la pena que hable 20 minutos con nuestro especialista."`;
  }
  return `"I want you to know that Windmar has been here in Florida for over 15 years, and what our customers value most isn't the installation itself — it's that we don't disappear afterward. Real production warranties, included maintenance, and a local team that responds when you need it.

That's why it's worth spending 20 minutes with our specialist."`;
}
