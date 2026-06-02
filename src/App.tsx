import {
  Bell,
  Check,
  ChevronRight,
  ClipboardList,
  FileText,
  HeartHandshake,
  Home,
  LockKeyhole,
  MapPin,
  Paperclip,
  Pencil,
  Search,
  ShieldCheck,
  Users,
  X
} from "lucide-react";
import { useState } from "react";

type Screen =
  | "landing"
  | "chat"
  | "classification"
  | "dashboard"
  | "patient"
  | "event"
  | "delegate"
  | "tasks"
  | "support"
  | "history";

type StatusTone = "green" | "blue" | "amber" | "red" | "slate";

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
  chat: "Chat",
  classification: "Revisar clasificación",
  dashboard: "Inicio",
  patient: "Familia",
  event: "Evento médico",
  delegate: "Acompañante",
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
  const [saved, setSaved] = useState(false);
  const [accessSent, setAccessSent] = useState(false);

  const go = (next: Screen) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setScreen(next);
  };

  return (
    <AppShell screen={screen} go={go}>
      {!["landing", "chat"].includes(screen) && <Header title={screenTitles[screen]} go={go} />}
      {screen === "landing" && <Landing go={go} />}
      {screen === "chat" && <ChatSimulation go={go} />}
      {screen === "classification" && <Classification go={go} saved={saved} setSaved={setSaved} />}
      {screen === "dashboard" && <Dashboard go={go} />}
      {screen === "patient" && <PatientProfile go={go} />}
      {screen === "event" && <MedicalEvent go={go} />}
      {screen === "delegate" && <DelegateCare go={go} accessSent={accessSent} setAccessSent={setAccessSent} />}
      {screen === "tasks" && <TasksScreen go={go} />}
      {screen === "support" && <SupportScreen go={go} />}
      {screen === "history" && <HistoryScreen />}
    </AppShell>
  );
}

function AppShell({ children, screen, go }: { children: React.ReactNode; screen: Screen; go: (screen: Screen) => void }) {
  const isExternalCapture = screen === "chat";

  return (
    <div className="min-h-screen bg-surface">
      <main className={`mx-auto min-h-screen w-full max-w-md bg-surface px-4 pt-4 sm:border-x sm:border-slate-200 ${isExternalCapture ? "pb-6" : "pb-28"}`}>
        {children}
      </main>
      {!["landing", "chat"].includes(screen) && <BottomNav active={screen} go={go} />}
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
    { label: "Familia", icon: Users, screen: "patient" as Screen },
    { label: "Tareas", icon: ClipboardList, screen: "tasks" as Screen },
    { label: "Historial", icon: ShieldCheck, screen: "history" as Screen }
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-2 safe-bottom shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
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
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Cuidado familiar</span>
          </div>
          <h1 className="text-4xl font-black leading-tight">Salud en equipo</h1>
          <p className="mt-3 text-lg font-semibold text-blue-50">Del chat desordenado al cuidado familiar organizado.</p>
        </div>
        <p className="text-base leading-7 text-muted">
          Guardá recetas, estudios, turnos y mensajes reenviados desde WhatsApp en una bandeja ordenada por persona, evento y tipo de documento.
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
        <PrimaryButton className="mt-4 w-full" onClick={() => go("chat")}>Empezar</PrimaryButton>
        <p className="mt-3 text-center text-xs text-muted">Datos de ejemplo. No usa información real ni conexión a WhatsApp.</p>
      </div>
    </section>
  );
}

function ChatSimulation({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button className="rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm" onClick={() => go("landing")}>Volver</button>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-muted">Captura externa</span>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-ink">Así entra la información</h1>
        <p className="text-sm leading-6 text-muted">
          Marina reenvía una receta al contacto Salud en equipo. El sistema lee la imagen, pregunta lo mínimo necesario y deja listo el guardado con recordatorio.
        </p>
      </div>
      <MockPhoneFrame>
        <div className="rounded-t-3xl bg-care px-4 py-3 text-white">
          <p className="text-xs font-semibold opacity-90">Chat de captura</p>
          <div className="mt-1 flex items-center gap-3">
            <PersonAvatar name="SE" />
            <div><p className="font-bold">Salud en equipo</p><p className="text-xs opacity-90">Recibe archivos y prepara la clasificación</p></div>
          </div>
        </div>
        <div className="space-y-3 bg-[#eef7ef] p-3">
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
            Listo. Guardé la receta en Mamá Elena y preparé un recordatorio para Losartán 50 mg.
          </ChatBubble>
        </div>
      </MockPhoneFrame>
      <PrimaryButton className="w-full" onClick={() => go("dashboard")}>Continuar a la app</PrimaryButton>
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
  const [eventOrder, setEventOrder] = useState<"date" | "updates">("date");
  const upcomingEvents = [
    {
      title: "Mamá Elena",
      detail: "Control cardiología",
      meta: "Mañana 10:30",
      status: "Preparar documentación",
      onClick: () => go("event"),
      hasNew: true,
      dateOrder: 1,
      updateOrder: 1
    },
    {
      title: "Tomás",
      detail: "Vacuna pendiente",
      meta: "Sin turno asignado",
      status: "Falta coordinar turno",
      onClick: undefined,
      hasNew: false,
      dateOrder: 2,
      updateOrder: 4
    },
    {
      title: "Lucía",
      detail: "Resultado de laboratorio cargado",
      meta: "PDF recibido hoy",
      status: "Revisar",
      onClick: undefined,
      hasNew: true,
      dateOrder: 3,
      updateOrder: 2
    },
    {
      title: "Tareas por delegar",
      detail: "3 pendientes",
      meta: "Esta semana",
      status: "3 sin asignar",
      onClick: undefined,
      hasNew: false,
      dateOrder: 4,
      updateOrder: 3
    }
  ].sort((a, b) => (eventOrder === "date" ? a.dateOrder - b.dateOrder : a.updateOrder - b.updateOrder));
  const visibleEvents = upcomingEvents.filter((event) => event.title !== "Tareas por delegar");

  return (
    <div className="space-y-5">
      <div><h1 className="text-3xl font-black">Hola, Marina</h1><p className="text-muted">Salud en equipo</p></div>
      <Card className="flex items-center justify-between gap-3">
        <div>
          <p className="font-black">Próximos eventos</p>
          <p className="text-sm text-muted">2 con movimientos nuevos</p>
        </div>
        <div className="flex rounded-full bg-slate-100 p-1">
          <button
            onClick={() => setEventOrder("date")}
            className={`rounded-full px-3 py-2 text-xs font-black ${eventOrder === "date" ? "bg-white text-primary shadow-sm" : "text-muted"}`}
          >
            Fecha
          </button>
          <button
            onClick={() => setEventOrder("updates")}
            className={`rounded-full px-3 py-2 text-xs font-black ${eventOrder === "updates" ? "bg-white text-primary shadow-sm" : "text-muted"}`}
          >
            Nuevos
          </button>
        </div>
      </Card>
      <div className="grid gap-3">
        {visibleEvents.map((event) => (
          <PatientCard key={event.title} {...event} />
        ))}
      </div>
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-primary">Coordinación familiar</p>
            <h2 className="mt-1 text-xl font-black">Tareas por delegar</h2>
            <p className="mt-1 text-sm text-muted">3 pendientes para asignar esta semana.</p>
          </div>
          <StatusBadge status="3 sin asignar" tone="amber" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xl font-black text-ink">3</p>
            <p className="text-xs font-bold text-muted">Pendientes</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xl font-black text-ink">2</p>
            <p className="text-xs font-bold text-muted">Familiares</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xl font-black text-ink">1</p>
            <p className="text-xs font-bold text-muted">Urgente</p>
          </div>
        </div>
        <SecondaryButton className="mt-4 w-full" onClick={() => go("tasks")}>Ver tareas</SecondaryButton>
      </Card>
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
      <SectionTitle title="Archivos" subtitle="Ordenados por tipo y fecha" />
      {medicalFiles.map((file) => <Card key={file.id} className="flex items-center justify-between"><div><p className="font-bold">{file.title}</p><p className="text-sm text-muted">{file.type} · {file.source} · {file.date}</p></div><FileText className="text-primary" /></Card>)}
      <div className="grid gap-3"><PrimaryButton>Agregar documento</PrimaryButton><SecondaryButton onClick={() => go("event")}>Preparar consulta</SecondaryButton><SecondaryButton onClick={() => go("delegate")}>Delegar acceso</SecondaryButton></div>
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
        <div className="mt-4 h-3 rounded-full bg-slate-100"><div className="h-3 w-4/5 rounded-full bg-care" /></div>
        <p className="mt-2 text-sm font-bold text-care">80% preparado</p>
      </Card>
      <Card>
        <div className="flex items-start justify-between gap-3">
          <SectionTitle title="Datos de preparación" subtitle="La lista se arma con información cargada y archivos vinculados." />
          <button
            onClick={() => setPrepEditing(!prepEditing)}
            className={`rounded-full px-3 py-2 text-xs font-black shadow-sm ${prepEditing ? "bg-primary text-white" : "bg-white text-primary"}`}
          >
            Edición
          </button>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          <PrepFieldRow label="Turno cargado" value="Cardiología · Dr. Ruiz" editing={prepEditing} />
          <PrepFieldRow label="Fecha y hora" value="30/05 · 10:30" editing={prepEditing} />
          <PrepFieldRow label="Dirección" value="Av. Santa Fe 2450" editing={prepEditing} />
          <PrepFieldRow label="Medicación activa" value="Losartán 50 mg" editing={prepEditing} />
          <PrepFieldRow label="Notas para consulta" value="3 cargadas" editing={prepEditing} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-emerald-50 p-3">
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
          <SecondaryButton>Editar turno</SecondaryButton>
          <SecondaryButton>Añadir imagen</SecondaryButton>
          <SecondaryButton onClick={() => document.getElementById("notas-consulta")?.scrollIntoView({ behavior: "smooth", block: "start" })}>Agregar nota</SecondaryButton>
          <SecondaryButton onClick={() => go("delegate")}>Sumar acompañante</SecondaryButton>
        </div>
      </Card>
      <PackingList />
      <ConsultationNotes />
      <Checklist title="Preparación práctica" subtitle="Sugerido para este turno" items={["Revisar estudios", "Confirmar dirección", "Llevar credencial", "Avisar a acompañante"]} />
      <Card><SectionTitle title="Archivos vinculados" subtitle="ECG_2025.pdf · Laboratorio_Abril.pdf · Receta_Losartan.jpg · Orden_Control.pdf" /></Card>
      <PrimaryButton className="w-full" onClick={() => go("delegate")}>Compartir con acompañante</PrimaryButton>
    </div>
  );
}

function DelegateCare({ go, accessSent, setAccessSent }: { go: (screen: Screen) => void; accessSent: boolean; setAccessSent: (v: boolean) => void }) {
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
  };
  const toggleSelected = (id: string, selectedIds: string[], setSelectedIds: (ids: string[]) => void) => {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((selectedId) => selectedId !== id) : [...selectedIds, id]);
    setAccessSent(false);
  };
  const moveToStep = (step: 1 | 2 | 3) => {
    setDelegateStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      {accessSent && <div className="rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-700">Mensaje listo para enviar a {selectedCompanion.shortName}</div>}
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
                    className={`flex items-center justify-between rounded-2xl border p-3 text-left transition ${isSelected ? "border-primary bg-blue-50" : "border-slate-200 bg-white"}`}
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
          <PrimaryButton className="w-full" onClick={() => moveToStep(2)}>Continuar</PrimaryButton>
          <SecondaryButton className="w-full" onClick={() => go("event")}>Volver al evento</SecondaryButton>
        </>
      )}

      {delegateStep === 2 && (
        <>
          <Card>
            <StepHeader number="2" title="Marcar qué se comparte" text="Notas, documentos y cosas para llevar que van a formar el mensaje." />
            <label className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-muted">
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

          <PrimaryButton className="w-full" onClick={() => moveToStep(3)}>Ver mensaje</PrimaryButton>
          <SecondaryButton className="w-full" onClick={() => moveToStep(1)}>Volver</SecondaryButton>
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
                  <p className="text-xs text-emerald-50">Acompañante del turno</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 bg-[#e9f3ec] p-4">
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
                    <div key={document.id} className="ml-auto flex w-[86%] items-center gap-3 rounded-2xl rounded-br-sm bg-[#d9f9c9] p-3 text-sm text-ink shadow-sm">
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
          <PrimaryButton className="w-full" onClick={() => setAccessSent(true)}>Enviar por WhatsApp</PrimaryButton>
          <SecondaryButton className="w-full" onClick={() => moveToStep(2)}>Editar selección</SecondaryButton>
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
          <div key={step.number} className={`rounded-2xl border p-3 text-center ${isActive ? "border-primary bg-blue-50" : "border-slate-200 bg-white"}`}>
            <span className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${isDone ? "bg-care text-white" : isActive ? "bg-primary text-white" : "bg-slate-100 text-muted"}`}>
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
        {items.length === 0 && <p className="rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-muted">Sin resultados para esta búsqueda.</p>}
        {items.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <button
              key={item.id}
              className={`flex items-center justify-between gap-3 rounded-2xl border p-3 text-left transition ${isSelected ? "border-primary bg-blue-50" : "border-slate-200 bg-white"}`}
              onClick={() => onToggle(item.id)}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isSelected ? "bg-white text-primary" : "bg-slate-50 text-muted"}`}>
                  {icon === "file" ? <FileText size={17} /> : <ClipboardList size={17} />}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-black text-ink">{item.title}</p>
                  {item.meta && <p className="text-xs font-semibold text-muted">{item.meta}</p>}
                </div>
              </div>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-primary bg-primary text-white" : "border-slate-300 bg-white"}`}>
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
      <SectionTitle title="Tareas compartidas" subtitle="Estado común para la familia" />
      <Card>
        <div className="flex items-center justify-between">
          <p className="font-black">Nueva tarea</p>
          <StatusBadge status="Mock" tone="blue" />
        </div>
        <div className="mt-3 divide-y divide-slate-100">
          <FieldRow label="Tarea" value="Retirar medicación" />
          <FieldRow label="Paciente" value="Mamá Elena" />
          <FieldRow label="Responsable" value="Pablo" />
          <FieldRow label="Vence" value="Mañana 18:00" />
        </div>
        <PrimaryButton className="mt-4 w-full">Agregar tarea</PrimaryButton>
      </Card>
      <div className="flex gap-2 overflow-x-auto pb-1">{["Pendiente", "En curso", "Hecho", "Por persona"].map((x, i) => <Chip active={i === 0} key={x}>{x}</Chip>)}</div>
      {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
      <SecondaryButton className="w-full" onClick={() => go("support")}>Configurar mensaje automático</SecondaryButton>
    </div>
  );
}

function SupportScreen({ go }: { go: (screen: Screen) => void }) {
  const [messageEnabled, setMessageEnabled] = useState(true);
  const [notifyFamily, setNotifyFamily] = useState(true);

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-sm font-bold text-primary">Mamá Elena</p>
        <h1 className="mt-1 text-2xl font-black">Mensaje automático</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Configurá un mensaje amable para la rutina de medicación. Elena puede confirmar, pedir ayuda o elegir que se lo recuerden más tarde.</p>
      </Card>
      <Card className="space-y-3">
        <PermissionToggle label="Mensaje activo" checked={messageEnabled} onChange={() => setMessageEnabled(!messageEnabled)} />
        <FieldRow label="Para" value="Mamá Elena" />
        <FieldRow label="Rutina" value="Losartán 50 mg" />
        <FieldRow label="Horario" value="Todos los días · 20:00" />
        <FieldRow label="Reintento" value="Recordar en 10 min" />
      </Card>
      <Card>
        <p className="font-black text-ink">Mensaje para Elena</p>
        <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-ink">
          Hola Elena, es momento de tu medicación de la noche: Losartán 50 mg. Podés responder: 1 ya lo tomé, 2 recordame en 10 minutos, 3 necesito ayuda.
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Chip active>1 Ya lo tomé</Chip>
          <Chip>2 Más tarde</Chip>
          <Chip>3 Ayuda</Chip>
        </div>
      </Card>
      <Card className="space-y-3">
        <PermissionToggle label="Avisar a Pablo si no hay confirmación" checked={notifyFamily} onChange={() => setNotifyFamily(!notifyFamily)} />
        <FieldRow label="Condición" value="Después de 2 recordatorios" />
        <FieldRow label="Mensaje a Pablo" value="Elena aún no confirmó" />
        <p className="text-sm leading-6 text-muted">Pablo recibe un estado general, no actividad minuto a minuto.</p>
      </Card>
      <PrimaryButton className="w-full">Guardar configuración</PrimaryButton>
      <SecondaryButton className="w-full" onClick={() => go("history")}>Ver historial de mensajes</SecondaryButton>
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

function PrepFieldRow({ label, value, editing }: { label: string; value: string; editing: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <span className="text-sm text-muted">{label}</span>
      <div className="flex items-center justify-end gap-2">
        <span className="text-right font-bold text-ink">{value}</span>
        {editing && (
          <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-primary shadow-sm" aria-label={`Editar ${label}`}>
            <Pencil size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

function PatientCard({ title, detail, meta, status, onClick, hasNew = false }: { title: string; detail: string; meta: string; status: string; onClick?: () => void; hasNew?: boolean }) {
  const content = (
    <Card className="relative flex items-center justify-between gap-3">
        {hasNew && <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-attention ring-4 ring-red-50" aria-label="Movimiento nuevo" />}
        <div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-black">{title}</p>
            {hasNew && <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-black text-attention">Nuevo</span>}
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

function TaskCard({ task }: { task: (typeof tasks)[number] }) {
  return <Card><div className="flex items-start justify-between gap-3"><div><p className="font-black">{task.title}</p><p className="mt-1 text-sm text-muted">Responsable: {task.owner} · Paciente: {task.patient}</p><p className="text-sm text-muted">Vence: {task.due}</p></div><StatusBadge status={task.status} tone={toneForStatus(task.status)} /></div><PrimaryButton className="mt-4 w-full">Acción principal</PrimaryButton></Card>;
}

function PermissionToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return <button onClick={onChange} className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-3 text-left"><span className="font-bold">{label}</span><span className={`flex h-7 w-12 items-center rounded-full p-1 transition ${checked ? "bg-care" : "bg-slate-300"}`}><span className={`h-5 w-5 rounded-full bg-white transition ${checked ? "translate-x-5" : ""}`} /></span></button>;
}

function TimelineItem({ item, last }: { item: (typeof activityLog)[number]; last: boolean }) {
  return <div className="flex gap-3"><div className="flex flex-col items-center"><div className="mt-1 h-3 w-3 rounded-full bg-primary" />{!last && <div className="h-full min-h-12 w-px bg-slate-200" />}</div><div className="pb-5"><p className="font-black">{item.time}</p><p className="text-sm text-muted">{item.text}</p></div></div>;
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
        <button
          onClick={() => setEditing(!editing)}
          className={`rounded-full px-3 py-2 text-xs font-black shadow-sm ${editing ? "bg-primary text-white" : "bg-white text-primary"}`}
        >
          Edición
        </button>
      </div>
      <div className="space-y-2">
        {notes.map((note) => (
          <div key={note} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
            <span className="font-semibold">{note}</span>
            {editing && (
              <div className="flex shrink-0 gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary shadow-sm" aria-label={`Editar nota: ${note}`}>
                  <Pencil size={16} />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-attention shadow-sm" aria-label={`Borrar nota: ${note}`}>
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-3">
        <p className="text-xs font-black uppercase text-muted">Agregar nota</p>
        <p className="mt-2 rounded-xl bg-slate-50 px-3 py-3 text-sm text-muted">Ej: preguntar si conviene controlar la presión por la mañana</p>
        <SecondaryButton className="mt-3 w-full">Agregar a la consulta</SecondaryButton>
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
        <button
          onClick={() => setEditing(!editing)}
          className={`rounded-full px-3 py-2 text-xs font-black shadow-sm ${editing ? "bg-primary text-white" : "bg-white text-primary"}`}
        >
          Edición
        </button>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
            <label className="flex flex-1 items-center gap-3 font-semibold">
              <input
                type="checkbox"
                checked={checkedItems[item]}
                onChange={() => setCheckedItems({ ...checkedItems, [item]: !checkedItems[item] })}
                className="h-5 w-5 rounded border-slate-300 accent-emerald-500"
              />
              <span className={checkedItems[item] ? "text-muted line-through" : "text-ink"}>{item}</span>
            </label>
            {editing && (
              <div className="flex shrink-0 gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary shadow-sm" aria-label={`Editar item: ${item}`}>
                  <Pencil size={16} />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-attention shadow-sm" aria-label={`Borrar item: ${item}`}>
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-3">
        <p className="text-xs font-black uppercase text-muted">Agregar item</p>
        <p className="mt-2 rounded-xl bg-slate-50 px-3 py-3 text-sm text-muted">Ej: llevar credencial física</p>
        <SecondaryButton className="mt-3 w-full">Agregar a la lista</SecondaryButton>
      </div>
    </Card>
  );
}

function ChatBubble({ children, mine = false }: { children: React.ReactNode; mine?: boolean }) {
  return <div className={`max-w-[84%] rounded-2xl px-3 py-2 text-sm shadow-sm ${mine ? "ml-auto rounded-br-sm bg-[#dcf8c6]" : "rounded-bl-sm bg-white"}`}>{children}</div>;
}

function MockPhoneFrame({ children, scroll = false }: { children: React.ReactNode; scroll?: boolean }) {
  return <div className={`${scroll ? "scrollbar-none h-[min(68vh,560px)] min-h-[430px] overflow-y-auto" : "overflow-hidden"} rounded-[2rem] border-4 border-slate-800 bg-white shadow-soft`}>{children}</div>;
}

function Checklist({ title, subtitle, items }: { title: string; subtitle?: string; items: string[] }) {
  return <Card><p className="font-black">{title}</p>{subtitle && <p className="mb-3 mt-1 text-sm text-muted">{subtitle}</p>}<div className="space-y-2">{items.map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"><Check className="text-care" size={18} /><span className="font-semibold">{item}</span></div>)}</div></Card>;
}

export default App;
