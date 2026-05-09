# 💾 Ejemplos de Código - Smart Networking

*Plantillas y snippets listos para copiar-pegar para tareas comunes*

---

## 🏗️ TEMPLATES PARA NUEVAS INSTRUCCIONES (Anchor/Rust)

### Template Básico de Instrucción + Contexto

```rust
// 1. INSTRUCCIÓN
pub fn my_new_action(
    ctx: Context<MyNewActionContext>,
    param1: String,
    param2: u32,
) -> Result<()> {
    let account = &mut ctx.accounts.my_account;
    
    // Validaciones
    require!(param1.len() <= 64, ErrorCode::InvalidParameter);
    require!(param2 > 0, ErrorCode::InvalidParameter);
    
    // Lógica principal
    account.field1 = param1;
    account.field2 = param2;
    account.updated_at = Clock::get()?.unix_timestamp;
    
    Ok(())
}

// 2. CONTEXTO
#[derive(Accounts)]
#[instruction(param1: String)]
pub struct MyNewActionContext<'info> {
    #[account(
        init,
        seeds = [b"myprefix", param1.as_bytes()],
        bump,
        payer = payer,
        space = 8 + MyData::LEN,
    )]
    pub my_account: Account<'info, MyData>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// 3. ESTRUCTURA DE DATOS
#[account]
pub struct MyData {
    pub field1: String,    // ≤ 64 chars
    pub field2: u32,
    pub created_by: Pubkey,
    pub updated_at: i64,
    pub bump: u8,
}

impl MyData {
    pub const LEN: usize = (4 + 64) + 4 + 32 + 8 + 1;
}
```

**Dónde poner esto:** `contracts/programs/workspace/src/lib.rs`
- Instrucción → Al final del módulo `#[program]` (después de `update_reputation`)
- Contexto → En la sección "// ── Context Structs ──"
- Estructura → En la sección "// ── Account Structures ──"

---

### Template: Modificar UserProfile Existente

```rust
// PARA AGREGAR CAMPO A UserProfile:

// 1. Editar struct (línea ~197)
#[account]
pub struct UserProfile {
    pub user: Pubkey,
    pub reputation_score: u16,
    pub badges_count: u16,
    pub total_check_ins: u32,
    pub total_matches: u32,
    pub total_reviews_given: u32,
    pub total_reviews_received: u32,
    pub interests_hash: [u8; 32],
    pub last_updated: i64,
    pub bump: u8,
    pub mi_nuevo_campo: String,     // ← AGREGAR AQUÍ
}

// 2. Actualizar LEN (línea ~212)
impl UserProfile {
    pub const LEN: usize = 32 + 2 + 2 + 4 + 4 + 4 + 4 + 32 + 8 + 1 + (4 + 64); // ← SUMAR (4 + tamaño_string)
}

// 3. Inicializar en initialize_config (línea ~25)
pub fn initialize_config(
    ctx: Context<InitializeConfig>,
    interests_hash: [u8; 32],
) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    profile.user = ctx.accounts.user.key();
    profile.reputation_score = 50;
    profile.badges_count = 0;
    profile.total_check_ins = 0;
    profile.total_matches = 0;
    profile.total_reviews_given = 0;
    profile.total_reviews_received = 0;
    profile.interests_hash = interests_hash;
    profile.last_updated = Clock::get()?.unix_timestamp;
    profile.bump = ctx.bumps.profile;
    profile.mi_nuevo_campo = String::from("valor_inicial"); // ← AGREGAR AQUÍ
    Ok(())
}
```

---

### Template: Instrucción con CPI (Cross Program Invocation)

```rust
// Ejemplo: Llamar a token program para transferir
pub fn my_cpi_action(
    ctx: Context<MyCPIContext>,
) -> Result<()> {
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_accounts = Transfer {
        from: ctx.accounts.from_token_account.to_account_info(),
        to: ctx.accounts.to_token_account.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, 1000)?;
    Ok(())
}

#[derive(Accounts)]
pub struct MyCPIContext<'info> {
    pub authority: Signer<'info>,
    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}
```

---

## 🎨 TEMPLATES PARA FRONTEND (React/TypeScript)

### Template: Nuevo Hook con Integracion Blockchain

```typescript
// src/hooks/useMyData.ts

import { useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';

// Aquí iría: import { useAnchorProgram } from '@/lib/useAnchorProgram';
// (Este hook necesita ser creado para acceder al programa Anchor)

export interface MyData {
  field1: string;
  field2: number;
  timestamp: number;
}

export function useMyData() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [data, setData] = useState<MyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos cuando usuario conecta wallet
  useEffect(() => {
    if (!connected || !publicKey) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Reemplazar con llamada real a Anchor
        // const program = useAnchorProgram();
        // const pda = PublicKey.findProgramAddressSync(
        //   [Buffer.from("myprefix"), publicKey.toBuffer()],
        //   program.programId
        // )[0];
        // const account = await program.account.myData.fetch(pda);
        // setData(account);

        // Por ahora simular:
        await new Promise(r => setTimeout(r, 500));
        setData({
          field1: 'mock',
          field2: 42,
          timestamp: Date.now(),
        });
      } catch (err) {
        setError((err as Error).message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [connected, publicKey]);

  // Acción que ejecuta instrucción
  const myAction = useCallback(async (param: string) => {
    if (!connected || !publicKey) {
      setError('Wallet not connected');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // TODO: Reemplazar con instrucción real
      // const program = useAnchorProgram();
      // const tx = await program.methods
      //   .myNewAction(param, 42)
      //   .accounts({
      //     myAccount: pda,
      //     payer: publicKey,
      //     systemProgram: SystemProgram.programId,
      //   })
      //   .rpc();

      console.log('Action completed');
    } catch (err) {
      const errorMsg = (err as Error).message;
      setError(errorMsg);
      console.error('Error executing action:', err);
    } finally {
      setLoading(false);
    }
  }, [connected, publicKey]);

  return { data, loading, error, myAction };
}
```

**Dónde poner:** `src/hooks/useMyData.ts` (nuevo archivo)

---

### Template: Página con Hook

```typescript
// src/pages/MyPage.tsx

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import AppLayout from '@/components/AppLayout';
import WalletGuard from '@/components/WalletGuard';
import { useMyData } from '@/hooks/useMyData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const MyPage: React.FC = () => {
  const { publicKey } = useWallet();
  const { data, loading, error, myAction } = useMyData();
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();

  const handleAction = async () => {
    try {
      await myAction(inputValue);
      toast({
        title: 'Success',
        description: 'Action completed',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: (err as Error).message,
        variant: 'destructive',
      });
    }
  };

  return (
    <AppLayout>
      <WalletGuard>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Mi Página</h1>

          {loading && <p>Cargando...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}

          {data && (
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Datos</h2>
              <p>Field 1: {data.field1}</p>
              <p>Field 2: {data.field2}</p>
              <p>Wallet: {publicKey?.toBase58()}</p>
            </Card>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ingresa parámetro"
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <Button onClick={handleAction} disabled={loading}>
              {loading ? 'Procesando...' : 'Enviar'}
            </Button>
          </div>
        </div>
      </WalletGuard>
    </AppLayout>
  );
};

export default MyPage;
```

**Dónde poner:** `src/pages/MyPage.tsx` (nuevo archivo)

**Agregar ruta en `src/App.tsx`:**
```typescript
import MyPage from '@/pages/MyPage';

// Dentro del <Routes>:
<Route path="/my-page" element={<MyPage />} />
```

---

### Template: Componente Reutilizable

```typescript
// src/components/MyComponent.tsx

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface MyComponentProps {
  title: string;
  description?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  description,
  onClick,
  disabled = false,
  className,
}) => {
  return (
    <Card 
      className={cn(
        'p-4 border border-border rounded-lg hover:border-primary/50 transition-colors',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      <Button
        onClick={onClick}
        disabled={disabled}
        variant="default"
        size="sm"
      >
        Acción
      </Button>
    </Card>
  );
};

export default MyComponent;
```

**Uso:**
```typescript
<MyComponent
  title="Mi Componente"
  description="Descripción aquí"
  onClick={() => console.log('Clickeado')}
/>
```

---

### Template: Hook para Datos Mock

```typescript
// src/hooks/useMyMockData.ts

import { useState, useEffect } from 'react';

export interface MyMockItem {
  id: string;
  name: string;
  value: number;
}

const mockData: MyMockItem[] = [
  { id: '1', name: 'Item 1', value: 100 },
  { id: '2', name: 'Item 2', value: 200 },
];

export function useMyMockData() {
  const [items, setItems] = useState<MyMockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular delay de red
    const timer = setTimeout(() => {
      setItems(mockData);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return { items, loading };
}
```

---

## 🔧 TEMPLATES PARA MODIFICACIONES COMUNES

### Agregar Validación de Input

```rust
// En instrucción Anchor
require!(param.len() > 0, ErrorCode::InvalidParameter);
require!(param.len() <= 64, ErrorCode::InvalidParameter);
require!(score >= 0 && score <= 100, ErrorCode::InvalidScore);
require!(
    ctx.accounts.user.key() == expected_user,
    ErrorCode::Unauthorized
);
require!(event.is_active, ErrorCode::EventNotActive);
require!(event.current_attendees < event.max_attendees, ErrorCode::EventFull);
```

---

### Cambiar Algoritmo de Reputación

```rust
// ACTUAL (línea ~98-103):
if rating >= 4 {
    reviewed_profile.reputation_score = reviewed_profile.reputation_score
        .saturating_add(2)
        .min(100);
} else if rating <= 2 {
    reviewed_profile.reputation_score = reviewed_profile.reputation_score
        .saturating_sub(1);
}

// NUEVO EJEMPLO - Escala más grande:
match rating {
    5 => reviewed_profile.reputation_score = reviewed_profile.reputation_score.saturating_add(5).min(100),
    4 => reviewed_profile.reputation_score = reviewed_profile.reputation_score.saturating_add(3).min(100),
    3 => {}, // Sin cambio
    2 => reviewed_profile.reputation_score = reviewed_profile.reputation_score.saturating_sub(2),
    1 => reviewed_profile.reputation_score = reviewed_profile.reputation_score.saturating_sub(5),
    _ => {},
}
```

---

### Manejar Errores en Frontend

```typescript
try {
  // Tu acción aquí
  await myAction();
  
  toast({
    title: 'Éxito',
    description: 'Acción completada',
  });
} catch (err) {
  const errorMsg = (err as Error).message;
  
  toast({
    title: 'Error',
    description: errorMsg,
    variant: 'destructive',
  });
  
  console.error('Detalles del error:', err);
}
```

---

### Cargar Todos los PDAs de un Tipo

```typescript
// Fetch todos los eventos creados:
const events = await program.account.eventConfig.all();

// Fetch todas las asistencias de un usuario:
const attendances = await program.account.attendance.all();

// Filtrar resultados:
const userEvents = events.filter(e => e.account.organizer.equals(publicKey));
```

---

## 🎯 PLANTILLAS PARA TIPOS COMUNES

### Tipos TypeScript para Datos

```typescript
// Espejo de structs Rust
export interface UserProfile {
  user: string;
  reputationScore: number;
  badgesCount: number;
  totalCheckIns: number;
  totalMatches: number;
  totalReviewsGiven: number;
  totalReviewsReceived: number;
  interestsHash: Uint8Array;
  lastUpdated: number;
  bump: number;
}

export interface EventConfig {
  organizer: string;
  eventId: string;
  name: string;
  maxAttendees: number;
  currentAttendees: number;
  isActive: boolean;
  createdAt: number;
  bump: number;
}

export interface CheckInResponse {
  transactionHash: string;
  attendanceAccount: string;
  timestamp: number;
}
```

---

### Enums para Estados UI

```typescript
export enum CheckInStatus {
  IDLE = 'idle',
  SCANNING = 'scanning',
  CONFIRMING = 'confirming',
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  LIVE = 'live',
  PAST = 'past',
}

export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}
```

---

## 📝 TEMPLATE: Git Commit Message

```
When committing changes, use this format:

feat(scope): description
├─ feat: Nueva funcionalidad
├─ fix: Corrección de bug
├─ refactor: Cambio estructura sin cambiar funcionalidad
├─ docs: Cambio documentación
└─ test: Agregar/modificar tests

Ejemplos:
- feat(blockchain): agregar instrucción mint_badge
- fix(frontend): corregir cálculo de matching
- refactor(ui): limpiar componentes innecesarios
- docs: actualizar guía de instalación
```

---

## 🚀 CHECKLIST ANTES DE PR

```markdown
- [ ] Código compilado sin warnings: `npm run build` + `anchor build`
- [ ] Tests pasan: `npm run test` (si existen)
- [ ] Linter limpio: `npm run lint`
- [ ] Actualmente usando mock data (antes de merge a desarrollo)
- [ ] Cambios documentados en Ai-Usage/ folder
- [ ] Se testeó en devnet manualmente
- [ ] Se actualizó PROJECT_CONTEXT_FOR_AI.md si hay cambios estructura
- [ ] Se actualizó QUICK_REFERENCE.md si hay nuevas tareas comunes
```

---

**Última actualización:** Mayo 2026
