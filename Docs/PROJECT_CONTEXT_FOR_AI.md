# Smart Networking - Contexto Completo para IAs

**Última actualización:** Mayo 2026  
**Tipo de Proyecto:** dApp Solana + React (Networking eventos blockchain)

---

## 📋 Resumen Ejecutivo

**Smart Networking** es una plataforma descentralizada para hacer networking en eventos. Permite:
- Crear y gestionar eventos
- hacer Check-in en eventos (genera NFTs)
- Sistema de reputación basado en reviews
- Matching inteligente entre asistentes
- Gestión de perfiles en cadena (Solana PDAs)

**Stack:**
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Blockchain:** Solana + Anchor (programa Rust)
- **Wallets:** Phantom, Solflare
- **UI:** Radix UI (componentes sin-server)

---

## 🏗️ Arquitectura General

```
Smart-Networking/
├── Frontend (React/TS)
│   ├── src/
│   │   ├── App.tsx (Router principal)
│   │   ├── pages/ (7 páginas de la app)
│   │   ├── components/ (Componentes reutilizables)
│   │   ├── hooks/ (Integraciones con blockchain)
│   │   └── lib/ (Utilidades y data mock)
│   └── package.json
│
├── Contrato (Anchor/Rust)
│   ├── contracts/programs/workspace/src/lib.rs
│   ├── contracts/Anchor.toml
│   └── contracts/target/idl/workspace.json
│
└── Documentación
    └── Ai-Usage/ (Registro de cambios por IA)
```

---

## 🔗 CONTRATO ANCHOR (Blockchain)

### 📍 Ubicación
`/workspaces/Smart-Networking-/contracts/programs/workspace/src/lib.rs`

### 🎯 Instrucciones Principales

#### 1️⃣ `initialize_config`
**Crea perfil de usuario**
```rust
pub fn initialize_config(ctx, interests_hash: [u8; 32]) -> Result<()>
```
- **Entrada:** Hash de intereses del usuario (32 bytes)
- **PDA:** `seeds = [b"profile", user_pubkey]`
- **Inicializa:** Puntuación reputación = 50, badges = 0
- **Ubicación de modificación:** Línea ~25

#### 2️⃣ `create_event`
**Organiza un evento**
```rust
pub fn create_event(ctx, event_id: String, name: String, max_attendees: u32) -> Result<()>
```
- **Entrada:** ID evento, nombre, límite de asistentes
- **PDA:** `seeds = [b"event", event_id]`
- **Validaciones:** event_id ≤ 64 chars, name ≤ 128, max_attendees > 0
- **Ubicación de modificación:** Línea ~33

#### 3️⃣ `check_in`
**Usuario entra a evento**
```rust
pub fn check_in(ctx, event_id: String) -> Result<()>
```
- **Crea cuenta:** Attendance PDA
- **Validaciones:** Evento activo, no lleno
- **Actualiza:** Profile (total_check_ins++, badges_count++)
- **Ubicación de modificación:** Línea ~50

#### 4️⃣ `submit_review`
**User deja review de otro usuario**
```rust
pub fn submit_review(ctx, event_id: String, rating: u8, comment_hash: [u8; 32]) -> Result<()>
```
- **Validaciones:** Rating 1-5, ambos check-in
- **Lógica reputación:** rating ≥ 4 → +2 puntos, rating ≤ 2 → -1 punto
- **Ubicación de modificación:** Línea ~68

#### 5️⃣ `update_reputation`
**Admin actualiza reputación (solo organizador)**
```rust
pub fn update_reputation(ctx, event_id: String, new_score: u16) -> Result<()>
```
- **Permisos:** Solo organizador del evento
- **Rango:** 0-100
- **Ubicación de modificación:** Línea ~103

### 📊 Estructuras de Datos (PDAs)

#### UserProfile
```rust
pub struct UserProfile {
    pub user: Pubkey,               // Wallet del usuario
    pub reputation_score: u16,      // 0-100
    pub badges_count: u16,          // NFTs ganados
    pub total_check_ins: u32,
    pub total_matches: u32,
    pub total_reviews_given: u32,
    pub total_reviews_received: u32,
    pub interests_hash: [u8; 32],   // Hash de intereses (fuera de cadena)
    pub last_updated: i64,          // Unix timestamp
    pub bump: u8,                   // PDA bump
}
```
**PDA Seed:** `[b"profile", user_pubkey]`  
**Ubicación:** Línea ~197

#### EventConfig
```rust
pub struct EventConfig {
    pub organizer: Pubkey,
    pub event_id: String,           // ≤ 64 chars
    pub name: String,               // ≤ 128 chars
    pub max_attendees: u32,
    pub current_attendees: u32,
    pub is_active: bool,
    pub created_at: i64,
    pub bump: u8,
}
```
**PDA Seed:** `[b"event", event_id]`  
**Ubicación:** Línea ~181

#### Attendance
```rust
pub struct Attendance {
    pub user: Pubkey,
    pub event_id: String,           // ≤ 64 chars
    pub checked_in: bool,
    pub timestamp: i64,
    pub bump: u8,
}
```
**PDA Seed:** `[b"attendance", event_id, user_pubkey]`  
**Ubicación:** Línea ~215

#### UserReview
```rust
pub struct UserReview {
    pub reviewer: Pubkey,
    pub reviewed_user: Pubkey,
    pub event_id: String,           // ≤ 64 chars
    pub rating: u8,                 // 1-5
    pub comment_hash: [u8; 32],     // Hash del comentario (fuera de cadena)
    pub timestamp: i64,
    pub bump: u8,
}
```
**PDA Seed:** `[b"review", event_id, reviewer_pubkey, reviewed_pubkey]`  
**Ubicación:** Línea ~225

### ⚠️ Códigos de Error
```rust
EventNotActive, EventFull, InvalidRating, ReputationOverflow,
NotCheckedIn, Unauthorized, InvalidReputationScore, InvalidParameter, MathOverflow
```
**Ubicación:** Línea ~235

### 🔐 Seguridad - Stack Overflow Check
- `submit_review` tiene 8 cuentas (máximo Solana)
- 0 CPIs (Cross Program Invocations)

---

## 🎨 FRONTEND (React)

### 📂 Estructura de Componentes

#### Páginas (`src/pages/`)
| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `Index.tsx` | Landing page | Mock data |
| `Dashboard.tsx` | Panel principal del usuario | Mock data |
| `EventDetail.tsx` | Detalle de un evento | Mock data |
| `Matches.tsx` | Sugerencias de networking IA | Mock data |
| `Reviews.tsx` | Historial de reviews | Mock data |
| `Profile.tsx` | Perfil del usuario | Mock data |
| `NotFound.tsx` | Error 404 | — |

**Ubicación:** `/src/pages/`

#### Componentes Reutilizables (`src/components/`)

**Core UI Components:**
```
AppLayout.tsx     - Contenedor principal (navbar + sidebar)
Navbar.tsx        - Barra de navegación
Footer.tsx        - Pie de página
WalletGuard.tsx   - HOC para requerer wallet conectada
```

**Feature Components:**
```
EventCard.tsx            - Tarjeta de evento
MatchCard.tsx            - Sugerencia de match (para networking)
ReputationBadge.tsx      - Display de puntuación reputación
NFTBadgeCard.tsx         - Display de NFT badges ganados
StarRating.tsx           - Widget de rating 1-5 estrellas
```

**Landing Page:**
```
HeroSection.tsx          - Banner principal
FeaturesSection.tsx      - Características
HowItWorksSection.tsx    - Explicación del flujo
CompareSection.tsx       - Comparativa de features
CTASection.tsx           - Call-to-action
```

**UI de Radix:** `/src/components/ui/*.tsx` (30+ componentes sin-servidor)

### 🎣 Hooks Principales (`src/hooks/`)

#### useUserProfile()
**Obtiene perfil del usuario conectado**
```typescript
const { profile, loading, connected } = useUserProfile()
// profile: UserProfile | null
```
- **Estado:** Mock data (línea ~40)
- **TODO:** Reemplazar con llamada PDA real: `program.account.userProfile.fetch(pda)`
- **Ubicación:** `src/hooks/useUserProfile.ts`

#### useEvents()
**Obtiene eventos y estado de asistencia**
```typescript
const { events, liveEvents, upcomingEvents, pastEvents, isCheckedIn, loading } = useEvents()
// isCheckedIn(eventId: string) => boolean
```
- **Estado:** Mock data
- **TODO:** Reemplazar con:
  - `program.account.eventConfig.all()` para eventos
  - `program.account.attendance.all()` para asistencias
- **Ubicación:** `src/hooks/useEvents.ts`

#### useMatches(eventId)
**Obtiene sugerencias de matching IA**
```typescript
const { matches, loading } = useMatches(eventId)
// matches: MatchSuggestion[]
```
- **Estado:** Mock data
- **TODO:** Integrar con API de IA para calcular compatibilidad
- **Ubicación:** `src/hooks/useMatches.ts`

#### useCheckIn()
**Simula el flujo de check-in**
```typescript
const { status, txHash, error, checkIn, reset } = useCheckIn()
// status: 'idle' | 'scanning' | 'confirming' | 'success' | 'error'
```
- **Estados:** Scanning QR → Confirming TX → Success/Error
- **TODO:** Reemplazar con llamada a `check_in` instruction
- **Ubicación:** `src/hooks/useCheckIn.ts`

#### useReviews(eventId)
**Obtiene reviews de un evento**
```typescript
const { reviews, loading } = useReviews(eventId)
```
- **Estado:** Mock data
- **Ubicación:** `src/hooks/useReviews.ts`

### 🔌 Configuración Blockchain (`src/App.tsx`)

```typescript
const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];
```

- **Red:** Devnet
- **Wallets:** Phantom, Solflare
- **Conexión:** `@solana/wallet-adapter-react`
- **Ubicación:** `src/App.tsx` línea ~6-25

### 💫 Data Mock (`src/lib/mockData.ts`)

**Interfaces espejo de PDAs:**
```typescript
export interface UserProfile { /* ... */ }
export interface EventConfig { /* ... */ }
export interface Attendance { /* ... */ }
export interface UserReview { /* ... */ }
export interface MatchSuggestion { /* ... */ }
export interface NFTBadge { /* ... */ }
```

**Mock Wallets:**
```typescript
const MOCK_WALLETS = {
  self: '9B4bE2wK7mPxJr8dF3nQ1hYtR6vG5cXs2aL8jN0fWpDq',
  alice, bob, charlie, diana, evan, // (para testing)
}
```

- **Ubicación:** `src/lib/mockData.ts`
- **Proposito:** Facilitar UI testing antes de integración blockchain real

---

## 🔄 Flujos de Usuario Principales

### 1. Onboarding (Nuevo Usuario)
```
1. Usuario conecta wallet (Phantom/Solflare)
2. Es redirigido a /dashboard
3. Si no existe profile → llamar initialize_config (costo: ~0.015 SOL)
4. useUserProfile() carga su profile PDA
5. Puede ver eventos en Dashboard
```
**Modificar si necesitas:** Cambiar lógica de onboarding → `src/pages/Dashboard.tsx`

### 2. Check-in en Evento
```
1. Usuario ve evento en Dashboard
2. Clickea en evento → /event/:eventId
3. Escanea QR o clickea botón check-in
4. useCheckIn() → Se ejecuta check_in instruction
5. Recibe TX hash y NFT badge
6. Attendance PDA se crea con checked_in=true
```
**Modificar si necesitas:** Lógica check-in → `src/hooks/useCheckIn.ts` + `submit_check_in` instruction

### 3. Dar Review
```
1. Ambos usuarios han hecho check-in en mismo evento
2. Usuario va a /event/:eventId/reviews
3. Selecciona usuario → ★★★★★
4. Se ejecuta submit_review instruction
5. Puntuación reputación se actualiza automáticamente
6. Review PDA se crea
```
**Modificar si necesitas:** Lógica reviews → `src/pages/Reviews.tsx` + `submit_review` instruction

### 4. Matching (Networking IA)
```
1. Usuario en evento clickea "Find Matches"
2. Va a /event/:eventId/matches
3. useMatches() busca sugerencias compatibles
4. Muestra: compatibilidad %, intereses compartidos, reputación
5. Usuario puede conectar vía mensajes (fuera de cadena)
```
**Modificar si necesitas:** Lógica matching → `src/hooks/useMatches.ts` (integrar API externa)

---

## 🔧 GUÍA DE MODIFICACIONES FRECUENTES

### 🆕 Agregar Nueva Instrucción en Contrato

**Pasos:**
1. Editar `/contracts/programs/workspace/src/lib.rs`
   - Agregar función pub fn en module `#[program] pub mod workspace`
   - Crear Context struct con `#[derive(Accounts)]`
   - Definir validaciones y lógica (línea ~25-130)
2. Agregar cuenta si necesita PDA nueva (línea ~150-240)
3. Agregar error code si falta (línea ~235)
4. Rebuild:
   ```bash
   cd contracts && anchor build
   ```
5. Actualizar IDL: `target/idl/workspace.json` se regenera automáticamente

**Ejemplo mínimo:**
```rust
pub fn my_instruction(
    ctx: Context<MyContext>,
    param: String,
) -> Result<()> {
    let my_account = &mut ctx.accounts.my_account;
    // tu lógica
    Ok(())
}

#[derive(Accounts)]
pub struct MyContext<'info> {
    #[account(init, seeds = [b"my_seed"], bump, payer = payer, space = 8 + MyData::LEN)]
    pub my_account: Account<'info, MyData>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct MyData {
    pub field1: u32,
}
impl MyData { pub const LEN: usize = 4; }
```

### ➕ Agregar Nuevo Hook

**Ubicación:** `src/hooks/useMyFeature.ts`

**Estructura:**
```typescript
import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export function useMyFeature() {
  const { publicKey, connected } = useWallet();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!connected || !publicKey) return;
    
    // TODO: Reemplazar fetch de PDA o llamada RPC aquí
    setLoading(true);
    // const account = await program.account.myData.fetch(pda);
    // setData(account);
    setLoading(false);
  }, [connected, publicKey]);

  const myAction = useCallback(async (params) => {
    try {
      // TODO: Ejecutar instrucción aquí
      // const tx = await program.methods.myInstruction(params)...
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  return { data, loading, error, myAction };
}
```

### 🎨 Agregar Nueva Página

**Ubicación:** `src/pages/MyPage.tsx`

**Estructura:**
```typescript
import React from 'react';
import AppLayout from '@/components/AppLayout';
import WalletGuard from '@/components/WalletGuard';

const MyPage: React.FC = () => {
  return (
    <AppLayout>
      <WalletGuard>
        {/* Tu contenido aquí */}
      </WalletGuard>
    </AppLayout>
  );
};

export default MyPage;
```

**Luego agregar ruta en `src/App.tsx`:**
```typescript
<Route path="/my-page" element={<MyPage />} />
```

### 🔗 Integrar Llamada Real a Blockchain

**Patrón general (from mock to real):**

**Estado Actual (mock):**
```typescript
// src/hooks/useMyData.ts
useEffect(() => {
  const timer = setTimeout(() => {
    setData(mockData); // ← MOCK
    setLoading(false);
  }, 300);
}, []);
```

**Estado Real (con Anchor):**
```typescript
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAnchorProgram } from '@/lib/useAnchorProgram'; // (crear este hook si no existe)

useEffect(() => {
  if (!connected || !publicKey) return;
  
  (async () => {
    try {
      setLoading(true);
      const program = useAnchorProgram();
      // Opción 1: Fetch un PDA específico
      const pda = PublicKey.findProgramAddressSync(
        [Buffer.from("profile"), publicKey.toBuffer()],
        program.programId
      )[0];
      const account = await program.account.userProfile.fetch(pda);
      setData(account);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  })();
}, [connected, publicKey]);
```

### 🎯 Modificar Validación en Contrato

**Ubicación:** `contracts/programs/workspace/src/lib.rs` línea ~33-45

**Ejemplo - hacer evento privado:**
```rust
require!(organizer == ctx.accounts.user.key(), ErrorCode::Unauthorized); // Agregar esta línea
let event = &mut ctx.accounts.event_config;
```

### 🏆 Cambiar Lógica de Reputación

**Ubicación:** `contracts/programs/workspace/src/lib.rs` línea ~98-103

**Actual:**
```rust
if rating >= 4 {
    reviewed_profile.reputation_score = reviewed_profile.reputation_score.saturating_add(2).min(100);
} else if rating <= 2 {
    reviewed_profile.reputation_score = reviewed_profile.reputation_score.saturating_sub(1);
}
```

**Para cambiar algoritmo:** Modificar valores (+2, -1) o agregar más condiciones

### 🎭 Cambiar UI de Componente

**Ubicación:** `src/components/EventCard.tsx` (ejemplo)

**Estructura del componente:**
```typescript
export interface EventCardProps {
  event: EventConfig;
  isCheckedIn?: boolean;
}

// Render: JSX con Tailwind + Radix
```

**Para modificar:**
- Cambiar clases Tailwind: Línea ~25-60
- Cambiar estructura JSX: Reorganizar secciones
- Agregar campos: Pasar nuevas props desde componente padre

---

## 📚 Referencias de Código Por Tarea

| Tarea | Ubicación | Cambios |
|-------|-----------|---------|
| Crear instrucción | `contracts/programs/.../lib.rs` | Agregar fn + Context struct |
| Crear hook | `src/hooks/useXxx.ts` | Nuevos archivos |
| Crear página | `src/pages/MyPage.tsx` | Nuevos archivos + ruta en App.tsx |
| Cambiar validación | `contracts/programs/.../lib.rs:35` | `require!()` calls |
| Cambiar reputación | `contracts/programs/.../lib.rs:98` | Lógica de puntos |
| Agregar campo a PDA | `contracts/programs/.../lib.rs:181+` | Struct definition |
| Cambiar UI | `src/components/EventCard.tsx` | Clases Tailwind, JSX |
| Integrar blockchain | `src/hooks/useXxx.ts` | Reemplazar mock con `program.methods` |
| Agregar validación UI | `src/pages/MyPage.tsx` | Condicionales React, error handling |

---

## 🚀 Configuración Local

```bash
# Frontend
npm install
npm run dev          # http://localhost:5173

# Contrato
cd contracts
anchor build         # Compila programa
anchor deploy        # Deploy a devnet
anchor test          # Tests unitarios (si existen)

# Generar tipos TypeScript desde IDL
npm run build:anchor # (si existe en package.json)
```

**Archivo de configuración Anchor:** `contracts/Anchor.toml`  
**Ruta IDL generado:** `contracts/target/idl/workspace.json`

---

## 🔐 Consideraciones de Seguridad

1. **Validació de entrada:** Todos los `String` tienen límites (64-128 bytes)
2. **PDA Seeds:** Siempre incluyen pubkey del usuario para evitar conflicts
3. **Permisos:** `require!()` checks para autor/organizador
4. **Overflow:** Usar `saturating_*` o `checked_add` para aritmética
5. **Comentarios hash:** Reviews usan hash del comentario (puede almacenarse off-chain)
6. **Intereses hash:** Profile usa hash de intereses (privacidad)

---

## 📖 Notas Importantes

- **Mock Data:** Todos los hooks retornan data mock actualmente
- **IDL:** Se regenera automáticamente al hacer `anchor build`
- **Bump seeds:** Todos los PDAs incluyen bump para derivación segura
- **Red:** Devnet (usar `solana-cli` para clusterapi query)
- **Costos:** Cada transacción cuesta ~0.00025 SOL (negligible)
- **Wallet:** Guardar público en localStorage seguro; privada nunca

---

## 💬 Estructura de Decisiones

Las decisiones de arquitectura se documentan en: `/workspaces/Smart-Networking-/Ai-Usage/`

Cada sesión de IA crea un archivo con:
- Problemas encontrados
- Decisiones tomadas
- Cambios dependencias
- Status de integración

---

## 🎯 Próximas Integraciones (TODO)

1. **Reemplazar todos los hooks con llamadas reales a Anchor**
2. **Agregar programa de IA para matching (backend API)**
3. **Agregar sistema de mensajes entre usuarios**
4. **Agregar NFT minting automático en check-in**
5. **Agregar filtros de búsqueda avanzada en eventos**
6. **Agregar gamificación (badges, leaderboards)**

---

**Pregunta de referencia rápida:** ¿Dónde modifico X?
- ✅ Instrucción blockchain → `contracts/programs/workspace/src/lib.rs`
- ✅ Hook usario → `src/hooks/useXxx.ts`
- ✅ Página → `src/pages/MyPage.tsx`
- ✅ Componente UI → `src/components/MyComponent.tsx`
- ✅ Rutas → `src/App.tsx`
- ✅ Data/colores → Tailwind en componentes
- ✅ Lógica validación → `require!()` en Rust
