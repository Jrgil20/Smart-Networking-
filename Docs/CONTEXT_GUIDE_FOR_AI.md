# 📚 Guía de Contexto para IAs - Índice Maestro

Bienvenido. Este conjunto de documentos te proporciona **todo lo que necesitas conocer** sobre Smart Networking para contribuir eficientemente.

---

## 🗺️ COMIENZA AQUÍ: Elige tu Camino

### 🏃 Tengo prisa - 5 minutos

**Lee:** `QUICK_REFERENCE.md`
- Qué archivo tocar según tu tarea
- Líneas de código exactas
- Tabla rápida de ubicaciones
- Comandos git

**Tiempo:** 5 min | **Profundidad:** Superficial ⭐

---

### 🚶 Necesito comprender - 20 minutos  

**Lee:** `PROJECT_CONTEXT_FOR_AI.md`
- Resumen ejecutivo del proyecto
- Arquitectura general
- Todas las instrucciones Anchor explicadas
- Todas las estructuras de datos (PDAs)
- Flujos de usuario principales
- Guía de modificaciones frecuentes

**Tiempo:** 20 min | **Profundidad:** Completa ⭐⭐⭐

---

### 💻 Necesito código - 30 minutos

**Lee:** `CODE_TEMPLATES.md`
- Plantillas de instrucciones Rust
- Plantillas de hooks React
- Plantillas de componentes
- Snippets para modificaciones comunes
- Checklist antes de PR

**Tiempo:** 30 min | **Profundidad:** Práctica ⭐⭐⭐⭐

---

### 🎨 Prefiero visual - 15 minutos

**Lee:** `ARCHITECTURE_VISUAL.md`
- Diagramas de flujos
- Estructura de PDAs visual
- Ciclo de vida check-in
- User journey map
- Árbol de componentes React

**Tiempo:** 15 min | **Profundidad:** Visual ⭐⭐

---

## 📖 Flujo Recomendado Completo

1. **Primer visita:** Lee `PROJECT_CONTEXT_FOR_AI.md` (20 min)
2. **Antes de codear:** Consulta `QUICK_REFERENCE.md` + `CODE_TEMPLATES.md` (15 min)
3. **Para entender visualmente:** Mira `ARCHITECTURE_VISUAL.md` (10 min)
4. **Trabajo específico:** Vuelve a `QUICK_REFERENCE.md` para ubicación exacta

---

## 📚 Matriz de Referencia Rápida

| Situación | Lee Este | Tiempo |
|-----------|----------|--------|
| ¿Dónde edito X? | QUICK_REFERENCE.md | 2 min |
| Agregar instrucción | CODE_TEMPLATES.md | 5 min |
| Agregar hook | CODE_TEMPLATES.md | 5 min |
| Cambiar UI | QUICK_REFERENCE.md | 3 min |
| Entender PDA | PROJECT_CONTEXT_FOR_AI.md | 10 min |
| Ver flujo check-in | ARCHITECTURE_VISUAL.md | 5 min |
| Entender desde cero | PROJECT_CONTEXT_FOR_AI.md | 20 min |
| Integrar blockchain | CODE_TEMPLATES.md | 10 min |
| Validación | CODE_TEMPLATES.md | 2 min |

---

## 🎯 Por Tipo de Tarea

### Si necesitas **CREAR ALGO NUEVO**
1. Lee `QUICK_REFERENCE.md` → Encuentra archivo
2. Lee `CODE_TEMPLATES.md` → Copia template
3. Adapta el código
4. Prueba: `npm run dev` + `anchor build`

### Si necesitas **MODIFICAR ALGO EXISTENTE**
1. Consulta `QUICK_REFERENCE.md` → Exacta línea
2. Lee `PROJECT_CONTEXT_FOR_AI.md` → Entiende la lógica
3. Modifica el código
4. Valida con tests

### Si necesitas **INTEGRAR BLOCKCHAIN**
1. Lee `ARCHITECTURE_VISUAL.md` → Entiende flujo
2. Lee `PROJECT_CONTEXT_FOR_AI.md` → PDA structure
3. Lee `CODE_TEMPLATES.md` → Patrón integración
4. Reemplaza mock data con llamadas reales

### Si necesitas **ENTENDER ASEGURITY**
1. Lee `PROJECT_CONTEXT_FOR_AI.md` → Sección seguridad
2. Lee `ARCHITECTURE_VISUAL.md` → Security model
3. Revisa `CODE_TEMPLATES.md` → Validaciones

---

## 🔍 Índice por Tema

### Blockchain & Solana
- **Program ID:** `9yEGhSnNtkW6i6NxmXRniN2BNr6a8AvUxDf69h7DNSCm`
- **Red:** Devnet
- **Ubicación código:** `contracts/programs/workspace/src/lib.rs`
- **Referencia:** `PROJECT_CONTEXT_FOR_AI.md` → "CONTRATO ANCHOR"

### Instrucciones Disponibles
1. `initialize_config` ← Crear perfil usuario
2. `create_event` ← Organizar evento
3. `check_in` ← Asistir a evento  
4. `submit_review` ← Dar review
5. `update_reputation` ← Admin override
- **Referencia:** `PROJECT_CONTEXT_FOR_AI.md` → "🎯 Instrucciones Principales"

### Estructuras PDA
- `UserProfile` ← Perfil del usuario
- `EventConfig` ← Configuración evento
- `Attendance` ← Registro asistencia  
- `UserReview` ← Review de usuario
- **Referencia:** `PROJECT_CONTEXT_FOR_AI.md` → "📊 Estructuras de Datos"

### Frontend Pages
- `/` - Landing
- `/dashboard` - Panel eventos
- `/event/:id` - Detalle evento
- `/event/:id/matches` - Networking
- `/event/:id/reviews` - Reviews
- `/profile` - Perfil usuario
- **Referencia:** `QUICK_REFERENCE.md` → "🎨 FRONTEND"

### Hooks Principales
- `useUserProfile()` - Carga perfil
- `useEvents()` - Carga eventos
- `useMatches()` - Sugerencias IA
- `useCheckIn()` - Flujo check-in
- `useReviews()` - Carga reviews
- **Referencia:** `PROJECT_CONTEXT_FOR_AI.md` → "🎣 Hooks Principales"

### Componentes UI Clave
- `EventCard` - Tarjeta evento
- `MatchCard` - Sugerencia match
- `ReputationBadge` - Display reputación
- `NFTBadgeCard` - Display badge
- `StarRating` - Rating 1-5
- **Referencia:** `QUICK_REFERENCE.md` → "🎨 Componentes"

---

## 📁 Archivos Contexto Disponibles

```
📦 Smart-Networking/
├─ 📄 PROJECT_CONTEXT_FOR_AI.md      ← EMPEZAR AQUÍ (comprensivo)
├─ 📄 QUICK_REFERENCE.md              ← Referencia rápida  
├─ 📄 CODE_TEMPLATES.md               ← Ejemplos código
├─ 📄 ARCHITECTURE_VISUAL.md           ← Diagramas
├─ 📄 CONTEXT_GUIDE_FOR_AI.md          ← ESTE ARCHIVO
│
├─ contracts/                          ← BLOCKCHAIN
│  └─ programs/workspace/src/lib.rs
│
├─ src/                                ← FRONTEND
│  ├─ pages/                           ← Pantallas
│  ├─ components/                      ← Componentes
│  ├─ hooks/                           ← Lógica estado
│  └─ lib/                             ← Utilitarios
│
└─ Ai-Usage/                           ← Registro cambios IA
```

---

## 🚀 Casos de Uso Típicos

### Caso 1: Agregar nuevo campo a UserProfile

**Pasos:**
1. Consulta `QUICK_REFERENCE.md` → "Sistema de EVENTOS"
2. Lee `CODE_TEMPLATES.md` → "Modificar UserProfile Existente"
3. Edita `contracts/.../lib.rs:197` (struct `UserProfile`)
4. Actualiza `.LEN` en línea ~212
5. Inicializa en `initialize_config` línea ~25
6. Ejecuta: `cd contracts && anchor build`

---

### Caso 2: Cambiar algoritmo reputación

**Pasos:**
1. Lee `PROJECT_CONTEXT_FOR_AI.md` → "4️⃣ submit_review"
2. Consulta `CODE_TEMPLATES.md` → "Cambiar Algoritmo de Reputación"
3. Edita `contracts/.../lib.rs:98-103`
4. Modifica lógica `saturating_add`, `saturating_sub`
5. Build: `anchor build`

---

### Caso 3: Agregar nueva página con datos blockchain

**Pasos:**
1. Lee `CODE_TEMPLATES.md` → "Template: Nueva Página con Hook"
2. Crea `src/pages/MyPage.tsx`
3. Crea `src/hooks/useMyData.ts`
4. Agrega ruta en `src/App.tsx`
5. Prueba: `npm run dev`

---

### Caso 4: Integrar blockchain real (reemplazar mock)

**Pasos:**
1. Consulta `ARCHITECTURE_VISUAL.md` → "📊 Integración Frontend ↔ Blockchain"
2. Lee `CODE_TEMPLATES.md` → "Template: Nuevo Hook con Integración"
3. Para cada hook (useUserProfile, useEvents, etc.):
   - Reemplaza `setTimeout` con `program.methods`
   - Usa `PublicKey.findProgramAddressSync` para PDAs
   - Maneja errores con try-catch

---

## 💡 Tips Importantes

✅ **SIEMPRE HACER:**
- Leer `PROJECT_CONTEXT_FOR_AI.md` si es primera vez
- Usar `QUICK_REFERENCE.md` para ubicación de archivos
- Consultar `CODE_TEMPLATES.md` para estructura exacta
- Compilar antes de commitear: `npm run build && anchor build`
- Actualizar `Ai-Usage/` con cambios realizados
- Mirar ejemplos en `CODE_TEMPLATES.md` como referencia
- Usar nombres descriptivos (match la nomenclatura existente)

❌ **NUNCA HACER:**
- Editar `contracts/target/idl/workspace.json` directamente
- Cambiar `declare_id!` del programa
- Tocar bump derivation sin entender seeds
- Olvidar validaciones `require!()` en instrucciones
- Usar mock data después de integración real
- Hacer PRs sin actualizar documentación
- Ignorar errores de compilación

---

## 🔧 Flujo de Trabajo Recomendado

```
1. PLANIFICAR
   ├─ Leer PROJECT_CONTEXT_FOR_AI.md (qué tenemos)
   ├─ Leer QUICK_REFERENCE.md (dónde editar)
   └─ Leer CODE_TEMPLATES.md (estructura exacta)

2. DEVELOPING
   ├─ Crear/editar archivo
   ├─ Compilar: npm run build (frontend) + anchor build (blockchain)
   ├─ Probar: npm run dev (frontend)
   └─ Validar: npm run lint

3. DOCUMENTAR
   ├─ Crear AI_USAGE_YYYYMMDD.md con cambios
   ├─ Actualizar PROJECT_CONTEXT_FOR_AI.md si hay cambios estructura
   ├─ Actualizar QUICK_REFERENCE.md si hay nuevas tareas comunes
   └─ Commitear con descripción clara

4. REVISAR
   ├─ Checklist: ¿Compila sin errores? ✓
   ├─ Checklist: ¿Tests pasan? ✓
   ├─ Checklist: ¿Linter limpio? ✓
   ├─ Checklist: ¿Documentación actualizada? ✓
   └─ Crear PR
```

---

## 📞 Preguntas Frecuentes

**P: ¿Dónde está el ID del programa?**
A: `9yEGhSnNtkW6i6NxmXRniN2BNr6a8AvUxDf69h7DNSCm` (vea `contracts/.../lib.rs:2`)

**P: ¿Cuál es el archivo principal del contrato?**
A: `contracts/programs/workspace/src/lib.rs`

**P: ¿Cómo agrego un campo a PDA?**
A: Sigue patrón en `CODE_TEMPLATES.md` → "Modificar UserProfile Existente"

**P: ¿Dónde está mock data?**
A: `src/lib/mockData.ts`

**P: ¿En qué red estamos?**
A: Devnet (ver `src/App.tsx:8`)

**P: ¿Cuánto cuesta una transacción?**
A: ~0.00025 SOL (negligible en devnet, gratis con airdrops)

**P: ¿Cómo compilar?**
A: `cd contracts && anchor build` (blockchain) o `npm run build` (frontend)

---

## 🎬 Próximas Pasos

1. **Lee `PROJECT_CONTEXT_FOR_AI.md`** (20 minutos)
2. **Échale un vistazo a `ARCHITECTURE_VISUAL.md`** (5 minutos)
3. **Bookmark `QUICK_REFERENCE.md`** (lo usarás constantemente)
4. **Guarda `CODE_TEMPLATES.md`** (para copiar-pegar)
5. **Empieza tu tarea**

---

## 📝 Registro de Cambios por IA

Cada vez que una IA realiza cambios importantes, debe:

1. Crear archivo: `Ai-Usage/ai-usage-YYYYMMDD-HHMM.md`
2. Documentar:
   - Tareas completadas
   - Problemas encontrados
   - Decisiones tomadas
   - Status de integración
   - Próximas acciones

3. Actualizar documentación central si cambios estructura

**Ubicación:** `/workspaces/Smart-Networking-/Ai-Usage/`

---

## ✨ Notas Finales

- Este contexto fue generado para facilitar colaboración entre múltiples IAs
- Está diseñado para ser comprensivo pero conciso
- Incluye ejemplos reales de código propio del proyecto
- Se actualiza conforme el proyecto evoluciona
- Es la "fuente única de verdad" para nuevos desarrolladores

**¿Necesitas algo más? Consulta el archivo específico:**
- General → `PROJECT_CONTEXT_FOR_AI.md`
- Rápido → `QUICK_REFERENCE.md`
- Código → `CODE_TEMPLATES.md`
- Visual → `ARCHITECTURE_VISUAL.md`

---

**Creado:** Mayo 2026  
**Versión:** 1.0  
**Lenguaje:** Español  
**Destinatario:** IAs futuras trabajando en Smart Networking

¡Bienvenid@ a Smart Networking! 🚀
