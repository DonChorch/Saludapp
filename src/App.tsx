import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  FileText,
  HeartHandshake,
  Home,
  Inbox,
  LockKeyhole,
  MessageCircle,
  Mic,
  Paperclip,
  Pencil,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
  X
} from "lucide-react";
import { useMemo, useState } from "react";

type Screen =
  | "landing"
  | "chat"
  | "classification"
  | "dashboard"
  | "inbox"
  | "patient"
  | "event"
  | "delegate"
  | "tasks"
  | "support"
  | "history";

type StatusTone = "green" | "blue" | "amber" | "red" | "slate";
type Permissions = {
  appointments: boolean;
  studies: boolean;
  medication: boolean;
  reminders: boolean;
  upload: boolean;
  edit: boolean;
  reshare: boolean;
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

const inboxItems = [
  {
    id: "item-1",
    source: "WhatsApp",
    title: "Foto de receta médica",
    patient: "Mamá Elena",
    type: "Receta",
    specialty: "Cardiología",
    status: "Clasificado",
    date: "20/05/2026",
    tags: ["medicación", "presión arterial", "cardiología"]
  },
  {
    id: "item-2",
    source: "PDF",
    title: "Resultado laboratorio.pdf",
    patient: "Lucía",
    type: "Estudio",
    specialty: "Laboratorio",
    status: "Pendiente de revisar",
    date: "18/05/2026",
    tags: ["laboratorio", "resultado"]
  },
  {
    id: "item-3",
    source: "WhatsApp",
    title: "Audio: turno pediatra",
    patient: "Tomás",
    type: "Turno",
    specialty: "Pediatría",
    status: "Requiere confirmación",
    date: "21/05/2026",
    tags: ["turno", "pediatría"]
  },
  {
    id: "item-4",
    source: "Nota",
    title: "Control en ayunas",
    patient: "Mamá Elena",
    type: "Indicación",
    specialty: "Clínica médica",
    status: "Convertido en recordatorio",
    date: "22/05/2026",
    tags: ["ayunas", "recordatorio"]
  },
  {
    id: "item-5",
    source: "Foto",
    title: "Credencial obra social",
    patient: "Mamá Elena",
    type: "Credencial",
    specialty: "Administrativo",
    status: "Sin clasificar",
    date: "19/05/2026",
    tags: ["obra social", "credencial"]
  }
];

const tasks = [
  { id: "task-1", owner: "Pablo", patient: "Tomás", title: "Subir estudio de Tomás", due: "Hoy", status: "Pendiente" },
  { id: "task-2", owner: "Marina", patient: "Mamá Elena", title: "Llevar receta a farmacia", due: "18:00", status: "En curso" },
  { id: "task-3", owner: "Elena", patient: "Mamá Elena", title: "Confirmar pastillas", due: "20:00", status: "Pendiente" },
  { id: "task-4", owner: "Laura", patient: "Mamá Elena", title: "Acompañar a control cardiológico", due: "Mañana 10:00", status: "Confirmado" },
  { id: "task-5", owner: "Marina", patient: "Mamá Elena", title: "Autorizar estudio en obra social", due: "Esta semana", status: "Pendiente" }
];

const medicalFiles = [
  { id: "file-1", patient: "Mamá Elena", title: "Receta Losartán 50 mg", type: "Receta", source: "WhatsApp", date: "20/05/2026" },
  { id: "file-2", patient: "Mamá Elena", title: "ECG 2025", type: "Estudio", source: "PDF", date: "10/12/2025" },
  { id: "file-3", patient: "Mamá Elena", title: "Laboratorio abril 2026", type: "Laboratorio", source: "PDF", date: "12/04/2026" },
  { id: "file-4", patient: "Mamá Elena", title: "Orden control cardiológico", type: "Orden médica", source: "Foto", date: "18/05/2026" },
  { id: "file-5", patient: "Mamá Elena", title: "Credencial obra social", type: "Credencial", source: "Foto", date: "19/05/2026" }
];

const activityLog = [
  { id: "log-1", time: "09:12", text: "Marina reenvió receta desde WhatsApp" },
  { id: "log-2", time: "09:13", text: "Sistema clasificó como Receta / Mamá Elena" },
  { id: "log-3", time: "09:14", text: "Marina confirmó clasificación" },
  { id: "log-4", time: "09:16", text: "Se creó recordatorio de medicación" },
  { id: "log-5", time: "09:20", text: "Se compartió acceso temporal con Pablo" },
  { id: "log-6", time: "20:00", text: "Elena recibió recordatorio amable" },
  { id: "log-7", time: "20:08", text: "Elena confirmó medicación" }
];

const screenTitles: Record<Screen, string> = {
  landing: "Salud en equipo",
  chat: "Simulación de chat",
  classification: "Revisar clasificación",
  dashboard: "Inicio",
  inbox: "Bandeja",
  patient: "Familia",
  event: "Evento médico",
  delegate: "Delegar",
  tasks: "Tareas",
  support: "Apoyo",
  history: "Historial"
};

function toneForStatus(status: string): StatusTone {
  if (["Clasificado", "Confirmado", "Hecho"].includes(status)) return "green";
  if (["En curso", "Revisar"].includes(status)) return "blue";
  if (["Pendiente", "Pendiente de revisar", "Requiere confirmación", "Sin clasificar"].some((word) => status.includes(word))) return "amber";
  return "slate";
}

function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [selectedPatient, setSelectedPatient] = useState(false);
  const [saved, setSaved] = useState(false);
  const [accessSent, setAccessSent] = useState(false);
  const [permissions, setPermissions] = useState({
    appointments: true,
    studies: true,
    medication: false,
    reminders: true,
    upload: true,
    edit: false,
    reshare: false
  });

  const go = (next: Screen) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setScreen(next);
  };

  return (
    <AppShell screen={screen} go={go}>
      {screen !== "landing" && <Header title={screenTitles[screen]} go={go} />}
      {screen === "landing" && <Landing go={go} />}
      {screen === "chat" && <ChatSimulation go={go} selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} />}
      {screen === "classification" && <Classification go={go} saved={saved} setSaved={setSaved} />}
      {screen === "dashboard" && <Dashboard go={go} />}
      {screen === "inbox" && <InboxScreen go={go} />}
      {screen === "patient" && <PatientProfile go={go} />}
      {screen === "event" && <MedicalEvent go={go} />}
      {screen === "delegate" && (
        <DelegateCare go={go} permissions={permissions} setPermissions={setPermissions} accessSent={accessSent} setAccessSent={setAccessSent} />
      )}
      {screen === "tasks" && <TasksScreen go={go} />}
      {screen === "support" && <SupportScreen go={go} />}
      {screen === "history" && <HistoryScreen />}
    </AppShell>
  );
}

function AppShell({ children, screen, go }: { children: React.ReactNode; screen: Screen; go: (screen: Screen) => void }) {
  return (
    <div className="min-h-screen bg-surface">
      <main className="mx-auto min-h-screen w-full max-w-md bg-surface px-4 pb-28 pt-4 sm:border-x sm:border-slate-200">
        {children}
      </main>
      {screen !== "landing" && <BottomNav active={screen} go={go} />}
    </div>
  );
}

function Header({ title, go }: { title: string; go: (screen: Screen) => void }) {
  return (
    <div className="sticky top-0 z-20 -mx-4 mb-4 border-b border-slate-200 bg-surface/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between">
        <button className="rounded-full bg-white p-2 text-ink shadow-sm" onClick={() => go("dashboard")} aria-label="Ir al inicio">
          <Home size={18} />
        </button>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Salud en equipo</p>
          <h1 className="text-lg font-bold text-ink">{title}</h1>
        </div>
        <button className="rounded-full bg-white p-2 text-ink shadow-sm" onClick={() => go("history")} aria-label="Ver historial">
          <Bell size={18} />
        </button>
      </div>
    </div>
  );
}

function BottomNav({ active, go }: { active: Screen; go: (screen: Screen) => void }) {
  const items = [
    { label: "Inicio", icon: Home, screen: "dashboard" as Screen },
    { label: "Bandeja", icon: Inbox, screen: "inbox" as Screen },
    { label: "Familia", icon: Users, screen: "patient" as Screen },
    { label: "Tareas", icon: ClipboardList, screen: "tasks" as Screen },
    { label: "Historial", icon: ShieldCheck, screen: "history" as Screen }
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-2 safe-bottom shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map(({ label, icon: Icon, screen }) => (
          <button
            key={label}
            onClick={() => go(screen)}
            className={`flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-semibold ${active === screen ? "bg-blue-50 text-primary" : "text-muted"}`}
          >
            <Icon size={19} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function Landing({ go }: { go: (screen: Screen) => void }) {
  return (
    <section className="flex min-h-screen flex-col justify-between py-4">
      <div>
        <div className="mb-7 rounded-[2rem] bg-primary p-6 text-white shadow-soft">
          <div className="mb-10 flex items-center justify-between">
            <div className="rounded-2xl bg-white/15 p-3"><HeartHandshake /></div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Demo conceptual</span>
          </div>
          <h1 className="text-4xl font-black leading-tight">Salud en equipo</h1>
          <p className="mt-3 text-lg font-semibold text-blue-50">Del chat desordenado al cuidado familiar organizado.</p>
        </div>
        <p className="text-base leading-7 text-muted">
          Una demo conceptual que muestra cómo transformar recetas, estudios, turnos y mensajes reenviados desde WhatsApp en información organizada, tareas compartidas y permisos claros.
        </p>
        <div className="mt-6 grid gap-3">
          {[
            "Ordena lo que llega por WhatsApp",
            "Clasifica por persona y tipo de documento",
            "Permite delegar sin perder control",
            "Acompaña sin vigilar"
          ].map((text) => (
            <Card key={text} className="flex items-center gap-3">
              <Check className="text-care" size={20} />
              <span className="font-semibold">{text}</span>
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <InfoCallout title="Privacidad y control">
          La persona gestora decide qué se comparte, con quién, por cuánto tiempo y con qué permisos. El sistema evita mostrar actividad innecesaria y prioriza estados de cuidado antes que vigilancia.
        </InfoCallout>
        <PrimaryButton className="mt-4 w-full" onClick={() => go("chat")}>Iniciar demo</PrimaryButton>
        <p className="mt-3 text-center text-xs text-muted">Demo con datos simulados. No usa datos reales ni conexión a WhatsApp.</p>
      </div>
    </section>
  );
}

function ChatSimulation({ go, selectedPatient, setSelectedPatient }: { go: (screen: Screen) => void; selectedPatient: boolean; setSelectedPatient: (value: boolean) => void }) {
  return (
    <div className="space-y-4">
      <MockPhoneFrame>
        <div className="rounded-t-3xl bg-care px-4 py-3 text-white">
          <p className="text-xs font-semibold opacity-90">Simulación de chat</p>
          <div className="mt-1 flex items-center gap-3">
            <PersonAvatar name="SE" />
            <div><p className="font-bold">Salud en equipo</p><p className="text-xs opacity-90">WhatsApp como entrada, la app como orden</p></div>
          </div>
        </div>
        <div className="space-y-3 bg-[#eef7ef] p-3">
          <ChatBubble mine>Te reenvío esta receta de mamá.</ChatBubble>
          <ChatBubble mine>
            <div className="flex items-center gap-3"><Paperclip size={18} /><div><b>IMG_3482.jpg</b><p className="text-xs">Receta médica</p></div></div>
          </ChatBubble>
          <ChatBubble>Parece una receta médica. ¿Para quién la guardo?</ChatBubble>
          <div className="grid grid-cols-2 gap-2">
            {["Mamá Elena", "Tomás", "Lucía", "Otro"].map((label) => (
              <button key={label} onClick={() => label === "Mamá Elena" && setSelectedPatient(true)} className={`rounded-full px-3 py-2 text-sm font-bold shadow-sm ${selectedPatient && label === "Mamá Elena" ? "bg-primary text-white" : "bg-white text-primary"}`}>{label}</button>
            ))}
          </div>
          {selectedPatient && (
            <>
              <ChatBubble>
                <b>Detecté estos datos:</b><br />
                Paciente: Mamá Elena<br />Tipo: Receta médica<br />Medicación: Losartán 50 mg<br />Frecuencia: 1 comprimido por día<br />Fecha: 20 de mayo<br />Origen: WhatsApp
              </ChatBubble>
              <div className="grid gap-2">
                <PrimaryButton onClick={() => go("classification")}>Confirmar y guardar</PrimaryButton>
                <SecondaryButton><Pencil size={16} /> Corregir datos</SecondaryButton>
                <SecondaryButton><Bell size={16} /> Agregar recordatorio</SecondaryButton>
              </div>
            </>
          )}
        </div>
      </MockPhoneFrame>
      <SectionTitle title="Otros ingresos recientes" subtitle="Del chat al cuidado organizado" />
      {[
        ["Audio: turno pediatra Tomás", Mic],
        ["PDF: laboratorio Lucía", FileText],
        ["Foto: orden cardiología Mamá Elena", Stethoscope]
      ].map(([text, Icon]) => (
        <Card key={text as string} className="flex items-center justify-between">
          <div className="flex items-center gap-3"><Icon className="text-primary" size={20} /><span className="font-semibold">{text as string}</span></div>
          <StatusBadge status="En bandeja" tone="blue" />
        </Card>
      ))}
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
      {saved && <div className="rounded-2xl bg-emerald-50 p-4 font-semibold text-emerald-700">Guardado en Mamá Elena &gt; Recetas &gt; Cardiología</div>}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">Revisar clasificación</h2>
          <StatusBadge status={saved ? "Confirmado" : "Pendiente de confirmar"} tone={saved ? "green" : "amber"} />
        </div>
        <div className="divide-y divide-slate-100">
          {fields.map(([label, value]) => <FieldRow key={label} label={label} value={value} />)}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["medicación", "presión arterial", "cardiología", "receta"].map((tag) => <Chip key={tag}>{tag}</Chip>)}
        </div>
      </Card>
      <PrimaryButton className="w-full" onClick={() => { setSaved(true); setTimeout(() => go("dashboard"), 550); }}>Guardar en archivo de Mamá Elena</PrimaryButton>
      <SecondaryButton className="w-full" onClick={() => { setSaved(true); setTimeout(() => go("dashboard"), 550); }}><Bell size={16} /> Guardar y crear recordatorio</SecondaryButton>
      <div className="grid grid-cols-2 gap-3">
        <SecondaryButton>Cambiar paciente</SecondaryButton>
        <SecondaryButton>Editar datos</SecondaryButton>
      </div>
    </div>
  );
}

function Dashboard({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="space-y-5">
      <div><h1 className="text-3xl font-black">Hola, Marina</h1><p className="text-muted">Salud en equipo</p></div>
      <div className="flex gap-2 overflow-x-auto pb-1">{["Hoy", "Familia", "Archivos", "Tareas"].map((tab, i) => <Chip active={i === 0} key={tab}>{tab}</Chip>)}</div>
      <div className="grid gap-3">
        <PatientCard title="Mamá Elena" detail="Control cardiología" meta="Mañana 10:30" status="Preparar documentación" onClick={() => go("event")} />
        <PatientCard title="Tomás" detail="Vacuna pendiente" meta="Pediatría" status="Falta coordinar turno" onClick={() => go("tasks")} />
        <PatientCard title="Lucía" detail="Resultado de laboratorio cargado" meta="Laboratorio" status="Revisar" onClick={() => go("inbox")} />
        <PatientCard title="Tareas por delegar" detail="3 pendientes" meta="Coordinación familiar" status="Delegar sin perder control" onClick={() => go("delegate")} />
      </div>
      <Card>
        <SectionTitle title="Fuentes unificadas" subtitle="Todo en un solo lugar" />
        <div className="mt-3 flex flex-wrap gap-2">{["WhatsApp", "Fotos", "PDFs", "Notas", "Alarmas"].map((x) => <Chip key={x}>{x}</Chip>)}</div>
        <p className="mt-4 text-sm text-muted">Todo lo que antes quedaba disperso ahora entra a una bandeja común.</p>
      </Card>
      <InfoCallout title="Menos chats, menos doble trabajo">Más coordinación familiar con información organizada por persona, evento y tipo.</InfoCallout>
    </div>
  );
}

function InboxScreen({ go }: { go: (screen: Screen) => void }) {
  const [filter, setFilter] = useState("Todos");
  const filtered = useMemo(() => filter === "Todos" ? inboxItems : inboxItems.filter((item) => item.source === filter || (filter === "Sin clasificar" && item.status === "Sin clasificar")), [filter]);
  return (
    <div className="space-y-4">
      <SectionTitle title="Bandeja de salud" subtitle="Elementos recibidos desde WhatsApp, fotos, notas y archivos." />
      <div className="flex gap-2 overflow-x-auto pb-1">{["Todos", "WhatsApp", "PDF", "Foto", "Audio", "Sin clasificar"].map((x) => <button key={x} onClick={() => setFilter(x)}><Chip active={filter === x}>{x}</Chip></button>)}</div>
      <PrimaryButton className="w-full">Organizar automáticamente</PrimaryButton>
      {filtered.map((item) => <InboxItemCard key={item.id} item={item} go={go} />)}
    </div>
  );
}

function PatientProfile({ go }: { go: (screen: Screen) => void }) {
  const elena = familyMembers[1];
  return (
    <div className="space-y-4">
      <Card className="bg-primary text-white">
        <div className="flex items-center gap-4"><PersonAvatar name="ME" large /><div><h1 className="text-2xl font-black">{elena.name}</h1><p className="text-blue-50">72 años · Persona acompañada</p></div></div>
        <div className="mt-4 grid gap-2 text-sm text-blue-50">
          <p>Dato de cuidado relevante: Hipertensión</p>
          <p>Próximo turno: Cardiología, Dr. Ruiz, 30/05, 10:30</p>
          <p>Rutina registrada: Losartán 50 mg</p>
        </div>
      </Card>
      <Card><FieldRow label="Responsable principal" value="Marina" /><FieldRow label="Acceso compartido con" value="Pablo, Laura" /></Card>
      <div className="grid grid-cols-2 gap-3">{["Archivo familiar", "Recetas", "Estudios", "Turnos", "Rutinas", "Trámites", "Compartido con", "Actividad reciente"].map((s) => <Card key={s} className="min-h-24"><p className="font-bold">{s}</p><ChevronRight className="mt-3 text-primary" size={18} /></Card>)}</div>
      <SectionTitle title="Archivos simulados" subtitle="La información está organizada por persona, evento y tipo" />
      {medicalFiles.map((file) => <Card key={file.id} className="flex items-center justify-between"><div><p className="font-bold">{file.title}</p><p className="text-sm text-muted">{file.type} · {file.source} · {file.date}</p></div><FileText className="text-primary" /></Card>)}
      <div className="grid gap-3"><PrimaryButton>Agregar documento</PrimaryButton><SecondaryButton onClick={() => go("event")}>Preparar consulta</SecondaryButton><SecondaryButton onClick={() => go("delegate")}>Delegar acceso</SecondaryButton></div>
    </div>
  );
}

function MedicalEvent({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm font-semibold text-primary">Mamá Elena</p>
        <h1 className="mt-1 text-2xl font-black">Control cardiología — Dr. Ruiz</h1>
        <p className="mt-2 text-muted">Mañana, 10:30</p>
        <div className="mt-4 h-3 rounded-full bg-slate-100"><div className="h-3 w-4/5 rounded-full bg-care" /></div>
        <p className="mt-2 text-sm font-bold text-care">80% preparado</p>
      </Card>
      <Checklist title="Llevar" items={["ECG 2025", "Laboratorio abril 2026", "Lista de medicación actual", "Orden médica"]} />
      <Checklist title="Notas para consulta" items={["Falta de aire al caminar", "Mareos leves por la mañana", "Consultar ajuste de medicación"]} />
      <Checklist title="Checklist" items={["Revisar estudios", "Confirmar dirección", "Llevar credencial", "Avisar a acompañante"]} />
      <Card><SectionTitle title="Archivos vinculados" subtitle="ECG_2025.pdf · Laboratorio_Abril.pdf · Receta_Losartan.jpg · Orden_Control.pdf" /></Card>
      <InfoCallout title="Todo en un solo lugar">Antes del turno, todo queda preparado en un solo lugar.</InfoCallout>
      <div className="grid gap-3"><PrimaryButton onClick={() => go("delegate")}>Compartir con acompañante</PrimaryButton><SecondaryButton>Crear checklist</SecondaryButton><SecondaryButton>Marcar como listo</SecondaryButton></div>
    </div>
  );
}

function DelegateCare({ go, permissions, setPermissions, accessSent, setAccessSent }: { go: (screen: Screen) => void; permissions: Permissions; setPermissions: (p: Permissions) => void; accessSent: boolean; setAccessSent: (v: boolean) => void }) {
  const labels: Record<keyof Permissions, string> = { appointments: "Ver turnos", studies: "Ver estudios", medication: "Ver medicación", reminders: "Recibir recordatorios", upload: "Subir documentos", edit: "Editar archivos", reshare: "Compartir con terceros" };
  return (
    <div className="space-y-4">
      {accessSent && <div className="rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-700">Acceso enviado a Pablo</div>}
      <SectionTitle title="Delegar cuidado" subtitle="Compartí solo lo necesario, por el tiempo necesario." />
      <Card><FieldRow label="Compartir con" value="Pablo" /></Card>
      <Card className="space-y-3">
        {(Object.entries(labels) as Array<[keyof Permissions, string]>).map(([key, label]) => <PermissionToggle key={key} label={label} checked={permissions[key]} onChange={() => setPermissions({ ...permissions, [key]: !permissions[key] })} />)}
      </Card>
      <Card>
        <p className="font-bold">Configurar acceso</p>
        <div className="mt-3 grid gap-2">{["Solo para este evento médico", "Temporal", "Permanente"].map((x, i) => <Chip active={i === 1} key={x}>{x}</Chip>)}</div>
        <FieldRow label="Fecha de fin" value="30 mayo 2026" />
      </Card>
      <InfoCallout title="Delegar sin perder control">Pablo podrá ver el turno de cardiología, acceder a los estudios vinculados y subir documentos. No podrá editar ni compartir información con terceros.</InfoCallout>
      <PrimaryButton className="w-full" onClick={() => setAccessSent(true)}>Enviar acceso</PrimaryButton>
      <Card><p className="text-sm leading-6 text-muted">Delegar no es entregar todo. Es compartir lo necesario para que otra persona pueda ayudar sin desordenar ni invadir.</p></Card>
      <SecondaryButton className="w-full" onClick={() => go("tasks")}>Ver tareas compartidas</SecondaryButton>
    </div>
  );
}

function TasksScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="space-y-4">
      <SectionTitle title="Tareas compartidas" subtitle="Todos ven el mismo estado. Menos doble trabajo." />
      <div className="flex gap-2 overflow-x-auto pb-1">{["Pendiente", "En curso", "Hecho", "Por persona"].map((x, i) => <Chip active={i === 0} key={x}>{x}</Chip>)}</div>
      {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
      <div className="grid gap-3"><PrimaryButton>Asignar tarea</PrimaryButton><SecondaryButton>Cambiar responsable</SecondaryButton><SecondaryButton>Marcar hecho</SecondaryButton><SecondaryButton onClick={() => go("support")}>Ver apoyo sin vigilancia</SecondaryButton></div>
    </div>
  );
}

function SupportScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="space-y-4">
      <SectionTitle title="Apoyo sin vigilancia" subtitle="Acompañar sin controlar." />
      <Card>
        <p className="text-sm font-bold text-primary">Vista paciente — Mamá Elena</p>
        <h2 className="mt-2 text-xl font-black">Recordatorio amable</h2>
        <p className="mt-3 text-muted">Es momento de tu medicación de la noche.</p>
        <p className="mt-2 font-bold">Losartán 50 mg — 20:00</p>
        <div className="mt-4 grid gap-2"><PrimaryButton>Ya lo hice</PrimaryButton><SecondaryButton>Recordarme en 10 min</SecondaryButton><SecondaryButton>Necesito ayuda</SecondaryButton></div>
        <p className="mt-4 text-sm text-muted">Pablo solo será avisado si no hay confirmación después de dos recordatorios.</p>
      </Card>
      <Card>
        <p className="text-sm font-bold text-primary">Vista familia — Pablo</p>
        <StatusBadge status="Rutina aún sin confirmar" tone="amber" />
        <p className="mt-3 text-muted">El sistema volverá a recordarle a Elena antes de avisarte. No hace falta llamarla todavía.</p>
        <div className="mt-4 grid gap-2"><SecondaryButton>Ver acuerdo de cuidado</SecondaryButton><SecondaryButton>Esperar recordatorio</SecondaryButton><PrimaryButton>Ofrecer ayuda</PrimaryButton></div>
      </Card>
      <InfoCallout title="Primero recordamos, después avisamos">Acompañar no es vigilar. La persona cuidada mantiene autonomía.</InfoCallout>
      <SecondaryButton className="w-full" onClick={() => go("history")}>Ver trazabilidad</SecondaryButton>
    </div>
  );
}

function HistoryScreen() {
  return (
    <div className="space-y-4">
      <SectionTitle title="Actividad reciente" subtitle="La trazabilidad permite coordinar sin perseguir." />
      <div className="flex gap-2 overflow-x-auto pb-1">{["Por paciente", "Por documento", "Por tarea", "Por familiar"].map((x, i) => <Chip active={i === 0} key={x}>{x}</Chip>)}</div>
      <Card>
        {activityLog.map((item, index) => <TimelineItem key={item.id} item={item} last={index === activityLog.length - 1} />)}
      </Card>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-slate-100 bg-white p-4 shadow-soft ${className}`}>{children}</div>;
}

function PrimaryButton({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return <button onClick={onClick} className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-bold text-white shadow-sm transition active:scale-[0.98] ${className}`}>{children}</button>;
}

function SecondaryButton({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return <button onClick={onClick} className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-ink shadow-sm transition active:scale-[0.98] ${className}`}>{children}</button>;
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div><h2 className="text-2xl font-black text-ink">{title}</h2>{subtitle && <p className="mt-1 text-sm leading-6 text-muted">{subtitle}</p>}</div>;
}

function InfoCallout({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-3xl border border-blue-100 bg-blue-50 p-4"><div className="flex items-start gap-3"><LockKeyhole className="mt-1 shrink-0 text-primary" size={19} /><div><p className="font-black text-ink">{title}</p><p className="mt-1 text-sm leading-6 text-muted">{children}</p></div></div></div>;
}

function StatusBadge({ status, tone = "slate" }: { status: string; tone?: StatusTone }) {
  const styles = { green: "bg-emerald-50 text-emerald-700", blue: "bg-blue-50 text-primary", amber: "bg-amber-50 text-amber-700", red: "bg-red-50 text-attention", slate: "bg-slate-100 text-muted" };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${styles[tone]}`}>{status}</span>;
}

function PersonAvatar({ name, large = false }: { name: string; large?: boolean }) {
  return <div className={`${large ? "h-16 w-16 text-lg" : "h-10 w-10 text-sm"} flex shrink-0 items-center justify-center rounded-full bg-emerald-100 font-black text-emerald-700`}>{name}</div>;
}

function Chip({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-2 text-xs font-black ${active ? "bg-primary text-white" : "bg-slate-100 text-muted"}`}>{children}</span>;
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 py-3"><span className="text-sm text-muted">{label}</span><span className="text-right font-bold text-ink">{value}</span></div>;
}

function PatientCard({ title, detail, meta, status, onClick }: { title: string; detail: string; meta: string; status: string; onClick: () => void }) {
  return <button onClick={onClick} className="w-full text-left"><Card className="flex items-center justify-between gap-3"><div><p className="text-lg font-black">{title}</p><p className="font-semibold text-ink">{detail}</p><p className="text-sm text-muted">{meta}</p></div><div className="text-right"><StatusBadge status={status} tone={toneForStatus(status)} /><ChevronRight className="ml-auto mt-4 text-primary" /></div></Card></button>;
}

function InboxItemCard({ item, go }: { item: (typeof inboxItems)[number]; go: (screen: Screen) => void }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div><p className="font-black">{item.title}</p><p className="mt-1 text-sm text-muted">Fuente: {item.source} · Paciente: {item.patient}</p><p className="text-sm text-muted">{item.type} · {item.specialty}</p></div>
        <StatusBadge status={item.status} tone={toneForStatus(item.status)} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">{item.tags.map((tag) => <Chip key={tag}>{tag}</Chip>)}</div>
      <div className="mt-4 grid grid-cols-2 gap-2"><SecondaryButton onClick={() => go("classification")}>Ver</SecondaryButton><SecondaryButton>Confirmar</SecondaryButton><SecondaryButton>Cambiar paciente</SecondaryButton><SecondaryButton>Crear tarea</SecondaryButton></div>
    </Card>
  );
}

function TaskCard({ task }: { task: (typeof tasks)[number] }) {
  return <Card><div className="flex items-start justify-between gap-3"><div><p className="font-black">{task.title}</p><p className="mt-1 text-sm text-muted">Responsable: {task.owner} · Paciente: {task.patient}</p><p className="text-sm text-muted">Vence: {task.due}</p></div><StatusBadge status={task.status} tone={toneForStatus(task.status)} /></div><PrimaryButton className="mt-4 w-full">Acción principal</PrimaryButton></Card>;
}

function PermissionToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return <button onClick={onChange} className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-3 text-left"><span className="font-bold">{label}</span><span className={`flex h-7 w-12 items-center rounded-full p-1 transition ${checked ? "bg-care" : "bg-slate-300"}`}><span className={`h-5 w-5 rounded-full bg-white transition ${checked ? "translate-x-5" : ""}`} /></span></button>;
}

function TimelineItem({ item, last }: { item: (typeof activityLog)[number]; last: boolean }) {
  return <div className="flex gap-3"><div className="flex flex-col items-center"><div className="mt-1 h-3 w-3 rounded-full bg-primary" />{!last && <div className="h-full min-h-12 w-px bg-slate-200" />}</div><div className="pb-5"><p className="font-black">{item.time}</p><p className="text-sm text-muted">{item.text}</p></div></div>;
}

function ChatBubble({ children, mine = false }: { children: React.ReactNode; mine?: boolean }) {
  return <div className={`max-w-[84%] rounded-2xl px-3 py-2 text-sm shadow-sm ${mine ? "ml-auto rounded-br-sm bg-[#dcf8c6]" : "rounded-bl-sm bg-white"}`}>{children}</div>;
}

function MockPhoneFrame({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-[2rem] border-4 border-slate-800 bg-white shadow-soft">{children}</div>;
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return <Card><p className="mb-3 font-black">{title}</p><div className="space-y-2">{items.map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"><Check className="text-care" size={18} /><span className="font-semibold">{item}</span></div>)}</div></Card>;
}

export default App;
