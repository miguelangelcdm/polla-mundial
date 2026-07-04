import React from 'react';
import { Trophy, Star, ArrowRight, Sun, Moon } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Tabs } from '@heroui/react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function AuthCard({ 
  authTab, 
  setAuthTab,
  loginForm, 
  setLoginForm,
  joinForm, 
  setJoinForm,
  onLogin,
  onRegister,
  theme,
  toggleTheme
}) {
  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-gh-bg transition-all duration-300 relative overflow-y-auto lg:overflow-hidden lg:p-5 gap-6">
      
      {/* Imagen de fondo difuminada en móviles como textura de agua (marca de agua limpia) */}
      <img 
        src="/assets/family.jpg" 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover opacity-15 dark:opacity-25 lg:hidden z-0 pointer-events-none"
      />

      {/* --- SECCIÓN IZQUIERDA: IMAGEN FAMILIAR LIMPIA (TARJETA FLOTANTE - Oculta en móviles ya que va de fondo) --- */}
      <div className="hidden lg:block lg:w-[45%] h-full shrink-0 relative overflow-hidden rounded-3xl border border-gh-border bg-slate-100 dark:bg-slate-900 shadow-md z-10">
        <img 
          src="/assets/family.jpg" 
          alt="Familia Celebrando el Mundial" 
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* --- SECCIÓN DERECHA: TEXTOS Y ELEMENTOS DE ACCESO --- */}
      <div className="w-full lg:w-[55%] flex flex-col justify-between p-6 sm:p-8 lg:p-4 relative z-10 min-h-[500px] lg:h-full lg:overflow-y-auto">
        {/* Top Header del Formulario: Logo y Toggle de Tema */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-wc-purple/10 border border-wc-purple/35 rounded-xl shadow-xs">
              <Trophy className="text-wc-yellow" size={20} />
            </div>
            <span className="text-lg font-black font-barlow text-gh-text tracking-widest uppercase">
              POLLA<span className="text-wc-green font-bold">2026</span>
            </span>
          </div>

          {/* Botón de Conmutación de Tema */}
          <Button 
            type="button"
            variant="outline" 
            size="icon" 
            onClick={toggleTheme}
            className="rounded-full w-9 h-9 border-gh-border bg-gh-bg-light hover:bg-gh-bg-active"
            title={theme === 'dark' ? "Modo Claro" : "Modo Oscuro"}
          >
            {theme === 'dark' ? <Sun size={15} className="text-wc-yellow" /> : <Moon size={15} className="text-wc-purple" />}
          </Button>
        </div>

        {/* Contenido Central: Textos Resumidos y Tarjeta de Login */}
        <div className="my-auto max-w-md w-full mx-auto space-y-6">
          {/* Textos Resumidos e Integrados */}
          <div className="text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-wc-purple/10 border border-wc-purple/20 rounded-full text-[10px] text-wc-purple font-bold tracking-wider uppercase font-barlow">
              🏆 Octavos de Final Mundial 2026
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-barlow text-gh-text leading-tight tracking-wide uppercase">
              ¡Siente el Mundial en Familia!
            </h1>
            <p className="text-xs text-gh-text-muted leading-relaxed font-medium">
              Pronostica los marcadores reales de octavos de final de la Copa del Mundo, acumula puntos y compite por el podio de tu familia.
            </p>
          </div>

          {/* Formulario de Login en Tarjeta de Cristal Claro/Oscuro */}
          <Card className="w-full shadow-2xl border-gh-border overflow-hidden">
            <CardContent className="p-6">
              <Tabs 
                selectedKey={authTab} 
                onSelectionChange={setAuthTab}
                variant="solid"
                color="secondary"
                fullWidth
              >
                <Tabs.ListContainer className="w-full">
                  <Tabs.List 
                    className="w-full rounded-full bg-black/5 dark:bg-[#161b22]/50 p-1 border border-gh-border gap-1 relative"
                    aria-label="Opciones de acceso"
                  >
                    <Tabs.Tab 
                      id="login"
                      className="group max-w-full px-4 h-9 text-xs font-bold font-barlow tracking-wider uppercase cursor-pointer rounded-full"
                    >
                      <span className="group-data-[selected=true]:text-white text-gh-text-muted transition-colors duration-200">
                        INGRESAR
                      </span>
                      <Tabs.Indicator className="bg-wc-purple rounded-full shadow-md w-full h-full" />
                    </Tabs.Tab>

                    <Tabs.Tab 
                      id="register"
                      className="group max-w-full px-4 h-9 text-xs font-bold font-barlow tracking-wider uppercase cursor-pointer rounded-full"
                    >
                      <span className="group-data-[selected=true]:text-white text-gh-text-muted transition-colors duration-200">
                        REGISTRARSE
                      </span>
                      <Tabs.Indicator className="bg-wc-purple rounded-full shadow-md w-full h-full" />
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>

                <Tabs.Panel id="login">
                  <div className="mt-6">
                    <form onSubmit={onLogin} className="space-y-6">
                      <Input 
                        type="text" 
                        label="Usuario"
                        labelPlacement="outside"
                        placeholder="Ej: migue"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                      />
                      <Input 
                        type="password" 
                        label="Contraseña"
                        labelPlacement="outside"
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      />
                      <Button 
                        type="submit" 
                        variant="neon-blue"
                        className="w-full h-11 mt-6 flex items-center justify-center gap-2 rounded-full text-sm font-bold shadow-lg"
                      >
                        INGRESAR A LA POLLA <ArrowRight size={16} />
                      </Button>
                    </form>
                  </div>
                </Tabs.Panel>

                <Tabs.Panel id="register">
                  <div className="mt-6">
                    <form onSubmit={onRegister} className="space-y-6">
                      <Input 
                        type="text" 
                        label="Tu Nombre Completo"
                        labelPlacement="outside"
                        placeholder="Ej: Miguel Alejo"
                        value={joinForm.nombre}
                        onChange={(e) => setJoinForm({...joinForm, nombre: e.target.value})}
                      />
                      <Input 
                        type="password" 
                        label="Contraseña"
                        labelPlacement="outside"
                        placeholder="••••••••"
                        value={joinForm.password}
                        onChange={(e) => setJoinForm({...joinForm, password: e.target.value})}
                      />
                      <Button 
                        type="submit" 
                        variant="neon-blue"
                        className="w-full h-11 mt-6 rounded-full text-sm font-bold shadow-lg"
                      >
                        CREAR CUENTA
                      </Button>
                    </form>
                  </div>
                </Tabs.Panel>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Footer removed */}
      </div>
    </div>
  );
}
