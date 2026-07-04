import React, { useState } from 'react';
import { sileo } from 'sileo';
import { Crown, Globe, Trophy, Plus, Copy, Crown as CrownIcon, Info, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Tabs, Table, Select, ListBox } from '@heroui/react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function MasterDashboard({
  activeAdminTab,
  setActiveAdminTab,
  gruposList,
  usuariosList,
  partidos,
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
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-gh-border pb-3">
        <h2 className="text-2xl font-bold font-barlow text-gray-900 dark:text-white tracking-wider flex items-center gap-2">
          <Crown size={22} className="text-neon-blue" />
          PANEL MASTER GLOBAL
        </h2>
        <span className="text-xs text-neon-blue font-semibold">Administrador del Sistema</span>
      </div>

      <Tabs 
        selectedKey={activeAdminTab} 
        onSelectionChange={setActiveAdminTab}
        variant="solid"
        color="secondary"
        fullWidth
      >
        <Tabs.ListContainer className="w-full">
          <Tabs.List 
            className="w-full rounded-full bg-black/5 dark:bg-[#161b22]/50 p-1 border border-gh-border gap-1 relative"
            aria-label="Opciones del Administrador"
          >
            <Tabs.Tab 
              id="grupos_master"
              className="group max-w-full px-4 h-9 text-xs font-bold font-barlow tracking-wider uppercase cursor-pointer rounded-full"
            >
              <span className="group-data-[selected=true]:text-white text-gh-text-muted transition-colors duration-200 flex items-center gap-2">
                <Globe size={16} /> GRUPOS GLOBALES
              </span>
              <Tabs.Indicator className="bg-wc-purple rounded-full shadow-md w-full h-full" />
            </Tabs.Tab>

            <Tabs.Tab 
              id="gestores_master"
              className="group max-w-full px-4 h-9 text-xs font-bold font-barlow tracking-wider uppercase cursor-pointer rounded-full"
            >
              <span className="group-data-[selected=true]:text-white text-gh-text-muted transition-colors duration-200 flex items-center gap-2">
                <CrownIcon size={16} /> ASIGNAR GESTORES
              </span>
              <Tabs.Indicator className="bg-wc-purple rounded-full shadow-md w-full h-full" />
            </Tabs.Tab>

            <Tabs.Tab 
              id="resultados"
              className="group max-w-full px-4 h-9 text-xs font-bold font-barlow tracking-wider uppercase cursor-pointer rounded-full"
            >
              <span className="group-data-[selected=true]:text-white text-gh-text-muted transition-colors duration-200 flex items-center gap-2">
                <Trophy size={16} /> RESULTADOS OFICIALES
              </span>
              <Tabs.Indicator className="bg-wc-purple rounded-full shadow-md w-full h-full" />
            </Tabs.Tab>
            <Tabs.Tab 
              id="puntuaciones"
              className="group max-w-full px-4 h-9 text-xs font-bold font-barlow tracking-wider uppercase cursor-pointer rounded-full"
            >
              <span className="group-data-[selected=true]:text-white text-gh-text-muted transition-colors duration-200 flex items-center gap-2">
                <Info size={16} /> PUNTUACIONES
              </span>
              <Tabs.Indicator className="bg-wc-purple rounded-full shadow-md w-full h-full" />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="grupos_master">
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
              <Table.Cell className="font-semibold text-gray-900 dark:text-white">{g.nombre}</Table.Cell>
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
        </Tabs.Panel>

        {/* TAB B: ASIGNAR GESTOR DESDE TODOS LOS USUARIOS REGISTRADOS */}
        <Tabs.Panel id="gestores_master">
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
              <Table.Cell className="font-semibold text-gray-900 dark:text-white">{user.nombre}</Table.Cell>
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
        </Tabs.Panel>

        {/* TAB C: RESULTADOS OFICIALES */}
        <Tabs.Panel id="resultados">
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
                  <Card key={partido.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-neon-blue uppercase font-bold tracking-wider font-barlow">
                        {partido.id.replace('_', ' ')}
                      </span>
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">
                        {partido.confirmado ? `${partido.local} vs ${partido.visita}` : `Por confirmar — ${partido.local}`}
                      </div>
                      <span className="text-[10px] text-gh-text-muted">{partido.sede} · {partido.fecha}</span>
                    </div>

                    {/* Formulario/Inputs de Resultados */}
                    <div className="flex flex-wrap items-center gap-4">
                      {partido.confirmado ? (
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
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input 
                            type="text"
                            id={`local-input-master-${partido.id}`}
                            placeholder="País Local"
                            className="px-2 py-1 h-8 text-xs w-28"
                          />
                          <Input 
                            type="text"
                            id={`visita-input-master-${partido.id}`}
                            placeholder="País Visita"
                            className="px-2 py-1 h-8 text-xs w-28"
                          />
                          <Button 
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              const localVal = document.getElementById(`local-input-master-${partido.id}`).value;
                              const visitaVal = document.getElementById(`visita-input-master-${partido.id}`).value;
                              onConfirmarPartidoPendiente(partido.id, localVal, visitaVal);
                            }}
                            className="h-8"
                          >
                            Confirmar Equipos
                          </Button>
                        </div>
                      )}

                      {partido.confirmado && (
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
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
          </div>
          </Tabs.Panel>
          {/* TAB D: PUNTUACIONES */}
          <Tabs.Panel id="puntuaciones">
            <div className="space-y-4 mt-4">
              <Select
                selectedKeys={selectedGroupId ? new Set([selectedGroupId.toString()]) : new Set()}
                onSelectionChange={(keys) => {
                  const val = [...keys][0];
                  setSelectedGroupId(val || '');
                }}
                placeholder="Selecciona familia"
                className="w-full max-w-sm"
                label="Familia"
                aria-label="Seleccionar familia"
              >
                <ListBox>
                  {gruposList.map(g => (
                    <ListBox.Item key={g.id.toString()} id={g.id.toString()} textValue={g.nombre}>
                      {g.nombre}
                    </ListBox.Item>
                  ))}
                </ListBox>
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
                          .filter(u => selectedGroupId && u.grupo_id === Number(selectedGroupId))
                          .map(user => (
                            <Table.Row key={user.id} className="hover:bg-gray-100 dark:hover:bg-[#21262d]/5">
                              <Table.Cell className="font-semibold text-gray-900 dark:text-white">{user.nombre}</Table.Cell>
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
          </Tabs.Panel>
        </Tabs>
      </div>
    );
  }
