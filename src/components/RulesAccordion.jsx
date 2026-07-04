import React from 'react';
import { HelpCircle, Clock } from 'lucide-react';
import { Accordion, AccordionItem } from '@heroui/react';

export default function RulesAccordion() {
  return (
    <Accordion variant="splitted" className="px-0 w-full">
      <AccordionItem 
        key="rules-item" 
        aria-label="Reglamento de Puntos" 
        title={
          <span className="flex items-center gap-2 text-wc-purple font-barlow tracking-wider font-semibold text-sm">
            <HelpCircle size={16} /> SISTEMA DE PUNTUACIÓN Y REGLAS
          </span>
        }
        className="border border-gh-border bg-gh-bg-light rounded-xl overflow-hidden shadow-xs"
      >
        <div className="p-4 pt-1 space-y-3 text-xs leading-relaxed text-gh-text">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-wc-green/10 border border-wc-green/30 rounded-xl text-left">
              <span className="font-extrabold text-wc-green flex items-center gap-1.5 mb-1 tracking-wider uppercase font-barlow">
                🏆 3 Puntos
              </span>
              Marcador exacto. Ejemplo: predices 2-1 y termina 2-1.
            </div>
            <div className="p-3 bg-wc-purple/10 border border-wc-purple/30 rounded-xl text-left">
              <span className="font-extrabold text-wc-purple flex items-center gap-1.5 mb-1 tracking-wider uppercase font-barlow">
                ✅ 1 Punto
              </span>
              Aciertas ganador/empate pero no el marcador. Ejemplo: predices 1-0 y termina 3-0.
            </div>
            <div className="p-3 bg-wc-red/10 border border-wc-red/30 rounded-xl text-left">
              <span className="font-extrabold text-wc-red flex items-center gap-1.5 mb-1 tracking-wider uppercase font-barlow">
                ❌ 0 Puntos
              </span>
              No aciertas ganador, empate ni marcador.
            </div>
          </div>
          
          <div className="pt-3.5 border-t border-gh-border flex flex-col sm:flex-row justify-between gap-2 text-gh-text-muted font-medium">
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-wc-purple" /> Solo cuentan los 90 minutos reglamentarios (sin prórrogas/penales).
            </span>
            <span className="flex items-center gap-1.5 text-wc-red font-bold">
              ⚠️ Quien no envíe predicciones antes de un partido será retirado.
            </span>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
}
