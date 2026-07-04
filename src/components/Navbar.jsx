import React from 'react';
import { Trophy, User, LogOut, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';

export default function Navbar({ 
  currentUser, 
  onLogout, 
  theme, 
  toggleTheme,
  activeTab,
  setActiveTab,
  activeAdminTab,
  setActiveAdminTab
}) {
  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-40 bg-gh-bg-light/80 backdrop-blur-md border-b border-gh-border transition-all duration-300 transition-theme">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo y Nombre del grupo */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-wc-purple/10 border border-wc-purple/35 rounded-xl shadow-xs">
            <Trophy className="text-wc-yellow shrink-0" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gh-text-muted uppercase tracking-wider font-semibold">
              {currentUser.es_master ? 'Administrador Supremo' : 'Grupo Activo'}
            </span>
            <span className="text-sm font-bold font-barlow text-gh-text tracking-wider uppercase">
              {currentUser.es_master 
                ? 'PANEL MASTER GLOBAL' 
                : (currentUser.grupo_nombre ? currentUser.grupo_nombre : 'SIN GRUPO')
              }
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation for Gestors/Masters */}
        {currentUser && !currentUser.es_master && currentUser.es_admin && currentUser.grupo_id && (
          <div className="hidden md:flex items-center gap-1 bg-[#0d1627]/5 dark:bg-[#0d1627]/40 border border-gh-border p-1 rounded-full backdrop-blur-md">
            <button 
              onClick={() => setActiveTab('predicciones')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider font-barlow cursor-pointer transition-all ${
                activeTab === 'predicciones' 
                  ? 'bg-wc-purple text-white shadow-md' 
                  : 'text-gh-text-muted hover:text-gh-text'
              }`}
            >
              PREDICCIONES
            </button>
            <button 
              onClick={() => {
                setActiveTab('admin');
                setActiveAdminTab('grupo_gestor');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider font-barlow cursor-pointer transition-all ${
                activeTab === 'admin' 
                  ? 'bg-wc-red text-white shadow-md' 
                  : 'text-gh-text-muted hover:text-gh-text'
              }`}
            >
              MI FAMILIA
            </button>
          </div>
        )}



        {/* Controles de Usuario */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-[#0d1627]/5 border dark:bg-[#0d1627]/60 border-gh-border rounded-lg py-1 px-3">
            <User size={13} className="text-wc-green" />
            <span className="text-xs text-gh-text font-medium">{currentUser.nombre}</span>
            {currentUser.es_admin && (
              <span className="px-1.5 py-0.5 bg-wc-green/10 border border-wc-green/30 rounded-sm text-[9px] text-wc-green font-bold tracking-wider uppercase font-barlow">
                GESTOR
              </span>
            )}
            {currentUser.es_master && (
              <span className="px-1.5 py-0.5 bg-wc-purple/10 border border-wc-purple/30 rounded-sm text-[9px] text-wc-purple font-bold tracking-wider uppercase font-barlow">
                MASTER
              </span>
            )}
          </div>

          {/* Toggle de Tema */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="rounded-full w-8 h-8 hover:bg-gh-bg-active"
            title={theme === 'dark' ? "Modo Claro" : "Modo Oscuro"}
          >
            {theme === 'dark' ? <Sun size={15} className="text-wc-yellow" /> : <Moon size={15} className="text-wc-purple" />}
          </Button>

          {/* Logout */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onLogout}
            className="text-gh-text-muted hover:text-gh-text flex items-center gap-1.5 text-xs hover:bg-gh-bg-active"
          >
            <LogOut size={14} className="text-wc-red" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
