import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Trophy, Star, Settings, Globe, Crown, LogOut, 
  AlertCircle, RefreshCw, Check
} from 'lucide-react';
import { Toaster, sileo } from 'sileo';

// Base de datos y utilidades
import { db, checkConnection, clientState } from './supabaseClient';

// Componentes modulares de interfaz
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import RulesAccordion from './components/RulesAccordion';
import MatchItem from './components/MatchItem';
import Leaderboard from './components/Leaderboard';
import AuthCard from './components/AuthCard';
import GestorDashboard from './components/GestorDashboard';
import MasterDashboard from './components/MasterDashboard';
import MemberDashboard from './components/MemberDashboard';

// UI Atómica
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Input } from './components/ui/input';

export default function App() {
  // --- TEMA (LIGHT / DARK) ---
  const [theme, setTheme] = useState(() => localStorage.getItem('pb_theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('pb_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // --- ESTADOS DE CARGA Y CONEXIÓN ---
  const [loading, setLoading] = useState(true);
  const [connError, setConnError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // --- ESTADOS DE SESIÓN Y USUARIO ---
  const [currentUser, setCurrentUser] = useState(null);
  
  // --- NAVEGACIÓN ---
  const [activeTab, setActiveTab] = useState('predicciones');
  const [activeAdminTab, setActiveAdminTab] = useState('predicciones');

  // --- ESTADOS DE NEGOCIO ---
  const [partidos, setPartidos] = useState([]);
  const [predicciones, setPredicciones] = useState({});
  const [resultados, setResultados] = useState({});
  const [tablaPosiciones, setTablaPosiciones] = useState([]);
  
  // Estados para vistas de administración
  const [gruposList, setGruposList] = useState([]);
  const [usuariosList, setUsuariosList] = useState([]);
  const [allPredicciones, setAllPredicciones] = useState([]);
  
  // --- FORMULARIOS DE REGISTRO / LOGIN ---
  const [authTab, setAuthTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [joinForm, setJoinForm] = useState({ nombre: '', apellido: '', username: '', password: '', codigoGrupo: '' });
  const [createForm, setCreateForm] = useState({ nombre: '', username: '', password: '', nombreGrupo: '' });

  // --- FORMULARIOS DE EDICIÓN ---
  const [nuevoGrupoNombre, setNuevoGrupoNombre] = useState('');
  const [resultadoEdicion, setResultadoEdicion] = useState({});

  // --- ONBOARDING STATES ---
  const [onboardingGroupName, setOnboardingGroupName] = useState('');
  const [onboardingGroupCode, setOnboardingGroupCode] = useState('');

  // Ref to store latest currentUser to avoid dependency loops in callbacks
  const currentUserRef = useRef(null);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // --- CARGAR DATOS PRINCIPALES ---
  const cargarDatosApp = useCallback(async (user) => {
    const activeUser = user || currentUserRef.current;
    if (!activeUser) return;
    try {
      const listPartidos = await db.getPartidos();
      setPartidos(listPartidos);

      const resOficiales = await db.getResultados();
      setResultados(resOficiales);
      
      const initResEdicion = {};
      listPartidos.forEach(p => {
        initResEdicion[p.id] = {
          goles_local: resOficiales[p.id]?.goles_local !== undefined ? resOficiales[p.id].goles_local : '',
          goles_visita: resOficiales[p.id]?.goles_visita !== undefined ? resOficiales[p.id].goles_visita : '',
          cerrado: resOficiales[p.id]?.cerrado || false,
          ganador_nombre: resOficiales[p.id]?.ganador_nombre || ''
        };
      });
      setResultadoEdicion(initResEdicion);

      if (!activeUser.es_master) {
        const listPreds = await db.getPredicciones(activeUser.id);
        const predsObj = {};
        listPreds.forEach(p => {
          predsObj[p.partido_id] = {
            goles_local: p.goles_local === null ? '' : p.goles_local,
            goles_visita: p.goles_visita === null ? '' : p.goles_visita
          };
        });
        setPredicciones(predsObj);
        
        if (activeUser.grupo_id) {
          const tabla = await db.getTablaPosiciones(activeUser.grupo_id);
          setTablaPosiciones(tabla);
        }
      }

      if (activeUser.es_admin || activeUser.es_master) {
        const grupos = await db.getGrupos();
        setGruposList(grupos);
        
        const usuarios = await db.getUsuarios();
        setUsuariosList(usuarios);

        const allPreds = await db.getAllPredicciones();
        setAllPredicciones(allPreds);
      }
    } catch (err) {
      sileo.error({ title: "Error al cargar datos", description: err.message });
    }
  }, []);

  // --- INICIALIZACIÓN Y CONEXIÓN ---
  useEffect(() => {
    const conectar = async () => {
      setLoading(true);
      const res = await checkConnection();
      setIsDemoMode(clientState.isMock);
      if (!res.success) {
        setConnError(res.error);
      }
      
      const cachedUser = localStorage.getItem('pb_session_user');
      const cachedPass = localStorage.getItem('pb_session_pass');
      if (cachedUser && cachedPass) {
        const u = JSON.parse(cachedUser);
        try {
          const freshUser = await db.login(u.username, cachedPass);
          localStorage.setItem('pb_session_user', JSON.stringify(freshUser));
          if (freshUser.es_master) {
            setActiveTab('master');
            setActiveAdminTab('grupos_master');
          } else if (freshUser.es_admin) {
            setActiveTab('admin');
            setActiveAdminTab('predicciones');
          } else {
            setActiveTab('predicciones');
          }
          setCurrentUser(freshUser);
          // cargarDatosApp is defined above — safe to call here
          await cargarDatosApp(freshUser);
        } catch (e) {
          localStorage.removeItem('pb_session_user');
          localStorage.removeItem('pb_session_pass');
        }
      }
      setLoading(false);
    };
    conectar();
  }, [cargarDatosApp]);

  // Recargar datos cuando hay acciones del usuario (save, toggle, etc.)
  // NOTE: login/register flows call cargarDatosApp(user) directly with fresh user

  // --- CONTROL DE ACCIONES ---

  // Ingresar
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) {
      sileo.error({ title: "Completa todos los campos" });
      return;
    }
    setLoading(true);
    try {
      const u = await db.login(loginForm.username, loginForm.password);
      setCurrentUser(u);
      localStorage.setItem('pb_session_user', JSON.stringify(u));
      localStorage.setItem('pb_session_pass', loginForm.password);
      sileo.success({ title: `¡Bienvenido de nuevo, ${u.nombre}!` });
      // Pass fresh user directly to avoid stale closure
      await cargarDatosApp(u);
      if (u.es_master) {
        setActiveTab('master');
        setActiveAdminTab('grupos_master');
      } else if (u.es_admin) {
        setActiveTab('admin');
        setActiveAdminTab('predicciones');
      } else {
        setActiveTab('predicciones');
      }
    } catch (err) {
      sileo.error({ title: "Error al iniciar sesión", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Registrarse sin grupo (registro simplificado)
  const handleRegister = async (e) => {
    e.preventDefault();
    const { nombre, apellido, password } = joinForm;
    if (!nombre || !apellido || !password) {
      sileo.error({ title: "Completa todos los campos" });
      return;
    }
    setLoading(true);
    try {
      const fullNombre = `${nombre.trim()} ${apellido.trim()}`;
      
      // Validar si el participante ya existe en la lista local antes de registrar
      const allUsers = await db.getUsuarios();
      if (allUsers.some(u => u.nombre.toLowerCase() === fullNombre.toLowerCase())) {
        sileo.error({ 
          title: "Participante ya registrado", 
          description: `El nombre "${fullNombre}" ya está registrado en el sistema. Por favor, usa una variación o agrega tu segundo apellido.`
        });
        setLoading(false);
        return;
      }

      const base = fullNombre
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, '_')
        .replace(/__+/g, '_')
        .replace(/^_+|_+$/g, '') || "usuario";

      let username = base;
      let attempt = 0;
      let u = null;

      while (attempt < 5) {
        try {
          u = await db.register(fullNombre, username, password);
          break; // Exito
        } catch (err) {
          const isDup = err.message.includes("ya está registrado") || 
                        err.message.includes("unique") || 
                        err.message.includes("duplicate");
          if (isDup) {
            const suffix = Math.floor(100 + Math.random() * 900);
            username = `${base}_${suffix}`;
            attempt++;
          } else {
            throw err;
          }
        }
      }

      if (!u) {
        throw new Error("No se pudo generar un nombre de usuario único. Inténtalo de nuevo.");
      }

      setCurrentUser(u);
      localStorage.setItem('pb_session_user', JSON.stringify(u));
      localStorage.setItem('pb_session_pass', password);
      sileo.success({ 
        title: "¡Cuenta creada correctamente!", 
        description: `Tu usuario asignado es: "${username}". Guárdalo para volver a ingresar.` 
      });
      setActiveTab('predicciones');
    } catch (err) {
      sileo.error({ title: "Error al registrarse", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Unirse a grupo en Onboarding
  const handleOnboardingJoinGroup = async (e) => {
    e.preventDefault();
    if (!onboardingGroupCode.trim()) {
      sileo.error({ title: "Ingresa un código de familia válido" });
      return;
    }
    setLoading(true);
    try {
      const u = await db.joinGroup(currentUser.id, onboardingGroupCode);
      setCurrentUser(u);
      localStorage.setItem('pb_session_user', JSON.stringify(u));
      sileo.success({ title: "¡Te has unido al grupo!", description: `Bienvenido a "${u.grupo_nombre}"` });
      await cargarDatosApp();
    } catch (err) {
      sileo.error({ title: "Error al unirse al grupo", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Crear grupo en Onboarding (para el Gestor designado)
  const handleOnboardingCreateGroup = async (e) => {
    e.preventDefault();
    if (!onboardingGroupName.trim()) {
      sileo.error({ title: "Ingresa un nombre de grupo válido" });
      return;
    }
    setLoading(true);
    try {
      const u = await db.createGroupForGestor(currentUser.id, onboardingGroupName);
      setCurrentUser(u);
      localStorage.setItem('pb_session_user', JSON.stringify(u));
      sileo.success({ title: "¡Grupo Familiar creado!", description: `Código de invitación: ${u.grupo_codigo}` });
      setActiveTab('admin');
      setActiveAdminTab('predicciones');
      await cargarDatosApp(u);
    } catch (err) {
      sileo.error({ title: "Error al crear grupo", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Cerrar Sesión
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pb_session_user');
    localStorage.removeItem('pb_session_pass');
    setLoginForm({ username: '', password: '' });
    setJoinForm({ nombre: '', username: '', password: '', codigoGrupo: '' });
    setCreateForm({ nombre: '', username: '', password: '', nombreGrupo: '' });
    setOnboardingGroupName('');
    setOnboardingGroupCode('');
    setActiveTab('predicciones');
    sileo.success({ title: "Sesión cerrada correctamente" });
  };

  // Guardar Predicciones (Upsert)
  const handleSavePredicciones = async () => {
    setLoading(true);
    try {
      let guardados = 0;
      for (const partido of partidos) {
        if (!partido.confirmado) continue;
        
        const resOficial = resultados[partido.id];
        if (resOficial && resOficial.cerrado) continue;

        const pred = predicciones[partido.id];
        const golesL = pred?.goles_local;
        const golesV = pred?.goles_visita;

        if (golesL !== undefined && golesV !== undefined && golesL !== '' && golesV !== '') {
          await db.savePrediccion(currentUser.id, partido.id, golesL, golesV);
          guardados++;
        }
      }

      if (guardados > 0) {
        sileo.success({ title: `¡Predicciones guardadas!`, description: `Se actualizaron ${guardados} predicciones.` });
        cargarDatosApp();
      } else {
        sileo.error({ title: "No hay predicciones válidas para guardar" });
      }
    } catch (err) {
      sileo.error({ title: "Error al guardar", description: err.message });
    } finally {
      setLoading(false);
    }
  };
  // Guardar Predicción Individual (Tile 2)
  const handleSaveSinglePrediction = async (partidoId, golesLocal, golesVisita) => {
    if (golesLocal === '' || golesVisita === '' || golesLocal === undefined || golesVisita === undefined) {
      sileo.error({ title: "Ingresa un marcador válido" });
      return;
    }
    setLoading(true);
    try {
      await db.savePrediccion(currentUser.id, partidoId, Number(golesLocal), Number(golesVisita));
      sileo.success({ title: "Pronóstico guardado", description: "Tu predicción se ha registrado con éxito." });
      await cargarDatosApp();
    } catch (err) {
      sileo.error({ title: "Error al guardar pronóstico", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Guardar Resultado Oficial (Admin / Master)
  const handleSaveResultado = async (partidoId) => {
    const rEdit = resultadoEdicion[partidoId];
    if (rEdit.goles_local === '' || rEdit.goles_visita === '') {
      sileo.error({ title: "Faltan goles oficiales" });
      return;
    }
    
    const gL = parseInt(rEdit.goles_local);
    const gV = parseInt(rEdit.goles_visita);
    if (gL === gV && !rEdit.ganador_nombre) {
      sileo.error({ title: "Clasificación Requerida", description: "Debes seleccionar el equipo que avanza (ganador de la prórroga/penaltis) si el partido termina empatado." });
      return;
    }

    setLoading(true);
    try {
      await db.saveResultado(partidoId, rEdit.goles_local, rEdit.goles_visita, true, rEdit.ganador_nombre || null);
      sileo.success({ title: "Resultado cargado", description: "El partido ha sido cerrado y los puntos recalculados." });
      await cargarDatosApp();
    } catch (err) {
      sileo.error({ title: "Error al guardar resultado", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Desbloquear/Abrir Partido (Admin / Master)
  const handleAbrirPartido = async (partidoId) => {
    setLoading(true);
    try {
      const rEdit = resultadoEdicion[partidoId];
      await db.saveResultado(partidoId, rEdit.goles_local || 0, rEdit.goles_visita || 0, false);
      sileo.success({ title: "Partido reabierto para predicciones" });
      await cargarDatosApp();
    } catch (err) {
      sileo.error({ title: "Error al reabrir", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Crear Grupo (Master Directo)
  const handleMasterCreateGroup = async (e) => {
    e.preventDefault();
    if (!nuevoGrupoNombre.trim()) {
      sileo.error({ title: "Ingresa un nombre de grupo válido" });
      return;
    }
    setLoading(true);
    try {
      const g = await db.createGroupDirectly(nuevoGrupoNombre);
      sileo.success({ title: `Grupo creado`, description: `Código: ${g.codigo}` });
      setNuevoGrupoNombre('');
      await cargarDatosApp();
    } catch (err) {
      sileo.error({ title: "Error al crear grupo", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Designar Gestor Global (Master)
  const handleToggleUserAdmin = async (usuarioId, esAdmin) => {
    setLoading(true);
    try {
      await db.toggleUserAdmin(usuarioId, esAdmin);
      sileo.success({ title: esAdmin ? "Usuario promovido a Gestor con éxito" : "Rol de Gestor removido" });
      await cargarDatosApp();
    } catch (err) {
      sileo.error({ title: "Error al cambiar rol de usuario", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Suspender / Activar usuario (Master)
  const handleSuspendUser = async (usuarioId, suspendido) => {
    setLoading(true);
    try {
      await db.suspendUser(usuarioId, suspendido);
      sileo.success({ title: suspendido ? "Usuario suspendido correctamente" : "Usuario activado correctamente" });
      await cargarDatosApp();
    } catch (err) {
      sileo.error({ title: "Error al suspender/activar usuario", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario (Master)
  const handleDeleteUser = async (usuarioId, nombre) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente al miembro "${nombre}"? Se borrarán todos sus pronósticos y perfil.`)) {
      return;
    }
    setLoading(true);
    try {
      await db.deleteUser(usuarioId);
      sileo.success({ title: `Miembro "${nombre}" eliminado con éxito` });
      await cargarDatosApp();
    } catch (err) {
      sileo.error({ title: "Error al eliminar miembro", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Confirmar Partido F, G, H con nombres reales (Admin / Master)
  const handleConfirmarPartidoPendiente = async (partidoId, local, visita) => {
    if (!local || !visita) {
      sileo.error({ title: "Completa los dos equipos" });
      return;
    }
    setLoading(true);
    try {
      await db.confirmarPartido(partidoId, local, visita);
      sileo.success({ title: "Equipos confirmados", description: "El partido está abierto para predicciones." });
      await cargarDatosApp();
    } catch (err) {
      sileo.error({ title: "Error al confirmar", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Copiar código de grupo
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    sileo.success({ title: "Código de invitación copiado" });
  };

  const handleUpdatePrediction = (partidoId, localOrVisita, value) => {
    const currentPred = predicciones[partidoId] || { goles_local: '', goles_visita: '' };
    setPredicciones({
      ...predicciones,
      [partidoId]: {
        ...currentPred,
        [localOrVisita]: value
      }
    });
  };

  // Spinner de carga inicial
  if (loading && !currentUser && !connError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020813] text-white p-4 relative overflow-hidden">
        <div className="absolute w-[300px] h-[300px] bg-wc-purple/10 blur-[80px] rounded-full top-1/4 left-1/4"></div>
        <div className="relative flex items-center justify-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-wc-purple/75"></div>
          <Trophy className="absolute text-wc-yellow animate-pulse" size={24} />
        </div>
        <h2 className="text-xl font-bold tracking-wider font-barlow text-wc-purple mb-2 uppercase">
          CONECTANDO CON LA BASE DE DATOS
        </h2>
        <p className="text-xs text-gh-text-muted animate-pulse font-medium">Cargando la Polla Mundialista 2026...</p>
      </div>
    );
  }

  // Error de conexión a Supabase (Timeout de 6 segundos)
  if (connError && !isDemoMode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#020813] text-white p-4 relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bg-wc-red/10 blur-[100px] rounded-full top-1/3 left-1/3"></div>
        <Card className="w-full max-w-md p-6 text-center shadow-2xl relative z-10 border-wc-red/40 bg-[#081122]/50">
          <div className="inline-flex p-3 bg-red-950/30 rounded-full border border-wc-red/40 mb-4 text-wc-red">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold font-barlow text-wc-red mb-3">ERROR DE CONEXIÓN</h2>
          <p className="text-xs text-gh-text-muted leading-relaxed mb-6 font-medium">
            {connError}
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline"
              onClick={() => {
                setConnError(null);
                setLoading(true);
                checkConnection().then(res => {
                  setIsDemoMode(clientState.isMock);
                  if (!res.success) setConnError(res.error);
                  setLoading(false);
                });
              }}
              className="w-full h-10 flex items-center justify-center gap-2"
            >
              <RefreshCw size={15} /> Reintentar conexión
            </Button>
            <Button 
              variant="neon-pink"
              onClick={() => {
                setIsDemoMode(true);
                setConnError(null);
                sileo.success({ title: "Modo Local (Demo) activado" });
              }}
              className="w-full h-10"
            >
              Continuar en Modo Local (Demo)
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex-1 flex flex-col relative overflow-x-clip bg-gh-bg-dark text-gh-text transition-colors duration-250 ${!currentUser ? 'lg:h-screen lg:overflow-hidden' : ''}`}>
      {/* Background Aura Spots (Solo visibles en Dark Mode) */}
      {theme === 'dark' && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-wc-purple/5 blur-[150px] pointer-events-none z-0"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-wc-green/4 blur-[150px] pointer-events-none z-0"></div>
          <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full bg-wc-yellow/3 blur-[120px] pointer-events-none z-0"></div>
        </>
      )}

      {/* Physics-based Sileo Toast Container */}
      <Toaster position="top-center" theme={theme === 'dark' ? 'light' : 'dark'} />

      {/* --- FORMULARIO DE ACCESO --- */}
      {!currentUser ? (
        <AuthCard 
          authTab={authTab}
          setAuthTab={setAuthTab}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          joinForm={joinForm}
          setJoinForm={setJoinForm}
          onLogin={handleLogin}
          onRegister={handleRegister}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      ) : (
        /* --- APLICACIÓN PRINCIPAL --- */
        <>
          {/* NAV SUPERIOR STICKY */}
          <Navbar 
            currentUser={currentUser} 
            onLogout={handleLogout} 
            theme={theme} 
            toggleTheme={toggleTheme}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeAdminTab={activeAdminTab}
            setActiveAdminTab={setActiveAdminTab}
          />

          {/* CUERPO PRINCIPAL */}
          <main className="max-w-7xl w-full mx-auto px-4 pt-6 z-10 relative">
            
            {/* BANNER MODO LOCAL (DEMO) */}
            {isDemoMode && (
              <div className="mb-6 p-3 bg-neon-pink/5 border border-neon-pink/35 rounded-lg flex items-center gap-3 text-xs text-gh-text leading-relaxed">
                <AlertCircle size={16} className="text-neon-pink shrink-0" />
                <div>
                  <strong>Modo Demo / Sin conexión a base de datos externa.</strong> Los datos están funcionando en local utilizando el almacenamiento de tu navegador (LocalStorage). Cuando configures las variables de Supabase se migrará a tu servidor en la nube.
                </div>
              </div>
            )}

            {/* --- FLUJO DE ONBOARDING (Usuario logueado pero sin grupo) --- */}
            {currentUser && !currentUser.es_master && !currentUser.grupo_id ? (
              <div className="max-w-md mx-auto my-12 relative z-10">
                <Card className="border-gh-border shadow-2xl">
                  <div className="p-6 text-center border-b border-gh-border bg-black/5 dark:bg-white/5">
                    <Trophy className="mx-auto text-wc-yellow mb-3" size={40} />
                    <h2 className="text-xl font-bold font-barlow text-gh-text tracking-wide uppercase">
                      Configuración de Familia
                    </h2>
                    <p className="text-xs text-gh-text-muted mt-1 font-medium">
                      Hola <strong>{currentUser.nombre}</strong>. Completa este paso para comenzar.
                    </p>
                  </div>
                  
                  <CardContent className="p-6">
                    {currentUser.es_admin ? (
                      /* CASO A: Es Gestor designado, debe crear su grupo */
                      <form onSubmit={handleOnboardingCreateGroup} className="space-y-4">
                        <div className="p-3 bg-wc-purple/5 border border-wc-purple/20 rounded-xl text-left">
                          <p className="text-[11px] text-gh-text-muted leading-relaxed font-medium">
                            🌟 <strong>¡Eres Gestor de Familia!</strong> El Administrador Master te ha asignado este rol. Crea tu grupo familiar para generar tu código exclusivo de invitación.
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gh-text-muted uppercase tracking-wider mb-1.5 font-barlow">
                            Nombre del Grupo Familiar
                          </label>
                          <Input 
                            type="text" 
                            placeholder="Ej: Familia Pérez"
                            value={onboardingGroupName}
                            onChange={(e) => setOnboardingGroupName(e.target.value)}
                            className="h-10 px-3 rounded-lg"
                          />
                        </div>
                        <Button 
                          type="submit" 
                          variant="neon-blue"
                          className="w-full h-10 mt-6 rounded-full"
                        >
                          CREAR GRUPO Y EMPEZAR
                        </Button>
                      </form>
                    ) : (
                      /* CASO B: Miembro normal, debe ingresar el código de familia */
                      <form onSubmit={handleOnboardingJoinGroup} className="space-y-4">
                        <div className="p-3 bg-wc-green/5 border border-wc-green/20 rounded-xl text-left">
                          <p className="text-[11px] text-gh-text-muted leading-relaxed font-medium">
                            🔑 Ingresa el código de invitación familiar que te dio tu gestor para registrar tus predicciones y ver la tabla de posiciones.
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gh-text-muted uppercase tracking-wider mb-1.5 font-barlow">
                            Código de Invitación Familiar
                          </label>
                          <Input 
                            type="text" 
                            placeholder="Ej: FAM-3847"
                            value={onboardingGroupCode}
                            onChange={(e) => setOnboardingGroupCode(e.target.value)}
                            className="h-10 px-3 rounded-lg"
                          />
                        </div>
                        <Button 
                          type="submit" 
                          variant="neon-green"
                          className="w-full h-10 mt-6 rounded-full"
                        >
                          UNIRME A MI FAMILIA
                        </Button>
                      </form>
                    )}
                    
                    <div className="mt-6 pt-4 border-t border-gh-border text-center">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="text-xs text-wc-red hover:underline font-bold uppercase tracking-wider font-barlow bg-transparent border-0 cursor-pointer"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* --- VISTAS NORMALES (Usuario con grupo o master) --- */
              <>
                {!currentUser.es_master && !currentUser.es_admin && (
                  <MemberDashboard
                    partidos={partidos}
                    predicciones={predicciones}
                    resultados={resultados}
                    tablaPosiciones={tablaPosiciones}
                    currentUser={currentUser}
                    onSavePrediction={handleSaveSinglePrediction}
                    usuariosList={usuariosList}
                    allPredicciones={allPredicciones}
                  />
                )}

                {/* --- PANEL ADMIN (GESTOR DE GRUPO) --- */}
                {!currentUser.es_master && currentUser.es_admin && activeTab === 'admin' && (
                  <GestorDashboard
                    currentUser={currentUser}
                    activeAdminTab={activeAdminTab}
                    setActiveAdminTab={setActiveAdminTab}
                    usuariosList={usuariosList}
                    partidos={partidos}
                    resultadoEdicion={resultadoEdicion}
                    setResultadoEdicion={setResultadoEdicion}
                    onSaveResultado={handleSaveResultado}
                    onAbrirPartido={handleAbrirPartido}
                    onConfirmarPartidoPendiente={handleConfirmarPartidoPendiente}
                    copyToClipboard={copyToClipboard}
                    predicciones={predicciones}
                    resultados={resultados}
                    tablaPosiciones={tablaPosiciones}
                    onSavePrediction={handleSaveSinglePrediction}
                    allPredicciones={allPredicciones}
                  />
                )}

                {/* --- PANEL MASTER (ADMINISTRADOR GLOBAL) --- */}
                {currentUser.es_master && activeTab === 'master' && (
                  <MasterDashboard
                    activeAdminTab={activeAdminTab}
                    setActiveAdminTab={setActiveAdminTab}
                    gruposList={gruposList}
                    usuariosList={usuariosList}
                    partidos={partidos}
                    resultados={resultados}
                    allPredicciones={allPredicciones}
                    resultadoEdicion={resultadoEdicion}
                    setResultadoEdicion={setResultadoEdicion}
                    nuevoGrupoNombre={nuevoGrupoNombre}
                    setNuevoGrupoNombre={setNuevoGrupoNombre}
                    onMasterCreateGroup={handleMasterCreateGroup}
                    onToggleUserAdmin={handleToggleUserAdmin}
                    onSuspendUser={handleSuspendUser}
                    onDeleteUser={handleDeleteUser}
                    onSaveResultado={handleSaveResultado}
                    onAbrirPartido={handleAbrirPartido}
                    onConfirmarPartidoPendiente={handleConfirmarPartidoPendiente}
                    copyToClipboard={copyToClipboard}
                  />
                )}
              </>
            )}

          </main>

          {/* BARRA DE NAVEGACIÓN INFERIOR (Mobile) */}
          {currentUser && (currentUser.grupo_id || currentUser.es_master) && (
            <MobileNav 
              currentUser={currentUser}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeAdminTab={activeAdminTab}
              setActiveAdminTab={setActiveAdminTab}
            />
          )}
        </>
      )}

      {/* FOOTER GENERAL (Solo se muestra si el usuario está logueado para no empujar la pantalla del login) */}
      {currentUser && (
        <>
          {/* Desktop Fixed Footer */}
          <footer className="fixed bottom-0 left-0 right-0 py-4 border-t border-gh-border text-center text-[10px] text-gh-text-muted bg-gh-bg-dark/80 backdrop-blur-md hidden md:block z-30">
            <p>© Polla 2026 Copa Mundial de la FIFA  · Creado por <a className="hover:text-wc-blue" href="https://www.linkedin.com/in/miguelangel-garay-b15178195/" target="_blank" rel="noopener noreferrer">Miguel Garay</a></p>
          </footer>

          {/* Mobile Static Footer (con padding-bottom para quedar sobre el MobileNav al hacer scroll) */}
          <footer className="py-2 text-center text-[10px] text-gh-text-muted md:hidden z-10 mt-2">
            <p>© Polla 2026 Copa Mundial de la FIFA  · Creado por <a className="hover:text-wc-blue" href="https://www.linkedin.com/in/miguelangel-garay-b15178195/" target="_blank" rel="noopener noreferrer">Miguel Garay</a></p>
          </footer>
        </>
      )}
    </div>
  );
}
