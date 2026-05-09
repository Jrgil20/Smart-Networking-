# ⚡ CheatSheet - Smart Networking

*Referencia de una página para acceso ultra-rápido*

---

## 🎯 QUÉ-DÓNDE INSTANTÁNEO

| QUÉ QUIERO HACER | DÓNDE | LÍNEA APROX | TIEMPO |
|---|---|---|---|
| Ver todas las instrucciones | `contracts/.../lib.rs` | 25-130 | 10s |
| Agregar instrucción nueva | `contracts/.../lib.rs` | +135 | 5m |
| Cambiar validación | `contracts/.../lib.rs` | 35-45 | 2m |
| Cambiar reputación | `contracts/.../lib.rs` | 98-103 | 3m |
| Agregar campo PDA | `contracts/.../lib.rs` | 197+ | 5m |
| Ver todas las páginas | `src/pages/` | Todos | 2s |
| Agregar página | `src/pages/MyPage.tsx` | NUEVO | 5m |
| Cambiar UI evento | `src/components/EventCard.tsx` | 25-85 | 3m |
| Agregar componente | `src/components/MyComp.tsx` | NUEVO | 5m |
| Ver todos los hooks | `src/hooks/` | Todos | 2s |
| Agregar hook | `src/hooks/useXxx.ts` | NUEVO | 5m |
| Cambiar mock data | `src/lib/mockData.ts` | TODO | 10m |
| Integrar blockchain | `src/hooks/useXxx.ts` | LINE 7-30 | 15m |
| Agregar ruta | `src/App.tsx` | 28-36 | 2m |

---

## 📂 ESTRUCTURA MÍNIMA

```
BLOCKCHAIN                          FRONTEND
contracts/.../lib.rs               src/pages/Dashboard.tsx
├─ initialize_config()             ├─ useUserProfile()
├─ create_event()                  ├─ useEvents()
├─ check_in()                      └─ EventCard component
├─ submit_review()
└─ update_reputation()             src/hooks/useXxx.ts
                                   └─ [Tu hook aquí]
Cuentas (PDAs)                     Componentes
├─ [b"profile", user]              ├─ src/components/
├─ [b"event", event_id]            └─ [Tu componente]
├─ [b"attendance", ...]
└─ [b"review", ...]
```

---

## 🔑 KEYWORDS CLAVE

```
BLOCKCHAIN (Rust)
├─ Instruction = pub fn
├─ Context = #[derive(Accounts)]
├─ Account = #[account] struct
├─ PDA = PublicKey.findProgramAddressSync([seeds])
├─ Error = #[error_code] pub enum
└─ Validation = require!(condition, ErrorCode)

FRONTEND (React)
├─ Page = React.FC component en src/pages/
├─ Component = React.FC en src/components/
├─ Hook = export function use* en src/hooks/
├─ Type = interface { fields }
├─ State = useState<Type>()
└─ Effect = useEffect(() => {}, [deps])
```

---

## 🚀 COMANDOS CRÍTICOS

```bash
# Dev
npm run dev              # Dev server on :5173
npm run build            # Build producción
npm run lint             # Check errors

# Blockchain
anchor build             # Compilar programa
anchor deploy            # Deploy devnet
anchor test              # Tests

# Utils
npm install              # Instalar deps
solana balance           # Ver SOL
solana airdrop 2         # 2 SOL devnet
```

---

## 🔀 FLUJOS IMPORTANTES

```
USER → WALLET → INITIALIZE → PROFILE PDA
USER → EVENT → CHECK-IN → ATTENDANCE PDA + PROFILE UPDATE
USER → REVIEW → SUBMIT → REVIEW PDA + REPUTATION UPDATE
USER → PROFILE → SHOW → ReputationBadge + NFTBadges
```

---

## 📊 PDAs QUICK LOOKUP

```
[b"profile", userPubkey]           → UserProfile
[b"event", eventId]                → EventConfig  
[b"attendance", eventId, user]     → Attendance
[b"review", eventId, reviewer, reviewed] → UserReview
```

---

## 🧵 REACT HOOKS QUICK LOOKUP

```
useUserProfile()      → { profile, loading, connected }
useEvents()           → { events, liveEvents, isCheckedIn(), loading }
useMatches(eventId)   → { matches, loading }
useCheckIn()          → { status, txHash, checkIn(), reset() }
useReviews(eventId)   → { reviews, loading }
useWallet()           → { publicKey, connected, sendTransaction }
useConnection()       → { connection }
```

---

## 🎨 COMPONENTE TEMPLATE (COPY-PASTE)

```typescript
// src/components/MyComp.tsx
import React from 'react';
import { Card } from '@/components/ui/card';

interface Props { title: string }

const MyComp: React.FC<Props> = ({ title }) => (
  <Card className="p-4">
    <h2>{title}</h2>
  </Card>
);

export default MyComp;
```

---

## 🪝 HOOK TEMPLATE (COPY-PASTE)

```typescript
// src/hooks/useMyData.ts
import { useState, useEffect } from 'react';

export function useMyData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData({/* mock data */});
      setLoading(false);
    }, 300);
  }, []);

  return { data, loading };
}
```

---

## 📄 INSTRUCCIÓN TEMPLATE (COPY-PASTE)

```rust
// contracts/.../lib.rs
pub fn my_instruction(
    ctx: Context<MyContext>,
    param: String,
) -> Result<()> {
    let account = &mut ctx.accounts.account;
    require!(param.len() > 0, ErrorCode::InvalidParameter);
    account.field = param;
    Ok(())
}

#[derive(Accounts)]
pub struct MyContext<'info> {
    #[account(init, seeds = [b"seed"], bump, payer = payer, space = 8 + Data::LEN)]
    pub account: Account<'info, Data>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Data { pub field: String }
impl Data { pub const LEN: usize = 4 + 64; }
```

---

## 🔍 BÚSQUEDA RÁPIDA

**Necesito entender:** `PROJECT_CONTEXT_FOR_AI.md`  
**Necesito ubicación:** `QUICK_REFERENCE.md`  
**Necesito código:** `CODE_TEMPLATES.md`  
**Necesito visual:** `ARCHITECTURE_VISUAL.md`  
**Necesito guía:** `CONTEXT_GUIDE_FOR_AI.md` (este archivo)  

---

## ⚙️ CONFIGURACIÓN CLAVE

```
Network:     Devnet
Program ID:  9yEGhSnNtkW6i6NxmXRniN2BNr6a8AvUxDf69h7DNSCm
Wallets:     Phantom, Solflare
Frontend:    React 18 + Vite + Tailwind
Blockchain:  Solana + Anchor 0.30
```

---

## ✅ CHECKLIST PRE-COMMIT

- [ ] Compila: `npm run build && anchor build`
- [ ] Lint limpio: `npm run lint`
- [ ] Probado en devnet manualmente
- [ ] Documentación actualizada
- [ ] Registro en `Ai-Usage/` creado
- [ ] Commits descriptivos

---

## 🐛 ERRORES COMUNES & FIXES

| Error | Causa | Fix |
|---|---|---|
| Account not found | PDA derivation wrong | Verifica seeds exactos |
| Insufficient funds | Usuario sin SOL | `solana airdrop 2` |
| Instruction encode error | Parámetros tipo incorrecto | Verifica tipos String/u32 |
| Stack limits exceeded | Demasiadas cuentas | ≤ 8 cuentas por instrucción |
| Compilation error | Cambios Rust | `anchor build` nuevamente |

---

## 📱 FILE SIZES REFERENCE

| Archivo | Tipo | Tamaño PDA |
|---------|------|-----------|
| UserProfile | Account | 93 bytes |
| EventConfig | Account | 256 bytes |
| Attendance | Account | 107 bytes |
| UserReview | Account | 133 bytes |

---

## 🎯 VALIDATION SNIPPETS

```rust
// String max length
require!(param.len() <= 64, ErrorCode::InvalidParameter);

// Number range
require!(score >= 0 && score <= 100, ErrorCode::InvalidScore);

// Pubkey match
require!(ctx.accounts.user.key() == expected, ErrorCode::Unauthorized);

// Bool check
require!(event.is_active, ErrorCode::EventNotActive);
require!(attendee.checked_in, ErrorCode::NotCheckedIn);
```

---

## 💚 UI COMPONENTS AVAILABLE

```
Button, Card, Dialog, Input, Select, Avatar, Badge,
Alert, Skeleton, Toast, Tooltip, Tabs, Accordion,
Dropdown, Sidebar, Form, Checkbox, Radio, Switch,
Textarea, Label, Popover, Sheet, Calendar, Carousel,
...+ 30 más en src/components/ui/
```

---

## 📦 POPULAR REGEX PATTERNS

```bash
# Encuentra todas las instrucciones
grep -n "pub fn" contracts/programs/workspace/src/lib.rs

# Encuentra todo PDA seeds
grep -n "seeds =" contracts/programs/workspace/src/lib.rs

# Encuentra todos requires
grep -n "require!" contracts/programs/workspace/src/lib.rs

# Encuentra componentes export
grep -n "export" src/components/*.tsx
```

---

## 🔐 SECURITY CHECKLIST

- [ ] ¿Validas entrada? (`require!()`)
- [ ] ¿Verificas permisos? (`signer` checks)
- [ ] ¿Prevines exploit? (PDA seeds correctas)
- [ ] ¿Maneja overflow? (`saturating_*`, `checked_*`)
- [ ] ¿Privacidad OK? (hashes de datos sensibles)

---

## 📚 QUICK LINKS EN CÓDIGO

```
Program ID:           lib.rs:2
initialize_config:    lib.rs:~25
create_event:         lib.rs:~33
check_in:             lib.rs:~50
submit_review:        lib.rs:~68
update_reputation:    lib.rs:~103
UserProfile struct:   lib.rs:~197
EventConfig struct:   lib.rs:~181
Error codes:          lib.rs:~235
App router:           src/App.tsx:~28
useUserProfile:       src/hooks/useUserProfile.ts
useEvents:            src/hooks/useEvents.ts
useMatches:           src/hooks/useMatches.ts
```

---

## 🎲 MOCK DATA QUICK ACCESS

```typescript
// MOCK_WALLETS
self:     '9B4bE2wK7mPxJr8dF3nQ1hYtR6vG5cXs2aL8jN0fWpDq'
alice:    '7xJ9kL2MnOpQrStUvWxYz1A3bC4dE5fG6hI7jK8lM9nO'
bob:      '4pR7sT0uVwXyZ1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT'
charlie:  '2mN8oP9qR0sT1uV2wX3yZ4aB5cD6eF7gH8iJ9kL0mN'

// mockEvents, mockAttendances, mockMatches
// Ver src/lib/mockData.ts para todos
```

---

## 🔗 VERSIONADO

```
Network:       Devnet
Anchor:        ~0.30.0
Solana Web3:   ^1.98.2
React:         18
TypeScript:    5.x
Node:          18+
```

---

## 💬 COMMITS ÚTILES

```
feat(blockchain): add new instruction
fix(frontend): correct check-in flow
refactor(ui): clean components
docs: update context docs
chore: update dependencies
```

---

## 🚨 ANTES DE PUSHEAR

```bash
npm run build        # Frontend
anchor build         # Blockchain  
npm run lint         # Linter
# Manualmente testear en devnet
# Actualizar documentación
git add .
git commit -m "feat(X): descripción"
git push
```

---

**Última actualización:** Mayo 2026  
**Minuto en que lo necesites:** Este archivo  
**Tiempo de lectura:** 3 minutos  
**Valor:** ⭐⭐⭐⭐⭐
