# Aprendizajes de la jornada - Salud en equipo

Fecha: 26/06/2026

## Enfoque general

La aplicacion debe sentirse como una app real, aunque sea una simulacion con datos mock. No debe hablar todo el tiempo de "demo"; la prueba de usabilidad puede tener datos inventados, pero la experiencia visual y narrativa tiene que ser autentica.

La solucion no reemplaza WhatsApp. WhatsApp funciona como entrada externa de informacion, y la app organiza, clasifica y permite accionar sobre esa informacion.

## Flujo principal definido

1. Antes de entrar al flujo, la persona ve una pantalla de prueba de usabilidad.
2. Esa pantalla agradece la participacion, explica brevemente que se va a evaluar el flujo, y permite ingresar un nombre.
3. El nombre ingresado personaliza la experiencia reemplazando a Marina.
4. Luego comienza el flujo externo de WhatsApp.
5. El usuario lee el chat completo para entender el contexto.
6. La app muestra como Memo interpreta la informacion reenviada.
7. El home muestra solo lo relevante para hoy: el evento nuevo, actividad reciente y accion sugerida.
8. La preparacion, carga de notas, documentos, cosas para llevar y asignacion de acompañante se realiza desde el evento medico.

## Decisiones UX importantes

- El chat de WhatsApp no forma parte de la app: es un input externo.
- El onboarding de la app viene despues del input externo.
- El home no debe resolver todo. Debe orientar y mostrar actividad o necesidades inmediatas.
- La asignacion de acompañante no debe estar en el home; se hace desde el evento medico, porque depende del contexto de esa cita.
- El usuario debe tener libertad de accion mediante carga manual, pero esa accion vive principalmente en el `+` segun la seccion.
- En Ajustes no debe aparecer el `+`, porque esa pantalla no es un lugar de carga operativa.
- Las acciones destructivas, de guardado, edicion o cancelacion necesitan confirmacion para reducir errores.
- El boton `Cerrar sesion` funciona como reset oculto de la prueba de usabilidad.

## Ajustes de usabilidad realizados

- Se agrego personalizacion por nombre para la prueba.
- Se agrego una pantalla previa con agradecimiento y contexto.
- El CTA inicial ahora dice `Comenzar`.
- El texto de ingreso por WhatsApp pide leer el chat completo.
- Se elimino la asignacion de acompañante desde el home.
- El envio del mensaje al acompañante muestra spinner, tilde verde y confirmacion.
- El home deja de mostrar `Acompañante asignado` como si fuera un evento.
- La pantalla de Ajustes se reorganizo en cuenta, privacidad, notificaciones, preferencias y ayuda.
- Se agrego ayuda con Centro de ayuda, Politica de privacidad y Terminos de uso.
- Se mejoro contraste en la tarjeta de perfil de Ajustes.

## Evento medico

El evento medico es el centro operativo para preparar una consulta.

Elementos clave:

- Datos de preparacion.
- Direccion con referencia a geotag/Google Maps.
- Notas para consulta.
- Cosas para llevar.
- Archivos vinculados.
- Accion para sumar acompañante.
- Vista previa del mensaje que se enviara por WhatsApp.

La barra de preparacion ya no debe decir un porcentaje que no se pueda completar. Actualmente muestra preparacion completa con `5 de 5 datos cargados`, usando datos simulados.

Los 5 datos representados son:

1. Turno cargado.
2. Fecha y hora.
3. Direccion.
4. Notas para consulta.
5. Archivos vinculados.

## Edicion

Los controles de edicion deben ser claros:

- En reposo dicen `Edicion`.
- Cuando estan activos dicen `Listo`.

Esto aplica a:

- Datos de preparacion.
- Notas para consulta.
- Para llevar.

## Acompañante

El acompañante se asigna desde el evento medico.

El flujo se divide en tres pasos:

1. Elegir acompañante.
2. Marcar que se comparte: notas, documentos y cosas para llevar.
3. Ver vista previa del mensaje de WhatsApp.

Al enviar:

- aparece spinner;
- aparece tilde verde;
- se confirma que el mensaje fue enviado correctamente;
- la app vuelve al home.

## Prueba de usabilidad

La app debe permitir reiniciar la experiencia desde cero.

El boton `Cerrar sesion` en Ajustes:

- pide confirmacion;
- borra los cambios simulados;
- limpia el nombre ingresado;
- vuelve al inicio externo del flujo.

La prueba debe evaluar especialmente:

- si se entiende que WhatsApp es entrada y no repositorio;
- si se entiende que Memo clasifica la informacion;
- si el usuario encuentra donde preparar el evento;
- si entiende que el acompañante se suma desde el evento;
- si entiende la vista previa del mensaje antes de enviarlo;
- si el reset permite repetir la prueba sin friccion.

## Pendientes posibles

- Hacer que la barra de preparacion sea realmente dinamica segun checks o campos cargados.
- Convertir ayuda, privacidad y terminos en pantallas internas simples.
- Guardar temporalmente el nombre en `localStorage` si se quiere persistir al recargar.
- Agregar tareas guiadas de testeo para moderador.
- Registrar en historial las acciones simuladas hechas durante la sesion.
- Revisar accesibilidad de contraste en todas las tarjetas con fondos de color.
