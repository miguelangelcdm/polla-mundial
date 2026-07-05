import React, { useState } from 'react';
import { sileo } from 'sileo';
import { Settings, Users, Trophy, Copy, Lock, Info, Check, ChevronDown, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Tabs, Table, Select, ListBox } from '@heroui/react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import MemberDashboard from './MemberDashboard';

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

export default function GestorDashboard({
  currentUser,
  activeAdminTab,
  setActiveAdminTab,
  usuariosList,
  partidos,
  resultadoEdicion,
  setResultadoEdicion,
  onSaveResultado,
  onAbrirPartido,
  onConfirmarPartidoPendiente,
  copyToClipboard,
  predicciones,
  resultados,
  tablaPosiciones,
  onSavePrediction,
  allPredicciones
}) {
  const [unconfirmedEquipos, setUnconfirmedEquipos] = useState({});
  return (
    <div className="space-y-6 w-full mx-auto">
      <div className="flex items-center justify-between border-b border-gh-border pb-3">
        <h2 className="text-2xl font-bold font-barlow text-gh-text tracking-wider flex items-center gap-2">
          <Settings size={22} className="text-neon-pink" />
          PANEL DE GESTOR
        </h2>
        <span className="text-xs text-neon-pink font-semibold">Administración de Familia</span>
      </div>

      {/* PESTAÑAS HORIZONTALES (TABS) AL TOP */}
      <div className="hidden md:block w-full mb-6">
        <Tabs 
          selectedKey={activeAdminTab} 
          onSelectionChange={(key) => setActiveAdminTab(key.toString())}
          variant="solid"
          color="secondary"
          fullWidth
        >
          <Tabs.ListContainer className="w-full">
            <Tabs.List 
              className="w-full rounded-full bg-black/5 dark:bg-[#161b22]/50 p-1 border border-gh-border gap-1 relative"
              aria-label="Navegación del Gestor"
            >
              <Tabs.Tab 
                id="predicciones"
                className="group max-w-full px-4 h-10 text-xs font-bold font-barlow tracking-wider uppercase cursor-pointer rounded-full"
              >
                <span className="flex items-center gap-1.5 group-data-[selected=true]:text-white text-gh-text-muted transition-colors duration-200">
                  <Star size={14} /> PREDICCIONES
                </span>
                <Tabs.Indicator className="bg-wc-purple rounded-full shadow-md w-full h-full" />
              </Tabs.Tab>

              <Tabs.Tab 
                id="grupo_gestor"
                className="group max-w-full px-4 h-10 text-xs font-bold font-barlow tracking-wider uppercase cursor-pointer rounded-full"
              >
                <span className="flex items-center gap-1.5 group-data-[selected=true]:text-white text-gh-text-muted transition-colors duration-200">
                  <Users size={14} /> MI GRUPO
                </span>
                <Tabs.Indicator className="bg-wc-purple rounded-full shadow-md w-full h-full" />
              </Tabs.Tab>

              <Tabs.Tab 
                id="resultados"
                className="group max-w-full px-4 h-10 text-xs font-bold font-barlow tracking-wider uppercase cursor-pointer rounded-full"
              >
                <span className="flex items-center gap-1.5 group-data-[selected=true]:text-white text-gh-text-muted transition-colors duration-200">
                  <Trophy size={14} /> RESULTADOS REALES
                </span>
                <Tabs.Indicator className="bg-wc-purple rounded-full shadow-md w-full h-full" />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </div>

      <div className="w-full">
        {/* CONTENT PANEL AREA */}
        <div className="w-full">
          {activeAdminTab === 'predicciones' && (
            <MemberDashboard
              partidos={partidos}
              predicciones={predicciones}
              resultados={resultados}
              tablaPosiciones={tablaPosiciones}
              currentUser={currentUser}
              onSavePrediction={onSavePrediction}
              usuariosList={usuariosList}
              allPredicciones={allPredicciones}
            />
          )}

          {activeAdminTab === 'grupo_gestor' && (
            <div className="space-y-6">
              <Card className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col gap-1 text-center sm:text-left">
                  <span className="text-xs text-gh-text-muted uppercase font-bold tracking-wider">Código de Invitación de Familia</span>
                  <span className="text-2xl font-bold font-barlow text-gh-text tracking-widest">{currentUser.grupo_codigo}</span>
                </div>
                <Button onClick={() => copyToClipboard(currentUser.grupo_codigo)} className="flex items-center gap-2">
                  <Copy size={14} /> COPIAR CÓDIGO
                </Button>
              </Card>

              <Table className="overflow-hidden">
                <Table.ScrollContainer>
                  <Table.Content aria-label="Miembros del grupo">
                    <Table.Header>
                      <Table.Column>Nombre</Table.Column>
                      <Table.Column>Usuario</Table.Column>
                      <Table.Column>Rol</Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {usuariosList.filter(u => u.grupo_id === currentUser.grupo_id).length === 0 ? (
                        <Table.Row>
                          <Table.Cell colSpan={3} className="p-6 text-center text-xs text-gray-600 italic">No hay miembros en el grupo</Table.Cell>
                        </Table.Row>
                      ) : (
                        usuariosList.filter(u => u.grupo_id === currentUser.grupo_id).map((usr) => (
                          <Table.Row key={usr.id} className="hover:bg-gray-100 dark:hover:bg-[#21262d]/5">
                            <Table.Cell className="font-semibold text-gh-text">{usr.nombre}</Table.Cell>
                            <Table.Cell className="text-sm text-gray-600 dark:text-gray-400">@{usr.username}</Table.Cell>
                            <Table.Cell className="text-sm text-gray-600 dark:text-gray-400">
                              {usr.es_admin ? 'GESTOR' : 'MIEMBRO'}
                            </Table.Cell>
                          </Table.Row>
                        ))
                      )}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </div>
          )}

          {activeAdminTab === 'resultados' && (
            <div className="space-y-4">
              <div className="p-3 bg-neon-pink/5 border border-neon-pink/35 rounded-md text-xs leading-relaxed text-gh-text flex items-center gap-2.5">
                <Info size={16} className="text-neon-pink shrink-0" />
                <div><strong>Carga de Marcadores Oficiales:</strong> Carga el resultado del partido para realizar los cálculos de puntos de forma automática para toda la polla mundial. Al guardar un resultado, el partido se cerrará y los usuarios no podrán editar sus predicciones.</div>
              </div>
              <div className="space-y-4">
                {partidos.map((partido) => {
                  const rEdit = resultadoEdicion[partido.id] || { goles_local: '', goles_visita: '', cerrado: false };
                  return (
                    <Card key={partido.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gh-bg-light border border-gh-border text-gh-text">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-neon-blue uppercase font-bold tracking-wider font-barlow">{partido.id.replace('_', ' ')}</span>
                        <div className="font-semibold text-sm text-gh-text">
                          {partido.confirmado ? (<span>{partido.local} VS {partido.visita}</span>) : (<span className="text-gh-text-muted uppercase text-xs">Fase por definir ({partido.local})</span>)}
                        </div>
                        <div className="text-[10px] text-gh-text-muted">Sede: {partido.sede} · {partido.fecha}</div>
                      </div>
                      {partido.confirmado ? (
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            {/* Goles Local */}
                            <label htmlFor={`goles-local-${partido.id}`} className="sr-only">Goles Local</label>
                            <input
                              id={`goles-local-${partido.id}`}
                              type="number"
                              min="0"
                              disabled={rEdit.cerrado}
                              value={rEdit.goles_local}
                              onChange={(e) => {
                                const val = e.target.value === '' ? '' : parseInt(e.target.value);
                                setResultadoEdicion({ ...resultadoEdicion, [partido.id]: { ...rEdit, goles_local: val } });
                              }}
                              placeholder="-"
                              className="w-12 h-10 text-center text-lg font-bold rounded-lg border border-gh-border bg-gh-bg-light text-gh-text focus:outline-none focus:border-wc-purple transition-all"
                            />
                            <span className="text-gh-text-muted font-bold">-</span>
                            {/* Goles Visita */}
                            <label htmlFor={`goles-visita-${partido.id}`} className="sr-only">Goles Visita</label>
                            <input
                              id={`goles-visita-${partido.id}`}
                              type="number"
                              min="0"
                              disabled={rEdit.cerrado}
                              value={rEdit.goles_visita}
                              onChange={(e) => {
                                const val = e.target.value === '' ? '' : parseInt(e.target.value);
                                setResultadoEdicion({ ...resultadoEdicion, [partido.id]: { ...rEdit, goles_visita: val } });
                              }}
                              placeholder="-"
                              className="w-12 h-10 text-center text-lg font-bold rounded-lg border border-gh-border bg-gh-bg-light text-gh-text focus:outline-none focus:border-wc-purple transition-all"
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
                            <Button disabled={rEdit.cerrado} variant="neon-pink" size="sm" onClick={() => onSaveResultado(partido.id)} className="h-8"><Check size={14} className="mr-1" /> Cerrar y Guardar</Button>
                            {rEdit.cerrado && (
                              <Button variant="outline" size="sm" onClick={() => onAbrirPartido(partido.id)} className="h-8" title="Reabrir partido">Reabrir</Button>
                            )}
                          </div>
                        </div>
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
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
