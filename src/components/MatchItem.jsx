import React from 'react';
import { Lock } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { calcularPuntosPartido } from '../supabaseClient';

export default function MatchItem({ partido, pred = { goles_local: '', goles_visita: '' }, res, onChangePrediction }) {
  const partidoCerrado = res?.cerrado;

  // Calcular puntos ganados si el partido ya se cerró
  const puntosGanados = partidoCerrado 
    ? calcularPuntosPartido(pred.goles_local, pred.goles_visita, res.goles_local, res.goles_visita)
    : null;

  return (
    <Card 
      variant={partidoCerrado ? undefined : "glow-blue"}
      className={`p-4 transition-all duration-300 relative overflow-hidden transition-theme ${
        partidoCerrado 
          ? 'border-gh-border/50 bg-[#020813]/20' 
          : 'bg-[#081122]/30 hover:scale-[1.01] hover:border-wc-purple/40 hover:shadow-lg'
      }`}
    >
      {/* Sello de Estado Cerrado */}
      {partidoCerrado && (
        <div className="absolute top-0 right-0 py-0.5 px-3 bg-wc-red/10 border-l border-b border-wc-red/35 rounded-bl-xl text-[10px] text-wc-red font-bold flex items-center gap-1 font-barlow tracking-wider">
          <Lock size={10} /> CERRADO
        </div>
      )}

      {/* Info General del Partido */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 text-xs text-gh-text-muted">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white px-2 py-0.5 bg-[#0d1627] border border-gh-border rounded-md font-barlow tracking-wider">
            {partido.fecha}
          </span>
          <span className="font-medium text-[11px]">{partido.sede}</span>
        </div>
        <span className="font-bold text-wc-green tracking-wider font-barlow text-sm uppercase">
          {partido.id.replace('_', ' ')}
        </span>
      </div>

      {/* Grid del Partido */}
      <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4">
        {/* Local / Visita */}
        <div className="md:col-span-3 flex items-center justify-between md:justify-around gap-2">
          {partido.confirmado ? (
            <>
              <div className="flex items-center gap-2 w-5/12 text-right justify-end font-semibold text-sm md:text-base text-white">
                <span>{partido.local}</span>
              </div>
              <span className="text-xs text-gh-text-muted font-bold tracking-widest font-barlow">VS</span>
              <div className="flex items-center gap-2 w-5/12 text-left justify-start font-semibold text-sm md:text-base text-white">
                <span>{partido.visita}</span>
              </div>
            </>
          ) : (
            <div className="w-full text-center py-2 px-3 bg-black/30 border border-dashed border-gh-border/40 rounded-xl text-xs text-wc-red font-bold font-barlow uppercase tracking-wider">
              {partido.local} — en espera de clasificación
            </div>
          )}
        </div>

        {/* Inputs de Predicción */}
        <div className="md:col-span-2 flex items-center justify-center gap-4">
          {partido.confirmado ? (
            <div className="flex items-center gap-3">
              {/* Local Goals Tactile Control */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={partidoCerrado}
                  onClick={() => {
                    const val = pred.goles_local === '' ? 0 : Math.max(0, parseInt(pred.goles_local) - 1);
                    onChangePrediction(partido.id, 'goles_local', val);
                  }}
                  className="w-7 h-7 flex items-center justify-center bg-black/10 dark:bg-white/5 border border-gh-border rounded-full hover:bg-wc-purple hover:text-white transition-all text-sm font-bold disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit cursor-pointer select-none"
                  aria-label="Disminuir goles local"
                >
                  -
                </button>
                <Input 
                  type="number"
                  min="0"
                  disabled={partidoCerrado}
                  value={pred.goles_local}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : parseInt(e.target.value);
                    onChangePrediction(partido.id, 'goles_local', val);
                  }}
                  placeholder="-"
                  className="w-10 h-10 text-center text-base font-extrabold rounded-lg border border-gh-border focus-visible:border-wc-purple p-0 select-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  disabled={partidoCerrado}
                  onClick={() => {
                    const val = pred.goles_local === '' ? 1 : parseInt(pred.goles_local) + 1;
                    onChangePrediction(partido.id, 'goles_local', val);
                  }}
                  className="w-7 h-7 flex items-center justify-center bg-black/10 dark:bg-white/5 border border-gh-border rounded-full hover:bg-wc-purple hover:text-white transition-all text-sm font-bold disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit cursor-pointer select-none"
                  aria-label="Aumentar goles local"
                >
                  +
                </button>
              </div>

              <span className="text-gh-text-muted font-bold">-</span>

              {/* Visita Goals Tactile Control */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={partidoCerrado}
                  onClick={() => {
                    const val = pred.goles_visita === '' ? 0 : Math.max(0, parseInt(pred.goles_visita) - 1);
                    onChangePrediction(partido.id, 'goles_visita', val);
                  }}
                  className="w-7 h-7 flex items-center justify-center bg-black/10 dark:bg-white/5 border border-gh-border rounded-full hover:bg-wc-purple hover:text-white transition-all text-sm font-bold disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit cursor-pointer select-none"
                  aria-label="Disminuir goles visita"
                >
                  -
                </button>
                <Input 
                  type="number"
                  min="0"
                  disabled={partidoCerrado}
                  value={pred.goles_visita}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : parseInt(e.target.value);
                    onChangePrediction(partido.id, 'goles_visita', val);
                  }}
                  placeholder="-"
                  className="w-10 h-10 text-center text-base font-extrabold rounded-lg border border-gh-border focus-visible:border-wc-purple p-0 select-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  disabled={partidoCerrado}
                  onClick={() => {
                    const val = pred.goles_visita === '' ? 1 : parseInt(pred.goles_visita) + 1;
                    onChangePrediction(partido.id, 'goles_visita', val);
                  }}
                  className="w-7 h-7 flex items-center justify-center bg-black/10 dark:bg-white/5 border border-gh-border rounded-full hover:bg-wc-purple hover:text-white transition-all text-sm font-bold disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit cursor-pointer select-none"
                  aria-label="Aumentar goles visita"
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-gh-text-muted italic">Bloqueado</div>
          )}

          {/* Mostrar Resultado Oficial y Puntos */}
          {partidoCerrado && res && (
            <div className="flex flex-col items-center pl-3 border-l border-gh-border/50">
              <span className="text-[9px] text-gh-text-muted uppercase font-bold tracking-wider">Oficial</span>
              <span className="text-xs font-bold text-white px-2 py-0.5 bg-[#0d1627] rounded-md border border-gh-border">
                {res.goles_local} - {res.goles_visita}
              </span>
              <span className={`text-[9px] font-extrabold mt-1 px-1.5 py-0.2 rounded-sm tracking-wider font-barlow uppercase ${
                puntosGanados === 3 
                  ? 'bg-wc-green/10 border border-wc-green/40 text-wc-green shadow-[0_0_10px_rgba(57,255,20,0.1)]' 
                  : puntosGanados === 1 
                    ? 'bg-wc-purple/10 border border-wc-purple/40 text-wc-purple shadow-[0_0_10px_rgba(140,82,255,0.1)]' 
                    : 'bg-black/30 border border-gh-border text-gh-text-muted'
              }`}>
                {puntosGanados === 3 ? '🏆 3 PTS' : puntosGanados === 1 ? '✅ 1 PT' : '❌ 0 PTS'}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
