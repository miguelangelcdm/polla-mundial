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
    
    - Fixed component state declaration in `src/components/MasterDashboard.jsx` to resolve build errors.
- Updated HeroUI `<Select>` component to correctly handle family selection and display scores.
- Added dark mode support to Sileo Toaster via `theme` prop for consistent toast styling.
- Adjusted ListBox items to use `value` prop for proper selection handling.
