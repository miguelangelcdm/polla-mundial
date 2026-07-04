import React from 'react';
import { Star, Trophy, Settings, Globe, Crown } from 'lucide-react';

export default function MobileNav({ currentUser, activeTab, setActiveTab, activeAdminTab, setActiveAdminTab }) {
  if (!currentUser) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gh-bg-light/95 border-t border-gh-border p-2 backdrop-blur-md md:hidden transition-theme">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {!currentUser.es_master ? (
          <>
            <button 
              onClick={() => setActiveTab('predicciones')}
              className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold tracking-wider font-barlow transition-all cursor-pointer ${
                activeTab === 'predicciones' ? 'text-neon-blue' : 'text-gh-text-muted hover:text-gh-text'
              }`}
            >
              <Star size={18} />
              <span>PREDICCIONES</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('tabla')}
              className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold tracking-wider font-barlow transition-all cursor-pointer ${
                activeTab === 'tabla' ? 'text-neon-blue' : 'text-gh-text-muted hover:text-gh-text'
              }`}
            >
              <Trophy size={18} />
              <span>POSICIONES</span>
            </button>

            {currentUser.es_admin && (
              <button 
                onClick={() => {
                  setActiveTab('admin');
                  setActiveAdminTab('grupo_gestor');
                }}
                className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold tracking-wider font-barlow transition-all cursor-pointer ${
                  activeTab === 'admin' ? 'text-neon-pink' : 'text-gh-text-muted hover:text-gh-text'
                }`}
              >
                <Settings size={18} />
                <span>ADMIN</span>
              </button>
            )}
          </>
        ) : (
          <>
            <button 
              onClick={() => {
                setActiveTab('master');
                setActiveAdminTab('grupos_master');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold tracking-wider font-barlow transition-all cursor-pointer ${
                activeAdminTab === 'grupos_master' ? 'text-neon-blue' : 'text-gh-text-muted hover:text-gh-text'
              }`}
            >
              <Globe size={18} />
              <span>GRUPOS</span>
            </button>
            
            <button 
              onClick={() => {
                setActiveTab('master');
                setActiveAdminTab('gestores_master');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold tracking-wider font-barlow transition-all cursor-pointer ${
                activeAdminTab === 'gestores_master' ? 'text-neon-blue' : 'text-gh-text-muted hover:text-gh-text'
              }`}
            >
              <Crown size={18} />
              <span>GESTORES</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('master');
                setActiveAdminTab('resultados');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold tracking-wider font-barlow transition-all cursor-pointer ${
                activeAdminTab === 'resultados' ? 'text-neon-blue' : 'text-gh-text-muted hover:text-gh-text'
              }`}
            >
              <Trophy size={18} />
              <span>RESULTADOS</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
