-- ====================================================================
-- SCHEMA DE LA POLLA MUNDIALISTA 2026 (OCTAVOS DE FINAL)
-- ====================================================================

-- 1. Tabla de Grupos (Familias)
CREATE TABLE IF NOT EXISTS grupos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    codigo TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla de Usuarios
-- Contiene las columnas es_admin (gestor del grupo) y es_master (administrador del sistema)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Nota: Para uso de amigos. Puedes usar hash en producción.
    grupo_id UUID REFERENCES grupos(id) ON DELETE SET NULL,
    es_admin BOOLEAN DEFAULT false, -- Gestor único por familia
    es_master BOOLEAN DEFAULT false, -- Administrador supremo
    suspendido BOOLEAN DEFAULT false, -- Suspender miembro de grupo
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Alter table statement for existing databases to prevent migration crashes
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS suspendido BOOLEAN DEFAULT false;

-- 3. Tabla de Resultados Oficiales
-- El admin/gestor registra el marcador real aquí. Aplica globalmente.
CREATE TABLE IF NOT EXISTS resultados (
    partido_id TEXT PRIMARY KEY, -- 'octavo_a', 'octavo_b', etc.
    goles_local INTEGER,
    goles_visita INTEGER,
    cerrado BOOLEAN DEFAULT false,
    ganador_nombre TEXT,
    fecha_cierre TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabla de Predicciones de Usuarios
-- Cada usuario guarda sus marcadores pronosticados aquí.
CREATE TABLE IF NOT EXISTS predicciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    partido_id TEXT NOT NULL,
    goles_local INTEGER,
    goles_visita INTEGER,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (usuario_id, partido_id)
);

-- Indices para mejorar velocidad de cruces y búsquedas
CREATE INDEX IF NOT EXISTS idx_usuarios_grupo ON usuarios(grupo_id);
CREATE INDEX IF NOT EXISTS idx_predicciones_usuario ON predicciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_predicciones_partido ON predicciones(partido_id);

-- Semilla: Usuario Master Inicial
-- Puedes cambiar las credenciales de ingreso para el usuario supremo.
INSERT INTO usuarios (nombre, username, password, es_master)
VALUES ('Administrador Master', 'master', 'master123', true)
ON CONFLICT (username) DO NOTHING;
