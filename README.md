# 🏆 Polla Mundialista 2026 - Octavos de Final

Este proyecto es una aplicación web de alta fidelidad diseñada para gestionar una **Polla Mundialista** (quiniela) para los octavos de final de la Copa Mundial 2026.

La interfaz visual combina un **Tema Claro (Light Mode) por defecto**, sofisticado y limpio (basado en matices de blanco, bordes finos y sombras tenues), con un **Modo Oscuro (Dark Mode) opcional y toggleable** que activa el tema del mundial previo (fondo espacial, morados intensos y glows neón). 

---

## 🎨 Sistema de Diseño Dual (Claro/Oscuro)

El sistema de temas se controla a través de variables CSS en [index.css](file:///c:/Users/migue/Documents/Projects/pollon-alejos/src/index.css), lo que permite que los componentes conmuten sus colores al instante cuando se añade la clase `.dark` al contenedor raíz:

1. **Tema Claro (Base del Sistema)**:
   - **Fondo**: Gris claro / azulado limpio (`#f8fafc` a `#f1f5f9`).
   - **Tarjetas (PulsLine Glass)**: Cristal blanco translúcido (`rgba(255, 255, 255, 0.85)`) con un borde sutil y sombra difusa muy suave. Sin luces de neón.
   - **Textos**: Azul pizarra oscuro (`#0f172a`) e índigo.
   - **Botones Píldora (`rounded-full`)**: Botones redondos con colores de fondo sólidos e intensos y sofisticados (azul real, verde esmeralda y oro ámbar) sin resplandores.
2. **Tema Oscuro (Mundial 2026)**:
   - **Fondo**: Degradado espacial azul profundo y violeta (`#020813` y `#0d041a`) con auras de color difuso.
   - **Tarjetas**: Cristal oscuro translúcido con bordes y anillos de luz sofisticados y elegantes (evitando neones estridentes).
   - **Textos**: Blanco grisáceo (`#f5f6f8`) y gris mutado.

---

## 🔑 Login Split-Screen Ajustado

La pantalla de acceso implementa un diseño dividido que maximiza la compatibilidad responsiva y optimiza la altura de pantalla:

- **Foto Familiar Limpia (Izquierda)**:
  - El lado izquierdo muestra la foto de la familia (`/assets/family.jpg`) a pantalla completa **completamente limpia**, sin ningún texto ni overlay oscuro encima.
- **Formulario y Textos Integrados (Derecha)**:
  - Todo el contenido de la polla (logotipo `🏆 POLLA2026`, titular y descripción resumidos) se muestra en la columna derecha encima de los formularios de ingreso.
  - El footer de características antiguo de la plantilla PulsLine fue removido completamente para mantener una estética más limpia y profesional.
- **Control de Altura y Footer**:
  - En desktop, la pantalla de login se bloquea en la altura del navegador (`h-screen overflow-hidden`) para garantizar que no aparezcan barras de scroll innecesarias.
  - El footer general se muestra de forma condicional **únicamente** cuando el usuario inicia sesión.

---

## 🔑 Registro Simplificado y Flujo de Onboarding

Para mejorar la experiencia de usuario y facilitar la adopción, hemos reestructurado el flujo de registro y vinculación:

1. **Registro Simplificado**: El usuario se registra únicamente con `Nombre Completo`, `Usuario` y `Contraseña`. El **Código de Familia** ha sido eliminado del formulario de registro inicial.
2. **Pantalla de Onboarding**: Si el usuario inicia sesión y su cuenta no tiene un `grupo_id` asociado (y no es el Master), se bloquea el acceso a las predicciones y posiciones, mostrándole una pantalla centralizada de **Configuración de Familia**:
   - **Miembros**: Deben ingresar el código de invitación familiar que les dio su gestor para unirse al grupo.
   - **Gestor Designado (Promovido por el Master)**: Al ingresar, se le muestra un formulario exclusivo para **Crear el Grupo Familiar** (definiendo el nombre), lo que genera automáticamente su código único de invitación para compartir con otros miembros.
3. **Control del Master**: Desde el panel global, el Master puede promover a cualquier usuario registrado al rol de **Gestor** con un solo clic, permitiendo que cree un grupo al iniciar sesión.

---

## ⚡ Componentes e Interfaz en Hero UI

Hemos migrado toda la interfaz de componentes (antes basada en shadcn/ui y Radix) a **Hero UI** (ex NextUI v3) para obtener transiciones dinámicas de alto nivel y consistencia de diseño:

- **Configuración de Zero Boilerplate**: Utilizando React 19 y Tailwind CSS v4, el proveedor de contexto no es necesario y el compilador carga dinámicamente los estilos optimizados.
- **Botones y Formularios**: Todos los campos de entrada (`Input`) y botones (`Button`) de la aplicación ahora utilizan los componentes interactivos nativos de Hero UI con bordes dinámicos, enfoques animados y estilos de píldora.
- **Pestañas y Acordeones**: Las pestañas en la autenticación, panel gestor y panel master utilizan el componente `<Tabs>` con la animación deslizante del cursor de Hero UI. El acordeón de reglas deportivas en la vista de predicciones utiliza el componente `<Accordion>` en modo splitted.
- **Accesibilidad**: Añadimos etiquetas `<label>` con clase `sr-only` a todos los campos de entrada en `GestorDashboard` para mejorar la accesibilidad y contraste.
- **Adaptadores UI**: Los archivos de `src/components/ui/` (`button.jsx`, `card.jsx`, `input.jsx`) actúan como wrappers inteligentes sobre Hero UI para asegurar compatibilidad total con el resto del código y simplificar la integración.

---

## ⚙️ Instrucciones de Instalación y Ejecución

1. **Instalar Dependencias**:
   ```bash
   npm install
   ```
2. **Ejecutar en Desarrollo**:
   ```bash
   npm run dev
   ```
3. **Compilar para Producción**:
   ```bash
   npm run build
   ```
4. **Iniciar en Producción**:
    ```bash
    npm start
    ```
    
     Edite el archivo `.env` en la raíz del proyecto para conectar su base de datos Supabase en la nube.

---

## 🎨 Mejoras de Diseño y Experiencia de Usuario (Julio 2026)

Hemos llevado a cabo un rediseño de la interfaz visual y la navegación enfocado en principios de **Design Engineering** (basados en el repositorio de **ui-skills**):

1. **Navegación Desktop Unificada**: Se integraron las pestañas de navegación principales directamente en la cabecera sticky (`Navbar.jsx`). Se eliminó la barra flotante inferior en pantallas grandes, liberando espacio vertical y centralizando la navegación.
2. **MobileNav con Tema Dinámico**: Corregido el bug del modo claro de la barra móvil inferior. Ahora utiliza la clase `.transition-theme` y fondo translúcido (`bg-gh-bg-light/95`) que responde correctamente a ambos temas.
3. **Predicciones Táctiles (`MatchItem.jsx`)**: Se reemplazaron los campos numéricos de goles por controles táctiles con botones `+` y `-` a cada lado. En celulares, esto permite ajustar marcadores mediante toques directos sin necesidad de abrir el teclado numérico.
4. **Podio Gamificado (`Leaderboard.jsx`)**: Se rediseñó la sección superior de la tabla de posiciones con un podio visual en 3D (segundo, primero y tercer lugar ordenados de izquierda a derecha), con medallas, auras dinámicas y avatares destacados.
5. **Efectos de Micro-Interacción**:
   - Transiciones suaves en todos los componentes con clase `.transition-theme`.
   - Efecto hover con escala suave (`hover:scale-[1.01]`) y sombras suaves en las tarjetas de partidos activos.
   - Vinculación correcta de las variables de color `--color-neon-blue`, `--color-neon-pink` y `--color-neon-green` en la directiva `@theme` de Tailwind CSS v4.

---

## 🚀 Guía de Despliegue en Supabase y Netlify

Sigue estos pasos para poner la aplicación en producción utilizando la base de datos Supabase en la nube y el alojamiento estático de Netlify.

### 1. Configuración de la Base de Datos en Supabase

1. **Crear Proyecto**: Regístrate o inicia sesión en [Supabase](https://supabase.com) y crea un nuevo proyecto.
2. **Crear Tablas y Semilla**:
   - Ve a la sección **SQL Editor** en el panel lateral de Supabase.
   - Crea un nuevo query, copia el contenido completo del archivo `schema.sql` de este proyecto y ejecútalo (`Run`).
   - Esto creará las tablas `grupos`, `usuarios`, `resultados` y `predicciones`, junto con sus índices y el usuario administrador principal (`master` / `master123`).
3. **Desactivar o Configurar RLS (Row Level Security)**:
   - Para un entorno rápido y privado entre amigos, puedes desactivar RLS en las tablas `grupos`, `usuarios`, `resultados` y `predicciones` en el panel de base de datos de Supabase.
   - Si prefieres habilitar RLS, recuerda agregar las políticas correspondientes en la pestaña **Authentication** / **Policies** para permitir accesos de lectura y escritura anónimos o por usuario.
4. **Obtener las Credenciales**:
   - Ve a **Project Settings** (icono de engranaje) -> **API**.
   - Copia la **Project API URL** (será tu `VITE_SUPABASE_URL`).
   - Copia la **anon public API key** (será tu `VITE_SUPABASE_ANON_KEY`).

### 2. Configuración Local (Opcional)

Si deseas probar la base de datos real localmente antes de subir a Netlify:
1. Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`.
2. Llena las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con tus credenciales.
3. Ejecuta `npm run dev`. La consola del navegador indicará si la conexión fue exitosa. Si falla la conexión, la aplicación activará automáticamente el modo de simulación local (`LocalStorage`).

### 3. Despliegue en Netlify

#### Opción A: Despliegue mediante GitHub (Recomendado)
1. Sube tu proyecto a un repositorio de **GitHub** (asegúrate de no subir el archivo `.env` local).
2. Entra a [Netlify](https://netlify.com) y selecciona **Add new site** -> **Import an existing project** -> GitHub.
3. Configura los parámetros del Build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Configura las Variables de Entorno en Netlify:
   - Ve a **Site settings** -> **Environment variables** -> **Add a variable**.
   - Agrega `VITE_SUPABASE_URL` y su valor correspondiente.
   - Agrega `VITE_SUPABASE_ANON_KEY` y su valor correspondiente.
5. Haz clic on **Deploy site**.

#### Opción B: Despliegue Manual con Netlify CLI
1. Instala el CLI de Netlify globalmente:
   ```bash
   npm install -g netlify-cli
   ```
2. Compila el proyecto en tu máquina local:
   ```bash
   npm run build
   ```
3. Inicia sesión y despliega la carpeta `dist`:
   ```bash
   netlify deploy --prod --dir=dist
   ```
4. Agrega las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en la sección de administración del sitio en la web de Netlify.

> [!NOTE]
> 1. El archivo `public/_redirects` ya ha sido incluido en el proyecto. Esto asegura que Netlify maneje correctamente las rutas internas de React (Vite Router) sin generar errores 404 al recargar el navegador en rutas como `/dashboard` o `/onboarding`.
> 2. Se ha incluido un archivo `.npmrc` con la directiva `legacy-peer-deps=true`. Esto es necesario porque algunas dependencias del ecosistema (como `lucide-react`) aún solicitan React 18 como dependencia de pares (peer dependency) en sus metadatos, mientras que este proyecto utiliza React 19.
> 3. **Migración de Base de Datos (Supabase)**: Si estás usando una base de datos de Supabase ya existente y quieres evitar errores al cerrar y guardar partidos, ejecuta el siguiente script en el **SQL Editor** de tu consola de Supabase:
>    ```sql
>    ALTER TABLE resultados ADD COLUMN IF NOT EXISTS ganador_nombre TEXT;
>    ALTER TABLE resultados ADD COLUMN IF NOT EXISTS fecha_cierre TIMESTAMPTZ;
>    ```
> 4. **Navegación Lateral Unificada**: Tanto los Master como los Gestores de Familia tienen su navegación centralizada en el menú lateral izquierdo (Sidebar) en ordenadores, y mediante pestañas dedicadas en la barra inferior en móviles, eliminando los switchers duplicados de la cabecera.


---

## 🛠️ Resiliencia en Selección de Ganadores y Progresión del Fixture (Julio 2026)

Para garantizar que los administradores no pierdan los valores seleccionados de los clasificados en las llaves eliminatorias al refrescar la página, se implementó un sistema de emparejamiento tolerante a formatos:

1. **Normalizador de Equipos (`cleanTeamName`)**:
   - Resuelve discrepancias ortográficas, de banderas unicode y códigos de país entre distintas bases de datos (ej. compara de manera equivalente `'Francia 🇫🇷'`, `'Francia FR'` y `'Francia'` convirtiéndolas de forma segura a `'francia'`).
   - El helper está disponible de forma centralizada en [src/supabaseClient.js](file:///c:/Users/migue/Documents/Projects/pollon-alejos/src/supabaseClient.js) y se utiliza automáticamente al mapear datos entrantes y salientes.

2. **Selects Nativos de Alta Fiabilidad (Migración Global)**:
   - Se reemplazaron **todos los selectores del sistema** (selector de ganador en partidos jugados, selector de local/visita en partidos por confirmar, selector móvil de pestañas, y selectores de familias en logs y puntuaciones) por elementos nativos HTML `<select>` estilizados con CSS y variables modernas.
   - Esto erradica por completo la pérdida de valores debido a la desestructuración de los portales de React Aria cuando los dropdowns están cerrados al renderizar el componente.
   - La solución fue verificada mediante pruebas E2E con **Playwright** en Chromium, garantizando la persistencia e integridad de todo el flujo tras recargas y logueos.
