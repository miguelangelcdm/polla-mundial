import React from 'react';
import { Trophy } from 'lucide-react';
import { Card } from './ui/card';

export default function Leaderboard({ tablaPosiciones, currentUserId }) {
  const top3 = tablaPosiciones.slice(0, 3);
  const restOfUsers = tablaPosiciones.slice(3);

  // Arrange top 3 for podium display: [2nd, 1st, 3rd]
  const podiumUsers = [];
  if (top3[1]) podiumUsers.push({ ...top3[1], place: 2, medal: '🥈', color: 'border-slate-400/30 bg-slate-400/5 text-slate-300', height: 'h-28' }); // 2nd
  if (top3[0]) podiumUsers.push({ ...top3[0], place: 1, medal: '🥇', color: 'border-wc-yellow/40 bg-wc-yellow/10 text-wc-yellow shadow-[0_0_15px_rgba(251,197,49,0.1)]', height: 'h-32 z-10' }); // 1st
  if (top3[2]) podiumUsers.push({ ...top3[2], place: 3, medal: '🥉', color: 'border-amber-700/30 bg-amber-700/5 text-amber-600', height: 'h-24' }); // 3rd

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gh-border pb-3">
        <h2 className="text-2xl font-bold font-barlow text-white tracking-wider flex items-center gap-2">
          <Trophy size={20} className="text-wc-yellow" />
          POSICIONES
        </h2>
        <span className="text-xs text-gh-text-muted">Grupo Local</span>
      </div>

      <Card className="overflow-hidden shadow-2xl transition-theme">
        <div className="p-4 bg-[#0d1627]/60 border-b border-gh-border flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-barlow">
            Participantes ({tablaPosiciones.length})
          </span>
          <span className="text-[10px] text-gh-text-muted uppercase">Puntos · Exactos</span>
        </div>

        {/* Podium section for Top 3 */}
        {tablaPosiciones.length > 0 && podiumUsers.length > 0 && (
          <div className="flex items-end justify-center gap-2 sm:gap-4 pt-8 pb-5 bg-gradient-to-t from-black/10 to-transparent border-b border-gh-border/50 px-2 transition-theme">
            {podiumUsers.map((usr) => {
              const esTu = usr.usuario_id === currentUserId;
              return (
                <div 
                  key={usr.usuario_id}
                  className={`w-[30%] max-w-[110px] rounded-t-2xl border flex flex-col items-center justify-end p-2 sm:p-3 text-center transition-all duration-300 relative ${usr.color} ${usr.height} hover:scale-[1.03]`}
                >
                  {/* Medal Icon Badge */}
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xl drop-shadow-md select-none">
                    {usr.medal}
                  </span>

                  {/* Avatar Circle */}
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-black border ${
                    esTu ? 'border-wc-green bg-wc-green/20 text-white' : 'border-gh-border bg-[#0d1627] text-gh-text-muted'
                  }`}>
                    {usr.nombre.substring(0, 2).toUpperCase()}
                  </div>

                  {/* Name */}
                  <div className="mt-2 w-full">
                    <div className="flex items-center justify-center gap-1 max-w-full">
                      <p className="text-[10px] sm:text-xs font-bold text-white truncate max-w-[80%] leading-tight">
                        {usr.nombre.split(' ')[0]}
                      </p>
                      {esTu && (
                        <span className="px-1 py-0.2 bg-wc-green/10 border border-wc-green/40 rounded-xs text-[7px] text-wc-green font-extrabold tracking-widest leading-none shrink-0">
                          TÚ
                        </span>
                      )}
                    </div>
                    <p className="text-[8px] text-gh-text-muted font-mono leading-none mt-0.5">
                      @{usr.username}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="mt-2.5 pt-1 border-t border-gh-border/30 w-full">
                    <span className="text-xs sm:text-sm font-black font-barlow tracking-wider text-wc-yellow block">
                      {usr.puntos} PTS
                    </span>
                    <span className="text-[8px] text-gh-text-muted uppercase block leading-none mt-0.5">
                      {usr.exactos} exac
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List of remaining participants */}
        <div className="divide-y divide-gh-border/50">
          {tablaPosiciones.length === 0 ? (
            <div className="p-6 text-center text-xs text-gh-text-muted italic">
              Aún no hay predicciones calculadas. Los resultados oficiales deben ser cerrados.
            </div>
          ) : (
            <>
              {tablaPosiciones.map((row, index) => {
                const esTu = row.usuario_id === currentUserId;
                const realIndex = index;

                return (
                  <div 
                    key={row.usuario_id}
                    className={`p-3 flex items-center justify-between text-xs transition-all transition-theme ${
                      esTu 
                        ? 'bg-wc-green/5 border-l-2 border-wc-green font-semibold' 
                        : 'hover:bg-[#21262d]/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Position Rank */}
                      <span className="w-6 text-center font-bold font-barlow text-sm text-gh-text-muted">
                        {realIndex + 1}
                      </span>

                      {/* Nombre / Username */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-white font-medium text-xs">{row.nombre}</span>
                          {esTu && (
                            <span className="px-1.5 py-0.2 bg-wc-green/10 border border-wc-green/40 rounded-sm text-[9px] text-wc-green font-extrabold tracking-widest leading-none">
                              TÚ
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gh-text-muted font-mono">@{row.username}</span>
                      </div>
                    </div>

                    {/* Stats / Columnas */}
                    <div className="flex items-center gap-4 text-right">
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] text-gh-text-muted uppercase font-bold">Exac</span>
                        <span className="font-bold text-white">{row.exactos}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] text-gh-text-muted uppercase font-bold">Gan</span>
                        <span className="font-bold text-white">{row.ganador}</span>
                      </div>
                      <div className="pl-3 border-l border-gh-border/50 flex flex-col items-center">
                        <span className="text-[9px] text-wc-green uppercase font-bold">Pts</span>
                        <span className="font-bold text-wc-yellow font-barlow text-sm leading-none">{row.puntos}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
