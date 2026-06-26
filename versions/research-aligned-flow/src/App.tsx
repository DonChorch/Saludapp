import {
  Bell,
  Calendar,
  Check,
  ChevronRight,
  ClipboardList,
  FileText,
  HeartHandshake,
  Home,
  LockKeyhole,
  MapPin,
  Mic,
  Paperclip,
  Pencil,
  Play,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Square,
  Trash2,
  Users,
  X
} from "lucide-react";
import { useEffect, useState } from "react";

type Screen =
  | "landing"
  | "chat"
  | "classification"
  | "dashboard"
  | "agenda"
  | "patient"
  | "event"
  | "delegate"
  | "tasks"
  | "support"
  | "history"
  | "settings";

type StatusTone = "green" | "blue" | "amber" | "red" | "slate";
type Situation = {
  id: string;
  kind: "Evento médico" | "Trámite" | "Documento" | "Recordatorio";
  title: string;
  patient: string;
  date: string;
  time: string;
  place: string;
  status: string;
  source: "Sistema" | "Manual";
};
type SituationDraft = Omit<Situation, "id">;
type ManualIntent = Situation["kind"];
type ProcessedIngress = {
  id: string;
  title: string;
  patient: string;
  source: string;
  result: string;
  status: string;
  tone: StatusTone;
  action: string;
};

const familyMembers = [
  {
    id: "marina",
    name: "Marina Gómez",
    shortName: "Marina",
    role: "Gestora principal",
    age: 42,
    description: "Organiza turnos, estudios, recetas, medicación y trámites familiares."
  },
  {
    id: "elena",
    name: "Mamá Elena",
    fullName: "Elena Rivas",
    role: "Persona acompañada",
    age: 72,
    conditions: ["Hipertensión"],
    medication: ["Losartán 50 mg"],
    nextAppointment: "Cardiología — Dr. Ruiz — 30/05 10:30"
  },
  {
    id: "tomas",
    name: "Tomás",
    fullName: "Tomás Gómez",
    role: "Hijo",
    age: 9,
    needs: ["Vacunas", "Controles pediátricos"]
  },
  {
    id: "lucia",
    name: "Lucía",
    fullName: "Lucía Gómez",
    role: "Hija adolescente",
    age: 15,
    needs: ["Estudios", "Controles clínicos"]
  },
  { id: "pablo", name: "Pablo", fullName: "Pablo Gómez", role: "Familiar colaborador" },
  { id: "laura", name: "Laura", role: "Cuidadora ocasional" }
];

const reminders = [
  { id: "reminder-1", title: "Losartán 50 mg", detail: "1 comprimido por día", time: "20:00", status: "Sugerido" }
];

const initialSituations: Situation[] = [
  {
    id: "situation-cardio",
    kind: "Evento médico",
    title: "Control cardiología",
    patient: "Mamá Elena",
    date: "Mañana",
    time: "10:30",
    place: "Centro Médico Norte",
    status: "Preparar",
    source: "Sistema"
  }
];

const processedIngresses: ProcessedIngress[] = [
  {
    id: "ingress-1",
    title: "IMG_3482.jpg",
    patient: "Mamá Elena",
    source: "WhatsApp",
    result: "Receta Losartán 50 mg guardada y vinculada al control de cardiología. Se sugiere crear recordatorio.",
    status: "Organizado",
    tone: "green",
    action: "Ver en evento"
  },
  {
    id: "ingress-2",
    title: "Audio: turno pediatra",
    patient: "Tomás",
    source: "WhatsApp",
    result: "Se detectó un turno pediátrico. Falta confirmar fecha.",
    status: "Revisar",
    tone: "amber",
    action: "Completar dato"
  },
  {
    id: "ingress-3",
    title: "Autorización obra social",
    patient: "Mamá Elena",
    source: "Foto",
    result: "Se creó una gestión administrativa para seguimiento.",
    status: "En agenda",
    tone: "blue",
    action: "Ver gestión"
  }
];

const medicalFiles = [
  { id: "file-1", patient: "Mamá Elena", title: "Receta Losartán 50 mg", type: "Receta", source: "WhatsApp", date: "20/05/2026" },
  { id: "file-2", patient: "Mamá Elena", title: "ECG 2025", type: "Estudio", source: "PDF", date: "10/12/2025" },
  { id: "file-3", patient: "Mamá Elena", title: "Laboratorio abril 2026", type: "Laboratorio", source: "PDF", date: "12/04/2026" },
  { id: "file-4", patient: "Mamá Elena", title: "Orden control cardiológico", type: "Orden médica", source: "Foto", date: "18/05/2026" },
  { id: "file-5", patient: "Mamá Elena", title: "Credencial obra social", type: "Credencial", source: "Foto", date: "19/05/2026" }
];

const activityLog = [
  {
    id: "log-1",
    category: "document",
    time: "09:12",
    where: "Inicio del flujo",
    who: "Marina",
    what: "Reenvió IMG_3482.jpg desde WhatsApp para guardar una receta de Mamá Elena."
  },
  {
    id: "log-2",
    category: "document",
    time: "09:13",
    where: "Clasificación",
    who: "Memo",
    what: "Detectó fecha, paciente, tipo de documento, medicación y origen del archivo."
  },
  {
    id: "log-3",
    category: "patient",
    time: "09:14",
    where: "Historia de Mamá Elena",
    who: "Marina",
    what: "Confirmó la clasificación y guardó la receta en Recetas > Cardiología."
  },
  {
    id: "log-4",
    category: "task",
    time: "09:16",
    where: "Recordatorios",
    who: "Memo",
    what: "Sugirió crear un recordatorio para Losartán 50 mg a las 20:00."
  },
  {
    id: "log-5",
    category: "document",
    time: "09:18",
    where: "Evento médico",
    who: "Marina",
    what: "Adjuntó ECG 2025, Laboratorio abril, Orden médica y Credencial al control de cardiología."
  },
  {
    id: "log-6",
    category: "family",
    time: "09:20",
    where: "Acompañante",
    who: "Marina",
    what: "Asignó a Pablo como acompañante y preparó un mensaje de WhatsApp con cita y documentos."
  },
  {
    id: "log-7",
    category: "family",
    time: "09:21",
    where: "Permisos",
    who: "Memo",
    what: "Limitó lo compartido con Pablo al evento de cardiología y sus documentos adjuntos."
  },
  {
    id: "log-8",
    category: "task",
    time: "20:00",
    where: "WhatsApp",
    who: "Memo",
    what: "Tiene pendiente la confirmación del recordatorio automático de Losartán 50 mg."
  },
  {
    id: "log-9",
    category: "family",
    time: "20:01",
    where: "Mensaje de apoyo",
    who: "Memo",
    what: "Dejó preparada la opción de avisar a Pablo cuando el recordatorio quede activo."
  }
];

const screenTitles: Record<Screen, string> = {
  landing: "Salud en equipo",
  chat: "Chat",
  classification: "Revisar clasificación",
  dashboard: "Inicio",
  agenda: "Agenda",
  patient: "Familia",
  event: "Evento médico",
  delegate: "Acompañante",
  tasks: "Recordatorios",
  support: "Apoyo",
  history: "Historial",
  settings: "Ajustes"
};

function toneForStatus(status: string): StatusTone {
  if (["Clasificado", "Confirmado", "Hecho", "Activo"].includes(status)) return "green";
  if (["En curso", "Revisar", "Programado", "Preparar", "En agenda"].includes(status)) return "blue";
  if (["Pendiente", "Pendiente de revisar", "Requiere confirmación", "Sin clasificar", "A confirmar"].some((word) => status.includes(word))) return "amber";
  return "slate";
}

function App() {
  const [screen, setScreen] = useState<Screen>("chat");
  const [saved, setSaved] = useState(false);
  const [accessSent, setAccessSent] = useState(false);
  const [companionAssignment, setCompanionAssignment] = useState<string | null>(null);
  const [situations, setSituations] = useState<Situation[]>(initialSituations);
  const [agendaCreateToken, setAgendaCreateToken] = useState(0);
  const [agendaIntent, setAgendaIntent] = useState<ManualIntent>("Evento médico");
  const [patientCreateToken, setPatientCreateToken] = useState(0);
  const [companionCreateToken, setCompanionCreateToken] = useState(0);

  const go = (next: Screen) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setScreen(next);
  };

  return (
    <AppShell
      screen={screen}
      go={go}
      onNewSituation={(intent = "Evento médico") => {
        setAgendaIntent(intent);
        setAgendaCreateToken((token) => token + 1);
        go("agenda");
      }}
      onNewPatient={() => {
        setPatientCreateToken((token) => token + 1);
        go("patient");
      }}
      onNewCompanion={() => {
        setCompanionCreateToken((token) => token + 1);
        go("patient");
      }}
    >
      {!["landing", "chat"].includes(screen) && <Header title={screenTitles[screen]} go={go} />}
      {screen === "landing" && <Landing go={go} />}
      {screen === "chat" && <ChatSimulation go={go} />}
      {screen === "classification" && <Classification go={go} saved={saved} setSaved={setSaved} />}
      {screen === "dashboard" && <Dashboard go={go} companionAssignment={companionAssignment} situations={situations} />}
      {screen === "agenda" && <AgendaScreen go={go} situations={situations} setSituations={setSituations} createToken={agendaCreateToken} createIntent={agendaIntent} />}
      {screen === "patient" && <PatientProfile go={go} patientCreateToken={patientCreateToken} companionCreateToken={companionCreateToken} />}
      {screen === "event" && <MedicalEvent go={go} />}
      {screen === "delegate" && <DelegateCare go={go} accessSent={accessSent} setAccessSent={setAccessSent} onCompanionAssigned={setCompanionAssignment} />}
      {screen === "tasks" && <TasksScreen go={go} />}
      {screen === "support" && <SupportScreen go={go} />}
      {screen === "history" && <HistoryScreen />}
      {screen === "settings" && <SettingsScreen go={go} />}
    </AppShell>
  );
}

function AppShell({
  children,
  screen,
  go,
  onNewSituation,
  onNewPatient,
  onNewCompanion
}: {
  children: React.ReactNode;
  screen: Screen;
  go: (screen: Screen) => void;
  onNewSituation: (intent?: ManualIntent) => void;
  onNewPatient: () => void;
  onNewCompanion: () => void;
}) {
  const isExternalCapture = screen === "chat";

  return (
    <div className="min-h-screen bg-surface">
      <main className={`mx-auto min-h-screen w-full max-w-md bg-surface px-4 pt-4 shadow-phone sm:my-4 sm:min-h-[calc(100vh-2rem)] sm:rounded-[44px] sm:border sm:border-line ${isExternalCapture ? "pb-6" : "pb-28"}`}>
        {children}
      </main>
      {!["landing", "chat"].includes(screen) && <BottomNav active={screen} go={go} />}
      {["dashboard", "agenda", "patient", "settings"].includes(screen) && (
        <ActionFab
          key={screen}
          active={screen}
          go={go}
          onNewSituation={onNewSituation}
          onNewPatient={onNewPatient}
          onNewCompanion={onNewCompanion}
        />
      )}
    </div>
  );
}

function Header({ title, go }: { title: string; go: (screen: Screen) => void }) {
  return (
    <div className="sticky top-0 z-20 -mx-4 mb-4 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur sm:rounded-t-[44px]">
      <div className="flex items-center justify-between">
        <button className="rounded-full bg-white/90 p-2 text-ink shadow-sm" onClick={() => go("dashboard")} aria-label="Ir al inicio">
          <Home size={18} />
        </button>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Salud en equipo</p>
          <h1 className="text-lg font-bold text-ink">{title}</h1>
        </div>
        <button className="rounded-full bg-white/90 p-2 text-ink shadow-sm" onClick={() => go("history")} aria-label="Ver historial">
          <Bell size={18} />
        </button>
      </div>
    </div>
  );
}

function BottomNav({ active, go }: { active: Screen; go: (screen: Screen) => void }) {
  const items = [
    { label: "Inicio", icon: Home, screen: "dashboard" as Screen },
    { label: "Agenda", icon: Calendar, screen: "agenda" as Screen },
    { label: "Familia", icon: Users, screen: "patient" as Screen },
    { label: "Ajustes", icon: Settings, screen: "settings" as Screen }
  ];
  const activeScreen = active === "tasks" || active === "event" || active === "support" ? "agenda" : active === "history" ? "settings" : active;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/90 px-2 safe-bottom shadow-[0_-10px_30px_rgba(60,50,100,0.10)] backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map(({ label, icon: Icon, screen }) => (
          <button
            key={label}
            onClick={() => go(screen)}
            className={`flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-semibold ${activeScreen === screen ? "bg-primarySoft text-primary" : "text-muted"}`}
          >
            <Icon size={19} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function ActionFab({
  active,
  go,
  onNewSituation,
  onNewPatient,
  onNewCompanion
}: {
  active: Screen;
  go: (screen: Screen) => void;
  onNewSituation: (intent?: ManualIntent) => void;
  onNewPatient: () => void;
  onNewCompanion: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | { label: string; action: () => void; title: string; description: string; confirmLabel: string }>(null);
  const actionMap: Record<string, Array<{ label: string; icon: typeof Calendar; action: () => void; title: string; description: string; confirmLabel: string }>> = {
    dashboard: [
      { label: "Nuevo evento", icon: Calendar, action: () => onNewSituation("Evento médico"), title: "¿Crear evento?", description: "Se abrirá el alta manual de un evento médico.", confirmLabel: "Crear" },
      { label: "Nueva gestión", icon: ClipboardList, action: () => onNewSituation("Trámite"), title: "¿Crear gestión?", description: "Se abrirá el alta manual de una gestión o trámite.", confirmLabel: "Crear" },
      { label: "Adjuntar documento", icon: Paperclip, action: () => onNewSituation("Documento"), title: "¿Adjuntar documento?", description: "Se abrirá la carga manual de un documento.", confirmLabel: "Adjuntar" },
      { label: "Crear recordatorio", icon: Bell, action: () => go("support"), title: "¿Crear recordatorio?", description: "Se abrirá la configuración de un nuevo recordatorio.", confirmLabel: "Crear" },
    ],
    agenda: [
      { label: "Nuevo evento", icon: Calendar, action: () => onNewSituation("Evento médico"), title: "¿Crear evento?", description: "Se abrirá el formulario para cargar un evento médico.", confirmLabel: "Crear" },
      { label: "Nueva gestión", icon: ClipboardList, action: () => onNewSituation("Trámite"), title: "¿Crear gestión?", description: "Se abrirá el formulario para cargar una gestión.", confirmLabel: "Crear" },
      { label: "Crear recordatorio", icon: Bell, action: () => go("support"), title: "¿Crear recordatorio?", description: "Se abrirá la configuración de un recordatorio.", confirmLabel: "Crear" },
      { label: "Adjuntar documento", icon: Paperclip, action: () => onNewSituation("Documento"), title: "¿Adjuntar documento?", description: "Se abrirá la carga manual de un documento.", confirmLabel: "Adjuntar" }
    ],
    patient: [
      { label: "Alta paciente", icon: Users, action: onNewPatient, title: "¿Dar de alta paciente?", description: "Se abrirá el formulario para crear una ficha familiar.", confirmLabel: "Crear" },
      { label: "Alta acompañante", icon: HeartHandshake, action: onNewCompanion, title: "¿Dar de alta acompañante?", description: "Se abrirá el formulario para agregar un acompañante.", confirmLabel: "Crear" },
      { label: "Compartir acceso", icon: ShieldCheck, action: () => go("delegate"), title: "¿Compartir acceso?", description: "Se abrirá el flujo para elegir qué información compartir.", confirmLabel: "Continuar" }
    ],
    settings: [
      { label: "Ver historial", icon: ClipboardList, action: () => go("history"), title: "¿Ver historial?", description: "Se abrirá la trazabilidad de actividad reciente.", confirmLabel: "Ver" },
      { label: "Privacidad", icon: LockKeyhole, action: () => go("settings"), title: "¿Revisar privacidad?", description: "Vas a revisar preferencias y accesos.", confirmLabel: "Revisar" },
      { label: "Nuevo perfil", icon: Users, action: onNewPatient, title: "¿Crear perfil?", description: "Se abrirá el alta de un nuevo paciente.", confirmLabel: "Crear" }
    ]
  };
  const actions = actionMap[active] ?? actionMap.dashboard;

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-[35] bg-[rgba(42,41,56,0.18)]"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú de acciones"
        />
      )}
      <div className="fixed bottom-24 left-1/2 z-40 flex w-full max-w-md -translate-x-1/2 justify-end px-5 pointer-events-none">
      <div className="flex flex-col items-end gap-2 pointer-events-auto">
        {open && actions.map(({ label, icon: Icon, action, title, description, confirmLabel }) => (
          <button
            key={label}
            onClick={() => {
              setOpen(false);
              setPendingAction({ label, action, title, description, confirmLabel });
            }}
            className="flex min-h-12 items-center gap-3 rounded-2xl border border-primaryTint bg-white px-4 py-3 font-black text-ink shadow-[0_18px_44px_rgba(42,41,56,0.22)] ring-1 ring-white/80"
          >
            {label}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
              <Icon size={18} />
            </span>
          </button>
        ))}
        <button
          onClick={() => setOpen(!open)}
          className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-soft transition ${open ? "rotate-45 bg-ink" : "bg-primary"}`}
          aria-label={open ? "Cerrar acciones" : "Abrir acciones"}
        >
          <Plus size={25} />
        </button>
      </div>
    </div>
      {pendingAction && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(42,41,56,0.28)] px-5 py-8">
          <div className="w-full max-w-sm rounded-[28px] border border-line bg-white p-4 text-center shadow-phone">
            <p className="text-xs font-black uppercase tracking-wide text-primary">Confirmación</p>
            <h3 className="mt-2 text-xl font-black text-ink">{pendingAction.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{pendingAction.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <PrimaryButton onClick={() => { const action = pendingAction.action; setPendingAction(null); action(); }}>{pendingAction.confirmLabel}</PrimaryButton>
              <SecondaryButton onClick={() => setPendingAction(null)}>Volver</SecondaryButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Landing({ go }: { go: (screen: Screen) => void }) {
  type OnboardingTone = "primary" | "care" | "warm";
  const slides: Array<{ title: string; text: string; tone: OnboardingTone; icon: typeof HeartHandshake }> = [
    {
      title: "Del caos a la calma",
      text: "Encontrá el orden en el flujo de información diaria y transformá el cuidado familiar en algo simple y compartido.",
      tone: "primary",
      icon: HeartHandshake
    },
    {
      title: "Tu asistente virtual: Memo",
      text: "Contale por WhatsApp qué necesitás hacer, compartile documentos o tareas, y Memo clasificará y guardará todo por persona y tipo.",
      tone: "care",
      icon: Paperclip
    },
    {
      title: "Coordiná con tu red",
      text: "Gestioná permisos y tareas con tu familia o cuidadores. Podés compartir información incluso con quienes no usan la app.",
      tone: "warm",
      icon: Users
    },
    {
      title: "Acceso rápido y seguro",
      text: "Toda la información importante, al instante. Filtrá, buscá y almacená lo esencial para tener siempre a mano lo que necesitás.",
      tone: "primary",
      icon: ShieldCheck
    }
  ];
  const [step, setStep] = useState(0);
  const slide = slides[step];
  const Icon = slide.icon;
  const isLast = step === slides.length - 1;
  const toneStyles: Record<OnboardingTone, { section: string; panel: string; icon: string; pill: string; button: string }> = {
    primary: {
      section: "bg-primaryTint",
      panel: "bg-primarySoft",
      icon: "bg-white/75 text-primary",
      pill: "bg-white/75 text-primary",
      button: "bg-primary"
    },
    care: {
      section: "bg-careTint",
      panel: "bg-careSoft",
      icon: "bg-white/75 text-care",
      pill: "bg-white/75 text-care",
      button: "bg-care"
    },
    warm: {
      section: "bg-warmSoft",
      panel: "bg-white",
      icon: "bg-warmSoft text-warm",
      pill: "bg-warmSoft text-warm",
      button: "bg-warm"
    }
  };
  const activeTone = toneStyles[slide.tone];

  return (
    <section className={`relative -mx-4 flex min-h-screen flex-col justify-between overflow-hidden px-4 py-4 ${activeTone.section}`}>
      <OnboardingMotifs tone={slide.tone} step={step} />
      <div className="relative z-10 flex justify-end">
        {!isLast && (
          <button onClick={() => go("dashboard")} className={`rounded-full px-4 py-2 text-sm font-bold shadow-sm ${activeTone.pill}`}>
            Saltar
          </button>
        )}
      </div>
      <div className="relative z-10 flex flex-1 items-center">
        <div className={`w-full rounded-[44px] p-7 text-ink shadow-phone ${activeTone.panel}`}>
          <div className="mb-12 flex items-center justify-between">
            <div className={`rounded-2xl p-3 ${activeTone.icon}`}><Icon size={28} /></div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${activeTone.pill}`}>Salud en equipo</span>
          </div>
          <h1 className="text-3xl font-black leading-tight">{slide.title}</h1>
          <p className="mt-5 text-base leading-7 text-muted">{slide.text}</p>
        </div>
      </div>
      <div className="relative z-10 pb-2">
        <div className="mb-4 flex justify-center gap-2">
          {slides.map((item, index) => (
            <span
              key={item.title}
              className={`h-2 rounded-full transition-all ${index === step ? "w-8 bg-ink" : "w-2 bg-ink/20"}`}
            />
          ))}
        </div>
        <button
          onClick={() => isLast ? go("dashboard") : setStep((current) => current + 1)}
          className={`flex min-h-12 w-full items-center justify-center rounded-2xl px-4 py-3 font-black text-white shadow-sm transition active:scale-[0.98] ${activeTone.button}`}
        >
          {isLast ? "Comenzar" : "Siguiente"}
        </button>
      </div>
    </section>
  );
}

function OnboardingMotifs({ tone, step }: { tone: "primary" | "care" | "warm"; step: number }) {
  const color = tone === "care" ? "#5A8B78" : tone === "warm" ? "#C47A2B" : "#7B6FAD";
  const soft = tone === "care" ? "#B8DAC8" : tone === "warm" ? "#EFC899" : "#D9D4EF";

  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-80" aria-hidden="true">
      <svg className="absolute -right-10 top-20 h-44 w-44" viewBox="0 0 180 180" fill="none">
        <circle cx="88" cy="88" r="58" stroke={color} strokeWidth="10" opacity="0.16" />
        <circle cx="88" cy="88" r="26" fill={soft} opacity="0.28" />
        <path d="M38 112c26-32 55-44 104-38" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.14" />
      </svg>
      <svg className="absolute -left-8 bottom-28 h-40 w-40" viewBox="0 0 160 160" fill="none">
        <rect x="30" y="34" width="92" height="92" rx="28" fill="white" opacity="0.18" />
        <path d="M45 58h58M45 78h42M45 98h64" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.18" />
      </svg>
      <svg className="absolute left-8 top-24 h-24 w-24" viewBox="0 0 96 96" fill="none">
        {step === 0 && <path d="M20 50c14-20 35-26 56-18M23 67c18-15 34-17 51-7" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.22" />}
        {step === 1 && <path d="M27 31h42a9 9 0 0 1 9 9v21a9 9 0 0 1-9 9H45L29 81v-11h-2a9 9 0 0 1-9-9V40a9 9 0 0 1 9-9Z" fill="white" opacity="0.24" />}
        {step === 2 && <path d="M48 24v48M24 48h48M32 32l32 32M64 32L32 64" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.18" />}
        {step === 3 && <path d="M48 18l24 10v18c0 18-10 29-24 36-14-7-24-18-24-36V28l24-10Z" fill="white" opacity="0.24" />}
      </svg>
      <div className="absolute bottom-24 right-8 h-16 w-16 rounded-[22px] bg-white/20 shadow-soft" />
      <div className="absolute left-10 top-1/2 h-3 w-16 rounded-full bg-white/30" />
    </div>
  );
}

function ChatSimulation({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm">Entrada externa</span>
        <span className="rounded-full bg-primarySoft px-3 py-1 text-xs font-bold text-muted">Captura externa</span>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-ink">Ingreso desde WhatsApp</h1>
        <p className="text-sm leading-6 text-muted">
          Marina reenvía una receta al contacto Memo. El sistema lee la imagen, pregunta lo mínimo necesario y deja listo el guardado.
        </p>
      </div>
      <MockPhoneFrame>
        <div className="rounded-t-[28px] bg-care px-4 py-3 text-white">
          <p className="text-xs font-semibold opacity-90">Chat de captura</p>
          <div className="mt-1 flex items-center gap-3">
            <PersonAvatar name="M" />
            <div><p className="font-bold">Memo</p><p className="text-xs opacity-90">Recibe archivos y prepara la clasificación</p></div>
          </div>
        </div>
        <div className="space-y-3 bg-careSoft p-3">
          <ChatBubble mine>Te reenvío esta receta de mamá.</ChatBubble>
          <ChatBubble mine>
            <div className="flex items-center gap-3"><Paperclip size={18} /><div><b>IMG_3482.jpg</b><p className="text-xs">Receta médica</p></div></div>
          </ChatBubble>
          <ChatBubble>
            Parece una receta médica. ¿Para quién la guardo?<br /><br />
            1. Mamá Elena<br />
            2. Tomás<br />
            3. Lucía<br />
            4. Otro
          </ChatBubble>
          <ChatBubble mine>1</ChatBubble>
          <ChatBubble>
            <b>Detecté estos datos:</b><br />
            Fecha: 20 de mayo<br />Paciente: Mamá Elena<br />Tipo: Receta médica<br />Medicación: Losartán 50 mg<br />Frecuencia: 1 comprimido por día<br />Origen: WhatsApp<br /><br />
            ¿Qué querés hacer?<br />
            1. Editar datos<br />
            2. Guardar<br />
            3. Guardar y crear recordatorio
          </ChatBubble>
          <ChatBubble mine>3</ChatBubble>
          <ChatBubble>
            Listo. Guardé la receta en Mamá Elena. También puedo sugerirte un recordatorio para Losartán 50 mg.
          </ChatBubble>
        </div>
      </MockPhoneFrame>
      <PrimaryButton className="w-full" onClick={() => go("landing")}>Continuar</PrimaryButton>
    </div>
  );
}

function Classification({ go, saved, setSaved }: { go: (screen: Screen) => void; saved: boolean; setSaved: (value: boolean) => void }) {
  const fields = [
    ["Paciente", "Mamá Elena"],
    ["Categoría", "Receta médica"],
    ["Medicamento", "Losartán 50 mg"],
    ["Especialidad", "Cardiología"],
    ["Fecha", "20/05/2026"],
    ["Fuente", "WhatsApp"]
  ];
  return (
    <div className="space-y-4">
      {saved && <div className="rounded-2xl bg-careSoft p-4 font-semibold text-careDeep">Guardado en Mamá Elena &gt; Recetas &gt; Cardiología</div>}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">Revisar clasificación</h2>
          <StatusBadge status={saved ? "Confirmado" : "Pendiente de confirmar"} tone={saved ? "green" : "amber"} />
        </div>
        <div className="divide-y divide-line">
          {fields.map(([label, value]) => <FieldRow key={label} label={label} value={value} />)}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["medicación", "presión arterial", "cardiología", "receta"].map((tag) => <Chip key={tag}>{tag}</Chip>)}
        </div>
      </Card>
      <ConfirmActionButton
        className="w-full"
        title="¿Guardar en Mamá Elena?"
        description="La receta se va a incorporar al historial de Mamá Elena y quedará disponible para el evento de cardiología."
        confirmLabel="Guardar"
        onConfirm={() => { setSaved(true); setTimeout(() => go("dashboard"), 550); }}
      >
        Guardar en archivo de Mamá Elena
      </ConfirmActionButton>
      <ConfirmActionButton
        className="w-full"
        variant="secondary"
        title="¿Guardar y crear recordatorio?"
        description="Además de guardar la receta, se dejará lista la sugerencia para crear el recordatorio de Losartán 50 mg."
        confirmLabel="Guardar"
        onConfirm={() => { setSaved(true); setTimeout(() => go("dashboard"), 550); }}
      >
        <Bell size={16} /> Guardar y crear recordatorio
      </ConfirmActionButton>
      <div className="grid grid-cols-2 gap-3">
        <SecondaryButton>Cambiar paciente</SecondaryButton>
        <SecondaryButton>Editar datos</SecondaryButton>
      </div>
    </div>
  );
}

function Dashboard({
  go,
  companionAssignment,
  situations
}: {
  go: (screen: Screen) => void;
  companionAssignment: string | null;
  situations: Situation[];
}) {
  const newEvent = situations.find((situation) => situation.id === "situation-cardio") ?? situations[0];
  const mainIngress = processedIngresses[0];

  return (
    <div className="space-y-5">
      <div><h1 className="text-3xl font-black">Hola, Marina</h1><p className="text-muted">Esto necesita atención hoy.</p></div>
      {newEvent && (
        <button onClick={() => go("event")} className="w-full text-left">
          <Card className="relative overflow-hidden border-primaryTint bg-primarySoft">
            <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-attention ring-4 ring-attentionSoft" aria-label="Movimiento nuevo" />
            <div className="pr-8">
              <div className="flex items-center gap-2">
                <StatusBadge status="Evento nuevo" tone="blue" />
                <span className="text-xs font-black text-muted">Desde WhatsApp</span>
              </div>
              <p className="mt-4 text-sm font-bold text-primary">{newEvent.patient}</p>
              <h2 className="mt-1 text-2xl font-black text-ink">{newEvent.title}</h2>
              <p className="mt-1 text-sm font-semibold text-muted">{newEvent.date} · {newEvent.time} · {newEvent.place}</p>
              <p className="mt-3 text-sm leading-6 text-muted">La receta recibida quedó guardada y vinculada a este control. El sistema sugiere crear un recordatorio de medicación.</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <StatusBadge status={newEvent.status} tone={toneForStatus(newEvent.status)} />
                <span className="flex items-center gap-1 text-sm font-black text-primary">Preparar evento <ChevronRight size={17} /></span>
              </div>
            </div>
          </Card>
        </button>
      )}

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-primary">Actividad reciente</p>
            <h2 className="mt-1 text-xl font-black">Ingreso organizado por el sistema</h2>
            <p className="mt-1 text-sm leading-6 text-muted">La app muestra lo que ya fue procesado y lo que necesita una acción puntual.</p>
          </div>
          <StatusBadge status="Nuevo" tone="blue" />
        </div>
        <div className="mt-4">
          <ProcessedIngressCard item={mainIngress} onClick={() => go("event")} />
        </div>
      </Card>

      <Card>
        <p className="text-sm font-bold text-primary">Acción sugerida</p>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-ink">Crear recordatorio para Mamá Elena</h2>
            <p className="mt-1 text-sm leading-6 text-muted">La receta indica Losartán 50 mg, 1 comprimido por día. Podés activar un mensaje automático para las 20:00.</p>
          </div>
          <StatusBadge status="Sugerido" tone="amber" />
        </div>
        <ConfirmActionButton
          className="mt-4 w-full"
          title="¿Crear recordatorio?"
          description="Vas a revisar el mensaje automático sugerido antes de guardarlo."
          confirmLabel="Crear"
          onConfirm={() => go("support")}
        >
          Crear recordatorio
        </ConfirmActionButton>
      </Card>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-primary">Coordinación pendiente</p>
            <h2 className="mt-1 text-xl font-black">{companionAssignment ? "Acompañante asignado" : "Acompañante por asignar"}</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              {companionAssignment ? `Asignada a acompañante ${companionAssignment} para el control de Mamá Elena.` : "Podés enviarle a un acompañante solo los datos de este control."}
            </p>
          </div>
          <StatusBadge status={companionAssignment ? "Asignada" : "Pendiente"} tone={companionAssignment ? "green" : "amber"} />
        </div>
        <ConfirmActionButton
          className="mt-4 w-full"
          variant="secondary"
          title="¿Sumar acompañante?"
          description="Vas a elegir qué información de este evento se comparte por WhatsApp."
          confirmLabel="Continuar"
          onConfirm={() => go("delegate")}
        >
          Sumar acompañante
        </ConfirmActionButton>
      </Card>
    </div>
  );
}

function AgendaScreen({
  go,
  situations,
  setSituations,
  createToken,
  createIntent
}: {
  go: (screen: Screen) => void;
  situations: Situation[];
  setSituations: (situations: Situation[]) => void;
  createToken: number;
  createIntent: ManualIntent;
}) {
  const emptyDraft: SituationDraft = { kind: createIntent, title: "", patient: "", date: "", time: "", place: "", status: "Borrador", source: "Manual" };
  const [mode, setMode] = useState<"list" | "new" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);

  const draftForIntent = (intent: ManualIntent) => ({
    kind: intent,
    title: intent === "Evento médico" ? "Control clínico" : intent === "Trámite" ? "Autorizar estudio" : intent === "Documento" ? "Adjuntar resultado" : "Recordatorio de medicación",
    patient: "Mamá Elena",
    date: intent === "Documento" ? "Hoy" : "Viernes 26/06",
    time: intent === "Documento" ? "09:30" : "10:00",
    place: intent === "Trámite" ? "Obra social" : intent === "Documento" ? "Archivo familiar" : "Centro Médico Norte",
    status: "Borrador",
    source: "Manual" as const
  });

  const startNew = (intent: ManualIntent = createIntent) => {
    setDraft(draftForIntent(intent));
    setEditingId(null);
    setMode("new");
  };

  useEffect(() => {
    if (createToken > 0) startNew(createIntent);
  }, [createToken]);

  const startEdit = (situation: Situation) => {
    setDraft({ kind: situation.kind, title: situation.title, patient: situation.patient, date: situation.date, time: situation.time, place: situation.place, status: situation.status, source: situation.source });
    setEditingId(situation.id);
    setMode("edit");
  };
  const saveSituation = () => {
    if (!draft.title.trim() || !draft.patient.trim()) return;
    if (mode === "edit" && editingId) {
      setSituations(situations.map((situation) => situation.id === editingId ? { ...situation, ...draft } : situation));
    } else {
      setSituations([...situations, { id: `situation-${Date.now()}`, ...draft }]);
    }
    setMode("list");
    setEditingId(null);
    setDraft(emptyDraft);
  };
  const deleteSituation = (id: string) => {
    setSituations(situations.filter((situation) => situation.id !== id));
  };

  return (
    <div className="space-y-4">
      <SectionTitle title="Agenda" subtitle="Eventos, gestiones, documentos y recordatorios cargados por sistema o manualmente." />
      {mode === "list" && (
        <>
          <Card>
            <p className="font-black text-ink">Carga manual</p>
            <p className="mt-1 text-sm leading-6 text-muted">Usá la app directamente cuando necesitás agendar, adjuntar o crear una gestión sin pasar por WhatsApp.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <ConfirmActionButton variant="secondary" title="¿Crear evento?" description="Se abrirá el formulario para cargar un evento médico manualmente." confirmLabel="Crear" onConfirm={() => startNew("Evento médico")}><Calendar size={16} /> Evento</ConfirmActionButton>
              <ConfirmActionButton variant="secondary" title="¿Crear gestión?" description="Se abrirá el formulario para cargar una gestión o trámite." confirmLabel="Crear" onConfirm={() => startNew("Trámite")}><ClipboardList size={16} /> Gestión</ConfirmActionButton>
              <ConfirmActionButton variant="secondary" title="¿Adjuntar documento?" description="Se abrirá el formulario para cargar un documento manualmente." confirmLabel="Adjuntar" onConfirm={() => startNew("Documento")}><Paperclip size={16} /> Documento</ConfirmActionButton>
              <ConfirmActionButton variant="secondary" title="¿Crear recordatorio?" description="Se abrirá el formulario para cargar un recordatorio." confirmLabel="Crear" onConfirm={() => startNew("Recordatorio")}><Bell size={16} /> Recordatorio</ConfirmActionButton>
            </div>
          </Card>
          {situations.length === 0 && (
            <Card>
              <p className="font-black text-ink">Sin movimientos cargados</p>
              <p className="mt-1 text-sm leading-6 text-muted">Cuando agregues algo manualmente o el sistema organice un ingreso, va a aparecer acá.</p>
            </Card>
          )}
          {situations.map((situation) => (
            <Card key={situation.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-ink">{situation.title}</p>
                  <p className="mt-1 text-sm text-muted">{situation.kind} · {situation.patient} · {situation.date} · {situation.time}</p>
                  <p className="text-sm text-muted">{situation.place}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={situation.status} tone={toneForStatus(situation.status)} />
                  <p className="mt-2 text-xs font-bold text-muted">{situation.source}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <ConfirmActionButton
                  variant="secondary"
                  title="¿Modificar este movimiento?"
                  description="Vas a abrir sus datos para editar paciente, fecha, lugar o estado."
                  confirmLabel="Modificar"
                  onConfirm={() => startEdit(situation)}
                >
                  <Pencil size={16} /> Modificar
                </ConfirmActionButton>
                <ConfirmActionButton
                  variant="secondary"
                  title="¿Eliminar este movimiento?"
                  description="Se quitará de la agenda. Esta acción evita borrar por error una gestión o evento."
                  confirmLabel="Eliminar"
                  onConfirm={() => deleteSituation(situation.id)}
                >
                  <Trash2 size={16} /> Eliminar
                </ConfirmActionButton>
              </div>
            </Card>
          ))}
        </>
      )}
      {mode !== "list" && (
        <Card className="space-y-3">
          <p className="font-black text-ink">{mode === "new" ? `Agregar ${draft.kind.toLowerCase()}` : "Modificar situación"}</p>
          <div className="grid grid-cols-2 gap-2">
            {(["Evento médico", "Trámite", "Documento", "Recordatorio"] as ManualIntent[]).map((kind) => (
              <button
                key={kind}
                onClick={() => setDraft({ ...draftForIntent(kind), title: draft.title || draftForIntent(kind).title, patient: draft.patient || "Mamá Elena" })}
                className={`rounded-2xl px-3 py-2 text-xs font-black ${draft.kind === kind ? "bg-primary text-white" : "bg-primarySoft text-muted"}`}
              >
                {kind}
              </button>
            ))}
          </div>
          <MockInput label="Título" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} />
          <MockInput label="Paciente" value={draft.patient} onChange={(value) => setDraft({ ...draft, patient: value })} />
          <MockInput label="Fecha" value={draft.date} onChange={(value) => setDraft({ ...draft, date: value })} />
          <MockInput label="Hora" value={draft.time} onChange={(value) => setDraft({ ...draft, time: value })} />
          <MockInput label="Lugar" value={draft.place} onChange={(value) => setDraft({ ...draft, place: value })} />
          <MockInput label="Estado" value={draft.status} onChange={(value) => setDraft({ ...draft, status: value })} />
          <div className="grid grid-cols-2 gap-2">
            <ConfirmActionButton
              title={mode === "new" ? "¿Crear este movimiento?" : "¿Guardar cambios?"}
              description={mode === "new" ? "Se va a agregar a la agenda con los datos cargados." : "Se van a actualizar los datos de este movimiento."}
              confirmLabel={mode === "new" ? "Crear" : "Guardar"}
              onConfirm={saveSituation}
            >
              Guardar
            </ConfirmActionButton>
            <ConfirmActionButton
              variant="secondary"
              title="¿Cancelar sin guardar?"
              description="Los cambios cargados en este formulario se van a descartar."
              confirmLabel="Cancelar"
              onConfirm={() => setMode("list")}
            >
              Cancelar
            </ConfirmActionButton>
          </div>
        </Card>
      )}
    </div>
  );
}

function PatientProfile({
  go,
  patientCreateToken,
  companionCreateToken
}: {
  go: (screen: Screen) => void;
  patientCreateToken: number;
  companionCreateToken: number;
}) {
  type ManagedPatient = {
    id: string;
    name: string;
    age: string;
    condition: string;
    companions: string[];
    history: Array<{ title: string; detail: string }>;
  };
  type ManagedCompanion = { id: string; name: string; role: string; access: string; patients: string[] };

  const [tab, setTab] = useState<"patients" | "companions">("patients");
  const [patients, setPatients] = useState<ManagedPatient[]>([
    {
      id: "elena",
      name: "Mamá Elena",
      age: "72",
      condition: "Hipertensión",
      companions: ["Pablo", "Laura"],
      history: [
        { title: "Receta Losartán 50 mg", detail: "Receta · WhatsApp · 20/05/2026" },
        { title: "ECG 2025", detail: "Estudio · PDF · 10/12/2025" },
        { title: "Laboratorio abril 2026", detail: "Laboratorio · PDF · 12/04/2026" },
        { title: "Orden control cardiológico", detail: "Orden médica · Foto · 18/05/2026" }
      ]
    },
    {
      id: "tomas",
      name: "Tomás",
      age: "9",
      condition: "Vacunas y controles pediátricos",
      companions: ["Marina", "Pablo"],
      history: [
        { title: "Carnet de vacunas", detail: "Credencial · Foto · 15/05/2026" },
        { title: "Audio: turno pediatra", detail: "Turno · WhatsApp · 21/05/2026" }
      ]
    },
    {
      id: "lucia",
      name: "Lucía",
      age: "15",
      condition: "Controles clínicos",
      companions: ["Marina"],
      history: [
        { title: "Resultado laboratorio.pdf", detail: "Laboratorio · PDF · 18/05/2026" }
      ]
    }
  ]);
  const [companions, setCompanions] = useState<ManagedCompanion[]>([
    { id: "pablo", name: "Pablo Gómez", role: "Familiar colaborador", access: "Turnos y documentos del evento", patients: ["Mamá Elena", "Tomás"] },
    { id: "laura", name: "Laura", role: "Cuidadora ocasional", access: "Solo eventos asignados", patients: ["Mamá Elena"] }
  ]);
  const [selectedPatientId, setSelectedPatientId] = useState("elena");
  const [patientFormOpen, setPatientFormOpen] = useState<"new" | "edit" | null>(null);
  const [companionFormOpen, setCompanionFormOpen] = useState<"new" | "edit" | null>(null);
  const [companionConfirm, setCompanionConfirm] = useState<"cancel" | "save" | null>(null);
  const [editingCompanionId, setEditingCompanionId] = useState<string | null>(null);
  const [patientDraft, setPatientDraft] = useState({ name: "", age: "", condition: "" });
  const [companionDraft, setCompanionDraft] = useState({ name: "", role: "", access: "", patients: "" });
  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) ?? patients[0];

  const openPatientForm = (mode: "new" | "edit", patient = selectedPatient) => {
    setPatientFormOpen(mode);
    setPatientDraft(mode === "edit" && patient ? {
      name: patient.name,
      age: patient.age,
      condition: patient.condition
    } : {
      name: "",
      age: "",
      condition: ""
    });
  };
  const savePatient = () => {
    if (!patientDraft.name.trim()) return;
    if (patientFormOpen === "edit" && selectedPatient) {
      setPatients((current) => current.map((patient) => patient.id === selectedPatient.id ? { ...patient, ...patientDraft } : patient));
    } else {
      const newPatient = {
        id: `patient-${Date.now()}`,
        ...patientDraft,
        companions: [],
        history: [{ title: "Historia médica iniciada", detail: "Alta manual · Hoy" }]
      };
      setPatients((current) => [...current, newPatient]);
      setSelectedPatientId(newPatient.id);
    }
    setPatientFormOpen(null);
  };
  const applySuggestedPatient = () => {
    setPatientDraft((current) => ({
      name: current.name || "Roberto Rivas",
      age: current.age || "68",
      condition: current.condition || "Control clínico y presión arterial"
    }));
  };
  const deletePatient = (patientId: string) => {
    setPatients((current) => {
      const next = current.filter((patient) => patient.id !== patientId);
      if (selectedPatientId === patientId && next[0]) setSelectedPatientId(next[0].id);
      return next;
    });
  };
  const openCompanionForm = (mode: "new" | "edit", companion = companions[0]) => {
    setCompanionFormOpen(mode);
    setEditingCompanionId(mode === "edit" && companion ? companion.id : null);
    setCompanionDraft(mode === "edit" && companion ? {
      name: companion.name,
      role: companion.role,
      access: companion.access,
      patients: companion.patients.join(", ")
    } : {
      name: "",
      role: "",
      access: "",
      patients: ""
    });
  };
  const saveCompanion = () => {
    if (!companionDraft.name.trim()) return;
    const companionData = {
      name: companionDraft.name,
      role: companionDraft.role,
      access: companionDraft.access,
      patients: companionDraft.patients.split(",").map((patient) => patient.trim()).filter(Boolean)
    };
    if (companionFormOpen === "edit") {
      setCompanions((current) => current.map((companion) => companion.id === editingCompanionId ? { ...companion, ...companionData } : companion));
    } else {
      setCompanions((current) => [...current, { id: `companion-${Date.now()}`, ...companionData }]);
    }
    setCompanionFormOpen(null);
    setCompanionConfirm(null);
    setEditingCompanionId(null);
  };
  const cancelCompanionForm = () => {
    setCompanionFormOpen(null);
    setCompanionConfirm(null);
    setEditingCompanionId(null);
  };
  const applySuggestedCompanionRole = () => {
    setCompanionDraft((current) => ({
      ...current,
      role: current.role || "Acompañante de consulta",
      access: current.access || "Puede ver datos de la cita, documentos adjuntos y checklist para llevar",
      patients: current.patients || "Mamá Elena"
    }));
  };

  useEffect(() => {
    if (patientCreateToken > 0) {
      setTab("patients");
      openPatientForm("new");
    }
  }, [patientCreateToken]);

  useEffect(() => {
    if (companionCreateToken > 0) {
      setTab("companions");
      openCompanionForm("new");
    }
  }, [companionCreateToken]);

  return (
    <div className="space-y-4">
      <SectionTitle title="Familia" subtitle="Gestioná pacientes, historial médico y acompañantes." />
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-primarySoft p-1">
        <button onClick={() => setTab("patients")} className={`rounded-xl px-3 py-2 text-sm font-black ${tab === "patients" ? "bg-white text-primary shadow-sm" : "text-muted"}`}>Pacientes</button>
        <button onClick={() => setTab("companions")} className={`rounded-xl px-3 py-2 text-sm font-black ${tab === "companions" ? "bg-white text-primary shadow-sm" : "text-muted"}`}>Acompañantes</button>
      </div>

      {tab === "patients" && (
        <>
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-black">Pacientes</p>
                <p className="text-sm text-muted">Alta, baja y modificación.</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {patients.map((patient) => {
                const isSelected = patient.id === selectedPatient.id;
                return (
                  <button key={patient.id} onClick={() => setSelectedPatientId(patient.id)} className={`flex items-center justify-between rounded-2xl border p-3 text-left ${isSelected ? "border-primary bg-primarySoft" : "border-line bg-white"}`}>
                    <div className="flex items-center gap-3">
                      <PersonAvatar name={patient.name.split(" ").map((part) => part[0]).join("").slice(0, 2)} />
                      <div>
                        <p className="font-black text-ink">{patient.name}</p>
                        <p className="text-sm text-muted">{patient.age} años · {patient.condition}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="text-primary" size={20} />}
                  </button>
                );
              })}
            </div>
          </Card>

          {patientFormOpen && (
            <Card className="space-y-3">
              <p className="font-black">{patientFormOpen === "new" ? "Alta de paciente" : "Modificar paciente"}</p>
              <MockInput label="Nombre" value={patientDraft.name} onChange={(value) => setPatientDraft({ ...patientDraft, name: value })} onFocus={applySuggestedPatient} hint="Tocá para crear una ficha sugerida" />
              <MockInput label="Edad" value={patientDraft.age} onChange={(value) => setPatientDraft({ ...patientDraft, age: value })} />
              <MockInput label="Dato de cuidado" value={patientDraft.condition} onChange={(value) => setPatientDraft({ ...patientDraft, condition: value })} />
              <div className="grid grid-cols-2 gap-2">
                <ConfirmActionButton
                  title={patientFormOpen === "new" ? "¿Crear paciente?" : "¿Guardar cambios?"}
                  description={patientFormOpen === "new" ? "Se va a crear una ficha familiar con los datos cargados." : "Se van a actualizar los datos de este paciente."}
                  confirmLabel={patientFormOpen === "new" ? "Crear" : "Guardar"}
                  onConfirm={savePatient}
                >
                  Guardar
                </ConfirmActionButton>
                <ConfirmActionButton
                  variant="secondary"
                  title="¿Cancelar sin guardar?"
                  description="Los datos cargados en este formulario se van a descartar."
                  confirmLabel="Cancelar"
                  onConfirm={() => setPatientFormOpen(null)}
                >
                  Cancelar
                </ConfirmActionButton>
              </div>
            </Card>
          )}

          {selectedPatient && (
            <Card>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-primary">Paciente seleccionado</p>
                  <h2 className="mt-1 text-2xl font-black">{selectedPatient.name}</h2>
                  <p className="mt-1 text-sm text-muted">{selectedPatient.age} años · {selectedPatient.condition}</p>
                </div>
                <div className="flex gap-2">
                  <ConfirmIconButton
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primarySoft text-primary"
                    ariaLabel="Modificar paciente"
                    title="¿Modificar paciente?"
                    description="Vas a abrir la ficha para editar sus datos principales."
                    confirmLabel="Modificar"
                    onConfirm={() => openPatientForm("edit")}
                  >
                    <Pencil size={17} />
                  </ConfirmIconButton>
                  <ConfirmIconButton
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-attentionSoft text-attention"
                    ariaLabel="Dar de baja paciente"
                    title="¿Dar de baja paciente?"
                    description="La ficha dejará de aparecer en la familia. Pedimos confirmación para evitar bajas accidentales."
                    confirmLabel="Dar de baja"
                    onConfirm={() => deletePatient(selectedPatient.id)}
                  >
                    <Trash2 size={17} />
                  </ConfirmIconButton>
                </div>
              </div>
              <div className="mt-4 divide-y divide-line">
                <FieldRow label="Acompañantes" value={selectedPatient.companions.join(", ") || "Sin acompañantes"} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <ConfirmActionButton
                  variant="secondary"
                  title="¿Preparar consulta?"
                  description="Vas a abrir el evento médico con documentos, notas y checklist vinculados."
                  confirmLabel="Abrir"
                  onConfirm={() => go("event")}
                >
                  Preparar consulta
                </ConfirmActionButton>
                <ConfirmActionButton
                  variant="secondary"
                  title="¿Sumar acompañante?"
                  description="Vas a preparar qué información de la consulta se comparte."
                  confirmLabel="Continuar"
                  onConfirm={() => go("delegate")}
                >
                  Sumar acompañante
                </ConfirmActionButton>
              </div>
            </Card>
          )}

          <SectionTitle title="Historial médico" subtitle="Documentos y eventos del paciente seleccionado." />
          {selectedPatient?.history.map((item) => (
            <Card key={item.title} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-black">{item.title}</p>
                <p className="text-sm text-muted">{item.detail}</p>
              </div>
              <FileText className="shrink-0 text-primary" />
            </Card>
          ))}
        </>
      )}

      {tab === "companions" && (
        <>
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-black">Acompañantes</p>
                <p className="text-sm text-muted">Personas que pueden ayudar con permisos claros.</p>
              </div>
            </div>
          </Card>

          {companions.map((companion) => (
            <Card key={companion.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <PersonAvatar name={companion.name.split(" ").map((part) => part[0]).join("").slice(0, 2)} />
                  <div>
                    <p className="font-black text-ink">{companion.name}</p>
                    <p className="text-sm text-muted">{companion.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <ConfirmIconButton
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primarySoft text-primary"
                    ariaLabel={`Modificar ${companion.name}`}
                    title="¿Modificar acompañante?"
                    description={`Vas a editar el rol y permisos de ${companion.name}.`}
                    confirmLabel="Modificar"
                    onConfirm={() => openCompanionForm("edit", companion)}
                  >
                    <Pencil size={17} />
                  </ConfirmIconButton>
                  <ConfirmIconButton
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-attentionSoft text-attention"
                    ariaLabel={`Dar de baja ${companion.name}`}
                    title="¿Dar de baja acompañante?"
                    description={`${companion.name} dejará de figurar como acompañante disponible.`}
                    confirmLabel="Dar de baja"
                    onConfirm={() => setCompanions((current) => current.filter((item) => item.id !== companion.id))}
                  >
                    <Trash2 size={17} />
                  </ConfirmIconButton>
                </div>
              </div>
              <div className="mt-4 divide-y divide-line">
                <FieldRow label="Permiso" value={companion.access} />
                <FieldRow label="Pacientes" value={companion.patients.join(", ") || "Sin asignar"} />
              </div>
            </Card>
          ))}
        </>
      )}

      {companionFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/35 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-line bg-white p-4 shadow-phone">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-primary">Acompañante</p>
                <h2 className="mt-1 text-xl font-black text-ink">{companionFormOpen === "new" ? "Alta de acompañante" : "Modificar acompañante"}</h2>
                <p className="mt-1 text-sm leading-6 text-muted">Cargá solo los datos necesarios para compartir permisos claros.</p>
              </div>
              <button
                onClick={() => setCompanionConfirm("cancel")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primarySoft text-primary"
                aria-label="Cerrar alta de acompañante"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <MockInput label="Nombre" value={companionDraft.name} onChange={(value) => setCompanionDraft({ ...companionDraft, name: value })} />
              <MockInput label="Rol" value={companionDraft.role} onChange={(value) => setCompanionDraft({ ...companionDraft, role: value })} onFocus={applySuggestedCompanionRole} hint="Tocá para crear un rol sugerido" />
              <MockInput label="Permiso" value={companionDraft.access} onChange={(value) => setCompanionDraft({ ...companionDraft, access: value })} />
              <MockInput label="Pacientes asignados" value={companionDraft.patients} onChange={(value) => setCompanionDraft({ ...companionDraft, patients: value })} />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <PrimaryButton onClick={() => setCompanionConfirm("save")}>Guardar</PrimaryButton>
                <SecondaryButton onClick={() => setCompanionConfirm("cancel")}>Cancelar</SecondaryButton>
              </div>
            </div>
          </div>
          {companionConfirm && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink/30 px-6">
              <div className="w-full max-w-sm rounded-[28px] border border-line bg-white p-4 text-center shadow-phone">
                <p className="text-xs font-black uppercase tracking-wide text-primary">
                  {companionConfirm === "save" ? "Confirmar alta" : "Cancelar carga"}
                </p>
                <h3 className="mt-2 text-xl font-black text-ink">
                  {companionConfirm === "save" ? "¿Crear acompañante?" : "¿Cancelar sin guardar?"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {companionConfirm === "save"
                    ? "Se va a agregar esta persona como acompañante con los permisos indicados."
                    : "Los datos cargados en este formulario se van a descartar."}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <PrimaryButton onClick={companionConfirm === "save" ? saveCompanion : cancelCompanionForm}>
                    {companionConfirm === "save" ? "Crear" : "Sí, cancelar"}
                  </PrimaryButton>
                  <SecondaryButton onClick={() => setCompanionConfirm(null)}>Volver</SecondaryButton>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MedicalEvent({ go }: { go: (screen: Screen) => void }) {
  const [prepEditing, setPrepEditing] = useState(false);

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm font-semibold text-primary">Mamá Elena</p>
        <h1 className="mt-1 text-2xl font-black">Control cardiología — Dr. Ruiz</h1>
        <p className="mt-2 text-muted">Mañana, 10:30</p>
        <div className="mt-4 h-3 rounded-full bg-primarySoft"><div className="h-3 w-4/5 rounded-full bg-care" /></div>
        <p className="mt-2 text-sm font-bold text-care">80% preparado</p>
      </Card>
      <Card>
        <div className="flex items-start justify-between gap-3">
          <SectionTitle title="Datos de preparación" subtitle="La lista se arma con información cargada y archivos vinculados." />
          <ConfirmActionButton
            variant="secondary"
            className={`min-h-0 rounded-full px-3 py-2 text-xs shadow-sm ${prepEditing ? "bg-primary text-white" : "bg-white text-primary"}`}
            title={prepEditing ? "¿Salir de edición?" : "¿Editar preparación?"}
            description={prepEditing ? "Se ocultarán los controles de edición de los datos de preparación." : "Se mostrarán controles para modificar los datos vinculados al turno."}
            confirmLabel={prepEditing ? "Salir" : "Editar"}
            onConfirm={() => setPrepEditing(!prepEditing)}
          >
            Edición
          </ConfirmActionButton>
        </div>
        <div className="mt-4 divide-y divide-line">
          <PrepFieldRow label="Turno cargado" value="Cardiología · Dr. Ruiz" editing={prepEditing} />
          <PrepFieldRow label="Fecha y hora" value="30/05 · 10:30" editing={prepEditing} />
          <PrepFieldRow label="Dirección" value="Av. Santa Fe 2450" editing={prepEditing} />
          <PrepFieldRow label="Medicación activa" value="Losartán 50 mg" editing={prepEditing} />
          <PrepFieldRow label="Notas para consulta" value="3 cargadas" editing={prepEditing} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-careSoft p-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-care">
              <MapPin size={18} />
            </span>
            <div>
              <p className="font-black text-ink">Ubicación guardada</p>
              <p className="text-sm text-muted">Geotag listo para abrir en Google Maps</p>
            </div>
          </div>
          <button className="rounded-full bg-white px-3 py-2 text-xs font-black text-primary shadow-sm">Mapa</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["ECG 2025", "Laboratorio abril", "Receta Losartán", "Orden médica", "Credencial"].map((file) => (
            <Chip key={file} active>{file}</Chip>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <ConfirmActionButton
            variant="secondary"
            title="¿Editar turno?"
            description="Vas a modificar los datos centrales de la cita."
            confirmLabel="Editar"
            onConfirm={() => setPrepEditing(true)}
          >
            Editar turno
          </ConfirmActionButton>
          <ConfirmActionButton
            variant="secondary"
            title="¿Añadir imagen?"
            description="Se abrirá el flujo para sumar una imagen al evento."
            confirmLabel="Añadir"
            onConfirm={() => undefined}
          >
            Añadir imagen
          </ConfirmActionButton>
          <ConfirmActionButton
            variant="secondary"
            title="¿Agregar nota?"
            description="Vas a ir a la sección de notas para cargar una nueva observación."
            confirmLabel="Agregar"
            onConfirm={() => document.getElementById("notas-consulta")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            Agregar nota
          </ConfirmActionButton>
          <ConfirmActionButton
            variant="secondary"
            title="¿Sumar acompañante?"
            description="Vas a preparar qué datos de este turno se comparten por WhatsApp."
            confirmLabel="Continuar"
            onConfirm={() => go("delegate")}
          >
            Sumar acompañante
          </ConfirmActionButton>
        </div>
      </Card>
      <PackingList />
      <ConsultationNotes />
      <Checklist title="Preparación práctica" subtitle="Sugerido para este turno" items={["Revisar estudios", "Confirmar dirección", "Llevar credencial", "Avisar a acompañante"]} />
      <Card><SectionTitle title="Archivos vinculados" subtitle="ECG_2025.pdf · Laboratorio_Abril.pdf · Receta_Losartan.jpg · Orden_Control.pdf" /></Card>
      <ConfirmActionButton
        className="w-full"
        title="¿Compartir con acompañante?"
        description="Vas a elegir acompañante, notas y documentos para armar el mensaje de WhatsApp."
        confirmLabel="Continuar"
        onConfirm={() => go("delegate")}
      >
        Compartir con acompañante
      </ConfirmActionButton>
    </div>
  );
}

function DelegateCare({
  go,
  accessSent,
  setAccessSent,
  onCompanionAssigned
}: {
  go: (screen: Screen) => void;
  accessSent: boolean;
  setAccessSent: (v: boolean) => void;
  onCompanionAssigned: (name: string) => void;
}) {
  const companions = [
    { id: "pablo", name: "Pablo Gómez", shortName: "Pablo", role: "Familiar colaborador" },
    { id: "laura", name: "Laura", shortName: "Laura", role: "Cuidadora ocasional" }
  ];
  const notesForMessage = [
    { id: "nota-1", text: "Falta de aire al caminar" },
    { id: "nota-2", text: "Mareos leves por la mañana" },
    { id: "nota-3", text: "Consultar ajuste de medicación" }
  ];
  const documentsForMessage = [
    { id: "doc-1", title: "Receta_Losartan.jpg", meta: "Adjuntado 09:16" },
    { id: "doc-2", title: "Orden_Control.jpg", meta: "Adjuntado 09:18" },
    { id: "doc-3", title: "Credencial_Elena.jpg", meta: "Adjuntado 09:19" },
    { id: "doc-4", title: "Laboratorio_Abril.pdf", meta: "Adjuntado 09:21" }
  ];
  const packingForMessage = [
    { id: "llevar-1", text: "ECG 2025" },
    { id: "llevar-2", text: "Laboratorio abril 2026" },
    { id: "llevar-3", text: "Lista de medicación actual" },
    { id: "llevar-4", text: "Orden médica" },
    { id: "llevar-5", text: "Credencial de obra social" }
  ];
  const [selectedCompanionId, setSelectedCompanionId] = useState("pablo");
  const [delegateStep, setDelegateStep] = useState<1 | 2 | 3>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedNoteIds, setSelectedNoteIds] = useState(notesForMessage.map((note) => note.id));
  const [selectedDocumentIds, setSelectedDocumentIds] = useState(documentsForMessage.map((document) => document.id));
  const [selectedPackingIds, setSelectedPackingIds] = useState(packingForMessage.map((item) => item.id));
  const selectedCompanion = companions.find((companion) => companion.id === selectedCompanionId) ?? companions[0];
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const matchesSearch = (value: string) => !normalizedSearch || value.toLowerCase().includes(normalizedSearch);
  const visibleNotes = notesForMessage.filter((note) => matchesSearch(note.text));
  const visibleDocuments = documentsForMessage.filter((document) => matchesSearch(document.title));
  const visiblePacking = packingForMessage.filter((item) => matchesSearch(item.text));
  const selectedNotes = notesForMessage.filter((note) => selectedNoteIds.includes(note.id));
  const selectedDocuments = documentsForMessage.filter((document) => selectedDocumentIds.includes(document.id));
  const selectedPacking = packingForMessage.filter((item) => selectedPackingIds.includes(item.id));

  const selectCompanion = (id: string) => {
    setSelectedCompanionId(id);
    setAccessSent(false);
    setSending(false);
  };
  const toggleSelected = (id: string, selectedIds: string[], setSelectedIds: (ids: string[]) => void) => {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((selectedId) => selectedId !== id) : [...selectedIds, id]);
    setAccessSent(false);
  };
  const moveToStep = (step: 1 | 2 | 3) => {
    setDelegateStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const sendMessage = () => {
    if (sending) return;
    setSending(true);
    setAccessSent(true);
    onCompanionAssigned(selectedCompanion.shortName);
    window.setTimeout(() => {
      go("dashboard");
      setAccessSent(false);
    }, 1300);
  };

  return (
    <div className="space-y-4">
      {accessSent && (
        <div className="send-confirmation rounded-[28px] bg-careSoft p-4 text-careDeep shadow-soft">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-care text-white">
              <Check size={22} />
            </span>
            <div>
              <p className="font-black">Mensaje enviado</p>
              <p className="text-sm font-semibold">Tarea asignada a acompañante {selectedCompanion.shortName}</p>
            </div>
          </div>
        </div>
      )}
      <SectionTitle title="Sumar acompañante" subtitle="Armá el mensaje en tres pasos." />
      <StepProgress current={delegateStep} />

      {delegateStep === 1 && (
        <>
          <Card>
            <StepHeader number="1" title="Elegir acompañante" text="Quién va a recibir la información del turno." />
            <div className="mt-4 grid gap-2">
              {companions.map((companion) => {
                const isSelected = companion.id === selectedCompanionId;
                return (
                  <button
                    key={companion.id}
                    className={`flex items-center justify-between rounded-2xl border p-3 text-left transition ${isSelected ? "border-primary bg-primarySoft" : "border-line bg-white"}`}
                    onClick={() => selectCompanion(companion.id)}
                  >
                    <div className="flex items-center gap-3">
                      <PersonAvatar name={companion.shortName} />
                      <div>
                        <p className="font-black text-ink">{companion.name}</p>
                        <p className="text-sm text-muted">{companion.role}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="text-primary" size={20} />}
                  </button>
                );
              })}
            </div>
          </Card>
          <ConfirmActionButton
            className="w-full"
            title="¿Usar este acompañante?"
            description={`El mensaje se va a preparar para ${selectedCompanion.name}.`}
            confirmLabel="Continuar"
            onConfirm={() => moveToStep(2)}
          >
            Continuar
          </ConfirmActionButton>
          <ConfirmActionButton
            className="w-full"
            variant="secondary"
            title="¿Volver al evento?"
            description="Se cerrará la preparación del mensaje y volverás a la pantalla del turno."
            confirmLabel="Volver"
            onConfirm={() => go("event")}
          >
            Volver al evento
          </ConfirmActionButton>
        </>
      )}

      {delegateStep === 2 && (
        <>
          <Card>
            <StepHeader number="2" title="Marcar qué se comparte" text="Notas, documentos y cosas para llevar que van a formar el mensaje." />
            <label className="mt-4 flex items-center gap-2 rounded-2xl bg-paper px-3 py-2 text-sm text-muted">
              <Search size={18} />
              <input
                className="w-full bg-transparent font-semibold text-ink outline-none placeholder:text-muted"
                placeholder="Buscar notas o documentos"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
          </Card>

          <SelectionGroup
            title="Notas para la consulta"
            subtitle="Se agregan al cuerpo del mensaje"
            items={visibleNotes.map((note) => ({ id: note.id, title: note.text }))}
            selectedIds={selectedNoteIds}
            onToggle={(id) => toggleSelected(id, selectedNoteIds, setSelectedNoteIds)}
          />

          <SelectionGroup
            title="Documentos adjuntos"
            subtitle="Ordenados por momento de adjuntado"
            items={visibleDocuments.map((document) => ({ id: document.id, title: document.title, meta: document.meta }))}
            selectedIds={selectedDocumentIds}
            onToggle={(id) => toggleSelected(id, selectedDocumentIds, setSelectedDocumentIds)}
            icon="file"
          />

          <SelectionGroup
            title="Cosas para llevar"
            subtitle="Se envían como checklist simple"
            items={visiblePacking.map((item) => ({ id: item.id, title: item.text }))}
            selectedIds={selectedPackingIds}
            onToggle={(id) => toggleSelected(id, selectedPackingIds, setSelectedPackingIds)}
          />

          <ConfirmActionButton
            className="w-full"
            title="¿Generar vista previa?"
            description="Se armará el mensaje de WhatsApp con las notas, documentos y checklist seleccionados."
            confirmLabel="Ver mensaje"
            onConfirm={() => moveToStep(3)}
          >
            Ver mensaje
          </ConfirmActionButton>
          <ConfirmActionButton
            className="w-full"
            variant="secondary"
            title="¿Volver a acompañante?"
            description="La selección actual queda preparada mientras volvés al paso anterior."
            confirmLabel="Volver"
            onConfirm={() => moveToStep(1)}
          >
            Volver
          </ConfirmActionButton>
        </>
      )}

      {delegateStep === 3 && (
        <>
          <StepHeader number="3" title="Mensaje de WhatsApp" text="Vista previa generada con los checks seleccionados." />
          <MockPhoneFrame scroll>
            <div className="bg-care px-4 py-3 text-white">
              <p className="text-xs font-bold">Mensaje saliente</p>
              <div className="mt-2 flex items-center gap-3">
                <PersonAvatar name={selectedCompanion.shortName} />
                <div>
                  <p className="font-black">{selectedCompanion.name}</p>
                  <p className="text-xs text-careSoft">Acompañante del turno</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 bg-careSoft p-4">
              <ChatBubble mine>
                <p className="font-bold">Hola {selectedCompanion.shortName}, Marina te comparte el control de cardiología de Mamá Elena.</p>
                <div className="mt-3 space-y-1 text-sm">
                  <p><b>1. Datos de la cita</b></p>
                  <p>✓ 30/05 · 10:30</p>
                  <p>✓ Cardiología · Dr. Ruiz</p>
                  <p>✓ Av. Santa Fe 2450</p>
                  <p>✓ Ubicación guardada para abrir en Google Maps</p>
                </div>
              </ChatBubble>
              {selectedNotes.length > 0 && (
                <ChatBubble mine>
                  <p className="font-bold">2. Notas para la consulta</p>
                  <div className="mt-2 space-y-1 text-sm leading-6">
                    {selectedNotes.map((note) => <p key={note.id}>✓ {note.text}</p>)}
                  </div>
                </ChatBubble>
              )}
              {selectedPacking.length > 0 && (
                <ChatBubble mine>
                  <p className="font-bold">3. Para llevar</p>
                  <div className="mt-2 space-y-1 text-sm leading-6">
                    {selectedPacking.map((item) => <p key={item.id}>✓ {item.text}</p>)}
                  </div>
                </ChatBubble>
              )}
              {selectedDocuments.length > 0 && (
                <div className="grid gap-2">
                  {selectedDocuments.map((document) => (
                    <div key={document.id} className="ml-auto flex w-[86%] items-center gap-3 rounded-2xl rounded-br-sm bg-careTint p-3 text-sm text-ink shadow-sm">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary">
                        <FileText size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-black">{document.title}</p>
                        <p className="text-xs text-muted">Documento adjunto</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </MockPhoneFrame>

          <Card>
            <p className="font-black text-ink">Qué se comparte</p>
            <p className="mt-1 text-sm leading-6 text-muted">Solo los datos de esta cita y los documentos marcados para llevar. No se comparte el historial completo de Mamá Elena.</p>
          </Card>
          <ConfirmActionButton
            className="w-full"
            title="¿Enviar por WhatsApp?"
            description={`Se enviará a ${selectedCompanion.name} solo la información marcada para este evento.`}
            confirmLabel="Enviar"
            onConfirm={sendMessage}
          >
            {sending ? "Enviando..." : "Enviar por WhatsApp"}
          </ConfirmActionButton>
          <ConfirmActionButton
            className="w-full"
            variant="secondary"
            title="¿Editar selección?"
            description="Volverás al paso anterior para cambiar notas, documentos o checklist."
            confirmLabel="Editar"
            onConfirm={() => moveToStep(2)}
          >
            Editar selección
          </ConfirmActionButton>
        </>
      )}
    </div>
  );
}

function StepProgress({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        { number: 1, label: "Acompañante" },
        { number: 2, label: "Contenido" },
        { number: 3, label: "Mensaje" }
      ].map((step) => {
        const isActive = step.number === current;
        const isDone = step.number < current;
        return (
          <div key={step.number} className={`rounded-2xl border p-3 text-center ${isActive ? "border-primary bg-primarySoft" : "border-line bg-white"}`}>
            <span className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${isDone ? "bg-care text-white" : isActive ? "bg-primary text-white" : "bg-primarySoft text-muted"}`}>
              {isDone ? <Check size={14} /> : step.number}
            </span>
            <p className={`mt-2 text-xs font-black ${isActive ? "text-primary" : "text-muted"}`}>{step.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function StepHeader({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white">{number}</span>
      <div>
        <p className="font-black text-ink">{title}</p>
        <p className="mt-1 text-sm leading-5 text-muted">{text}</p>
      </div>
    </div>
  );
}

function SelectionGroup({
  title,
  subtitle,
  items,
  selectedIds,
  onToggle,
  icon
}: {
  title: string;
  subtitle: string;
  items: Array<{ id: string; title: string; meta?: string }>;
  selectedIds: string[];
  onToggle: (id: string) => void;
  icon?: "file";
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-black text-ink">{title}</p>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>
        <StatusBadge status={`${items.filter((item) => selectedIds.includes(item.id)).length} seleccionados`} tone="blue" />
      </div>
      <div className="mt-4 grid gap-2">
        {items.length === 0 && <p className="rounded-2xl bg-paper p-3 text-sm font-semibold text-muted">Sin resultados para esta búsqueda.</p>}
        {items.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <button
              key={item.id}
              className={`flex items-center justify-between gap-3 rounded-2xl border p-3 text-left transition ${isSelected ? "border-primary bg-primarySoft" : "border-line bg-white"}`}
              onClick={() => onToggle(item.id)}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isSelected ? "bg-white text-primary" : "bg-paper text-muted"}`}>
                  {icon === "file" ? <FileText size={17} /> : <ClipboardList size={17} />}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-black text-ink">{item.title}</p>
                  {item.meta && <p className="text-xs font-semibold text-muted">{item.meta}</p>}
                </div>
              </div>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-primary bg-primary text-white" : "border-line bg-white"}`}>
                {isSelected && <Check size={14} />}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function TasksScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-primary">Mamá Elena</p>
            <h1 className="mt-1 text-2xl font-black">Recordatorios</h1>
            <p className="mt-1 text-sm text-muted">Sugerencias y rutinas configuradas con mensajes amables.</p>
          </div>
          <StatusBadge status="1 sugerido" tone="amber" />
        </div>
      </Card>
      {reminders.map((reminder) => <ReminderCard key={reminder.id} reminder={reminder} onEdit={() => go("support")} />)}
      <ConfirmActionButton
        className="w-full"
        title="¿Crear recordatorio?"
        description="Vas a configurar un nuevo mensaje automático para una rutina de cuidado."
        confirmLabel="Crear"
        onConfirm={() => go("support")}
      >
        Crear recordatorio
      </ConfirmActionButton>
    </div>
  );
}

function SupportScreen({ go }: { go: (screen: Screen) => void }) {
  const [messageEnabled, setMessageEnabled] = useState(true);
  const [notifyFamily, setNotifyFamily] = useState(true);
  const [recordingAudio, setRecordingAudio] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm font-bold text-primary">Mamá Elena</p>
        <h1 className="mt-1 text-2xl font-black">Configurar recordatorio</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Revisá la sugerencia creada desde la receta y decidí si querés activar el mensaje automático por WhatsApp.</p>
      </Card>
      <Card className="space-y-3">
        <PermissionToggle label="Activar mensaje" checked={messageEnabled} onChange={() => setMessageEnabled(!messageEnabled)} />
        <FieldRow label="Para" value="Mamá Elena" />
        <FieldRow label="Rutina" value="Losartán 50 mg" />
        <FieldRow label="Horario" value="Todos los días · 20:00" />
        <FieldRow label="Reintento" value="Recordar en 10 min" />
      </Card>
      <Card>
        <p className="font-black text-ink">Mensaje para Elena</p>
        <div className="mt-3 rounded-2xl bg-paper p-3 text-sm leading-6 text-ink">
          Hola Elena, es momento de tu medicación de la noche: Losartán 50 mg.
        </div>
      </Card>
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-black text-ink">Audio para WhatsApp</p>
            <p className="mt-1 text-sm leading-6 text-muted">Grabá una nota de voz breve para que el recordatorio llegue con un tono más cercano.</p>
          </div>
          <StatusBadge status={audioReady ? "Audio listo" : recordingAudio ? "Grabando" : "Sin audio"} tone={audioReady ? "green" : recordingAudio ? "amber" : "slate"} />
        </div>
        <div className="mt-4 rounded-2xl bg-paper p-3">
          <div className="flex items-center gap-3">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${recordingAudio ? "bg-attentionSoft text-attention" : "bg-careSoft text-care"}`}>
              {recordingAudio ? <Square size={18} /> : <Mic size={20} />}
            </span>
            <div>
              <p className="font-black text-ink">{recordingAudio ? "Grabando audio..." : audioReady ? "Audio de 00:12 preparado" : "Sin audio grabado"}</p>
              <p className="text-sm text-muted">{audioReady ? "Se enviará junto al mensaje automático." : "Mock de grabación, no usa micrófono real."}</p>
            </div>
          </div>
          {audioReady && (
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white p-3">
              <Play size={17} className="text-primary" />
              <div className="h-2 flex-1 rounded-full bg-primarySoft">
                <div className="h-2 w-2/3 rounded-full bg-primary" />
              </div>
              <span className="text-xs font-black text-muted">00:12</span>
            </div>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <ConfirmActionButton
            variant="secondary"
            title="¿Grabar audio?"
            description="Se simulará la grabación de una nota de voz para enviar por WhatsApp."
            confirmLabel="Grabar"
            onConfirm={() => { setRecordingAudio(true); setAudioReady(false); }}
          >
            Grabar audio
          </ConfirmActionButton>
          <ConfirmActionButton
            variant="secondary"
            title="¿Detener grabación?"
            description="El audio quedará preparado para adjuntarse al recordatorio."
            confirmLabel="Detener"
            onConfirm={() => { setRecordingAudio(false); setAudioReady(true); }}
          >
            Detener
          </ConfirmActionButton>
        </div>
      </Card>
      <Card className="space-y-3">
        <PermissionToggle label="Enviar mensaje de apoyo" checked={notifyFamily} onChange={() => setNotifyFamily(!notifyFamily)} />
        <FieldRow label="A quién" value="Pablo" />
        <FieldRow label="Cuando" value="Después del recordatorio de Elena" />
        <FieldRow label="Mensaje" value="Elena recibió el recordatorio de Losartán 50 mg." />
        <p className="text-sm leading-6 text-muted">Pablo recibe una actualización general del recordatorio, no una vigilancia de actividad.</p>
      </Card>
      <ConfirmActionButton
        className="w-full"
        title="¿Crear recordatorio?"
        description="Se activará el mensaje automático de Losartán 50 mg para Mamá Elena."
        confirmLabel="Crear"
        onConfirm={() => go("tasks")}
      >
        Crear recordatorio
      </ConfirmActionButton>
    </div>
  );
}

function SettingsScreen({ go }: { go: (screen: Screen) => void }) {
  const [appointmentNotifications, setAppointmentNotifications] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [sharedNotifications, setSharedNotifications] = useState(true);

  return (
    <div className="space-y-4">
      <SectionTitle title="Ajustes" subtitle="Preferencias, actividad y configuración de la cuenta." />
      <Card>
        <div className="flex items-center gap-3">
          <PersonAvatar name="MG" />
          <div>
            <p className="font-black text-ink">Marina Gómez</p>
            <p className="text-sm text-muted">Gestora principal</p>
          </div>
        </div>
        <ConfirmActionButton
          className="mt-4 w-full"
          variant="secondary"
          title="¿Editar perfil?"
          description="Se abrirá la edición de los datos de Marina."
          confirmLabel="Editar"
          onConfirm={() => undefined}
        >
          Editar perfil
        </ConfirmActionButton>
      </Card>
      <Card className="space-y-3">
        <p className="font-black text-ink">Notificaciones</p>
        <PermissionToggle label="Citas médicas" checked={appointmentNotifications} onChange={() => setAppointmentNotifications(!appointmentNotifications)} />
        <PermissionToggle label="Recordatorios" checked={reminderNotifications} onChange={() => setReminderNotifications(!reminderNotifications)} />
        <PermissionToggle label="Archivos compartidos" checked={sharedNotifications} onChange={() => setSharedNotifications(!sharedNotifications)} />
      </Card>
      <Card>
        <p className="font-black text-ink">Actividad</p>
        <button onClick={() => go("history")} className="mt-3 flex w-full items-center justify-between rounded-2xl bg-paper p-3 text-left">
          <span className="font-bold text-ink">Historial</span>
          <ChevronRight className="text-primary" size={18} />
        </button>
      </Card>
      <Card>
        <p className="font-black text-ink">Preferencias</p>
        <FieldRow label="Tema" value="Claro" />
        <FieldRow label="Idioma" value="Español" />
      </Card>
    </div>
  );
}

function HistoryScreen() {
  const filters = [
    { id: "all", label: "Todos" },
    { id: "patient", label: "Pacientes" },
    { id: "document", label: "Archivos" },
    { id: "task", label: "Tarea" },
    { id: "family", label: "Familiar" }
  ] as const;
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"]>("all");
  const filteredLog = activeFilter === "all" ? activityLog : activityLog.filter((item) => item.category === activeFilter);

  return (
    <div className="space-y-4">
      <SectionTitle title="Historial" subtitle="Hora, dónde, quién y qué pasó en cada movimiento." />
      <div className="sticky top-[72px] z-10 -mx-1 grid grid-cols-5 gap-1 bg-surface/90 px-1 py-2 backdrop-blur">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`min-h-10 rounded-full px-1.5 text-[11px] font-black transition ${activeFilter === filter.id ? "bg-primary text-white shadow-sm" : "bg-primarySoft text-muted"}`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <Card>
        {filteredLog.map((item, index) => <TimelineItem key={item.id} item={item} last={index === filteredLog.length - 1} />)}
      </Card>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[28px] border border-line bg-white/95 p-4 shadow-soft ${className}`}>{children}</div>;
}

function PrimaryButton({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return <button onClick={onClick} className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-bold text-white shadow-[0_10px_15px_rgba(60,50,100,0.14)] transition active:scale-[0.98] ${className}`}>{children}</button>;
}

function SecondaryButton({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return <button onClick={onClick} className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-line bg-white/90 px-4 py-3 font-bold text-ink shadow-sm transition active:scale-[0.98] ${className}`}>{children}</button>;
}

function ConfirmActionButton({
  children,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Volver",
  variant = "primary",
  className = ""
}: {
  children: React.ReactNode;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const Button = variant === "primary" ? PrimaryButton : SecondaryButton;

  return (
    <>
      <Button className={className} onClick={() => setOpen(true)}>{children}</Button>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(42,41,56,0.28)] px-5 py-8">
          <div className="w-full max-w-sm rounded-[28px] border border-line bg-white p-4 text-center shadow-phone">
            <p className="text-xs font-black uppercase tracking-wide text-primary">Confirmación</p>
            <h3 className="mt-2 text-xl font-black text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <PrimaryButton onClick={() => { setOpen(false); onConfirm(); }}>{confirmLabel}</PrimaryButton>
              <SecondaryButton onClick={() => setOpen(false)}>{cancelLabel}</SecondaryButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ConfirmIconButton({
  children,
  onConfirm,
  title,
  description,
  confirmLabel,
  className,
  ariaLabel
}: {
  children: React.ReactNode;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  className: string;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className={className} aria-label={ariaLabel}>{children}</button>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(42,41,56,0.28)] px-5 py-8">
          <div className="w-full max-w-sm rounded-[28px] border border-line bg-white p-4 text-center shadow-phone">
            <p className="text-xs font-black uppercase tracking-wide text-primary">Confirmación</p>
            <h3 className="mt-2 text-xl font-black text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <PrimaryButton onClick={() => { setOpen(false); onConfirm(); }}>{confirmLabel}</PrimaryButton>
              <SecondaryButton onClick={() => setOpen(false)}>Volver</SecondaryButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div><h2 className="text-2xl font-black text-ink">{title}</h2>{subtitle && <p className="mt-1 text-sm leading-6 text-muted">{subtitle}</p>}</div>;
}

function InfoCallout({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-[28px] border border-primaryTint bg-primarySoft p-4"><div className="flex items-start gap-3"><LockKeyhole className="mt-1 shrink-0 text-primary" size={19} /><div><p className="font-black text-ink">{title}</p><p className="mt-1 text-sm leading-6 text-muted">{children}</p></div></div></div>;
}

function StatusBadge({ status, tone = "slate" }: { status: string; tone?: StatusTone }) {
  const styles = { green: "bg-careSoft text-careDeep", blue: "bg-primarySoft text-primary", amber: "bg-warmSoft text-warm", red: "bg-attentionSoft text-attention", slate: "bg-primarySoft text-muted" };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${styles[tone]}`}>{status}</span>;
}

function PersonAvatar({ name, large = false }: { name: string; large?: boolean }) {
  return <div className={`${large ? "h-16 w-16 text-lg" : "h-10 w-10 text-sm"} flex shrink-0 items-center justify-center rounded-full bg-careSoft font-black text-careDeep`}>{name}</div>;
}

function Chip({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-2 text-xs font-black ${active ? "bg-primary text-white" : "bg-primarySoft text-muted"}`}>{children}</span>;
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 py-3"><span className="text-sm text-muted">{label}</span><span className="text-right font-bold text-ink">{value}</span></div>;
}

function MockInput({ label, value, onChange, onFocus, hint }: { label: string; value: string; onChange: (value: string) => void; onFocus?: () => void; hint?: string }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-2 text-xs font-black uppercase text-muted">
        {label}
        {hint && <span className="normal-case text-primary">{hint}</span>}
      </span>
      <input
        className="mt-1 w-full rounded-2xl border border-line bg-paper px-3 py-3 font-semibold text-ink outline-none focus:border-primary focus:bg-white"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onClick={onFocus}
      />
    </label>
  );
}

function PrepFieldRow({ label, value, editing }: { label: string; value: string; editing: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <span className="text-sm text-muted">{label}</span>
      <div className="flex items-center justify-end gap-2">
        <span className="text-right font-bold text-ink">{value}</span>
        {editing && (
          <ConfirmIconButton
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper text-primary shadow-sm"
            ariaLabel={`Editar ${label}`}
            title={`¿Editar ${label.toLowerCase()}?`}
            description="Vas a modificar este dato de preparación del evento."
            confirmLabel="Editar"
            onConfirm={() => undefined}
          >
            <Pencil size={15} />
          </ConfirmIconButton>
        )}
      </div>
    </div>
  );
}

function PatientCard({ title, detail, meta, status, onClick, hasNew = false }: { title: string; detail: string; meta: string; status: string; onClick?: () => void; hasNew?: boolean }) {
  const content = (
    <Card className="relative flex items-center justify-between gap-3">
        {hasNew && <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-attention ring-4 ring-attentionSoft" aria-label="Movimiento nuevo" />}
        <div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-black">{title}</p>
            {hasNew && <span className="rounded-full bg-attentionSoft px-2 py-1 text-[10px] font-black text-attention">Nuevo</span>}
          </div>
          <p className="font-semibold text-ink">{detail}</p>
          <p className="text-sm text-muted">{meta}</p>
        </div>
        <div className="text-right">
          <StatusBadge status={status} tone={toneForStatus(status)} />
          {onClick && <ChevronRight className="ml-auto mt-4 text-primary" />}
        </div>
      </Card>
  );

  if (!onClick) return <div>{content}</div>;

  return (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
}

function ProcessedIngressCard({ item, onClick }: { item: ProcessedIngress; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full rounded-2xl border border-line bg-paper p-3 text-left transition active:scale-[0.99]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-primary">
              <Paperclip size={17} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-black text-ink">{item.title}</p>
              <p className="text-xs font-bold text-muted">{item.source} · {item.patient}</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-5 text-muted">{item.result}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <StatusBadge status={item.status} tone={item.tone} />
          <span className="text-xs font-black text-primary">{item.action}</span>
        </div>
      </div>
    </button>
  );
}

function AgendaItemCard({ item }: { item: { title: string; patient: string; date: string; time: string; place: string; status: string; type: string; onClick?: () => void } }) {
  const content = (
    <Card className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.type === "appointments" ? "bg-primarySoft text-primary" : "bg-careSoft text-care"}`}>
          {item.type === "appointments" ? <Calendar size={19} /> : <Bell size={19} />}
        </span>
        <div className="min-w-0">
          <p className="truncate font-black text-ink">{item.title}</p>
          <p className="text-sm text-muted">{item.patient} · {item.date} · {item.time}</p>
          <p className="truncate text-xs font-semibold text-muted">{item.place}</p>
        </div>
      </div>
      <div className="text-right">
        <StatusBadge status={item.status} tone={toneForStatus(item.status)} />
        {item.onClick && <ChevronRight className="ml-auto mt-3 text-primary" size={18} />}
      </div>
    </Card>
  );

  if (!item.onClick) return <div>{content}</div>;
  return <button onClick={item.onClick} className="w-full text-left">{content}</button>;
}

function ReminderCard({ reminder, onEdit }: { reminder: (typeof reminders)[number]; onEdit: () => void }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-careSoft text-care">
            <Bell size={19} />
          </span>
          <div>
            <p className="font-black">{reminder.title}</p>
            <p className="mt-1 text-sm text-muted">{reminder.detail}</p>
            <p className="mt-2 text-sm font-black text-ink">{reminder.time}</p>
          </div>
        </div>
        <StatusBadge status={reminder.status} tone={toneForStatus(reminder.status)} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <ConfirmActionButton
          variant="secondary"
          title="¿Revisar sugerencia?"
          description="Vas a abrir el mensaje automático sugerido antes de crearlo."
          confirmLabel="Revisar"
          onConfirm={onEdit}
        >
          Revisar
        </ConfirmActionButton>
        <ConfirmActionButton
          variant="secondary"
          title="¿Descartar sugerencia?"
          description="La sugerencia de recordatorio dejará de mostrarse en la lista."
          confirmLabel="Descartar"
          onConfirm={() => undefined}
        >
          Descartar
        </ConfirmActionButton>
      </div>
    </Card>
  );
}

function PermissionToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return <button onClick={onChange} className="flex w-full items-center justify-between rounded-2xl bg-paper p-3 text-left"><span className="font-bold">{label}</span><span className={`flex h-7 w-12 items-center rounded-full p-1 transition ${checked ? "bg-care" : "bg-primaryTint"}`}><span className={`h-5 w-5 rounded-full bg-white transition ${checked ? "translate-x-5" : ""}`} /></span></button>;
}

function TimelineItem({ item, last }: { item: (typeof activityLog)[number]; last: boolean }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="mt-1 h-3 w-3 rounded-full bg-primary" />
        {!last && <div className="h-full min-h-20 w-px bg-line" />}
      </div>
      <div className="pb-5">
        <div className="grid grid-cols-[72px_1fr] gap-x-3 gap-y-2 text-sm">
          <span className="font-black text-muted">Hora</span>
          <span className="font-black text-ink">{item.time}</span>
          <span className="font-black text-muted">Dónde</span>
          <span className="font-semibold text-ink">{item.where}</span>
          <span className="font-black text-muted">Quién</span>
          <span className="font-semibold text-ink">{item.who}</span>
          <span className="font-black text-muted">Qué</span>
          <span className="leading-6 text-muted">{item.what}</span>
        </div>
      </div>
    </div>
  );
}

function ConsultationNotes() {
  const [editing, setEditing] = useState(false);
  const notes = [
    "Falta de aire al caminar",
    "Mareos leves por la mañana",
    "Consultar ajuste de medicación"
  ];

  return (
    <div id="notas-consulta" className="scroll-mt-24">
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-black">Notas para consulta</p>
          <p className="mt-1 text-sm text-muted">Cargadas por Marina. Se pueden editar antes del turno.</p>
        </div>
        <ConfirmActionButton
          variant="secondary"
          className={`min-h-0 rounded-full px-3 py-2 text-xs shadow-sm ${editing ? "bg-primary text-white" : "bg-white text-primary"}`}
          title={editing ? "¿Salir de edición?" : "¿Editar notas?"}
          description={editing ? "Se ocultarán los controles de edición de notas." : "Se mostrarán opciones para editar o borrar notas de la consulta."}
          confirmLabel={editing ? "Salir" : "Editar"}
          onConfirm={() => setEditing(!editing)}
        >
          Edición
        </ConfirmActionButton>
      </div>
      <div className="space-y-2">
        {notes.map((note) => (
          <div key={note} className="flex items-center justify-between gap-3 rounded-2xl bg-paper p-3">
            <span className="font-semibold">{note}</span>
            {editing && (
              <div className="flex shrink-0 gap-2">
                <ConfirmIconButton className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary shadow-sm" ariaLabel={`Editar nota: ${note}`} title="¿Editar nota?" description="Vas a modificar esta nota de consulta." confirmLabel="Editar" onConfirm={() => undefined}>
                  <Pencil size={16} />
                </ConfirmIconButton>
                <ConfirmIconButton className="flex h-9 w-9 items-center justify-center rounded-full bg-attentionSoft text-attention shadow-sm" ariaLabel={`Borrar nota: ${note}`} title="¿Borrar nota?" description="Esta nota dejará de estar asociada a la consulta." confirmLabel="Borrar" onConfirm={() => undefined}>
                  <X size={16} />
                </ConfirmIconButton>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-dashed border-line bg-white p-3">
        <p className="text-xs font-black uppercase text-muted">Agregar nota</p>
        <p className="mt-2 rounded-xl bg-paper px-3 py-3 text-sm text-muted">Ej: preguntar si conviene controlar la presión por la mañana</p>
        <ConfirmActionButton className="mt-3 w-full" variant="secondary" title="¿Agregar nota?" description="Se agregará esta nota a la preparación de la consulta." confirmLabel="Agregar" onConfirm={() => undefined}>Agregar a la consulta</ConfirmActionButton>
      </div>
    </Card>
    </div>
  );
}

function PackingList() {
  const [editing, setEditing] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    "ECG 2025": true,
    "Laboratorio abril 2026": true,
    "Lista de medicación actual": false,
    "Orden médica": false
  });
  const items = Object.keys(checkedItems);

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-black">Para llevar</p>
          <p className="mt-1 text-sm text-muted">Lista cargada por Marina para este turno.</p>
        </div>
        <ConfirmActionButton
          variant="secondary"
          className={`min-h-0 rounded-full px-3 py-2 text-xs shadow-sm ${editing ? "bg-primary text-white" : "bg-white text-primary"}`}
          title={editing ? "¿Salir de edición?" : "¿Editar lista?"}
          description={editing ? "Se ocultarán los controles de edición de la lista." : "Se mostrarán opciones para editar o borrar elementos para llevar."}
          confirmLabel={editing ? "Salir" : "Editar"}
          onConfirm={() => setEditing(!editing)}
        >
          Edición
        </ConfirmActionButton>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item} className="flex items-center justify-between gap-3 rounded-2xl bg-paper p-3">
            <label className="flex flex-1 items-center gap-3 font-semibold">
              <input
                type="checkbox"
                checked={checkedItems[item]}
                onChange={() => setCheckedItems({ ...checkedItems, [item]: !checkedItems[item] })}
                className="h-5 w-5 rounded border-line accent-care"
              />
              <span className={checkedItems[item] ? "text-muted line-through" : "text-ink"}>{item}</span>
            </label>
            {editing && (
              <div className="flex shrink-0 gap-2">
                <ConfirmIconButton className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary shadow-sm" ariaLabel={`Editar item: ${item}`} title="¿Editar item?" description="Vas a modificar este elemento de la lista para llevar." confirmLabel="Editar" onConfirm={() => undefined}>
                  <Pencil size={16} />
                </ConfirmIconButton>
                <ConfirmIconButton className="flex h-9 w-9 items-center justify-center rounded-full bg-attentionSoft text-attention shadow-sm" ariaLabel={`Borrar item: ${item}`} title="¿Borrar item?" description="Este elemento dejará de estar en la lista para llevar." confirmLabel="Borrar" onConfirm={() => undefined}>
                  <X size={16} />
                </ConfirmIconButton>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-dashed border-line bg-white p-3">
        <p className="text-xs font-black uppercase text-muted">Agregar item</p>
        <p className="mt-2 rounded-xl bg-paper px-3 py-3 text-sm text-muted">Ej: llevar credencial física</p>
        <ConfirmActionButton className="mt-3 w-full" variant="secondary" title="¿Agregar item?" description="Se agregará este elemento a la lista para llevar." confirmLabel="Agregar" onConfirm={() => undefined}>Agregar a la lista</ConfirmActionButton>
      </div>
    </Card>
  );
}

function ChatBubble({ children, mine = false }: { children: React.ReactNode; mine?: boolean }) {
  return <div className={`max-w-[84%] rounded-2xl px-3 py-2 text-sm shadow-sm ${mine ? "ml-auto rounded-br-sm bg-careTint" : "rounded-bl-sm bg-white"}`}>{children}</div>;
}

function MockPhoneFrame({ children, scroll = false }: { children: React.ReactNode; scroll?: boolean }) {
  return <div className={`${scroll ? "scrollbar-none h-[min(68vh,560px)] min-h-[430px] overflow-y-auto" : "overflow-hidden"} rounded-[32px] border-4 border-ink bg-white shadow-phone`}>{children}</div>;
}

function Checklist({ title, subtitle, items }: { title: string; subtitle?: string; items: string[] }) {
  return <Card><p className="font-black">{title}</p>{subtitle && <p className="mb-3 mt-1 text-sm text-muted">{subtitle}</p>}<div className="space-y-2">{items.map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-paper p-3"><Check className="text-care" size={18} /><span className="font-semibold">{item}</span></div>)}</div></Card>;
}

export default App;



