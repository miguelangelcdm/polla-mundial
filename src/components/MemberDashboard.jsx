import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Select, ListBox, Button } from '@heroui/react';
import { Star, Trophy, Calendar, Clock, Plus, Minus, Check, MapPin, ChevronDown } from 'lucide-react';
import Leaderboard from './Leaderboard';

export default function MemberDashboard({
  partidos,
  predicciones,
  resultados,
  tablaPosiciones,
  currentUser,
  onSavePrediction
}) {
  // 1. Encontrar el próximo partido abierto
  const proximoPartido = useMemo(() => {
    return partidos.find(p => !resultados[p.id]?.cerrado) || partidos[partidos.length - 1];
  }, [partidos, resultados]);

  // 2. Estado para el partido seleccionado en Tile 2
  const [selectedPartidoId, setSelectedPartidoId] = useState('');

  // Sincronizar el partido seleccionado por defecto con el próximo partido
  useEffect(() => {
    if (proximoPartido && !selectedPartidoId) {
      setSelectedPartidoId(proximoPartido.id);
    }
  }, [proximoPartido, selectedPartidoId]);

  const selectedMatch = useMemo(() => {
    return partidos.find(p => p.id === selectedPartidoId) || proximoPartido;
  }, [partidos, selectedPartidoId, proximoPartido]);

  // 3. Estados locales para la edición del pronóstico en Tile 2
  const [golesLocal, setGolesLocal] = useState('');
  const [golesVisita, setGolesVisita] = useState('');

  const savedPred = useMemo(() => {
    return selectedMatch ? predicciones[selectedMatch.id] : null;
  }, [selectedMatch, predicciones]);

  const resOficial = useMemo(() => {
    return selectedMatch ? resultados[selectedMatch.id] : null;
  }, [selectedMatch, resultados]);

  const isCerrado = resOficial?.cerrado || false;

  // Sincronizar los campos al cambiar de partido
  useEffect(() => {
    if (savedPred) {
      setGolesLocal(savedPred.goles_local !== undefined ? String(savedPred.goles_local) : '');
      setGolesVisita(savedPred.goles_visita !== undefined ? String(savedPred.goles_visita) : '');
    } else {
      setGolesLocal('');
      setGolesVisita('');
    }
  }, [selectedMatch, savedPred]);

  // Controles de incremento / decremento
  const handleIncrementLocal = () => {
    if (isCerrado) return;
    setGolesLocal(prev => String((parseInt(prev) || 0) + 1));
  };
  const handleDecrementLocal = () => {
    if (isCerrado) return;
    setGolesLocal(prev => {
      const val = parseInt(prev) || 0;
      return val > 0 ? String(val - 1) : '0';
    });
  };
  const handleIncrementVisita = () => {
    if (isCerrado) return;
    setGolesVisita(prev => String((parseInt(prev) || 0) + 1));
  };
  const handleDecrementVisita = () => {
    if (isCerrado) return;
    setGolesVisita(prev => {
      const val = parseInt(prev) || 0;
      return val > 0 ? String(val - 1) : '0';
    });
  };

  const handleSave = () => {
    if (selectedMatch) {
      onSavePrediction(selectedMatch.id, golesLocal, golesVisita);
    }
  };

  // 4. Mapeo del calendario mensual de Julio 2026
  const diasMes = useMemo(() => {
    // Julio 2026 empieza en Miércoles. Offset de 2 celdas vacías (Lunes, Martes)
    const offset = 2;
    const totalDias = 31;
    const celdas = [];

    // Celdas vacías al inicio
    for (let i = 0; i < offset; i++) {
      celdas.push({ dia: null, matches: [] });
    }

    // Celdas de días
    for (let d = 1; d <= totalDias; d++) {
      const matchesOnDay = partidos.filter(p => {
        // Formato fecha: "4 Jul", "5 Jul", etc.
        const diaMatch = parseInt(p.fecha.split(' ')[0]);
        const mesMatch = p.fecha.split(' ')[1];
        return diaMatch === d && mesMatch === 'Jul';
      });
      celdas.push({ dia: d, matches: matchesOnDay });
    }

    return celdas;
  }, [partidos]);

  // Calcular puntos ganados si está cerrado
  const puntosGanados = useMemo(() => {
    if (!selectedMatch || !isCerrado || !savedPred) return null;
    const predL = savedPred.goles_local;
    const predV = savedPred.goles_visita;
    const resL = resOficial.goles_local;
    const resV = resOficial.goles_visita;

    if (predL === resL && predV === resV) return 3;

    const predDiff = predL - predV;
    const resDiff = resL - resV;
    if ((predDiff > 0 && resDiff > 0) || (predDiff < 0 && resDiff < 0) || (predDiff === 0 && resDiff === 0)) {
      return 1;
    }
    return 0;
  }, [selectedMatch, isCerrado, savedPred, resOficial]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* SECCIÓN IZQUIERDA (Span 2): Tiles 1, 2 y 4 */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* FILA DE TILE 1 & TILE 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* TILE 1: PRÓXIMO PARTIDO */}
          <Card className="shadow-lg border-gh-border overflow-hidden bg-gradient-to-br from-gh-bg-light to-gh-bg-active">
            <CardHeader className="border-b border-gh-border/50 py-3 px-4">
              <CardTitle className="text-xs font-bold text-wc-green font-barlow tracking-wider uppercase flex items-center gap-1.5">
                <Clock size={14} /> PRÓXIMO ENCUENTRO
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex flex-col justify-between h-[210px]">
              {proximoPartido ? (
                <>
                  <div className="space-y-4">
                    {/* Enfrentamiento */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col items-center flex-1 text-center">
                        <span className="text-2xl mb-1 filter drop-shadow-sm">
                          {proximoPartido.local.match(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g)?.[0] || '🏳️'}
                        </span>
                        <span className="text-xs font-bold text-gh-text truncate max-w-[80px]">
                          {proximoPartido.local.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '').trim()}
                        </span>
                      </div>
                      
                      <span className="px-2 py-1 bg-gh-border/50 rounded text-[10px] font-black text-gh-text-muted">VS</span>

                      <div className="flex flex-col items-center flex-1 text-center">
                        <span className="text-2xl mb-1 filter drop-shadow-sm">
                          {proximoPartido.visita.match(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g)?.[0] || '🏳️'}
                        </span>
                        <span className="text-xs font-bold text-gh-text truncate max-w-[80px]">
                          {proximoPartido.visita.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '').trim()}
                        </span>
                      </div>
                    </div>

                    {/* Fecha, hora y sede */}
                    <div className="space-y-1 text-center bg-black/10 dark:bg-black/20 p-2.5 rounded-lg border border-gh-border/30">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-gh-text font-bold">
                        <Calendar size={13} className="text-wc-yellow" />
                        <span>{proximoPartido.fecha} · 18:00 HS</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-[10px] text-gh-text-muted">
                        <MapPin size={11} />
                        <span>Estadio {proximoPartido.sede}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPartidoId(proximoPartido.id)}
                    className="w-full py-1.5 bg-wc-green/10 hover:bg-wc-green/20 border border-wc-green/30 rounded-lg text-[10px] font-black text-wc-green uppercase tracking-wider font-barlow cursor-pointer transition-all"
                  >
                    Pronosticar este partido
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-gh-text-muted italic">
                  No hay partidos programados
                </div>
              )}
            </CardContent>
          </Card>

          {/* TILE 2: TU PRONÓSTICO */}
          <Card className="shadow-lg border-gh-border overflow-hidden bg-gradient-to-br from-gh-bg-light to-gh-bg-active">
            <CardHeader className="border-b border-gh-border/50 py-3 px-4 flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-xs font-bold text-wc-purple font-barlow tracking-wider uppercase flex items-center gap-1.5">
                <Star size={14} className="text-neon-pink" /> TU PRONÓSTICO
              </CardTitle>
              
              {/* Selector de Partido */}
              <div className="w-[140px]">
                <Select
                  selectedKeys={selectedMatch ? new Set([selectedMatch.id]) : new Set()}
                  onSelectionChange={(keys) => {
                    let val = '';
                    if (keys instanceof Set) val = [...keys][0];
                    else if (typeof keys === 'string' || typeof keys === 'number') val = keys;
                    if (val) setSelectedPartidoId(val.toString());
                  }}
                  aria-label="Seleccionar partido"
                  size="sm"
                >
                  <Select.Trigger className="w-full h-7 px-2 border border-gh-border rounded-md flex items-center justify-between bg-gh-bg-light font-sans text-[10px] text-gh-text transition-all">
                    <Select.Value />
                    <Select.Indicator className="text-gh-text-muted">
                      <ChevronDown size={12} className="transition-transform duration-200" />
                    </Select.Indicator>
                  </Select.Trigger>
                  <Select.Popover className="border border-gh-border bg-gh-bg-light rounded-lg shadow-xl overflow-hidden min-w-[160px] z-50">
                    <ListBox className="p-1 max-h-48 overflow-y-auto">
                      {partidos.map((p) => (
                        <ListBox.Item 
                          key={p.id} 
                          id={p.id} 
                          textValue={`${p.local.split(' ')[0]} vs ${p.visita.split(' ')[0]}`}
                          className="px-2 py-1 rounded text-[10px] font-semibold text-gh-text hover:bg-wc-purple hover:text-white cursor-pointer transition-all"
                        >
                          {p.local.split(' ')[0]} vs {p.visita.split(' ')[0]}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-5 flex flex-col justify-between h-[210px]">
              {selectedMatch ? (
                <>
                  {/* Marcador Táctil */}
                  <div className="flex items-center justify-center gap-4">
                    {/* Local */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-gh-text-muted mb-1 truncate max-w-[60px]">
                        {selectedMatch.local.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '').trim()}
                      </span>
                      <div className="flex items-center bg-black/10 dark:bg-black/25 rounded-full p-1 border border-gh-border/50">
                        <button
                          type="button"
                          onClick={handleDecrementLocal}
                          disabled={isCerrado}
                          className="w-7 h-7 rounded-full bg-gh-bg flex items-center justify-center border border-gh-border text-gh-text-muted hover:text-gh-text hover:bg-gh-bg-active disabled:opacity-40 cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-10 text-center text-lg font-black text-gh-text">
                          {golesLocal !== '' ? golesLocal : '-'}
                        </span>
                        <button
                          type="button"
                          onClick={handleIncrementLocal}
                          disabled={isCerrado}
                          className="w-7 h-7 rounded-full bg-gh-bg flex items-center justify-center border border-gh-border text-gh-text-muted hover:text-gh-text hover:bg-gh-bg-active disabled:opacity-40 cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <span className="text-sm font-black text-gh-text-muted mt-5">:</span>

                    {/* Visita */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-gh-text-muted mb-1 truncate max-w-[60px]">
                        {selectedMatch.visita.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '').trim()}
                      </span>
                      <div className="flex items-center bg-black/10 dark:bg-black/25 rounded-full p-1 border border-gh-border/50">
                        <button
                          type="button"
                          onClick={handleDecrementVisita}
                          disabled={isCerrado}
                          className="w-7 h-7 rounded-full bg-gh-bg flex items-center justify-center border border-gh-border text-gh-text-muted hover:text-gh-text hover:bg-gh-bg-active disabled:opacity-40 cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-10 text-center text-lg font-black text-gh-text">
                          {golesVisita !== '' ? golesVisita : '-'}
                        </span>
                        <button
                          type="button"
                          onClick={handleIncrementVisita}
                          disabled={isCerrado}
                          className="w-7 h-7 rounded-full bg-gh-bg flex items-center justify-center border border-gh-border text-gh-text-muted hover:text-gh-text hover:bg-gh-bg-active disabled:opacity-40 cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Estado / Botón */}
                  <div className="mt-3">
                    {isCerrado ? (
                      <div className="text-center p-2 rounded-lg bg-black/10 border border-gh-border/40">
                        <span className="block text-[9px] font-black text-gh-text-muted uppercase tracking-wider">Marcador Oficial</span>
                        <span className="text-xs font-black text-gh-text">
                          {resOficial.goles_local} - {resOficial.goles_visita}
                        </span>
                        {puntosGanados !== null && (
                          <span className={`block text-[10px] font-black mt-1 ${
                            puntosGanados === 3 ? 'text-wc-yellow' : puntosGanados === 1 ? 'text-wc-green' : 'text-wc-red'
                          }`}>
                            {puntosGanados === 3 ? '🏆 ¡Marcador Exacto! +3 PTS' : puntosGanados === 1 ? '✅ ¡Ganador Acertado! +1 PT' : '❌ Sin Puntos (0 PTS)'}
                          </span>
                        )}
                      </div>
                    ) : (
                      <Button
                        variant="neon-blue"
                        className="w-full h-9 rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
                        onClick={handleSave}
                        disabled={golesLocal === '' || golesVisita === ''}
                      >
                        <Check size={13} /> GUARDAR PRONÓSTICO
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-gh-text-muted italic">
                  Selecciona un partido para pronosticar
                </div>
              )}
            </CardContent>
          </Card>
          
        </div>

        {/* TILE 4: CALENDARIO DE PARTIDOS */}
        <Card className="shadow-lg border-gh-border overflow-hidden bg-gh-bg-light">
          <CardHeader className="border-b border-gh-border/50 py-3 px-4">
            <CardTitle className="text-xs font-bold text-gh-text font-barlow tracking-wider uppercase flex items-center gap-1.5">
              <Calendar size={14} className="text-wc-yellow" /> CALENDARIO - JULIO 2026
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Encabezado de Días */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-black text-gh-text-muted uppercase tracking-wider font-barlow mb-2">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>
              
              {/* Rejilla del Mes */}
              <div className="grid grid-cols-7 gap-1.5">
                {diasMes.map((diaObj, idx) => {
                  const hasMatch = diaObj.matches.length > 0;
                  const isToday = diaObj.dia === 4; // Mock de día actual (Comienzo mundial)
                  return (
                    <div 
                      key={idx} 
                      className={`min-h-[75px] border p-1.5 rounded-lg flex flex-col justify-between transition-all ${
                        diaObj.dia === null 
                          ? 'border-transparent bg-transparent pointer-events-none'
                          : isToday 
                            ? 'border-wc-green bg-wc-green/5 shadow-xs'
                            : hasMatch
                              ? 'border-gh-border/80 bg-gh-bg-active/20 hover:border-gh-text/30'
                              : 'border-gh-border/30 bg-gh-bg/20'
                      }`}
                    >
                      {/* Número de día */}
                      <span className={`text-[10px] font-black leading-none ${
                        diaObj.dia === null 
                          ? 'text-transparent'
                          : isToday 
                            ? 'text-wc-green'
                            : hasMatch 
                              ? 'text-gh-text font-bold'
                              : 'text-gh-text-muted'
                      }`}>
                        {diaObj.dia}
                      </span>
                      
                      {/* Lista de partidos en este día */}
                      <div className="space-y-1 mt-1.5">
                        {diaObj.matches.map(p => {
                          const isSelected = selectedPartidoId === p.id;
                          const resOf = resultados[p.id];
                          const isClosed = resOf?.cerrado;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setSelectedPartidoId(p.id)}
                              title={`${p.local} vs ${p.visita}`}
                              className={`w-full text-left p-1 rounded border text-[9px] font-bold truncate flex items-center justify-between cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-wc-purple/10 border-wc-purple text-wc-purple'
                                  : isClosed
                                    ? 'bg-black/5 border-gh-border/40 text-gh-text-muted line-through'
                                    : 'bg-gh-bg-light border-gh-border/50 text-gh-text hover:bg-gh-bg-active'
                              }`}
                            >
                              <span>{p.local.split(' ')[0]} - {p.visita.split(' ')[0]}</span>
                              {isClosed && <span className="text-[8px]">🔒</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* SECCIÓN DERECHA (Span 1): Tile 3 (Leaderboard) */}
      <div className="space-y-6">
        {/* TILE 3: TABLA DE RESULTADOS */}
        <Leaderboard 
          tablaPosiciones={tablaPosiciones} 
          currentUserId={currentUser.id} 
        />
      </div>

    </div>
  );
}
