# 🗂️ Guía Rápida de Archivos - Smart Networking

*Un mapa visual para encontrar exactamente dónde modificar según tu tarea*

---

## 📍 ÍNDICE RÁPIDO POR TAREA

### 🔧 Necesito Hacer Cambios en BLOCKCHAIN (Solana/Anchor)

```
📂 contracts/programs/workspace/src/lib.rs ← ARCHIVO PRINCIPAL

└─ Instrucciones (pub fn) ........................ Línea 25-130
   ├─ initialize_config() ........................ Línea ~25
   ├─ create_event() ............................ Línea ~33
   ├─ check_in() ............................... Línea ~50
   ├─ submit_review() .......................... Línea ~68
   └─ update_reputation() ....................... Línea ~103

└─ Structs de Contexto (Cuentas) ............... Línea 150-180
   ├─ InitializeConfig ......................... Línea ~150
   ├─ CreateEvent ............................. Línea ~157
   ├─ CheckIn ................................. Línea ~166
   ├─ SubmitReview ............................ Línea ~180
   └─ UpdateReputation ......................... Línea ~217

└─ Structs de Datos (PDAs) ..................... Línea 181-235
   ├─ EventConfig ............................. Línea ~181
   ├─ UserProfile ............................. Línea ~197
   ├─ Attendance .............................. Línea ~215
   └─ UserReview .............................. Línea ~225

└─ Códigos de Error ............................ Línea ~235
```

**Tareas comunes BLOCKCHAIN:**
- ✏️ Agregar campo a UserProfile → Modifica struct + `.LEN`
- ✏️ Cambiar lógica validación → Modifica `require!()` statements
- ✏️ Cambiar algoritmo reputación → Línea ~98-103
- ✏️ Crear nueva instrucción → Copiar estructura `check_in` como plantilla
- 🔨 Compilar cambios → `cd contracts && anchor build`

---

### 🎨 Necesito Hacer Cambios en FRONTEND (React/UI)

```
📂 src/
├─ App.tsx ....................................... Router principal
│  └─ Network setup: Devnet, Phantom/Solflare wallets (Línea 6-25)

├─ pages/ ......................................... Pantallas principales
│  ├─ Index.tsx ................................... Landing page
│  ├─ Dashboard.tsx ................................ Panel de eventos
│  ├─ EventDetail.tsx .............................. Detalle evento
│  ├─ Matches.tsx .................................. Sugerencias networking
│  ├─ Reviews.tsx .................................. Historial reviews
│  ├─ Profile.tsx .................................. Perfil usuario
│  └─ NotFound.tsx ................................. Error 404

├─ components/ ..................................... Componentes reutilizables
│  ├─ AppLayout.tsx ................................ Contenedor principal
│  ├─ Navbar.tsx ................................... Barra navegación
│  ├─ EventCard.tsx ................................ Tarjeta evento (UI)
│  ├─ MatchCard.tsx ................................ Tarjeta matching
│  ├─ ReputationBadge.tsx ........................... Display reputación
│  ├─ NFTBadgeCard.tsx .............................. Display NFT badges
│  ├─ StarRating.tsx ................................ Rating 1-5 estrellas
│  ├─ WalletGuard.tsx ............................... HOC requiere wallet
│  └─ ui/ ............................................ 30+ componentes sin-servidor
│     └─ button.tsx, card.tsx, dialog.tsx, etc.

├─ hooks/ .......................................... Lógica estado/blockchain
│  ├─ useUserProfile.ts ............................ Obtiene perfil usuario
│  ├─ useEvents.ts ................................. Obtiene eventos
│  ├─ useMatches.ts ................................ Sugerencias IA matching
│  ├─ useCheckIn.ts ................................ Flujo check-in
│  ├─ useReviews.ts ................................ Obtiene reviews
│  └─ use-toast.ts .................................. Toast notifications

└─ lib/ ...........................................Utilidades
   ├─ mockData.ts .................................. Data mock (reemplazar aquí)
   └─ utils.ts ..................................... Funciones útiles
```

**Tareas comunes FRONTEND:**
- ✏️ Cambiar colores/estilos → Modifica clases Tailwind en componentes (src/components/)
- ✏️ Agregar campo a formulario → Edita página correspondiente en src/pages/
- ✏️ Cambiar layout → Modifica AppLayout.tsx o Navbar.tsx
- ✏️ Agregar nueva página → Crear src/pages/MyPage.tsx + ruta en App.tsx
- ✏️ Crear nuevo hook → Crear src/hooks/useMyFeature.ts

---

## 📋 MAPA POR FUNCIONALIDAD

### 🎟️ Sistema de EVENTOS

**Ver/listar eventos:**
```
src/pages/Dashboard.tsx       ← Página que muestra eventos
   ↓
src/hooks/useEvents.ts        ← Hook que obtiene datos
   ↓
src/lib/mockData.ts           ← Data mock (reemplazar aquí)
   ↓
src/components/EventCard.tsx  ← Renderiza cada evento UI
```

**Crear evento:**
```
0. Solo organizador → src/pages/Dashboard.tsx (botón crear)
1. Llamar instrucción: create_event 
   → contracts/programs/workspace/src/lib.rs:33
```

---

### ✅ Sistema de CHECK-IN

**UI check-in:**
```
src/pages/EventDetail.tsx      ← Botón "Check In"
   ↓
src/hooks/useCheckIn.ts        ← Hook simula flujo (scanning → confirming → success)
   ↓
contracts/.../lib.rs:50        ← check_in() instruction (TODO: conectar)
```

**Modificar flujo:**
- UI: Edita `src/pages/EventDetail.tsx`
- Lógica check-in: `src/hooks/useCheckIn.ts` línea ~17
- Contrato: `contracts/.../lib.rs` línea ~50

---

### ⭐ Sistema de REVIEWS

**Dar review:**
```
src/pages/Reviews.tsx          ← Página reviews
   ↓
useReviews() hook              ← Obtiene reviews existentes
   ↓
StarRating component           ← Selecciona rating 1-5
   ↓
submit_review instruction      ← contracts/.../lib.rs:68
   ↓
Reputación se actualiza        ← Lógica línea ~98-103
```

**Cambiar lógica reputación:**
- Archivo: `contracts/programs/workspace/src/lib.rs`
- Línea: ~98-103
- Cambiar: `saturating_add(2)` y `saturating_sub(1)`

---

### 🧲 Sistema de MATCHING (IA)

**Obtener sugerencias:**
```
src/pages/Matches.tsx          ← Muestra matches sugeridos
   ↓
src/hooks/useMatches.ts        ← Hook obtiene sugerencias (actualmente mock)
   ↓
src/lib/mockData.ts            ← Data simulada
   ↓
src/components/MatchCard.tsx   ← Renderiza cada match
```

**Integrar IA real:**
- Archivo: `src/hooks/useMatches.ts` línea ~9
- Reemplazar setTimeout con: `const matches = await callMyAIBackend(eventId)`

---

### 👤 PERFIL DE USUARIO

**Ver perfil:**
```
src/pages/Profile.tsx          ← Página perfil
   ↓
src/hooks/useUserProfile.ts    ← Hook obtiene datos (mock actualmente)
   ↓
UserProfile PDA                ← contracts/.../lib.rs:197
   ↓
Display componentes:
  - src/components/ReputationBadge.tsx
  - src/components/NFTBadgeCard.tsx
```

**Campos perfil:**
```
UserProfile {
  user: Pubkey,
  reputation_score: 0-100,
  badges_count,
  total_check_ins,
  total_matches,
  total_reviews_given,
  total_reviews_received,
  interests_hash: [u8; 32],
  last_updated: i64,
  bump: u8
}
```

---

## 🔌 INTEGRACIÓN BLOCKCHAIN (Paso a Paso)

### Estado Actual: TODO (Mock Data)
```
Todos los hooks retornan mockData después de delay simulado
├─ useUserProfile.ts ......... línea ~28
├─ useEvents.ts .............. línea ~10
├─ useMatches.ts ............. línea ~8
├─ useCheckIn.ts ............. línea ~13
└─ useReviews.ts ............. similar
```

### Para Integrar Cada Hook:

**1. useUserProfile.ts**
```typescript
// AHORA: mockUserProfile (línea 28-30)
// CAMBIAR A:
import { useAnchorProgram } from './useAnchorProgram';

const pda = PublicKey.findProgramAddressSync(
  [Buffer.from("profile"), publicKey.toBuffer()],
  program.programId
)[0];
const profile = await program.account.userProfile.fetch(pda);
```

**2. useEvents.ts**
```typescript
// AHORA: mockEvents (línea 10-12)
// CAMBIAR A:
const events = await program.account.eventConfig.all();
const attendances = await program.account.attendance.all();
```

**3. useMatches.ts**
```typescript
// AHORA: getMatchesForEvent() mock (línea 11)
// CAMBIAR A:
const matches = await fetch('/api/matches?eventId=' + eventId)
  .then(r => r.json());
```

**4. useCheckIn.ts**
```typescript
// AHORA: setTimeout simulado (línea 17-21)
// CAMBIAR A:
const tx = await program.methods
  .checkIn(eventId)
  .accounts({
    eventConfig: eventPda,
    attendance: attendancePda,
    profile: profilePda,
    user: publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

---

## 📦 ARCHIVOS CONFIGURACIÓN

```
📂 Blockchain config:
├─ contracts/Anchor.toml         ← Config programa Anchor
├─ contracts/Cargo.toml          ← Dependencias Rust
└─ contracts/idl/workspace.json  ← Tipos generados (NO editar manualmente)

📂 Frontend config:
├─ package.json                  ← Dependencias npm + scripts
├─ tsconfig.json                 ← Configuración TypeScript
├─ vite.config.ts                ← Bundler Vite
├─ tailwind.config.js            ← Temas Tailwind CSS
└─ eslint.config.js              ← Linter
```

---

## 🎯 REFERENCIA RÁPIDA SUPER CORTA

| Quiero... | Edito... | Línea aprox |
|-----------|----------|-----------|
| Nueva instrucción blockchain | `contracts/.../lib.rs` | ~25-130 |
| Cambiar validación | `contracts/.../lib.rs` | ~35 |
| Cambiar reputación | `contracts/.../lib.rs` | ~98-103 |
| Cambiar UI evento | `src/components/EventCard.tsx` | ~25-85 |
| Nueva página | `src/pages/MyPage.tsx` | nuevo + `App.tsx` |
| Nuevo hook | `src/hooks/useXxx.ts` | nuevo |
| Configurar red | `src/App.tsx` | ~8 |
| Data para testing | `src/lib/mockData.ts` | todo el archivo |
| Routing | `src/App.tsx` | ~28-36 |
| Colores/estilos | `tailwind.config.js` | todo el archivo |

---

## 🚀 COMANDOS ÚTILES

```bash
# FRONTEND
npm install              # Instalar dependencias
npm run dev             # Dev server (http://localhost:5173)
npm run build           # Build producción
npm run lint            # Lint código

# BLOCKCHAIN
cd contracts
anchor build            # Compilar programa
anchor deploy           # Deploy a devnet
anchor test             # Tests (si existen)
anchor idl init <id>    # Inicializar IDL

# Solana CLI
solana config get       # Ver configuración
solana balance          # Ver balance SOL
solana airdrop 2        # 2 SOL gratis (devnet)
```

---

## 🔑 PUNTOS CLAVE A RECORDAR

1. **Todo es PDA:** UserProfile, EventConfig, Attendance, UserReview todos usan seeds
2. **Mock data ahora:** Todos los hooks retornan mock, necesitan integración
3. **Red = Devnet:** No mainnet, es safe para testing
4. **Wallets:** Solo Phantom/Solflare (modificable en App.tsx)
5. **Limite de campos:** event_id ≤ 64 chars, name ≤ 128 chars
6. **Reputación 0-100:** No puede exceder ese rango
7. **Bump seeds:** Todos los PDAs tienen bump para derivacion segura
8. **Interfaces frontenda son espejos de estructuras Rust**

---

**Última actualización:** Mayo 2026  
**Versión contexto:** 1.0
