import React from 'react';
import { Trophy } from 'lucide-react';
import { Card } from './ui/card';

export default function Leaderboard({ tablaPosiciones, currentUserId }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gh-border pb-3">
        <h2 className="text-2xl font-bold font-barlow text-white tracking-wider flex items-center gap-2">
          <Trophy size={20} className="text-wc-yellow" />
          POSICIONES
        </h2>
        <span className="text-xs text-gh-text-muted">Grupo Local</span>
      </div>

      <Card className="overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#0d1627]/60 border-b border-gh-border flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-barlow">
            Participantes ({tablaPosiciones.length})
          </span>
          <span className="text-[10px] text-gh-text-muted uppercase">Puntos · Exactos</span>
        </div>

        <div className="divide-y divide-gh-border/50">
          {tablaPosiciones.length === 0 ? (
            <div className="p-6 text-center text-xs text-gh-text-muted italic">
              Aún no hay predicciones calculadas. Los resultados oficiales deben ser cerrados.
            </div>
          ) : (
            tablaPosiciones.map((row, index) => {
              const esTu = row.usuario_id === currentUserId;
              const esTop3 = index < 3;
              const medallas = ['🥇', '🥈', '🥉'];

              return (
                <div 
                  key={row.usuario_id}
                  className={`p-3 flex items-center justify-between text-xs transition-all ${
                    esTu 
                      ? 'bg-wc-green/5 border-l-2 border-wc-green font-semibold' 
                      : 'hover:bg-[#21262d]/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Medallas o Posición */}
                    <span className="w-6 text-center font-bold font-barlow text-sm">
                      {esTop3 ? medallas[index] : `${index + 1}`}
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
            })
          )}
        </div>
      </Card>
    </div>
  );
}
