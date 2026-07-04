import React, { useState, useMemo } from 'react';
import { sileo } from 'sileo';
import { Crown, Globe, Trophy, Plus, Copy, Crown as CrownIcon, Info, Check, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Tabs, Table, Select, ListBox } from '@heroui/react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { calcularPuntosPartido, REGLAS_PUNTOS } from '../supabaseClient';

const OBTENER_CANDIDATOS = (partidoId, partidos) => {
  const todosEquipos = [
    'Canadá 🇨🇦', 'Marruecos 🇲🇦', 'Brasil 🇧🇷', 'Noruega 🇳🇴',
    'Francia 🇫🇷', 'Paraguay 🇵🇾', 'México 🇲🇽', 'Inglaterra 🏴',
    'Bélgica 🇧🇪', 'USA 🇺🇸', 'España 🇪🇸', 'Portugal 🇵🇹',
    'Argentina 🇦🇷', 'Colombia 🇨🇴', 'Suiza 🇨🇭', 'Australia 🇦🇺'
  ];

  if (partidoId === 'octavo_f' || partidoId === 'octavo_g' || partidoId === 'octavo_h') {
    return { locales: todosEquipos, visitas: todosEquipos };
  }

  // Cuartos
  if (partidoId === 'cuartos_a') {
    const pA = partidos.find(p => p.id === 'octavo_a') || {};
    const pB = partidos.find(p => p.id === 'octavo_b') || {};
    return { locales: [pA.local, pA.visita].filter(Boolean), visitas: [pB.local, pB.visita].filter(Boolean) };
  }
  if (partidoId === 'cuartos_b') {
    const pC = partidos.find(p => p.id === 'octavo_c') || {};
    const pD = partidos.find(p => p.id === 'octavo_d') || {};
    return { locales: [pC.local, pC.visita].filter(Boolean), visitas: [pD.local, pD.visita].filter(Boolean) };
  }
  if (partidoId === 'cuartos_c') {
    const pE = partidos.find(p => p.id === 'octavo_e') || {};
    const pF = partidos.find(p => p.id === 'octavo_f') || {};
    return { locales: [pE.local, pE.visita].filter(Boolean), visitas: [pF.local, pF.visita].filter(Boolean) };
  }
  if (partidoId === 'cuartos_d') {
    const pG = partidos.find(p => p.id === 'octavo_g') || {};
    const pH = partidos.find(p => p.id === 'octavo_h') || {};
    return { locales: [pG.local, pG.visita].filter(Boolean), visitas: [pH.local, pH.visita].filter(Boolean) };
  }

  // Semis
  if (partidoId === 'semi_a') {
    const cA = partidos.find(p => p.id === 'cuartos_a') || {};
    const cB = partidos.find(p => p.id === 'cuartos_b') || {};
    const cand = [cA.local, cA.visita, cB.local, cB.visita].filter(t => t && !t.includes('Ganador'));
    return { locales: cand, visitas: cand };
  }
  if (partidoId === 'semi_b') {
    const cC = partidos.find(p => p.id === 'cuartos_c') || {};
    const cD = partidos.find(p => p.id === 'cuartos_d') || {};
    const cand = [cC.local, cC.visita, cD.local, cD.visita].filter(t => t && !t.includes('Ganador'));
    return { locales: cand, visitas: cand };
  }

  // Tercer Puesto y Final
  if (partidoId === 'tercer_puesto' || partidoId === 'final') {
    const sA = partidos.find(p => p.id === 'semi_a') || {};
    const sB = partidos.find(p => p.id === 'semi_b') || {};
    const cand = [sA.local, sA.visita, sB.local, sB.visita].filter(t => t && !t.includes('Ganador') && !t.includes('Perdedor'));
    return { locales: cand, visitas: cand };
  }

  return { locales: todosEquipos, visitas: todosEquipos };
};

export default function MasterDashboard({
  activeAdminTab,
  setActiveAdminTab,
  gruposList,
  usuariosList,
  partidos,
  resultados,
  allPredicciones,
  resultadoEdicion,
  setResultadoEdicion,
  nuevoGrupoNombre,
  setNuevoGrupoNombre,
  onMasterCreateGroup,
  onToggleUserAdmin,
  onSaveResultado,
  onAbrirPartido,
  onConfirmarPartidoPendiente,
  copyToClipboard
}) {
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [unconfirmedEquipos, setUnconfirmedEquipos] = useState({});

  const auditLogs = useMemo(() => {
    if (!selectedGroupId) return [];
    
    // Usuarios en el grupo seleccionado (excluyendo el master)
    const usuariosGrupo = usuariosList.filter(u => u.grupo_id === selectedGroupId && !u.es_master);
    const logs = [];

    // Recorrer los partidos
    partidos.forEach(partido => {
      const res = resultados[partido.id];
      // Solo nos importan los que tengan un resultado oficial cargado y cerrado
      if (res && res.cerrado) {
        usuariosGrupo.forEach(usr => {
          // Buscar predicción del usuario para este partido
          const pred = allPredicciones.find(p => p.usuario_id === usr.id && p.partido_id === partido.id);
          
          let golesL_pred = '-';
          let golesV_pred = '-';
          let pts = 0;
          let detalle = 'Sin predicción cargada';
          
          if (pred && pred.goles_local !== null && pred.goles_visita !== null) {
            golesL_pred = pred.goles_local;
            golesV_pred = pred.goles_visita;
            
            pts = calcularPuntosPartido(
              pred.goles_local,
              pred.goles_visita,
              res.goles_local,
              res.goles_visita
            );
            
            if (pts === REGLAS_PUNTOS.exacto) {
              detalle = 'Marcador exacto (+3 PTS)';
            } else if (pts === REGLAS_PUNTOS.ganador) {
              detalle = 'Ganador/Empate acertado (+1 PT)';
            } else {
              detalle = 'Predicción errónea (0 PTS)';
            }
          }
          
          logs.push({
            id: `${usr.id}-${partido.id}`,
            usuario: usr.nombre,
            username: usr.username,
            partido: `${partido.local} vs ${partido.visita}`,
            prediccion: `${golesL_pred} - ${golesV_pred}`,
            resultado: `${res.goles_local} - ${res.goles_visita}`,
            puntos: pts,
            detalle: detalle,
            fecha: res.fecha_cierre ? new Date(res.fecha_cierre).toLocaleString() : 'Recientemente'
          });
        });
      }
    });
    
    // Ordenar por fecha desc
    return logs.sort((a, b) => b.fecha.localeCompare(a.fecha) || a.usuario.localeCompare(b.usuario));
  }, [selectedGroupId, usuariosList, partidos, resultados, allPredicciones]);
  return (
    <div className="space-y-6 w-full mx-auto">
      <div className="flex items-center justify-between border-b border-gh-border pb-3">
        <h2 className="text-2xl font-bold font-barlow text-gh-text tracking-wider flex items-center gap-2">
          <Crown size={22} className="text-neon-blue" />
          PANEL MASTER GLOBAL
        </h2>
        <span className="text-xs text-neon-blue font-semibold">Administrador del Sistema</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* SIDEBAR TABS (Desktop) & SELECT (Mobile) */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 z-30">
          
          {/* Responsive Select (Mobile only) */}
          <div className="block md:hidden mb-4">
            <Select
              selectedKeys={new Set([activeAdminTab])}
              onSelectionChange={(keys) => {
                let val = '';
                if (keys instanceof Set) val = [...keys][0];
                else if (typeof keys === 'string' || typeof keys === 'number') val = keys;
                if (val) setActiveAdminTab(val.toString());
              }}
              aria-label="Seleccionar Sección"
              size="sm"
            >
              <Select.Trigger className="w-full h-10 px-3 border border-gh-border rounded-lg flex items-center justify-between bg-gh-bg-light font-sans text-xs text-gh-text transition-all">
                <Select.Value />
                <Select.Indicator className="text-gh-text-muted">
                <ChevronDown size={12} className="transition-transform duration-200" />
              </Select.Indicator>
              </Select.Trigger>
              <Select.Popover className="border border-gh-border bg-gh-bg-light rounded-lg shadow-xl overflow-hidden min-w-[200px] z-50">
                <ListBox className="p-1">
                  <ListBox.Item key="grupos_master" id="grupos_master" className="px-3 py-1.5 text-xs text-gh-text font-bold">GRUPOS GLOBALES</ListBox.Item>
                  <ListBox.Item key="gestores_master" id="gestores_master" className="px-3 py-1.5 text-xs text-gh-text font-bold">ASIGNAR GESTORES</ListBox.Item>
                  <ListBox.Item key="resultados" id="resultados" className="px-3 py-1.5 text-xs text-gh-text font-bold">RESULTADOS OFICIALES</ListBox.Item>
                  <ListBox.Item key="puntuaciones" id="puntuaciones" className="px-3 py-1.5 text-xs text-gh-text font-bold">PUNTUACIONES</ListBox.Item>
                  <ListBox.Item key="logs" id="logs" className="px-3 py-1.5 text-xs text-gh-text font-bold">LOGS DE PUNTOS</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          {/* Sticky Sidebar List (Desktop only) */}
          <div className="hidden md:flex flex-col gap-1.5 bg-gh-bg-light border border-gh-border p-2.5 rounded-xl shadow-xs">
            <button
              onClick={() => setActiveAdminTab('grupos_master')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-black font-barlow tracking-wider uppercase flex items-center gap-2.5 transition-all border cursor-pointer ${
                activeAdminTab === 'grupos_master'
                  ? 'bg-wc-purple/10 border-wc-purple text-wc-purple'
                  : 'bg-transparent border-transparent text-gh-text-muted hover:text-gh-text hover:bg-gh-bg-active'
              }`}
            >
              <Globe size={15} /> GRUPOS GLOBALES
            </button>
            
            <button
              onClick={() => setActiveAdminTab('gestores_master')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-black font-barlow tracking-wider uppercase flex items-center gap-2.5 transition-all border cursor-pointer ${
                activeAdminTab === 'gestores_master'
                  ? 'bg-wc-purple/10 border-wc-purple text-wc-purple'
                  : 'bg-transparent border-transparent text-gh-text-muted hover:text-gh-text hover:bg-gh-bg-active'
              }`}
            >
              <CrownIcon size={15} /> ASIGNAR GESTORES
            </button>
            
            <button
              onClick={() => setActiveAdminTab('resultados')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-black font-barlow tracking-wider uppercase flex items-center gap-2.5 transition-all border cursor-pointer ${
                activeAdminTab === 'resultados'
                  ? 'bg-wc-purple/10 border-wc-purple text-wc-purple'
                  : 'bg-transparent border-transparent text-gh-text-muted hover:text-gh-text hover:bg-gh-bg-active'
              }`}
            >
              <Trophy size={15} /> RESULTADOS OFICIALES
            </button>
            
            <button
              onClick={() => setActiveAdminTab('puntuaciones')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-black font-barlow tracking-wider uppercase flex items-center gap-2.5 transition-all border cursor-pointer ${
                activeAdminTab === 'puntuaciones'
                  ? 'bg-wc-purple/10 border-wc-purple text-wc-purple'
                  : 'bg-transparent border-transparent text-gh-text-muted hover:text-gh-text hover:bg-gh-bg-active'
              }`}
            >
              <Info size={15} /> PUNTUACIONES
            </button>
            
            <button
              onClick={() => setActiveAdminTab('logs')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-black font-barlow tracking-wider uppercase flex items-center gap-2.5 transition-all border cursor-pointer ${
                activeAdminTab === 'logs'
                  ? 'bg-wc-purple/10 border-wc-purple text-wc-purple'
                  : 'bg-transparent border-transparent text-gh-text-muted hover:text-gh-text hover:bg-gh-bg-active'
              }`}
            >
              <Info size={15} /> LOGS DE PUNTOS
            </button>
          </div>

        </div>

        {/* CONTENT PANEL AREA */}
        <div className="lg:col-span-4">

        {activeAdminTab === 'grupos_master' && (
          <div className="space-y-6 mt-4">
          <div className="space-y-6">
            
            {/* Formulario Crear Grupo */}
            <form onSubmit={onMasterCreateGroup}>
              <Card className="p-6 space-y-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Plus size={16} className="text-neon-blue" /> CREAR NUEVO GRUPO DIRECTAMENTE
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-gh-text-muted uppercase tracking-wider mb-1.5">
                      Nombre del Grupo
                    </label>
                    <Input 
                      type="text" 
                      placeholder="Ej: Familia Alejos"
                      value={nuevoGrupoNombre}
                      onChange={(e) => setNuevoGrupoNombre(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full sm:w-auto"
                  >
                    CREAR GRUPO
                  </Button>
                </div>
              </Card>
            </form>

            {/* Lista de Grupos */}
            <Table className="overflow-hidden">
  <Table.ScrollContainer>
    <Table.Content aria-label="Lista de grupos">
      <Table.Header>
        <Table.Column>Código</Table.Column>
        <Table.Column>Nombre</Table.Column>
        <Table.Column>Creado</Table.Column>
        <Table.Column>Participantes</Table.Column>
        <Table.Column>Acción</Table.Column>
      </Table.Header>
      <Table.Body>
        {gruposList.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={5} className="p-6 text-center text-xs text-gray-600 italic">No hay grupos creados todavía</Table.Cell>
          </Table.Row>
        ) : (
          gruposList.map((g) => (
            <Table.Row key={g.id} className="hover:bg-gray-100 dark:hover:bg-[#21262d]/5">
              <Table.Cell className="font-mono text-sm">{g.codigo}</Table.Cell>
              <Table.Cell className="font-semibold text-gh-text">{g.nombre}</Table.Cell>
              <Table.Cell className="text-sm text-gray-600 dark:text-gray-400">{new Date(g.created_at).toLocaleDateString()}</Table.Cell>
              <Table.Cell className="text-sm text-gray-600 dark:text-gray-400">{g.participantes_count} participante(s)</Table.Cell>
              <Table.Cell>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => copyToClipboard(g.codigo)}
                  className="h-8 w-8"
                  title="Copiar Código"
                >
                  <Copy size={14} />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table.Content>
  </Table.ScrollContainer>
</Table>
          </div>
          </div>
        )}

        {/* TAB B: ASIGNAR GESTOR DESDE TODOS LOS USUARIOS REGISTRADOS */}
        {activeAdminTab === 'gestores_master' && (
          <div className="space-y-6 mt-4">
          <div className="space-y-6">
            <div className="p-3 bg-wc-purple/10 border border-wc-purple/20 rounded-md text-xs leading-relaxed text-gh-text flex items-center gap-2.5">
              <Info size={16} className="text-wc-purple shrink-0" />
              <div>
                <strong>Designación de Gestores Globales:</strong> Puedes promover a cualquier usuario registrado para que sea un **Gestor de Familia**. El gestor podrá crear su propio grupo familiar e invitar a otros miembros al iniciar sesión.
              </div>
            </div>

     <Table className="overflow-hidden">
  <Table.ScrollContainer>
    <Table.Content aria-label="Lista de usuarios">
      <Table.Header>
        <Table.Column>Nombre</Table.Column>
        <Table.Column>Usuario</Table.Column>
        <Table.Column>Grupo</Table.Column>
        <Table.Column>Rol</Table.Column>
        <Table.Column>Acción</Table.Column>
      </Table.Header>
      <Table.Body>
        {usuariosList.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={5} className="p-6 text-center text-xs text-gray-600 italic">No hay usuarios registrados</Table.Cell>
          </Table.Row>
        ) : (
          usuariosList.map((user) => (
            <Table.Row key={user.id} className="hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
              <Table.Cell className="font-semibold text-gh-text">{user.nombre}</Table.Cell>
              <Table.Cell className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</Table.Cell>
              <Table.Cell className="text-sm text-gray-600 dark:text-gray-400">
                {user.grupo_nombre || <span className="text-gray-500">Ninguno (Pendiente)</span>}
              </Table.Cell>
              <Table.Cell className="text-sm text-gray-600 dark:text-gray-400">
                {user.es_admin ? 'GESTOR' : 'MIEMBRO'}
              </Table.Cell>
              <Table.Cell>
                <Button
                  variant={user.es_admin ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => onToggleUserAdmin(user.id, !user.es_admin)}
                  className={`h-8 font-bold ${user.es_admin ? 'border-wc-red/40 text-wc-red hover:bg-wc-red/5' : ''}`}
                >
                  {user.es_admin ? 'Quitar Gestor' : 'Hacer Gestor'}
                </Button>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table.Content>
  </Table.ScrollContainer>
</Table>
          </div>
          </div>
        )}

        {/* TAB C: RESULTADOS OFICIALES */}
        {activeAdminTab === 'resultados' && (
          <div className="space-y-4 mt-4">
          <div className="space-y-4">
            <div className="p-3 bg-neon-blue/5 border border-neon-blue/30 rounded-md text-xs leading-relaxed text-gh-text flex items-center gap-2.5">
              <Info size={16} className="text-neon-blue shrink-0" />
              <div>
                <strong>Carga de Marcadores Oficiales:</strong> Como Master tienes acceso global para ingresar y cerrar los marcadores de los partidos del Mundial 2026.
              </div>
            </div>

            <div className="space-y-4">
              {partidos.map((partido) => {
                const rEdit = resultadoEdicion[partido.id] || { goles_local: '', goles_visita: '', cerrado: false };
                
                return (
                  <Card key={partido.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gh-bg-light border border-gh-border text-gh-text">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-neon-blue uppercase font-bold tracking-wider font-barlow">
                        {partido.id.replace('_', ' ')}
                      </span>
                      <div className="font-semibold text-sm text-gh-text">
                        {partido.confirmado ? `${partido.local} vs ${partido.visita}` : `Por confirmar — ${partido.local}`}
                      </div>
                      <span className="text-[10px] text-gh-text-muted">{partido.sede} · {partido.fecha}</span>
                    </div>

                    {/* Formulario/Inputs de Resultados */}
                    <div className="flex flex-wrap items-center gap-4">
                      {partido.confirmado ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="number"
                              min="0"
                              value={rEdit.goles_local}
                              onChange={(e) => {
                                const val = e.target.value === '' ? '' : parseInt(e.target.value);
                                setResultadoEdicion({
                                  ...resultadoEdicion,
                                  [partido.id]: { ...rEdit, goles_local: val }
                                });
                              }}
                              placeholder="Local"
                              className="w-16 h-8 text-center text-sm font-bold"
                            />
                            <span className="text-gh-text-muted font-bold">-</span>
                            <Input 
                              type="number"
                              min="0"
                              value={rEdit.goles_visita}
                              onChange={(e) => {
                                const val = e.target.value === '' ? '' : parseInt(e.target.value);
                                setResultadoEdicion({
                                  ...resultadoEdicion,
                                  [partido.id]: { ...rEdit, goles_visita: val }
                                });
                              }}
                              placeholder="Visita"
                              className="w-16 h-8 text-center text-sm font-bold"
                            />
                          </div>

                          {/* Dropdown Ganador */}
                          <div className="w-32">
                            <Select
                              selectedKeys={rEdit.ganador_nombre ? new Set([rEdit.ganador_nombre]) : new Set()}
                              onSelectionChange={(keys) => {
                                let val = '';
                                if (keys instanceof Set) val = [...keys][0];
                                else if (typeof keys === 'string' || typeof keys === 'number') val = keys;
                                setResultadoEdicion({
                                  ...resultadoEdicion,
                                  [partido.id]: { ...rEdit, ganador_nombre: val }
                                });
                              }}
                              placeholder="Avanza"
                              aria-label="Ganador"
                              disabled={rEdit.cerrado}
                              size="sm"
                            >
                              <Select.Trigger className="w-full h-8 px-2 border border-gh-border rounded bg-gh-bg-light text-[10px] text-gh-text transition-all">
                                <Select.Value />
                                <Select.Indicator className="text-gh-text-muted">
                                  <ChevronDown size={12} className="transition-transform duration-200" />
                                </Select.Indicator>
                              </Select.Trigger>
                              <Select.Popover className="border border-gh-border bg-gh-bg-light rounded-lg shadow-xl overflow-hidden min-w-[120px] z-50">
                                <ListBox className="p-1">
                                  <ListBox.Item 
                                    key={partido.local} 
                                    id={partido.local} 
                                    textValue={partido.local}
                                    className="px-2 py-1 rounded text-[10px] font-semibold text-gh-text hover:bg-wc-purple hover:text-white cursor-pointer transition-all"
                                  >
                                    {partido.local.split(' ')[0]}
                                  </ListBox.Item>
                                  <ListBox.Item 
                                    key={partido.visita} 
                                    id={partido.visita} 
                                    textValue={partido.visita}
                                    className="px-2 py-1 rounded text-[10px] font-semibold text-gh-text hover:bg-wc-purple hover:text-white cursor-pointer transition-all"
                                  >
                                    {partido.visita.split(' ')[0]}
                                  </ListBox.Item>
                                </ListBox>
                              </Select.Popover>
                            </Select>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button 
                              variant="neon-blue"
                              size="sm"
                              onClick={() => onSaveResultado(partido.id)}
                              className="h-8"
                            >
                              <Check size={14} className="mr-1" /> Cerrar y Guardar
                            </Button>
                            
                            {rEdit.cerrado && (
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => onAbrirPartido(partido.id)}
                                className="h-8"
                                title="Reabrir partido"
                              >
                                Reabrir
                              </Button>
                            )}
                          </div>
                        </>
                      ) : (() => {
                        const candidatos = OBTENER_CANDIDATOS(partido.id, partidos);
                        const uEdit = unconfirmedEquipos[partido.id] || { local: '', visita: '' };
                        return (
                          <div className="flex flex-col sm:flex-row gap-2 items-center">
                            {/* Local Select */}
                            <div className="w-36">
                              <Select
                                selectedKeys={uEdit.local ? new Set([uEdit.local]) : new Set()}
                                onSelectionChange={(keys) => {
                                  let val = '';
                                  if (keys instanceof Set) val = [...keys][0];
                                  else if (typeof keys === 'string' || typeof keys === 'number') val = keys;
                                  setUnconfirmedEquipos({
                                    ...unconfirmedEquipos,
                                    [partido.id]: { ...uEdit, local: val }
                                  });
                                }}
                                placeholder="Selecciona Local"
                                aria-label="Local"
                                size="sm"
                              >
                                <Select.Trigger className="w-full h-8 px-2 border border-gh-border rounded bg-gh-bg-light text-[10px] text-gh-text transition-all">
                                  <Select.Value />
                                  <Select.Indicator className="text-gh-text-muted">
                                    <ChevronDown size={12} className="transition-transform duration-200" />
                                  </Select.Indicator>
                                </Select.Trigger>
                                <Select.Popover className="border border-gh-border bg-gh-bg-light rounded-lg shadow-xl overflow-hidden min-w-[120px] z-50">
                                  <ListBox className="p-1 max-h-40 overflow-y-auto">
                                    {candidatos.locales.map((team) => (
                                      <ListBox.Item 
                                        key={team} 
                                        id={team} 
                                        textValue={team}
                                        className="px-2 py-1 rounded text-[10px] font-semibold text-gh-text hover:bg-wc-purple hover:text-white cursor-pointer transition-all"
                                      >
                                        {team}
                                      </ListBox.Item>
                                    ))}
                                  </ListBox>
                                </Select.Popover>
                              </Select>
                            </div>

                            {/* Visita Select */}
                            <div className="w-36">
                              <Select
                                selectedKeys={uEdit.visita ? new Set([uEdit.visita]) : new Set()}
                                onSelectionChange={(keys) => {
                                  let val = '';
                                  if (keys instanceof Set) val = [...keys][0];
                                  else if (typeof keys === 'string' || typeof keys === 'number') val = keys;
                                  setUnconfirmedEquipos({
                                    ...unconfirmedEquipos,
                                    [partido.id]: { ...uEdit, visita: val }
                                  });
                                }}
                                placeholder="Selecciona Visita"
                                aria-label="Visita"
                                size="sm"
                              >
                                <Select.Trigger className="w-full h-8 px-2 border border-gh-border rounded bg-gh-bg-light text-[10px] text-gh-text transition-all">
                                  <Select.Value />
                                  <Select.Indicator className="text-gh-text-muted">
                                    <ChevronDown size={12} className="transition-transform duration-200" />
                                  </Select.Indicator>
                                </Select.Trigger>
                                <Select.Popover className="border border-gh-border bg-gh-bg-light rounded-lg shadow-xl overflow-hidden min-w-[120px] z-50">
                                  <ListBox className="p-1 max-h-40 overflow-y-auto">
                                    {candidatos.visitas.map((team) => (
                                      <ListBox.Item 
                                        key={team} 
                                        id={team} 
                                        textValue={team}
                                        className="px-2 py-1 rounded text-[10px] font-semibold text-gh-text hover:bg-wc-purple hover:text-white cursor-pointer transition-all"
                                      >
                                        {team}
                                      </ListBox.Item>
                                    ))}
                                  </ListBox>
                                </Select.Popover>
                              </Select>
                            </div>

                            <Button 
                              variant="secondary" 
                              size="sm" 
                              onClick={() => {
                                if (!uEdit.local || !uEdit.visita) {
                                  sileo.error({ title: "Faltan equipos", description: "Debes seleccionar ambos equipos." });
                                  return;
                                }
                                if (uEdit.local === uEdit.visita) {
                                  sileo.error({ title: "Equipos duplicados", description: "El equipo local y visita no pueden ser el mismo." });
                                  return;
                                }
                                onConfirmarPartidoPendiente(partido.id, uEdit.local, uEdit.visita);
                              }} 
                              className="h-8 shrink-0 text-[10px] font-bold"
                            >
                              Confirmar Equipos
                            </Button>
                          </div>
                        );
                      })()}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
          </div>
        )}
          {/* TAB D: PUNTUACIONES */}
        {activeAdminTab === 'puntuaciones' && (
            <div className="space-y-4 mt-4">
              <Select
                selectedKeys={selectedGroupId ? new Set([selectedGroupId.toString()]) : new Set()}
                onSelectionChange={(keys) => {
                  let val = '';
                  if (keys instanceof Set) {
                    val = [...keys][0];
                  } else if (typeof keys === 'string' || typeof keys === 'number') {
                    val = keys;
                  } else if (keys && typeof keys === 'object' && 'anchorKey' in keys) {
                    val = keys.anchorKey;
                  } else if (keys) {
                    val = [...keys][0];
                  }
                  setSelectedGroupId(val || '');
                }}
                placeholder="Selecciona familia"
                className="w-full max-w-sm"
                aria-label="Seleccionar familia"
              >
                <Select.Trigger className="w-full h-10 px-3 border border-gh-border rounded-lg flex items-center justify-between bg-gh-bg-light hover:bg-gh-bg-active font-sans text-sm text-gh-text transition-all">
                  <Select.Value />
                 <Select.Indicator className="text-gh-text-muted">
                   <ChevronDown size={12} className="transition-transform duration-200" />
                 </Select.Indicator>
                </Select.Trigger>
                <Select.Popover className="border border-gh-border bg-gh-bg-light rounded-lg shadow-xl overflow-hidden min-w-[200px] z-50">
                  <ListBox className="p-1 max-h-60 overflow-y-auto">
                    {gruposList.map((g) => (
                      <ListBox.Item 
                        key={g.id.toString()} 
                        id={g.id.toString()} 
                        textValue={g.nombre}
                        className="px-3 py-1.5 rounded-md text-xs font-semibold text-gh-text hover:bg-wc-purple hover:text-white cursor-pointer transition-all flex items-center"
                      >
                        {g.nombre}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
              {selectedGroupId && (
                <Table className="overflow-hidden">
                  <Table.ScrollContainer>
                    <Table.Content aria-label="Puntuaciones">
                      <Table.Header>
                        <Table.Column>Nombre</Table.Column>
                        <Table.Column>Usuario</Table.Column>
                        <Table.Column>Rol</Table.Column>
                        <Table.Column>Puntuación</Table.Column>
                      </Table.Header>
                      <Table.Body>
                        {usuariosList
                          .filter(u => selectedGroupId && u.grupo_id === selectedGroupId)
                          .map(user => (
                            <Table.Row key={user.id} className="hover:bg-gray-100 dark:hover:bg-[#21262d]/5">
                              <Table.Cell className="font-semibold text-gh-text">{user.nombre}</Table.Cell>
                              <Table.Cell className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</Table.Cell>
                              <Table.Cell className="text-sm text-gray-600 dark:text-gray-400">{user.es_admin ? 'GESTOR' : 'MIEMBRO'}</Table.Cell>
                              <Table.Cell className="text-sm text-gray-600 dark:text-gray-400">0</Table.Cell>
                            </Table.Row>
                          ))}
                      </Table.Body>
                    </Table.Content>
                  </Table.ScrollContainer>
                </Table>
              )}
            </div>
        )}
        {activeAdminTab === 'logs' && (
            <div className="space-y-4 mt-4">
              <Select
                selectedKeys={selectedGroupId ? new Set([selectedGroupId.toString()]) : new Set()}
                onSelectionChange={(keys) => {
                  let val = '';
                  if (keys instanceof Set) {
                    val = [...keys][0];
                  } else if (typeof keys === 'string' || typeof keys === 'number') {
                    val = keys;
                  } else if (keys && typeof keys === 'object' && 'anchorKey' in keys) {
                    val = keys.anchorKey;
                  } else if (keys) {
                    val = [...keys][0];
                  }
                  setSelectedGroupId(val || '');
                }}
                placeholder="Selecciona familia para ver logs"
                className="w-full max-w-sm"
                aria-label="Seleccionar familia para logs"
              >
                <Select.Trigger className="w-full h-10 px-3 border border-gh-border rounded-lg flex items-center justify-between bg-gh-bg-light hover:bg-gh-bg-active font-sans text-sm text-gh-text transition-all">
                  <Select.Value />
                 <Select.Indicator className="text-gh-text-muted">
                   <ChevronDown size={12} className="transition-transform duration-200" />
                 </Select.Indicator>
                </Select.Trigger>
                <Select.Popover className="border border-gh-border bg-gh-bg-light rounded-lg shadow-xl overflow-hidden min-w-[200px] z-50">
                  <ListBox className="p-1 max-h-60 overflow-y-auto">
                    {gruposList.map((g) => (
                      <ListBox.Item 
                        key={g.id} 
                        id={g.id} 
                        textValue={g.nombre}
                        className="px-3 py-1.5 rounded-md text-xs font-semibold text-gh-text hover:bg-wc-purple hover:text-white cursor-pointer transition-all"
                      >
                        {g.nombre} ({g.codigo})
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              {!selectedGroupId ? (
                <div className="text-center py-12 text-xs text-gh-text-muted italic bg-gh-bg-light rounded-xl border border-gh-border">
                  Selecciona una familia para auditar la asignación de puntos
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="text-center py-12 text-xs text-gh-text-muted italic bg-gh-bg-light rounded-xl border border-gh-border">
                  No hay logs de puntos registrados para esta familia (aún no se han cerrado partidos)
                </div>
              ) : (
                <Table aria-label="Tabla de Logs de Asignación de Puntos">
                  <Table.Header className="bg-black/5 dark:bg-[#161b22]/50 border-b border-gh-border text-xs font-bold text-gh-text-muted uppercase tracking-wider font-barlow text-left">
                    <Table.Column>Miembro</Table.Column>
                    <Table.Column>Partido</Table.Column>
                    <Table.Column>Pronóstico</Table.Column>
                    <Table.Column>Resultado</Table.Column>
                    <Table.Column>Cálculo</Table.Column>
                    <Table.Column>Puntos</Table.Column>
                    <Table.Column>Fecha de Cierre</Table.Column>
                  </Table.Header>
                  <Table.ScrollContainer className="max-h-[400px]">
                    <Table.Content>
                      <Table.Body>
                        {auditLogs.map((log) => (
                          <Table.Row key={log.id} className="hover:bg-gray-100 dark:hover:bg-[#21262d]/5">
                            <Table.Cell className="font-semibold text-gh-text text-xs">
                              <div>{log.usuario}</div>
                              <div className="text-[10px] text-gh-text-muted">@{log.username}</div>
                            </Table.Cell>
                            <Table.Cell className="text-xs font-semibold text-gh-text">{log.partido}</Table.Cell>
                            <Table.Cell className="text-xs font-mono">{log.prediccion}</Table.Cell>
                            <Table.Cell className="text-xs font-mono">{log.resultado}</Table.Cell>
                            <Table.Cell className="text-xs font-medium text-gh-text-muted">{log.detalle}</Table.Cell>
                            <Table.Cell className="text-xs font-black text-wc-green">{log.puntos} PTS</Table.Cell>
                            <Table.Cell className="text-[10px] text-gh-text-muted">{log.fecha}</Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Content>
                  </Table.ScrollContainer>
                </Table>
              )}
            </div>
        )}
        </div>
      </div>
      </div>
    );
  }
