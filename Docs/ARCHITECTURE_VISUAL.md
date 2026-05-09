# 🏛️ Arquitectura Visual - Smart Networking

*Diagramas y flujos visuales de la arquitectura del proyecto*

---

## 📊 Flujo General de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                     SMART NETWORKING APP                         │
│                    (React Frontend - Devnet)                     │
└─────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────┐
    │  USUARIO CONECTA WALLET (Phantom/Solflare)                  │
    │  ↓                                                           │
    │  ¿Tiene UserProfile PDA?                                    │
    │  ├─ NO → Ejecutar initialize_config → Crear PDA             │
    │  └─ SÍ → Cargar perfil existente                            │
    └─────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────────┐
    │  DASHBOARD - Usuario elige acciones:                         │
    │  ├─ Ver eventos activos → useEvents()                        │
    │  ├─ Check-in a evento → check_in instruction                │
    │  ├─ Ver perfil → useUserProfile()                           │
    │  ├─ Dar reviews → submit_review instruction                 │
    │  ├─ Ver matches → useMatches() (IA)                         │
    │  └─ Ver NFT badges → NFTBadgeCard component                 │
    └──────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────────┐
    │  BLOCKCHAIN (Solana Devnet)                                  │
    │                                                              │
    │  Todas las instrucciones mutables actualizan PDAs:           │
    │  ├─ initialize_config → Crea UserProfile PDA                │
    │  ├─ create_event → Crea EventConfig PDA                     │
    │  ├─ check_in → Crea Attendance PDA                          │
    │  ├─ submit_review → Crea UserReview PDA                     │
    │  │               → Actualiza reputación                     │
    │  └─ update_reputation → Solo organizador                    │
    └──────────────────────────────────────────────────────────────┘
```

---

## 🏢 Estructura de PDAs (ProgrammableAccount)

```
BLOCKCHAIN SOLANA
│
├─── PROGRAMA: 9yEGhSnNtkW6i6NxmXRniN2BNr6a8AvUxDf69h7DNSCm
│
├─ UserProfile PDAs
│  └─ [Seed: b"profile", userPubkey]
│     ├─ reputation_score (u16)
│     ├─ badges_count (u16)
│     ├─ total_check_ins (u32)
│     ├─ total_reviews_given (u32)
│     ├─ total_reviews_received (u32)
│     ├─ interests_hash ([u8; 32])
│     └─ Costo almacenamiento:
│        ├─ Creación: 0.015 SOL (rent para 2 años)
│        └─ Actualización: Gratis
│
├─ EventConfig PDAs
│  └─ [Seed: b"event", eventId]
│     ├─ organizer (Pubkey) ← Solo puede update_reputation
│     ├─ event_id (String ≤ 64 chars)
│     ├─ name (String ≤ 128 chars)
│     ├─ max_attendees (u32)
│     ├─ current_attendees (u32) ← Incrementa en check_in
│     ├─ is_active (bool)
│     └─ Costo: Similar a UserProfile
│
├─ Attendance PDAs (Muchos)
│  └─ [Seed: b"attendance", eventId, userPubkey]
│     ├─ checked_in (bool) ← Validación para reviews
│     ├─ timestamp (i64)
│     └─ Costo: ~0.0015 SOL por asistencia
│
└─ UserReview PDAs (Muchos)
   └─ [Seed: b"review", eventId, reviewerPubkey, reviewedPubkey]
      ├─ rating (u8: 1-5)
      ├─ comment_hash ([u8; 32]) ← Privacidad
      └─ Costo: ~0.0018 SOL por review
```

---

## 🔄 Ciclo de Vida de un Check-in

```
Usuario en /event/:eventId
│
├─ [EventCard muestra evento]
│
├─ Usuario clickea "Check In"
│  │
│  ├─ Frontend: useCheckIn() → Status: "scanning"
│  │  └─ Simula lectura QR (800ms)
│  │
│  ├─ Frontend: Status: "confirming"
│  │  └─ Simula confirmación TX (1500ms)
│  │  
│  └─ Backend: check_in instruction ejecuta
│     └─ Cuentas que modifica:
│        ├─ EventConfig ← current_attendees++
│        ├─ Attendance (NEW) ← Crea PDA
│        └─ UserProfile ← total_check_ins++, badges_count++
│
└─ Resultado:
   ├─ Status: "success"
   ├─ Usuario recibe TX hash
   ├─ Attendance PDA guardada para validar reviews
   └─ Aparece badge "Checked In" en EventCard
```

---

## ⭐ Flujo de Reviews y Reputación

```
Usuario A y Usuario B ambos check-in en evento X
│
├─ Usuario A va a /event/X/reviews
│
├─ Usuario A selecciona Usuario B
│
├─ Usuario A da rating: ★★★★☆ (4 estrellas)
│  │
│  └─ Frontend: submit_review instruction
│     └─ Validaciones:
│        ├─ ¿A y B ambos check-in? ✓
│        ├─ ¿En el mismo evento? ✓
│        ├─ ¿Rating 1-5? ✓
│        └─ OK → Ejecutar
│
└─ Backend: submit_review procesa
   │
   ├─ Crea UserReview PDA con:
   │  ├─ reviewer: Usuario A
   │  ├─ reviewed_user: Usuario B  
   │  ├─ rating: 4
   │  └─ comment_hash (privado)
   │
   └─ Actualiza UserProfile de Usuario B:
      ├─ total_reviews_received++
      │
      └─ REPUTACIÓN:
         ├─ Si rating >= 4 → reputation_score += 2 (máx 100)
         ├─ Si rating <= 2 → reputation_score -= 1 (mín 0)
         └─ Si rating = 3 → Sin cambio

Resultado:
└─ Usuario B ve su reputación actualizada en Profile
```

---

## 🧲 Flujo de Matching (IA)

```
Usuario en /event/X/matches
│
├─ Frontend: useMatches() hook
│  │
│  └─ Actualmente: Mock data (getMatchesForEvent)
│
├─ Datos enviados a backend IA:
│  ├─ Intereses del usuario A (hash decodificado)
│  ├─ Perfil del usuario A
│  │  └─ reputation_score, badges_count, reviews_received
│  │
│  └─ Otros usuarios en evento X
│     └─ Calcular compatibilidad basada en:
│        ├─ Intereses compartidos
│        ├─ Puntuación reputación
│        ├─ Badges obtenidos
│        └─ Reviews positivos recibidos
│
└─ MatchSuggestion retornado:
   ├─ matchWallet
   ├─ displayName
   ├─ compatibilityScore (0-100%)
   ├─ primaryInterestMatch
   ├─ sharedInterests []
   ├─ suggestedTopic
   ├─ reasoning
   ├─ reputationScore
   ├─ badgesCount
   ├─ isVIP (reputación > 80)
   └─ isNewcomer (total_check_ins < 3)

UI: MatchCard muestra sugerencia
└─ Usuario puede conectar (fuera de cadena)
```

---

## 📂 Árbol de Componentes React

```
App.tsx
│
└─ Routes + Wallets Setup
   │
   ├─ / (Index)
   │  └─ Landing page
   │     ├─ HeroSection
   │     ├─ FeaturesSection
   │     ├─ HowItWorksSection
   │     ├─ CompareSection
   │     └─ CTASection
   │
   ├─ /dashboard (Dashboard)
   │  └─ AppLayout
   │     ├─ Navbar
   │     ├─ [useEvents hook]
   │     ├─ EventCard (iterado)
   │     └─ Filter buttons
   │
   ├─ /event/:id (EventDetail)
   │  └─ AppLayout
   │     ├─ EventCard (expandida)
   │     ├─ [useCheckIn hook]
   │     ├─ Check-in button
   │     └─ Event metadata
   │
   ├─ /event/:id/matches (Matches)
   │  └─ AppLayout
   │     ├─ [useMatches hook]
   │     └─ MatchCard (iteradas)
   │        └─ MatchCard
   │           ├─ Avatar
   │           ├─ ReputationBadge
   │           └─ Compatibility score
   │
   ├─ /event/:id/reviews (Reviews)
   │  └─ AppLayout
   │     ├─ [useReviews hook]
   │     ├─ Review list
   │     └─ StarRating component
   │
   ├─ /profile (Profile)
   │  └─ AppLayout
   │     ├─ [useUserProfile hook]
   │     ├─ User Info
   │     ├─ ReputationBadge
   │     └─ NFTBadgeCard (iteradas)
   │
   └─ * (NotFound)
      └─ 404 page
```

---

## 🔌 Integración Frontend ↔ Blockchain

```
FRONTEND (React)                  BLOCKCHAIN (Solana)
└─ App.tsx
   │
   ├─ WalletProvider
   │  ├─ Network: Devnet
   │  └─ Wallets: [Phantom, Solflare]
   │
   └─ Route handlers
      │
      ├─ useUserProfile
      │  └─ TODO: Fetch UserProfile PDA
      │     └─ Solana RPC → program.account.userProfile.fetch(pda)
      │
      ├─ useEvents
      │  └─ TODO: Fetch todos EventConfig
      │     └─ Solana RPC → program.account.eventConfig.all()
      │
      ├─ useCheckIn
      │  └─ TODO: Ejecutar check_in instruction
      │     └─ program.methods.checkIn(eventId)...rpc()
      │
      │
      ├─ useReviews
      │  └─ TODO: Fetch todos UserReview
      │     └─ Solana RPC → program.account.userReview.all()
      │
      └─ useMatches
         └─ TODO: API backend para IA matching
            └─ POST /api/matches con datos usuario
```

---

## 💾 Modelo de Datos (Espejo PDA)

```
BACKEND (Rust - Anchor)              FRONTEND (TypeScript)
├─ UserProfile struct               ├─ UserProfile interface
│  ├─ user: Pubkey                  │  ├─ wallet: string
│  ├─ reputation_score: u16         │  ├─ reputationScore: number
│  ├─ badges_count: u16             │  ├─ badgesCount: number
│  ├─ total_check_ins: u32          │  ├─ totalCheckIns: number
│  ├─ total_matches: u32            │  ├─ totalMatches: number
│  ├─ total_reviews_given: u32      │  ├─ totalReviewsGiven: number
│  ├─ total_reviews_received: u32   │  ├─ totalReviewsReceived: number
│  ├─ interests_hash: [u8; 32]      │  ├─ interests: string[]
│  ├─ last_updated: i64             │  ├─ lastUpdated: number
│  └─ bump: u8                      │  └─ (sin bump en frontend)
│
├─ EventConfig struct               ├─ EventConfig interface
│  ├─ organizer: Pubkey             │  ├─ organizer: string
│  ├─ event_id: String              │  ├─ eventId: string
│  ├─ name: String                  │  ├─ name: string
│  ├─ max_attendees: u32            │  ├─ maxAttendees: number
│  ├─ current_attendees: u32        │  ├─ attendeesCount: number
│  ├─ is_active: bool               │  ├─ status: 'upcoming'|'live'|'past'
│  ├─ created_at: i64               │  └─ createdAt: number
│  └─ bump: u8                      │
│
└─ (Similar para Attendance,        └─ (Similar para Attendance,
   UserReview)                         UserReview)
```

---

## 🔐 Security & Permission Model

```
INSTRUCCIÓN          PERMISO REQUERIDO      MODIFICA PDAs
─────────────────────────────────────────────────────────────
initialize_config    User signer            → UserProfile (new)
create_event         Organizer signer       → EventConfig (new)
check_in             User signer            → EventConfig
                                              Attendance (new)
                                              UserProfile
submit_review        Reviewer signer        → UserReview (new)
                     + booth checked-in     → Reviewer Profile
                                              Reviewed Profile
update_reputation    Organizer of event    → Profile
                     signer                  (solo admin)
```

---

## 🚀 Límites y Restricciones

```
CAMPO                    LÍMITE          RAZÓN
─────────────────────────────────────────────────────────────
event_id                 ≤ 64 chars      Limitar PDA size
event_name               ≤ 128 chars     Limitar PDA size
reputation_score         0-100           Balance económico
rating                   1-5             Escala estándar
interests_hash           [u8; 32]        Privacidad (off-chain)
comment_hash             [u8; 32]        Privacidad (off-chain)
max_attendees            > 0 && < u32    Validez evento
```

---

## 📊 Flujo de Costos (Rent)

```
TRANSACCIÓN              COSTO               DESCRIPCIÓN
───────────────────────────────────────────────────────────
initialize_config        ~0.015 SOL (rent)   Crear UserProfile PDA
create_event             ~0.0165 SOL         Crear EventConfig PDA
check_in                 ~0.0015 SOL         Crear Attendance PDA
submit_review            ~0.0018 SOL         Crear UserReview PDA
update_reputation        ~0.000005 SOL       Solo update, no storage

Total para flujo completo:
Usuario nuevo:           ~0.025 SOL  (initialize + check-in + review)
User existente:          ~0.0033 SOL  (check-in + review)
Evento:                  ~0.0165 SOL  (create_event)

Notas:
- Todo es de pago ÚNICO (rent de 2 años en cadena)
- Updates no cuestan extra
- Solana Devnet tiene air-drops gratis
```

---

## 🔄 Estados de Transacción (UX Loop)

```
┌─────────────────────────────────────────────────────────────┐
│ CheckInStatus State Machine                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  IDLE ──────┐                                               │
│             ↓                                               │
│  SCANNING (800ms - QR scan simulation)                     │
│             ↓                                               │
│  CONFIRMING (1500ms - TX confirmation)                     │
│             ├─ Si TX OK →  SUCCESS (muestra hash)          │
│             └─ Si error → ERROR (muestra mensaje)          │
│                             ↓                               │
│                          [Reset]                            │
│                             ↓                               │
│                            IDLE                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Dependencias Principales

```
FRONTEND                          BACKEND
├─ @solana/web3.js               ├─ anchor-lang ~0.30
│  └─ RPC, wallets                 └─ Programa Anchor
│
├─ @solana/wallet-adapter-react  ├─ solana-program
│  └─ Conexión wallets             └─ Syscalls Solana
│
├─ React 18                       ├─ spl-token
│  └─ UI framework                 └─ Token transfers (si necesario)
│
├─ TypeScript                     └─ spl-memo
│  └─ Type safety                    └─ Memo (si necesario)
│
├─ Tailwind CSS
│  └─ Styling
│
├─ Radix UI
│  └─ Components
│
└─ Vite
   └─ Build tool
```

---

## 🎯 User Journey Map

```
Usuario nuevo                          Usuario existente
│                                      │
├─ Visita landing (/)                 ├─ Conect wallet
│  ├─ Ve features                     ├─ Automático a /dashboard
│  ├─ Se registra (signup)            │
│  │  └─ initialize_config → PDA       │
│  └─ Redirige a /dashboard           │
│                                      │
├─ Ve eventos disponibles             ├─ Ve eventos activos
│  ├─ EventCard muestra:              │  └─ Filtra por status
│  │  ├─ Nombre                       │
│  │  ├─ Fecha/hora                   │
│  │  ├─ Ubicación                    │
│  │  ├─ Asistentes                   │
│  │  └─ Status (live/upcoming)       │
│  │                                  │
│  └─ Clickea evento →                └─ Clickea evento →
│     /event/:id                         /event/:id
│                                      │
├─ Ve detalle evento                  ├─ Ve detalle evento
│  ├─ Botón "Check In"                │  ├─ Botón "Check In"
│  └─ Clickea → Ejecuta instruction   │  └─ Ejecuta instruction →
│     → check_in()                    │     Attendance PDA
│     → TX hash recibido               │
│     → Aparece "Checked In"           │     Aparece "Checked In"
│                                      │
├─ Ve /event/:id/matches              ├─ Ve /event/:id/matches
│  ├─ useMatches() → AI ←──────────┐   │  ├─ Sugerencias compatibles
│  ├─ Muestra compatibilidad        │   │  ├─ Reputación usuarios
│  └─ Puede conectar                │   │  └─ Puede conectar
│                                    │   │
├─ Va a /event/:id/reviews           ├─ Va a /event/:id/reviews
│  ├─ Selecciona usuario             │  ├─ Busca usuario
│  ├─ Da rating ★★★★☆              │  ├─ Da rating
│  ├─ submit_review() →              │  ├─ submit_review() →
│  │  └─ Reputación se actualiza     │  │  └─ Profile actualizado
│  └─ Review guardada                │  └─ Review guardada
│                                      │
└─ Va a /profile                       └─ Va a /profile
   ├─ Ve su reputación                   ├─ Reputación actualizada
   ├─ Ve badges obtenidos                ├─ Nuevos badges?
   └─ Puede editar intereses             └─ Puede editar intereses
```

---

**Última actualización:** Mayo 2026  
**Última revisión:** Arquitectura actual (Q2 2026)
