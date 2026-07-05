import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Select, ListBox, Button } from '@heroui/react';
import { Star, Trophy, Calendar, Clock, Plus, Minus, Check, MapPin, ChevronDown } from 'lucide-react';
import Leaderboard from './Leaderboard';
import { sileo } from 'sileo';

const getCountryInitials = (teamName) => {
  if (!teamName) return '';
  const cleanName = teamName.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '').trim().toUpperCase();
  
  const countryMap = {
    'FRANCIA': 'FRA',
    'PARAGUAY': 'PAR',
    'CANADÁ': 'CAN',
    'CANADA': 'CAN',
    'MARRUECOS': 'MAR',
    'BRASIL': 'BRA',
    'NORUEGA': 'NOR',
    'MÉXICO': 'MEX',
    'MEXICO': 'MEX',
    'INGLATERRA': 'ENG',
    'ESPAÑA': 'ESP',
    'ESPANA': 'ESP',
    'PORTUGAL': 'POR',
    'BÉLGICA': 'BEL',
    'BELGICA': 'BEL',
    'USA': 'USA',
    'EEUU': 'USA',
    'EE.UU.': 'USA',
    'ARGENTINA': 'ARG',
    'EGIPTO': 'EGY',
    'SUIZA': 'SUI',
    'COLOMBIA': 'COL'
  };

  if (countryMap[cleanName]) {
    return countryMap[cleanName];
  }

  if (cleanName.includes('GANADOR OCTAVOS')) {
    return `G_OCT_${cleanName.split(' ').pop()}`;
  }
  if (cleanName.includes('GANADOR CUARTOS')) {
    return `G_CUART_${cleanName.split(' ').pop()}`;
  }
  if (cleanName.includes('GANADOR SEMIFINAL')) {
    return `G_SEMI_${cleanName.split(' ').pop()}`;
  }
  if (cleanName.includes('PERDEDOR SEMIFINAL')) {
    return `P_SEMI_${cleanName.split(' ').pop()}`;
  }

  return cleanName.substring(0, 3);
};

const parseMatchDateTime = (fechaStr, horaStr) => {
  if (!fechaStr) return null;
  const dia = parseInt(fechaStr.split(' ')[0]);
  const horaClean = (horaStr || '18:00 HS').replace(' HS', '').trim();
  const [hrs, mins] = horaClean.split(':').map(Number);
  // Julio 2026 (index del mes es 6)
  return new Date(2026, 6, dia, hrs, mins, 0);
};

const getMatchLabel = (p) => {
  if (p.confirmado) {
    return `${getCountryInitials(p.local)} - ${getCountryInitials(p.visita)}`;
  }
  const phaseLabels = {
    'cuartos_a': 'Cuartos 1',
    'cuartos_b': 'Cuartos 2',
    'cuartos_c': 'Cuartos 3',
    'cuartos_d': 'Cuartos 4',
    'semi_a': 'Semifinal 1',
    'semi_b': 'Semifinal 2',
    'tercer_puesto': '3er Puesto',
    'final': 'Final'
  };
  return phaseLabels[p.id] || p.id;
};

export default function MemberDashboard({
  partidos,
  predicciones,
  resultados,
  tablaPosiciones,
  currentUser,
  onSavePrediction,
  usuariosList,
  allPredicciones
}) {
  // 1. Encontrar el próximo partido abierto (que no haya comenzado y no esté cerrado)
  const proximoPartido = useMemo(() => {
    const now = new Date();
    // Encontrar el primer partido en el futuro que no esté cerrado en la base de datos
    const match = partidos.find((p) => {
      const kickoff = parseMatchDateTime(p.fecha, p.hora);
      return kickoff && now < kickoff && !resultados[p.id]?.cerrado;
    });

    return match || partidos.find(p => !resultados[p.id]?.cerrado) || partidos[partidos.length - 1];
  }, [partidos, resultados]);

  // 2. Estado para el partido seleccionado en Tile 2
  const [selectedPartidoId, setSelectedPartidoId] = useState('');

  // Sincronizar el partido seleccionado por defecto con el próximo partido
  useEffect(() => {
    if (proximoPartido) {
      setSelectedPartidoId(proximoPartido.id);
    }
  }, [proximoPartido]);

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

  const isCerrado = useMemo(() => {
    if (resOficial?.cerrado) return true;
    if (!selectedMatch) return false;

    const kickoffDate = parseMatchDateTime(selectedMatch.fecha, selectedMatch.hora);
    if (!kickoffDate) return false;

    return new Date() >= kickoffDate;
  }, [selectedMatch, resOficial]);

  // --- COUNTDOWN TIMER PARA CERRAR PRONÓSTICOS ---
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!selectedMatch) {
      setTimeLeft('');
      return;
    }

    const targetDate = parseMatchDateTime(selectedMatch.fecha, selectedMatch.hora);
    if (!targetDate) {
      setTimeLeft('');
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('00:00:00');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [selectedMatch]);

  const [isDirty, setIsDirty] = useState(false);
  const prevSelectedPartidoIdRef = React.useRef('');

  // Sincronizar los campos al cambiar de partido o si los datos se cargan inicialmente
  useEffect(() => {
    const matchIdChanged = prevSelectedPartidoIdRef.current !== selectedMatch?.id;
    
    if (matchIdChanged || !isDirty) {
      if (savedPred) {
        setGolesLocal(savedPred.goles_local !== undefined ? String(savedPred.goles_local) : '');
        setGolesVisita(savedPred.goles_visita !== undefined ? String(savedPred.goles_visita) : '');
      } else {
        setGolesLocal('');
        setGolesVisita('');
      }
      if (matchIdChanged && selectedMatch) {
        setIsDirty(false);
        prevSelectedPartidoIdRef.current = selectedMatch.id;
      }
    }
  }, [selectedMatch, savedPred, isDirty]);

  // Si el estado guardado coincide con el estado local, ya no estamos sucios (se completó el guardado con éxito o no hay cambios)
  useEffect(() => {
    if (savedPred) {
      const savedL = savedPred.goles_local !== undefined ? String(savedPred.goles_local) : '';
      const savedV = savedPred.goles_visita !== undefined ? String(savedPred.goles_visita) : '';
      if (savedL === golesLocal && savedV === golesVisita) {
        setIsDirty(false);
      }
    } else if (golesLocal === '' && golesVisita === '') {
      setIsDirty(false);
    }
  }, [savedPred, golesLocal, golesVisita]);

  // Controles de incremento / decremento
  const handleIncrementLocal = () => {
    if (isCerrado) return;
    setIsDirty(true);
    setGolesLocal(prev => String((parseInt(prev) || 0) + 1));
  };
  const handleDecrementLocal = () => {
    if (isCerrado) return;
    setIsDirty(true);
    setGolesLocal(prev => {
      const val = parseInt(prev) || 0;
      return val > 0 ? String(val - 1) : '0';
    });
  };
  const handleIncrementVisita = () => {
    if (isCerrado) return;
    setIsDirty(true);
    setGolesVisita(prev => String((parseInt(prev) || 0) + 1));
  };
  const handleDecrementVisita = () => {
    if (isCerrado) return;
    setIsDirty(true);
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
    if (!selectedMatch || !isCerrado || !savedPred || !resOficial) return null;
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
          <Card className="shadow-lg border-gh-border overflow-hidden bg-gradient-to-br from-gh-bg-light to-gh-bg-active h-full flex flex-col">
            <CardHeader className="border-b border-gh-border/50 py-3 px-4">
              <CardTitle className="text-xs font-bold text-wc-green font-barlow tracking-wider uppercase flex items-center gap-1.5">
                <Clock size={14} /> PRÓXIMO ENCUENTRO
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex flex-col justify-between flex-1 min-h-[210px] h-auto gap-4">
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
                        <span>{proximoPartido.fecha} · {proximoPartido.hora || '18:00 HS'}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-[10px] text-gh-text-muted">
                        <MapPin size={11} />
                        <span>Estadio {proximoPartido.sede}</span>
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const kickoffDate = parseMatchDateTime(proximoPartido.fecha, proximoPartido.hora);
                    const hasStarted = kickoffDate && new Date() >= kickoffDate;

                    if (hasStarted) {
                      return (
                        <div className="flex items-center justify-center gap-1.5 py-1.5 bg-wc-red/10 border border-wc-red/20 rounded-lg text-[9px] font-black text-wc-red uppercase tracking-wider font-barlow select-none">
                          <span className="w-1.5 h-1.5 bg-wc-red rounded-full animate-pulse"></span>
                          Partido Iniciado / Cerrado
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex items-center justify-center gap-1.5 py-1.5 bg-wc-green/10 border border-wc-green/20 rounded-lg text-[9px] font-black text-wc-green uppercase tracking-wider font-barlow select-none">
                          <span className="w-1.5 h-1.5 bg-wc-green rounded-full animate-ping"></span>
                          Abierto para pronósticos
                        </div>
                      );
                    }
                  })()}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-gh-text-muted italic">
                  No hay partidos programados
                </div>
              )}
            </CardContent>
          </Card>

          {/* TILE 2: TU PRONÓSTICO */}
          <Card className="shadow-lg border-gh-border overflow-hidden bg-gradient-to-br from-gh-bg-light to-gh-bg-active h-full flex flex-col">
            <CardHeader className="border-b border-gh-border/50 py-3 px-4 flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-xs font-bold text-wc-purple font-barlow tracking-wider uppercase flex items-center gap-1.5">
                <Star size={14} className="text-neon-pink" /> TU PRONÓSTICO
              </CardTitle>
              
              {/* Selector de Partido */}
              <div className="w-[150px]">
                <Select
                  selectedKeys={selectedMatch ? new Set([selectedMatch.id]) : new Set()}
                  onSelectionChange={(keys) => {
                    let val = '';
                    if (keys instanceof Set) val = [...keys][0];
                    else if (typeof keys === 'string' || typeof keys === 'number') val = keys;
                    if (val) setSelectedPartidoId(val.toString());
                  }}
                  aria-label="Seleccionar partido"
                  placeholder="Selecciona"
                  size="sm"
                >
                  <Select.Trigger className="w-full h-7 px-2 border border-gh-border rounded-md flex items-center justify-between bg-gh-bg-light font-sans text-[10px] text-gh-text transition-all">
                    <Select.Value placeholder="Selecciona" />
                    <Select.Indicator className="text-gh-text-muted">
                      <ChevronDown size={12} className="transition-transform duration-200" />
                    </Select.Indicator>
                  </Select.Trigger>
                  <Select.Popover className="border border-gh-border bg-gh-bg-light rounded-lg shadow-xl overflow-hidden min-w-[160px] z-50">
                    <ListBox className="p-1 max-h-48 overflow-y-auto">
                      {partidos
                        .filter((p) => {
                          const kickoffDate = parseMatchDateTime(p.fecha, p.hora);
                          const hasPassed = kickoffDate && new Date() >= kickoffDate;
                          return !resultados[p.id]?.cerrado && !hasPassed;
                        })
                        .map((p) => (
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
            <CardContent className="p-5 flex flex-col justify-between min-h-[210px] h-auto gap-4 flex-1">
              {selectedMatch ? (
                <>
                  {/* Countdown Timer */}
                  {timeLeft && (
                    <div className={`flex items-center justify-center gap-1.5 py-1 px-3 border rounded-full text-[10px] font-black uppercase tracking-wider font-barlow max-w-[220px] mx-auto select-none ${
                      timeLeft === '00:00:00' 
                        ? 'bg-wc-red/10 border-wc-red/20 text-wc-red' 
                        : 'bg-wc-yellow/10 border-wc-yellow/20 text-wc-yellow animate-pulse'
                    }`}>
                      <Clock size={11} />
                      <span>{timeLeft === '00:00:00' ? 'Cerrado: 00:00:00' : `Cierre en: ${timeLeft}`}</span>
                    </div>
                  )}

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
                  <div className="mt-1">
                    {isCerrado ? (
                      <div className="text-center p-2.5 rounded-lg bg-black/10 dark:bg-black/25 border border-gh-border/40">
                        <span className="block text-[9px] font-black text-gh-text-muted uppercase tracking-wider">
                          {resOficial?.cerrado ? 'Marcador Oficial' : 'Partido Iniciado'}
                        </span>
                        {resOficial?.cerrado ? (
                          <span className="text-xs font-black text-gh-text">
                            {resOficial.goles_local} - {resOficial.goles_visita}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-wc-red uppercase tracking-wider font-barlow flex items-center justify-center gap-1.5 mt-0.5 select-none">
                            <span className="w-1.5 h-1.5 bg-wc-red rounded-full animate-ping"></span>
                            Predicciones Bloqueadas
                          </span>
                        )}
                        {puntosGanados !== null && resOficial?.cerrado && (
                          <span className={`block text-[10px] font-black mt-1 ${
                            puntosGanados === 3 ? 'text-wc-yellow' : puntosGanados === 1 ? 'text-wc-green' : 'text-wc-red'
                          }`}>
                            {puntosGanados === 3 ? '🏆 ¡Marcador Exacto! +3 PTS' : puntosGanados === 1 ? '✅ ¡Ganador Acertado! +1 PT' : '❌ Sin Puntos (0 PTS)'}
                          </span>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={golesLocal === '' || golesVisita === ''}
                        className="w-full h-11 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#db2777] hover:from-[#4338ca] hover:to-[#be185d] disabled:from-slate-400 disabled:to-slate-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)] transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer border-0"
                      >
                        <Check size={14} />
                        GUARDAR PRONÓSTICO
                      </button>
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
                  const isToday = diaObj.dia === new Date().getDate();
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
                              onClick={() => {
                                setSelectedPartidoId(p.id);
                                sileo.success({
                                  title: `${p.local} vs ${p.visita}`,
                                  description: `🏟️ Sede: ${p.sede || 'Por confirmar'}\n📍 Ubicación: ${p.ciudad || ''}${p.pais ? `, ${p.pais}` : ''}\n📅 Fecha: ${p.fecha} · ⏰ Hora: ${p.hora || '18:00 HS'}`
                                });
                              }}
                              title={`${p.local} vs ${p.visita}`}
                              className={`w-full text-left p-1 rounded border text-[9px] font-bold truncate flex items-center justify-between cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-wc-purple/10 border-wc-purple text-wc-purple'
                                  : isClosed
                                    ? 'bg-black/5 border-gh-border/40 text-gh-text-muted line-through'
                                    : 'bg-gh-bg-light border-gh-border/50 text-gh-text hover:bg-gh-bg-active'
                              }`}
                            >
                              <span>{getMatchLabel(p)}</span>
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

        {/* TILE 4: PRONÓSTICOS EN VIVO (SIGUIENTE PARTIDO) */}
        {proximoPartido && (
          <Card className="overflow-hidden shadow-2xl transition-theme">
            <div className="p-4 bg-gh-bg-active/35 dark:bg-[#0d1627]/60 border-b border-gh-border flex flex-col gap-1">
              <span className="text-xs font-bold text-gh-text uppercase tracking-wider font-barlow">
                Pronósticos en Vivo
              </span>
              <span className="text-[10px] text-gh-text-muted uppercase">
                Siguiente Partido: {proximoPartido.local.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '').trim()} vs {proximoPartido.visita.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '').trim()}
              </span>
            </div>
            
            <div className="divide-y divide-gh-border/50 max-h-[300px] overflow-y-auto">
              {usuariosList && usuariosList.filter(u => u.grupo_id === currentUser.grupo_id).length === 0 ? (
                <div className="p-6 text-center text-xs text-gh-text-muted italic">
                  No hay miembros en tu grupo familiar.
                </div>
              ) : (
                usuariosList && usuariosList
                  .filter(u => u.grupo_id === currentUser.grupo_id)
                  .map((usr) => {
                    const nextPred = allPredicciones && allPredicciones.find(
                      p => p.usuario_id === usr.id && p.partido_id === proximoPartido.id
                    );
                    
                    return (
                      <div key={usr.id} className="p-3 flex items-center justify-between text-xs hover:bg-[#21262d]/5 transition-theme">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gh-text">
                            {usr.nombre}
                            {usr.id === currentUser.id && (
                              <span className="text-[9px] bg-wc-green/10 border border-wc-green/20 text-wc-green font-bold px-1.5 py-0.5 rounded-md ml-1.5 uppercase font-barlow tracking-wider">Tú</span>
                            )}
                          </span>
                          <span className="text-[9px] text-gh-text-muted">@{usr.username}</span>
                        </div>
                        
                        <div className="px-3 py-1 bg-gh-bg-active/40 border border-gh-border rounded-lg font-mono font-bold text-gh-text text-center min-w-[70px]">
                          {nextPred && nextPred.goles_local !== '' && nextPred.goles_visita !== '' ? (
                            <span>{nextPred.goles_local} - {nextPred.goles_visita}</span>
                          ) : (
                            <span className="text-[10px] text-gh-text-muted italic font-sans font-normal">Sin pronóstico</span>
                          )}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </Card>
        )}
      </div>

    </div>
  );
}
