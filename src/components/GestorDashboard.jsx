import React from 'react';
import { Settings, Users, Trophy, Copy, Lock, Info, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Tabs, Table } from '@heroui/react';
import { Input } from './ui/input';
import { Button } from './ui/button';

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
  copyToClipboard
}) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-gh-border pb-3">
        <h2 className="text-2xl font-bold font-barlow text-gray-900 dark:text-white tracking-wider flex items-center gap-2">
          <Settings size={22} className="text-neon-pink" />
          PANEL DE GESTOR
        </h2>
        <span className="text-xs text-neon-pink font-semibold">Administración de Familia</span>
      </div>

     <Tabs
  selectedKey={activeAdminTab}
  onSelectionChange={setActiveAdminTab}
  variant="solid"
  color="danger"
  classNames={{
    tabList: "w-full rounded-full bg-black/5 dark:bg-[#161b22]/50 p-1 border border-gh-border gap-1 relative",
    cursor: "bg-wc-red rounded-full shadow-md w-full h-full",
    tab: "group max-w-full px-4 h-9 text-xs font-bold font-barlow tracking-wider uppercase cursor-pointer rounded-full",
    tabContent: "group-data-[selected=true]:text-white text-gh-text-muted transition-colors duration-200"
  }}
>
  <Tabs.ListContainer className="w-full">
    <Tabs.List
      className="w-full rounded-full bg-black/5 dark:bg-[#161b22]/50 p-1 border border-gh-border gap-1 relative"
      aria-label="Opciones del Gestor"
    >
      <Tabs.Tab
        id="grupo_gestor"
        className="group max-w-full px-4 h-9 text-xs font-bold font-barlow tracking-wider uppercase cursor-pointer rounded-full"
      >
        <span className="group-data-[selected=true]:text-white text-gh-text-muted transition-colors duration-200 flex items-center gap-2">
          <Users size={16} /> MI GRUPO
        </span>
        <Tabs.Indicator className="bg-wc-red rounded-full shadow-md w-full h-full" />
      </Tabs.Tab>

      <Tabs.Tab
        id="resultados"
        className="group max-w-full px-4 h-9 text-xs font-bold font-barlow tracking-wider uppercase cursor-pointer rounded-full"
      >
        <span className="group-data-[selected=true]:text-white text-gh-text-muted transition-colors duration-200 flex items-center gap-2">
          <Trophy size={16} /> RESULTADOS REALES
        </span>
        <Tabs.Indicator className="bg-wc-red rounded-full shadow-md w-full h-full" />
      </Tabs.Tab>
    </Tabs.List>
  </Tabs.ListContainer>

  {/* TAB A: DETALLES DE GRUPO */}
  <Tabs.Panel id="grupo_gestor">
    <div className="space-y-6 mt-4">
      <Card className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="text-xs text-gh-text-muted uppercase font-bold tracking-wider">Código de Invitación de Familia</span>
          <span className="text-2xl font-bold font-barlow text-white tracking-widest">{currentUser.grupo_codigo}</span>
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
              <Table.Cell className="font-semibold text-gray-900 dark:text-white">{usr.nombre}</Table.Cell>
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
  </Tabs.Panel>

  {/* TAB B: CARGA DE RESULTADOS REALES */}
  <Tabs.Panel id="resultados">
    <div className="space-y-4 mt-4">
      <div className="p-3 bg-neon-pink/5 border border-neon-pink/35 rounded-md text-xs leading-relaxed text-gh-text flex items-center gap-2.5">
        <Info size={16} className="text-neon-pink shrink-0" />
        <div><strong>Carga de Marcadores Oficiales:</strong> Carga el resultado del partido para realizar los cálculos de puntos de forma automática para toda la polla mundial. Al guardar un resultado, el partido se cerrará y los usuarios no podrán editar sus predicciones.</div>
      </div>
      <div className="space-y-4">
        {partidos.map((partido) => {
          const rEdit = resultadoEdicion[partido.id] || { goles_local: '', goles_visita: '', cerrado: false };
          return (
            <Card key={partido.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-neon-blue uppercase font-bold tracking-wider font-barlow">{partido.id.replace('_', ' ')}</span>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">
                  {partido.confirmado ? (<span>{partido.local} VS {partido.visita}</span>) : (<span className="text-gh-text-muted uppercase text-xs">Fase por definir ({partido.local})</span>)}
                </div>
                <div className="text-[10px] text-gh-text-muted">Sede: {partido.sede} · {partido.fecha}</div>
              </div>
              {partido.confirmado ? (
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-2">
      {/* Goles Local */}
      <label htmlFor={`goles-local-${partido.id}`} className="sr-only">Goles Local</label>
      <Input id={`goles-local-${partido.id}`} type="number" min="0" disabled={rEdit.cerrado} value={rEdit.goles_local} onChange={(e) => {
        const val = e.target.value === '' ? '' : parseInt(e.target.value);
        setResultadoEdicion({ ...resultadoEdicion, [partido.id]: { ...rEdit, goles_local: val } });
      }} placeholder="-" className="w-12 h-10 text-center text-lg font-bold rounded-lg" />
      <span className="text-gh-text-muted font-bold">-</span>
      {/* Goles Visita */}
      <label htmlFor={`goles-visita-${partido.id}`} className="sr-only">Goles Visita</label>
      <Input id={`goles-visita-${partido.id}`} type="number" min="0" disabled={rEdit.cerrado} value={rEdit.goles_visita} onChange={(e) => {
        const val = e.target.value === '' ? '' : parseInt(e.target.value);
        setResultadoEdicion({ ...resultadoEdicion, [partido.id]: { ...rEdit, goles_visita: val } });
      }} placeholder="-" className="w-12 h-10 text-center text-lg font-bold rounded-lg" />
    </div>
    <div className="flex items-center gap-2">
      <Button disabled={rEdit.cerrado} variant="neon-pink" size="sm" onClick={() => onSaveResultado(partido.id)} className="h-8"><Check size={14} className="mr-1" /> Cerrar y Guardar</Button>
      {rEdit.cerrado && (
        <Button variant="outline" size="sm" onClick={() => onAbrirPartido(partido.id)} className="h-8" title="Reabrir partido">Reabrir</Button>
      )}
    </div>
  </div>
) : (
  <div className="flex flex-col sm:flex-row gap-2">
    {/* Equipo Local */}
    <label htmlFor={`local-input-${partido.id}`} className="sr-only">Equipo Local</label>
    <Input type="text" id={`local-input-${partido.id}`} placeholder="País Local" className="px-2 py-1 h-8 text-xs w-28" />
    {/* Equipo Visita */}
    <label htmlFor={`visita-input-${partido.id}`} className="sr-only">Equipo Visita</label>
    <Input type="text" id={`visita-input-${partido.id}`} placeholder="País Visita" className="px-2 py-1 h-8 text-xs w-28" />
    <Button variant="secondary" size="sm" onClick={() => {
      const localVal = document.getElementById(`local-input-${partido.id}`).value;
      const visitaVal = document.getElementById(`visita-input-${partido.id}`).value;
      onConfirmarPartidoPendiente(partido.id, localVal, visitaVal);
    }} className="h-8">Confirmar Equipos</Button>
  </div>
)}
            </Card>
          );
        })}
      </div>
    </div>
  </Tabs.Panel>
</Tabs>
    </div>
  );
}
