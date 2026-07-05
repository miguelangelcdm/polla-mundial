import { createClient } from '@supabase/supabase-js';

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Inicialización condicional del cliente real
let supabase = null;
if (VITE_SUPABASE_URL && VITE_SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
  } catch (e) {
    console.error("Error al instanciar Supabase:", e);
  }
}

// Estado del cliente
export const clientState = {
  isMock: !supabase,
  error: null,
  initialized: false
};

// Partidos base de Octavos
// Clean team names helper to ensure full compatibility
export const cleanTeamName = (name) => {
  if (!name) return '';
  return name
    .replace(/[\s\uD83C-\uDBFF\uDC00-\uDFFF]+/g, ' ')
    .trim()
    .replace(/\s+(FR|PY|CA|MA|BR|NO|MX|GB|BE|US|ES|PT|AR|EG|CH|CO)$/i, '');
};

export const PARTIDOS_BASE = [
  { id: 'octavo_a', fecha: '4 Jul', hora: '16:00 HS', sede: 'Philadelphia Stadium (Lincoln Financial Field)', ciudad: 'Filadelfia, Pensilvania', pais: 'Estados Unidos', local: 'Francia', visita: 'Paraguay', confirmado: true },
  { id: 'octavo_b', fecha: '4 Jul', hora: '20:00 HS', sede: 'Houston Stadium (NRG Stadium)', ciudad: 'Houston, Texas', pais: 'Estados Unidos', local: 'Canadá', visita: 'Marruecos', confirmado: true },
  { id: 'octavo_c', fecha: '5 Jul', hora: '18:00 HS', sede: 'New York/New Jersey Stadium (MetLife Stadium)', ciudad: 'East Rutherford, Nueva Jersey', pais: 'Estados Unidos', local: 'Brasil', visita: 'Noruega', confirmado: true },
  { id: 'octavo_d', fecha: '6 Jul', hora: '17:00 HS', sede: 'Mexico City Stadium (Estadio Azteca)', ciudad: 'Ciudad de México', pais: 'México', local: 'México', visita: 'Inglaterra', confirmado: true },
  { id: 'octavo_e', fecha: '6 Jul', hora: '21:00 HS', sede: 'Dallas Stadium (AT&T Stadium)', ciudad: 'Arlington, Texas', pais: 'Estados Unidos', local: 'España', visita: 'Portugal', confirmado: true },
  { id: 'octavo_f', fecha: '7 Jul', hora: '15:00 HS', sede: 'Seattle Stadium (Lumen Field)', ciudad: 'Seattle, Washington', pais: 'Estados Unidos', local: 'Bélgica', visita: 'USA', confirmado: true },
  { id: 'octavo_g', fecha: '7 Jul', hora: '19:00 HS', sede: 'Atlanta Stadium (Mercedes-Benz Stadium)', ciudad: 'Atlanta, Georgia', pais: 'Estados Unidos', local: 'Argentina', visita: 'Egipto', confirmado: true },
  { id: 'octavo_h', fecha: '7 Jul', hora: '22:00 HS', sede: 'Vancouver Stadium (BC Place)', ciudad: 'Vancouver, Columbia Británica', pais: 'Canadá', local: 'Suiza', visita: 'Colombia', confirmado: true },
  
  // Cuartos de Final
  { id: 'cuartos_a', fecha: '9 Jul', hora: '18:00 HS', sede: 'Boston Stadium (Foxborough Stadium)', ciudad: 'Foxborough, Massachusetts', pais: 'Estados Unidos', local: 'Ganador Octavos A', visita: 'Ganador Octavos B', confirmado: false },
  { id: 'cuartos_b', fecha: '10 Jul', hora: '20:00 HS', sede: 'Los Angeles Stadium (SoFi Stadium)', ciudad: 'Inglewood, California', pais: 'Estados Unidos', local: 'Ganador Octavos C', visita: 'Ganador Octavos D', confirmado: false },
  { id: 'cuartos_c', fecha: '11 Jul', hora: '17:00 HS', sede: 'Miami Stadium (Hard Rock Stadium)', ciudad: 'Miami Gardens, Florida', pais: 'Estados Unidos', local: 'Ganador Octavos E', visita: 'Ganador Octavos F', confirmado: false },
  { id: 'cuartos_d', fecha: '12 Jul', hora: '19:00 HS', sede: 'Kansas City Stadium (Arrowhead Stadium)', ciudad: 'Kansas City, Missouri', pais: 'Estados Unidos', local: 'Ganador Octavos G', visita: 'Ganador Octavos H', confirmado: false },
  
  // Semifinales
  { id: 'semi_a', fecha: '14 Jul', hora: '20:00 HS', sede: 'Dallas Stadium (AT&T Stadium)', ciudad: 'Arlington, Texas', pais: 'Estados Unidos', local: 'Ganador Cuartos A', visita: 'Ganador Cuartos B', confirmado: false },
  { id: 'semi_b', fecha: '15 Jul', hora: '20:00 HS', sede: 'Atlanta Stadium (Mercedes-Benz Stadium)', ciudad: 'Atlanta, Georgia', pais: 'Estados Unidos', local: 'Ganador Cuartos C', visita: 'Ganador Cuartos D', confirmado: false },
  
  // Tercer Puesto
  { id: 'tercer_puesto', fecha: '18 Jul', hora: '16:00 HS', sede: 'Miami Stadium (Hard Rock Stadium)', ciudad: 'Miami Gardens, Florida', pais: 'Estados Unidos', local: 'Perdedor Semifinal A', visita: 'Perdedor Semifinal B', confirmado: false },
  
  // Final
  { id: 'final', fecha: '19 Jul', hora: '19:00 HS', sede: 'New York/New Jersey Stadium (MetLife Stadium)', ciudad: 'East Rutherford, Nueva Jersey', pais: 'Estados Unidos', local: 'Ganador Semifinal A', visita: 'Ganador Semifinal B', confirmado: false },
];

export const resolverFixtureDinamico = (resultados) => {
  // Empezar con una copia profunda de PARTIDOS_BASE
  const partidos = JSON.parse(JSON.stringify(PARTIDOS_BASE));

  // Mapa de dependencias: para cada partido que depende de resultados anteriores
  const deps = {
    'cuartos_a': { local: { de: 'octavo_a' }, visita: { de: 'octavo_b' } },
    'cuartos_b': { local: { de: 'octavo_c' }, visita: { de: 'octavo_d' } },
    'cuartos_c': { local: { de: 'octavo_e' }, visita: { de: 'octavo_f' } },
    'cuartos_d': { local: { de: 'octavo_g' }, visita: { de: 'octavo_h' } },
    
    'semi_a': { local: { de: 'cuartos_a' }, visita: { de: 'cuartos_b' } },
    'semi_b': { local: { de: 'cuartos_c' }, visita: { de: 'cuartos_d' } },
    
    'final': { local: { de: 'semi_a' }, visita: { de: 'semi_b' } },
    'tercer_puesto': { local: { de: 'semi_a', tipo: 'perdedor' }, visita: { de: 'semi_b', tipo: 'perdedor' } }
  };

  const fasesOrden = ['cuartos_a', 'cuartos_b', 'cuartos_c', 'cuartos_d', 'semi_a', 'semi_b', 'final', 'tercer_puesto'];

  fasesOrden.forEach(partidoId => {
    const partido = partidos.find(p => p.id === partidoId);
    if (!partido) return;

    const dep = deps[partidoId];
    if (!dep) return;

    // Resolver Local
    if (dep.local) {
      const dePart = partidos.find(p => p.id === dep.local.de);
      const res = resultados[dep.local.de];
      if (dePart && res && res.cerrado) {
        let ganador = res.ganador_nombre;
        if (!ganador) {
          const gL = parseInt(res.goles_local) || 0;
          const gV = parseInt(res.goles_visita) || 0;
          if (gL > gV) ganador = dePart.local;
          else if (gL < gV) ganador = dePart.visita;
        }
        
        if (dep.local.tipo === 'perdedor') {
          const perdedor = ganador === dePart.local ? dePart.visita : dePart.local;
          partido.local = perdedor;
        } else {
          partido.local = ganador;
        }
      }
    }

    // Resolver Visita
    if (dep.visita) {
      const dePart = partidos.find(p => p.id === dep.visita.de);
      const res = resultados[dep.visita.de];
      if (dePart && res && res.cerrado) {
        let ganador = res.ganador_nombre;
        if (!ganador) {
          const gL = parseInt(res.goles_local) || 0;
          const gV = parseInt(res.goles_visita) || 0;
          if (gL > gV) ganador = dePart.local;
          else if (gL < gV) ganador = dePart.visita;
        }
        
        if (dep.visita.tipo === 'perdedor') {
          const perdedor = ganador === dePart.local ? dePart.visita : dePart.local;
          partido.visita = perdedor;
        } else {
          partido.visita = ganador;
        }
      }
    }

    // Confirmar partido si tiene ambos equipos definidos y no son genéricos
    if (partido.local && partido.visita &&
        !partido.local.includes('Ganador') && !partido.visita.includes('Ganador') &&
        !partido.local.includes('Perdedor') && !partido.visita.includes('Perdedor')) {
      partido.confirmado = true;
    }
  });

  return partidos;
};

// Reglas del Sistema de Puntos
export const REGLAS_PUNTOS = {
  exacto: 3,     // Marcador exacto
  ganador: 1,    // Acierto de ganador/empate pero no marcador exacto
  incorrecto: 0  // Ninguno
};

// ====================================================================
// MOCK ENGINE (LOCAL STORAGE DB)
// ====================================================================
const getLocalData = (key) => JSON.parse(localStorage.getItem(key));
const setLocalData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const initMockDB = () => {
  if (!localStorage.getItem('pb_grupos')) {
    // Grupo inicial por defecto
    setLocalData('pb_grupos', [
      { id: 'g-default', nombre: 'Familia Mundialista', codigo: 'FAM-1234', created_at: new Date().toISOString() }
    ]);
  }
  
  if (!localStorage.getItem('pb_usuarios')) {
    // Usuario Master y algunos de prueba
    setLocalData('pb_usuarios', [
      { id: 'u-master', nombre: 'Administrador Master', username: 'master', password: 'master123', es_master: true, es_admin: false, grupo_id: null },
      { id: 'u-pilar', nombre: 'Pilar Pérez', username: 'pilar', password: '123', es_master: false, es_admin: true, grupo_id: 'g-default' },
      { id: 'u-migue', nombre: 'Miguel Alejo', username: 'migue', password: '123', es_master: false, es_admin: false, grupo_id: 'g-default' }
    ]);
  }
  
  if (!localStorage.getItem('pb_resultados')) {
    setLocalData('pb_resultados', {});
  }
  
  if (!localStorage.getItem('pb_predicciones')) {
    // Predicciones semilla para pruebas
    setLocalData('pb_predicciones', [
      { id: 'p1', usuario_id: 'u-migue', partido_id: 'octavo_a', goles_local: 2, goles_visita: 1 },
      { id: 'p2', usuario_id: 'u-migue', partido_id: 'octavo_b', goles_local: 3, goles_visita: 1 },
      { id: 'p3', usuario_id: 'u-pilar', partido_id: 'octavo_a', goles_local: 1, goles_visita: 1 }
    ]);
  }
  
  // Agregar partidos F, G, H en las predicciones si se confirman (actualizar si cambio de esquema de octavos a fixture completo)
  const partidosExistentes = getLocalData('pb_partidos_estados');
  if (!partidosExistentes || partidosExistentes.length < 16) {
    setLocalData('pb_partidos_estados', PARTIDOS_BASE);
  }
};

// Inicializar Mock
initMockDB();

// ====================================================================
// CONTROL DE CONEXIÓN A SUPABASE (6 segundos timeout)
// ====================================================================
export const checkConnection = () => {
  return new Promise((resolve) => {
    if (!supabase) {
      clientState.isMock = true;
      clientState.initialized = true;
      resolve({ success: false, error: 'No se configuraron las variables de entorno de Supabase.' });
      return;
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 6000)
    );

    const checkPromise = supabase.from('grupos').select('id').limit(1);

    Promise.race([checkPromise, timeoutPromise])
      .then((res) => {
        if (res.error) {
          throw new Error(res.error.message);
        }
        clientState.isMock = false;
        clientState.initialized = true;
        resolve({ success: true });
      })
      .catch((err) => {
        console.warn("Fallo de conexión a Supabase, activando Mock en LocalStorage:", err.message);
        clientState.isMock = true;
        clientState.error = err.message === 'timeout' 
          ? 'El servidor de Supabase no respondió en 6 segundos. Se activó el modo local.'
          : `Error de Supabase: ${err.message}. Se activó el modo local.`;
        clientState.initialized = true;
        resolve({ success: false, error: clientState.error });
      });
  });
};

// ====================================================================
// CÁLCULO DE PUNTOS
// ====================================================================
export const calcularPuntosPartido = (predLocal, predVisita, resLocal, resVisita) => {
  if (predLocal === null || predVisita === null || resLocal === null || resVisita === null) {
    return 0;
  }
  
  // Marcador exacto
  if (predLocal === resLocal && predVisita === resVisita) {
    return REGLAS_PUNTOS.exacto;
  }
  
  // Ganador / Empate
  const predDiferencia = predLocal - predVisita;
  const resDiferencia = resLocal - resVisita;
  
  if (
    (predDiferencia > 0 && resDiferencia > 0) || // Gana Local
    (predDiferencia < 0 && resDiferencia < 0) || // Gana Visita
    (predDiferencia === 0 && resDiferencia === 0) // Empate
  ) {
    return REGLAS_PUNTOS.ganador;
  }
  
  return REGLAS_PUNTOS.incorrecto;
};

// Mappings para progresión automática del mundial
const MAPA_PROPAGACION = {
  'octavo_a': { sig: 'cuartos_a', pos: 'local' },
  'octavo_b': { sig: 'cuartos_a', pos: 'visita' },
  'octavo_c': { sig: 'cuartos_b', pos: 'local' },
  'octavo_d': { sig: 'cuartos_b', pos: 'visita' },
  'octavo_e': { sig: 'cuartos_c', pos: 'local' },
  'octavo_f': { sig: 'cuartos_c', pos: 'visita' },
  'octavo_g': { sig: 'cuartos_d', pos: 'local' },
  'octavo_h': { sig: 'cuartos_d', pos: 'visita' },
  
  'cuartos_a': { sig: 'semi_a', pos: 'local' },
  'cuartos_b': { sig: 'semi_a', pos: 'visita' },
  'cuartos_c': { sig: 'semi_b', pos: 'local' },
  'cuartos_d': { sig: 'semi_b', pos: 'visita' },
  
  'semi_a': { sig: 'final', pos: 'local', perdedorSig: 'tercer_puesto', perdedorPos: 'local' },
  'semi_b': { sig: 'final', pos: 'visita', perdedorSig: 'tercer_puesto', perdedorPos: 'visita' }
};

export const propagarGanador = (partidoId, ganadorNombre, perdedorNombre) => {
  const prop = MAPA_PROPAGACION[partidoId];
  if (!prop) return;

  const partidos = getLocalData('pb_partidos_estados') || [];
  
  // Ganador avanza
  const matchSig = partidos.find(p => p.id === prop.sig);
  if (matchSig) {
    if (prop.pos === 'local') matchSig.local = ganadorNombre;
    if (prop.pos === 'visita') matchSig.visita = ganadorNombre;
    
    if (matchSig.local && matchSig.visita && 
        !matchSig.local.includes('Ganador') && !matchSig.visita.includes('Ganador') &&
        !matchSig.local.includes('Por confirmar') && !matchSig.visita.includes('Por confirmar')) {
      matchSig.confirmado = true;
    }
  }

  // Perdedor va al Tercer Puesto (solo en Semifinales)
  if (prop.perdedorSig) {
    const matchPerdSig = partidos.find(p => p.id === prop.perdedorSig);
    if (matchPerdSig) {
      if (prop.perdedorPos === 'local') matchPerdSig.local = perdedorNombre;
      if (prop.perdedorPos === 'visita') matchPerdSig.visita = perdedorNombre;
      
      if (matchPerdSig.local && matchPerdSig.visita && 
          !matchPerdSig.local.includes('Perdedor') && !matchPerdSig.visita.includes('Perdedor') &&
          !matchPerdSig.local.includes('Por confirmar') && !matchPerdSig.visita.includes('Por confirmar')) {
        matchPerdSig.confirmado = true;
      }
    }
  }

  setLocalData('pb_partidos_estados', partidos);
};

// ====================================================================
// INTERFAZ UNIFICADA DE MÉTODOS DE BASE DE DATOS
// ====================================================================
export const db = {
  // --- AUTH / USUARIOS ---
  async login(username, password) {
    const cleanUsername = username.trim().toLowerCase();
    
    if (clientState.isMock) {
      const usuarios = getLocalData('pb_usuarios');
      const grupos = getLocalData('pb_grupos');
      
      const user = usuarios.find(u => u.username.toLowerCase() === cleanUsername && u.password === password);
      if (!user) throw new Error("Usuario o contraseña incorrectos");
      if (user.suspendido) throw new Error("Tu cuenta ha sido suspendida por el Administrador Supremo.");
      
      const grupo = grupos.find(g => g.id === user.grupo_id);
      return {
        ...user,
        grupo_nombre: grupo ? grupo.nombre : null,
        grupo_codigo: grupo ? grupo.codigo : null
      };
    } else {
      // Nota: Para una app sencilla de amigos, validamos contra tabla "usuarios" de Supabase
      const { data, error } = await supabase
        .from('usuarios')
        .select('*, grupos(nombre, codigo)')
        .eq('username', cleanUsername)
        .eq('password', password)
        .maybeSingle();
        
      if (error) throw new Error(error.message);
      if (!data) throw new Error("Usuario o contraseña incorrectos");
      if (data.suspendido) throw new Error("Tu cuenta ha sido suspendida por el Administrador Supremo.");
      
      return {
        id: data.id,
        nombre: data.nombre,
        username: data.username,
        grupo_id: data.grupo_id,
        es_admin: data.es_admin,
        es_master: data.es_master,
        suspendido: data.suspendido || false,
        grupo_nombre: data.grupos ? data.grupos.nombre : null,
        grupo_codigo: data.grupos ? data.grupos.codigo : null
      };
    }
  },

  async register(nombre, username, password, grupoCodigo) {
    const cleanUsername = username.trim().toLowerCase();
    
    if (clientState.isMock) {
      const usuarios = getLocalData('pb_usuarios');
      const grupos = getLocalData('pb_grupos');
      
      // Validar si usuario ya existe
      if (usuarios.some(u => u.username.toLowerCase() === cleanUsername)) {
        throw new Error("El nombre de usuario ya está registrado");
      }

      // Validar si el participante con el mismo nombre ya existe
      if (usuarios.some(u => u.nombre.toLowerCase() === nombre.trim().toLowerCase())) {
        throw new Error(`El nombre de participante "${nombre.trim()}" ya está registrado`);
      }
      
      let grupoId = null;
      let grupoNombre = null;
      let grupoCod = null;
      
      if (grupoCodigo && grupoCodigo.trim() !== '') {
        // Buscar grupo
        const grupo = grupos.find(g => g.codigo.toUpperCase() === grupoCodigo.trim().toUpperCase());
        if (!grupo) {
          throw new Error("El código de grupo no existe");
        }
        grupoId = grupo.id;
        grupoNombre = grupo.nombre;
        grupoCod = grupo.codigo;
      }
      
      const newUser = {
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        nombre: nombre.trim(),
        username: cleanUsername,
        password: password,
        grupo_id: grupoId,
        es_admin: false,
        es_master: false
      };
      
      usuarios.push(newUser);
      setLocalData('pb_usuarios', usuarios);
      
      return {
        ...newUser,
        grupo_nombre: grupoNombre,
        grupo_codigo: grupoCod
      };
    } else {
      let grupoId = null;
      let grupoNombre = null;
      let grupoCod = null;
      
      if (grupoCodigo && grupoCodigo.trim() !== '') {
        // Buscar grupo
        const { data: grupo, error: gErr } = await supabase
          .from('grupos')
          .select('*')
          .eq('codigo', grupoCodigo.trim().toUpperCase())
          .maybeSingle();
          
        if (gErr) throw new Error(gErr.message);
        if (!grupo) throw new Error("El código de grupo no existe");
        
        grupoId = grupo.id;
        grupoNombre = grupo.nombre;
        grupoCod = grupo.codigo;
      }
      
      // Validar si usuario ya existe
      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('id')
        .eq('username', cleanUsername)
        .maybeSingle();
        
      if (existingUser) throw new Error("El nombre de usuario ya está registrado");

      // Validar si el participante con el mismo nombre ya existe
      const { data: existingNameUser } = await supabase
        .from('usuarios')
        .select('id')
        .eq('nombre', nombre.trim())
        .maybeSingle();
        
      if (existingNameUser) {
        throw new Error(`El nombre de participante "${nombre.trim()}" ya está registrado`);
      }
      
      // Crear usuario
      const { data: newUser, error: uErr } = await supabase
        .from('usuarios')
        .insert([{
          nombre: nombre.trim(),
          username: cleanUsername,
          password: password,
          grupo_id: grupoId,
          es_admin: false,
          es_master: false
        }])
        .select()
        .single();
        
      if (uErr) throw new Error(uErr.message);
      
      return {
        ...newUser,
        grupo_nombre: grupoNombre,
        grupo_codigo: grupoCod
      };
    }
  },

  async joinGroup(usuarioId, grupoCodigo) {
    if (clientState.isMock) {
      const usuarios = getLocalData('pb_usuarios');
      const grupos = getLocalData('pb_grupos');
      
      const grupo = grupos.find(g => g.codigo.toUpperCase() === grupoCodigo.trim().toUpperCase());
      if (!grupo) throw new Error("El código de grupo no existe");
      
      const uIndex = usuarios.findIndex(u => u.id === usuarioId);
      if (uIndex === -1) throw new Error("Usuario no encontrado");
      
      usuarios[uIndex].grupo_id = grupo.id;
      setLocalData('pb_usuarios', usuarios);
      
      return {
        ...usuarios[uIndex],
        grupo_nombre: grupo.nombre,
        grupo_codigo: grupo.codigo
      };
    } else {
      const { data: grupo, error: gErr } = await supabase
        .from('grupos')
        .select('*')
        .eq('codigo', grupoCodigo.trim().toUpperCase())
        .maybeSingle();
        
      if (gErr) throw new Error(gErr.message);
      if (!grupo) throw new Error("El código de grupo no existe");
      
      const { data: user, error: uErr } = await supabase
        .from('usuarios')
        .update({ grupo_id: grupo.id })
        .eq('id', usuarioId)
        .select()
        .single();
        
      if (uErr) throw new Error(uErr.message);
      
      return {
        ...user,
        grupo_nombre: grupo.nombre,
        grupo_codigo: grupo.codigo
      };
    }
  },

  async createGroupForGestor(usuarioId, grupoNombre) {
    // Generar código
    const prefix = grupoNombre.trim().substring(0, 3).toUpperCase().padEnd(3, 'X');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const codigo = `${prefix}-${randomDigits}`;
    
    if (clientState.isMock) {
      const usuarios = getLocalData('pb_usuarios');
      const grupos = getLocalData('pb_grupos');
      
      const uIndex = usuarios.findIndex(u => u.id === usuarioId);
      if (uIndex === -1) throw new Error("Usuario no encontrado");
      
      const newGrupo = {
        id: 'g-' + Math.random().toString(36).substr(2, 9),
        nombre: grupoNombre.trim(),
        codigo: codigo,
        created_at: new Date().toISOString()
      };
      
      grupos.push(newGrupo);
      usuarios[uIndex].grupo_id = newGrupo.id;
      usuarios[uIndex].es_admin = true;
      
      setLocalData('pb_grupos', grupos);
      setLocalData('pb_usuarios', usuarios);
      
      return {
        ...usuarios[uIndex],
        grupo_nombre: newGrupo.nombre,
        grupo_codigo: newGrupo.codigo
      };
    } else {
      // Insertar grupo
      const { data: newGrupo, error: gErr } = await supabase
        .from('grupos')
        .insert([{ nombre: grupoNombre.trim(), codigo: codigo }])
        .select()
        .single();
        
      if (gErr) throw new Error("Error al crear grupo: " + gErr.message);
      
      // Actualizar usuario
      const { data: user, error: uErr } = await supabase
        .from('usuarios')
        .update({ grupo_id: newGrupo.id, es_admin: true })
        .eq('id', usuarioId)
        .select()
        .single();
        
      if (uErr) {
        // Deshacer inserción de grupo
        await supabase.from('grupos').delete().eq('id', newGrupo.id);
        throw new Error("Error al actualizar usuario: " + uErr.message);
      }
      
      return {
        ...user,
        grupo_nombre: newGrupo.nombre,
        grupo_codigo: newGrupo.codigo
      };
    }
  },

  async createGroupAndRegister(nombre, username, password, grupoNombre) {
    const cleanUsername = username.trim().toLowerCase();
    
    // Generar código
    const prefix = grupoNombre.trim().substring(0, 3).toUpperCase().padEnd(3, 'X');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const codigo = `${prefix}-${randomDigits}`;
    
    if (clientState.isMock) {
      const usuarios = getLocalData('pb_usuarios');
      const grupos = getLocalData('pb_grupos');
      
      if (usuarios.some(u => u.username.toLowerCase() === cleanUsername)) {
        throw new Error("El nombre de usuario ya está registrado");
      }
      
      const newGrupo = {
        id: 'g-' + Math.random().toString(36).substr(2, 9),
        nombre: grupoNombre.trim(),
        codigo: codigo,
        created_at: new Date().toISOString()
      };
      
      const newUser = {
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        nombre: nombre.trim(),
        username: cleanUsername,
        password: password,
        grupo_id: newGrupo.id,
        es_admin: true, // El primer usuario en crear el grupo es el Gestor
        es_master: false
      };
      
      grupos.push(newGrupo);
      usuarios.push(newUser);
      
      setLocalData('pb_grupos', grupos);
      setLocalData('pb_usuarios', usuarios);
      
      return {
        ...newUser,
        grupo_nombre: newGrupo.nombre,
        grupo_codigo: newGrupo.codigo
      };
    } else {
      // Validar si el usuario ya existe
      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('id')
        .eq('username', cleanUsername)
        .maybeSingle();
        
      if (existingUser) throw new Error("El nombre de usuario ya está registrado");
      
      // Insertar grupo
      const { data: newGrupo, error: gErr } = await supabase
        .from('grupos')
        .insert([{ nombre: grupoNombre.trim(), codigo: codigo }])
        .select()
        .single();
        
      if (gErr) throw new Error("Error al crear grupo: " + gErr.message);
      
      // Insertar usuario (admin del grupo)
      const { data: newUser, error: uErr } = await supabase
        .from('usuarios')
        .insert([{
          nombre: nombre.trim(),
          username: cleanUsername,
          password: password,
          grupo_id: newGrupo.id,
          es_admin: true,
          es_master: false
        }])
        .select()
        .single();
        
      if (uErr) {
        // Deshacer inserción de grupo
        await supabase.from('grupos').delete().eq('id', newGrupo.id);
        throw new Error("Error al crear usuario: " + uErr.message);
      }
      
      return {
        ...newUser,
        grupo_nombre: newGrupo.nombre,
        grupo_codigo: newGrupo.codigo
      };
    }
  },

  // --- GRUPOS ---
  async getGrupos() {
    if (clientState.isMock) {
      const grupos = getLocalData('pb_grupos');
      const usuarios = getLocalData('pb_usuarios');
      
      return grupos.map(g => {
        const count = usuarios.filter(u => u.grupo_id === g.id && !u.es_master).length;
        return { ...g, participantes_count: count };
      });
    } else {
      // Trae los grupos con conteo de participantes
      const { data, error } = await supabase
        .from('grupos')
        .select('*, usuarios(id, es_master)');
        
      if (error) throw new Error(error.message);
      
      return data.map(g => {
        const count = g.usuarios ? g.usuarios.filter(u => !u.es_master).length : 0;
        return {
          id: g.id,
          nombre: g.nombre,
          codigo: g.codigo,
          created_at: g.created_at,
          participantes_count: count
        };
      });
    }
  },

  async createGroupDirectly(nombre) {
    const prefix = nombre.trim().substring(0, 3).toUpperCase().padEnd(3, 'X');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const codigo = `${prefix}-${randomDigits}`;

    if (clientState.isMock) {
      const grupos = getLocalData('pb_grupos');
      const newGrupo = {
        id: 'g-' + Math.random().toString(36).substr(2, 9),
        nombre: nombre.trim(),
        codigo: codigo,
        created_at: new Date().toISOString()
      };
      grupos.push(newGrupo);
      setLocalData('pb_grupos', grupos);
      return newGrupo;
    } else {
      const { data, error } = await supabase
        .from('grupos')
        .insert([{ nombre: nombre.trim(), codigo }])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
  },

  // --- GESTIÓN DE MIEMBROS POR MASTER ---
  async getUsuarios() {
    if (clientState.isMock) {
      const usuarios = getLocalData('pb_usuarios') || [];
      const grupos = getLocalData('pb_grupos') || [];
      
      return usuarios.filter(u => !u.es_master).map(u => {
        const grupo = grupos.find(g => g.id === u.grupo_id);
        return {
          ...u,
          suspendido: u.suspendido || false,
          grupo_nombre: grupo ? grupo.nombre : 'Sin grupo'
        };
      });
    } else {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*, grupos(nombre)')
        .eq('es_master', false);
        
      if (error) throw new Error(error.message);
      
      return data.map(u => ({
        id: u.id,
        nombre: u.nombre,
        username: u.username,
        grupo_id: u.grupo_id,
        es_admin: u.es_admin,
        suspendido: u.suspendido || false,
        grupo_nombre: u.grupos ? u.grupos.nombre : 'Sin grupo'
      }));
    }
  },

  async suspendUser(usuarioId, suspendido) {
    if (clientState.isMock) {
      const usuarios = getLocalData('pb_usuarios') || [];
      const idx = usuarios.findIndex(u => u.id === usuarioId);
      if (idx !== -1) {
        usuarios[idx].suspendido = suspendido;
        saveLocalData('pb_usuarios', usuarios);
      }
    } else {
      const { error } = await supabase
        .from('usuarios')
        .update({ suspendido })
        .eq('id', usuarioId);
      if (error) throw new Error(error.message);
    }
  },

  async deleteUser(usuarioId) {
    if (clientState.isMock) {
      let predicciones = getLocalData('pb_predicciones') || [];
      predicciones = predicciones.filter(p => p.usuario_id !== usuarioId);
      saveLocalData('pb_predicciones', predicciones);

      const usuarios = getLocalData('pb_usuarios') || [];
      const filtered = usuarios.filter(u => u.id !== usuarioId);
      saveLocalData('pb_usuarios', filtered);
    } else {
      const { error: predError } = await supabase
        .from('predicciones')
        .delete()
        .eq('usuario_id', usuarioId);
      if (predError) throw new Error(predError.message);

      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', usuarioId);
      if (error) throw new Error(error.message);
    }
  },

  async assignGestor(grupoId, usuarioId) {
    if (clientState.isMock) {
      const usuarios = getLocalData('pb_usuarios');
      
      const actualizados = usuarios.map(u => {
        if (u.grupo_id === grupoId) {
          return {
            ...u,
            es_admin: u.id === usuarioId // Solo el seleccionado es admin
          };
        }
        return u;
      });
      
      setLocalData('pb_usuarios', actualizados);
      return true;
    } else {
      // 1. Quitar admin a todos en ese grupo
      const { error: err1 } = await supabase
        .from('usuarios')
        .update({ es_admin: false })
        .eq('grupo_id', grupoId);
        
      if (err1) throw new Error(err1.message);
      
      // 2. Asignar admin al usuario seleccionado
      const { error: err2 } = await supabase
        .from('usuarios')
        .update({ es_admin: true })
        .eq('id', usuarioId);
        
      if (err2) throw new Error(err2.message);
      
      return true;
    }
  },

  async toggleUserAdmin(usuarioId, esAdmin) {
    if (clientState.isMock) {
      const usuarios = getLocalData('pb_usuarios');
      const uIndex = usuarios.findIndex(u => u.id === usuarioId);
      if (uIndex === -1) throw new Error("Usuario no encontrado");
      usuarios[uIndex].es_admin = esAdmin;
      setLocalData('pb_usuarios', usuarios);
      return usuarios[uIndex];
    } else {
      const { data, error } = await supabase
        .from('usuarios')
        .update({ es_admin: esAdmin })
        .eq('id', usuarioId)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
  },

  // --- PARTIDOS Y CONFIRMACIONES ---
  async getPartidos() {
    let rawPartidos = [];
    if (clientState.isMock) {
      rawPartidos = getLocalData('pb_partidos_estados') || [];
    } else {
      const { data: dbResultados } = await supabase.from('resultados').select('*');
      
      const resultadosMap = {};
      dbResultados?.forEach(r => {
        resultadosMap[r.partido_id] = {
          goles_local: r.goles_local,
          goles_visita: r.goles_visita,
          cerrado: r.cerrado,
          ganador_nombre: cleanTeamName(r.ganador_nombre)
        };
      });

      rawPartidos = resolverFixtureDinamico(resultadosMap);
    }
    return rawPartidos.map(p => ({
      ...p,
      local: cleanTeamName(p.local),
      visita: cleanTeamName(p.visita)
    }));
  },

  async confirmarPartido(partidoId, localNombre, visitaNombre) {
    if (clientState.isMock) {
      const partidos = getLocalData('pb_partidos_estados');
      const actualizados = partidos.map(p => {
        if (p.id === partidoId) {
          return { ...p, local: localNombre, visita: visitaNombre, confirmado: true };
        }
        return p;
      });
      setLocalData('pb_partidos_estados', actualizados);
      return actualizados;
    } else {
      // Si la app corre en Supabase, podemos insertar el resultado como "abierto" o actualizar datos
      // En el schema simple, los nombres de F, G, H se pueden cambiar. Para soportar esto de forma dinámica,
      // el master o admin guarda en una tabla de partidos_personalizados si fuera necesario.
      // Dejaremos que el Mock lo maneje y en Supabase devolvamos éxito.
      return PARTIDOS_BASE;
    }
  },

  async getAllPredicciones() {
    if (clientState.isMock) {
      return getLocalData('pb_predicciones') || [];
    } else {
      const { data, error } = await supabase
        .from('predicciones')
        .select('*');
      if (error) throw new Error(error.message);
      return data || [];
    }
  },

  // --- PREDICCIONES ---
  async getPredicciones(usuarioId) {
    if (clientState.isMock) {
      const predicciones = getLocalData('pb_predicciones');
      return predicciones.filter(p => p.usuario_id === usuarioId);
    } else {
      const { data, error } = await supabase
        .from('predicciones')
        .select('*')
        .eq('usuario_id', usuarioId);
        
      if (error) throw new Error(error.message);
      return data;
    }
  },

  async savePrediccion(usuarioId, partidoId, golesLocal, golesVisita) {
    if (clientState.isMock) {
      const predicciones = getLocalData('pb_predicciones');
      const idx = predicciones.findIndex(p => p.usuario_id === usuarioId && p.partido_id === partidoId);
      
      const pred = {
        id: idx >= 0 ? predicciones[idx].id : 'pred-' + Math.random().toString(36).substr(2, 9),
        usuario_id: usuarioId,
        partido_id: partidoId,
        goles_local: golesLocal === '' ? null : parseInt(golesLocal),
        goles_visita: golesVisita === '' ? null : parseInt(golesVisita)
      };
      
      if (idx >= 0) {
        predicciones[idx] = pred;
      } else {
        predicciones.push(pred);
      }
      
      setLocalData('pb_predicciones', predicciones);
      return pred;
    } else {
      const { data, error } = await supabase
        .from('predicciones')
        .upsert({
          usuario_id: usuarioId,
          partido_id: partidoId,
          goles_local: golesLocal === '' ? null : parseInt(golesLocal),
          goles_visita: golesVisita === '' ? null : parseInt(golesVisita)
        }, { onConflict: 'usuario_id,partido_id' })
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return data;
    }
  },

  // --- RESULTADOS OFICIALES ---
  async getResultados() {
    let rawResultados = {};
    if (clientState.isMock) {
      rawResultados = getLocalData('pb_resultados') || {};
    } else {
      const { data, error } = await supabase
        .from('resultados')
        .select('*');
        
      if (error) throw new Error(error.message);
      
      const resObj = {};
      data.forEach(r => {
        resObj[r.partido_id] = {
          goles_local: r.goles_local,
          goles_visita: r.goles_visita,
          cerrado: r.cerrado,
          ganador_nombre: r.ganador_nombre
        };
      });
      rawResultados = resObj;
    }
    
    const cleaned = {};
    for (const key in rawResultados) {
      cleaned[key] = {
        ...rawResultados[key],
        ganador_nombre: cleanTeamName(rawResultados[key]?.ganador_nombre)
      };
    }
    return cleaned;
  },

  async saveResultado(partidoId, golesLocal, golesVisita, cerrado = false, ganadorNombre = null) {
    if (clientState.isMock) {
      const resultados = getLocalData('pb_resultados');
      
      resultados[partidoId] = {
        goles_local: golesLocal === '' ? null : parseInt(golesLocal),
        goles_visita: golesVisita === '' ? null : parseInt(golesVisita),
        cerrado: cerrado,
        ganador_nombre: cleanTeamName(ganadorNombre),
        fecha_cierre: cerrado ? new Date().toISOString() : null
      };
      
      setLocalData('pb_resultados', resultados);
      
      // Propagar el ganador/perdedor si el partido se cerró
      if (cerrado) {
        const partidos = getLocalData('pb_partidos_estados');
        const partido = partidos.find(p => p.id === partidoId);
        if (partido) {
          let finalGanador = ganadorNombre;
          if (!finalGanador) {
            const gL = parseInt(golesLocal) || 0;
            const gV = parseInt(golesVisita) || 0;
            if (gL > gV) finalGanador = partido.local;
            else if (gL < gV) finalGanador = partido.visita;
            else finalGanador = partido.local; // fallback por defecto si empatan y no se indicó
          }
          const localName = partido.local;
          const visitaName = partido.visita;
          const perdedorNombre = finalGanador === localName ? visitaName : localName;
          
          propagarGanador(partidoId, finalGanador, perdedorNombre);
        }
      }
      
      return resultados[partidoId];
    } else {
      const { data, error } = await supabase
        .from('resultados')
        .upsert({
          partido_id: partidoId,
          goles_local: golesLocal === '' ? null : parseInt(golesLocal),
          goles_visita: golesVisita === '' ? null : parseInt(golesVisita),
          cerrado: cerrado,
          ganador_nombre: cleanTeamName(ganadorNombre),
          fecha_cierre: cerrado ? new Date().toISOString() : null
        }, { onConflict: 'partido_id' })
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return data;
    }
  },

  // --- TABLA DE POSICIONES ---
  async getTablaPosiciones(grupoId) {
    // 1. Obtener usuarios del grupo
    let usuariosGrupo = [];
    let todasPredicciones = [];
    let resultadosOficiales = {};
    
    if (clientState.isMock) {
      const usuarios = getLocalData('pb_usuarios');
      usuariosGrupo = usuarios.filter(u => u.grupo_id === grupoId && !u.es_master);
      todasPredicciones = getLocalData('pb_predicciones');
      resultadosOficiales = getLocalData('pb_resultados');
    } else {
      const { data: usrs, error: uErr } = await supabase
        .from('usuarios')
        .select('id, nombre, username')
        .eq('grupo_id', grupoId)
        .eq('es_master', false);
        
      if (uErr) throw new Error(uErr.message);
      usuariosGrupo = usrs || [];
      
      const { data: preds, error: pErr } = await supabase
        .from('predicciones')
        .select('*');
      if (pErr) throw new Error(pErr.message);
      todasPredicciones = preds || [];
      
      // Obtener resultados en formato objeto
      resultadosOficiales = await this.getResultados();
    }
    
    // 2. Calcular estadísticas por participante
    const tabla = usuariosGrupo.map(usr => {
      const predsUsr = todasPredicciones.filter(p => p.usuario_id === usr.id);
      
      let puntos = 0;
      let exactos = 0;
      let ganador = 0;
      let prediccionesEnviadas = 0;
      
      Object.keys(resultadosOficiales).forEach(partidoId => {
        const res = resultadosOficiales[partidoId];
        // Solo contamos partidos que estén cerrados oficialmente
        if (res && res.cerrado) {
          const pred = predsUsr.find(p => p.partido_id === partidoId);
          if (pred && pred.goles_local !== null && pred.goles_visita !== null) {
            prediccionesEnviadas++;
            const pts = calcularPuntosPartido(
              pred.goles_local,
              pred.goles_visita,
              res.goles_local,
              res.goles_visita
            );
            
            puntos += pts;
            if (pts === REGLAS_PUNTOS.exacto) {
              exactos++;
            } else if (pts === REGLAS_PUNTOS.ganador) {
              ganador++;
            }
          }
        }
      });
      
      return {
        usuario_id: usr.id,
        nombre: usr.nombre,
        username: usr.username,
        exactos: exactos,
        ganador: ganador,
        puntos: puntos,
        predicciones_enviadas: prediccionesEnviadas
      };
    });
    
    // 3. Ordenar: Puntos desc, luego exactos desc, luego ganador desc, luego nombre asc
    tabla.sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      if (b.exactos !== a.exactos) return b.exactos - a.exactos;
      if (b.ganador !== a.ganador) return b.ganador - a.ganador;
      return a.nombre.localeCompare(b.nombre);
    });
    
    return tabla;
  }
};
