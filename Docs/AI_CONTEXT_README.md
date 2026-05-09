# 🎓 Smart Networking - Documentación de Contexto para IAs

> Guías completas y plantillas de código para que cualquier IA pueda entender, modificar y extender Smart Networking de manera eficiente.

---

## 🚀 COMIENZA AQUÍ

**3 opciones según tu nivel de prisa:**

### ⚡ Prisa (3 minutos)
👉 **Lee:** [`CHEATSHEET.md`](CHEATSHEET.md)
- Tabla QUÉ-DÓNDE instantánea
- Comandos críticos
- Snippets copy-paste

### 🏃 Normal (20 minutos)  
👉 **Lee:** [`PROJECT_CONTEXT_FOR_AI.md`](PROJECT_CONTEXT_FOR_AI.md)
- Descripción completa del proyecto
- Todas las instrucciones explicadas
- Flujos de usuario
- Guía de modificaciones

### 🚶 Profundo (45 minutos)
👉 **Lee todo en orden:**
1. [`PROJECT_CONTEXT_FOR_AI.md`](PROJECT_CONTEXT_FOR_AI.md) - Contexto
2. [`ARCHITECTURE_VISUAL.md`](ARCHITECTURE_VISUAL.md) - Diagramas
3. [`CODE_TEMPLATES.md`](CODE_TEMPLATES.md) - Ejemplos
4. [`QUICK_REFERENCE.md`](QUICK_REFERENCE.md) - Referencia

---

## 📚 Documentos Disponibles

### 🎯 **[`PROJECT_CONTEXT_FOR_AI.md`](PROJECT_CONTEXT_FOR_AI.md)** - Contexto Completo
- Resumen ejecutivo del proyecto
- Stack tecnológico
- Arquitectura general
- Contrato Anchor: Instrucciones, estructuras, errores
- Frontend: Componentes, hooks, páginas
- Flujos de usuario principales
- Guía de modificaciones frecuentes
- **Ubicación de búsqueda:** `PROJECT_CONTEXT_FOR_AI.md`

### ⚡ **[`CHEATSHEET.md`](CHEATSHEET.md)** - Referencia Rápida  
- Tabla QUÉ-DÓNDE de tareas comunes
- Comandos críticos
- Estructuras mínimas
- Snippets copy-paste
- Validaciones, errores comunes
- **Para cuando:** Necesitas respuesta en < 5 minutos

### 📖 **[`QUICK_REFERENCE.md`](QUICK_REFERENCE.md)** - Guía Rápida de Archivos
- Índice rápido por tarea
- Mapa por funcionalidad
- Referencias de código por línea
- Matriz de archivos
- **Para cuando:** ¿Dónde editoX?

### 💾 **[`CODE_TEMPLATES.md`](CODE_TEMPLATES.md)** - Ejemplos de Código
- Template instrucción Anchor (Rust)
- Template hook React
- Template página React
- Template componente
- Snippets para modificaciones comunes
- **Para cuando:** Necesitas código listo para copiar-pegar

### 🎨 **[`ARCHITECTURE_VISUAL.md`](ARCHITECTURE_VISUAL.md)** - Diagramas
- Flujo general de datos
- Estructura PDAs
- Ciclo de vida check-in
- Flujo de reviews
- Árbol de componentes React
- User journey map
- **Para cuando:** Necesitas entender visualmente

### 🗺️ **[`CONTEXT_GUIDE_FOR_AI.md`](CONTEXT_GUIDE_FOR_AI.md)** - Índice Maestro
- Matriz de referencia rápida
- Guía por tipo de tarea
- Casos de uso típicos
- Flujo de trabajo recomendado
- FAQs
- **Para cuando:** No sabes por dónde empezar

---

## 🎯 Elige tu Ruta

### 📍 Soy nuevo en el proyecto
1. Lee [`PROJECT_CONTEXT_FOR_AI.md`](PROJECT_CONTEXT_FOR_AI.md) (20 min)
2. Mira [`ARCHITECTURE_VISUAL.md`](ARCHITECTURE_VISUAL.md) (10 min)
3. Bookmark [`QUICK_REFERENCE.md`](QUICK_REFERENCE.md)

### 🔧 Necesito agregar/cambiar algo
1. Abre [`QUICK_REFERENCE.md`](QUICK_REFERENCE.md) → Encuentra archivo
2. Consulta [`CODE_TEMPLATES.md`](CODE_TEMPLATES.md) → Obtén estructura
3. Adapta y prueba

### 💻 Necesito entender el código
1. Lee [`PROJECT_CONTEXT_FOR_AI.md`](PROJECT_CONTEXT_FOR_AI.md) → Entiende lógica
2. Mira [`ARCHITECTURE_VISUAL.md`](ARCHITECTURE_VISUAL.md) → Visualiza flujos
3. Usa [`CODE_TEMPLATES.md`](CODE_TEMPLATES.md) → Ve ejemplos

### 🚀 Necesito integrar blockchain
1. Lee [`ARCHITECTURE_VISUAL.md`](ARCHITECTURE_VISUAL.md) → Entiende flujo
2. Consulta [`PROJECT_CONTEXT_FOR_AI.md`](PROJECT_CONTEXT_FOR_AI.md) → PDAs y seeds
3. Usa [`CODE_TEMPLATES.md`](CODE_TEMPLATES.md) → Patrón integración

---

## 📊 Matriz Rápida - Qué Leer Según...

| Necesidad | Lee Este | Tiempo |
|-----------|----------|--------|
| **Entender proyecto completo** | PROJECT_CONTEXT_FOR_AI.md | 20 min |
| **Dónde edito X** | QUICK_REFERENCE.md | 3 min |
| **Agregar nueva funcionalidad** | CODE_TEMPLATES.md | 10 min |
| **Entender visualmente** | ARCHITECTURE_VISUAL.md | 10 min |
| **Referencia super rápida** | CHEATSHEET.md | 2 min |
| **Orientación general** | CONTEXT_GUIDE_FOR_AI.md | 5 min |

---

## 🔑 Información Clave (TL;DR)

### Proyecto
- **Nombre:** Smart Networking  
- **Tipo:** dApp Solana (Blockchain + React)
- **Propósito:** Platform de networking en eventos con reputación, reviews y matching IA

### Blockchain
- **Red:** Devnet (Solana)
- **Programa:** Anchor/Rust
- **ID Programa:** `9yEGhSnNtkW6i6NxmXRniN2BNr6a8AvUxDf69h7DNSCm`
- **Ubicación:** `contracts/programs/workspace/src/lib.rs`

### Frontend
- **Stack:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Radix UI
- **Ubicación:** `src/`

### PDAs (Cuentas blockchain)
```
[b"profile", userPubkey]           → UserProfile
[b"event", eventId]                → EventConfig
[b"attendance", eventId, userPubkey] → Attendance  
[b"review", eventId, reviewer, reviewed] → UserReview
```

### Instrucciones (Funciones blockchain)
1. `initialize_config` - Crear perfil usuario
2. `create_event` - Organizar evento
3. `check_in` - Asistir a evento
4. `submit_review` - Dar review (actualiza reputación)
5. `update_reputation` - Admin override

---

## 🚀 Comandos Útiles

```bash
# DESARROLLO FRONTEND
npm run dev          # Dev server (http://localhost:5173)
npm run build        # Build producción
npm run lint         # Check code errors

# BLOCKCHAIN (Anchor)
cd contracts
anchor build         # Compilar programa
anchor deploy        # Deploy a devnet
anchor test          # Ejecutar tests

# SOLANA CLI
solana balance       # Ver balance SOL
solana airdrop 2     # 2 SOL gratis (devnet)
solana config get    # Ver configuración
```

---

## 📝 Estructura de Archivos Contexto

```
Smart-Networking/
├─ 📄 PROJECT_CONTEXT_FOR_AI.md        ← START HERE
├─ 📄 QUICK_REFERENCE.md               ← Dónde editar
├─ 📄 CODE_TEMPLATES.md                ← Ejemplos código
├─ 📄 ARCHITECTURE_VISUAL.md            ← Diagramas
├─ 📄 CONTEXT_GUIDE_FOR_AI.md           ← Índice maestro
├─ 📄 CHEATSHEET.md                     ← Ultra-rápido
├─ 📄 README.md                         ← Este archivo
│
├─ 📂 contracts/                        ← BLOCKCHAIN
│  └─ programs/workspace/src/lib.rs     ← Programa Anchor
│
├─ 📂 src/                              ← FRONTEND
│  ├─ pages/                            ← Pantallas
│  ├─ components/                       ← Componentes
│  ├─ hooks/                            ← Lógica estado
│  └─ lib/                              ← Utilidades
│
└─ 📂 Ai-Usage/                         ← Registro IAs
```

---

## 🎯 Casos de Uso Comunes

### ✅ "Quiero agregar un nuevo campo a UserProfile"
→ Mira [`CODE_TEMPLATES.md`](CODE_TEMPLATES.md) → "Modificar UserProfile Existente"

### ✅ "Quiero cambiar el algoritmo de reputación"
→ Mira [`CODE_TEMPLATES.md`](CODE_TEMPLATES.md) → "Cambiar Algoritmo de Reputación"

### ✅ "Quiero agregar una nueva página"
→ Mira [`CODE_TEMPLATES.md`](CODE_TEMPLATES.md) → "Template: Nueva Página"

### ✅ "Quiero integrar blockchain real (sin mock)"
→ Mira [`CODE_TEMPLATES.md`](CODE_TEMPLATES.md) → "Template: Nuevo Hook con Integración"

### ✅ "Quiero entender el flujo check-in"
→ Mira [`ARCHITECTURE_VISUAL.md`](ARCHITECTURE_VISUAL.md) → "Ciclo de Vida Check-in"

---

## ⚠️ Reglas Importantes

✅ **SIEMPRE:**
- Leer [`PROJECT_CONTEXT_FOR_AI.md`](PROJECT_CONTEXT_FOR_AI.md) si es primera vez
- Compilar antes de commitear: `npm run build && anchor build`
- Actualizar documentación en `Ai-Usage/`

❌ **NUNCA:**
- Editar `contracts/target/idl/workspace.json` directamente
- Cambiar `declare_id!` del programa
- Tocar seeds sin entender PDA derivation
- Olvidar validaciones `require!()`

---

## 🤝 Cómo Contribuir

1. **Lee el contexto** (elige archivo según necesidad)
2. **Planifica tu cambio** (usa QUICK_REFERENCE como guía)
3. **Implementa** (usa CODE_TEMPLATES como estructura)
4. **Compila sin errores:** `npm run build && anchor build`
5. **Documenta** en `Ai-Usage/archivo-nuevo.md`
6. **Commitea** con descripción clara

---

## 📞 Preguntas Frecuentes

**P: ¿Por dónde empiezo?**  
A: Lee [`PROJECT_CONTEXT_FOR_AI.md`](PROJECT_CONTEXT_FOR_AI.md) (20 min)

**P: ¿Cómo agrego un nuevo hook?**  
A: Mira [`CODE_TEMPLATES.md`](CODE_TEMPLATES.md) → "Template: Nuevo Hook"

**P: ¿Dónde está X ubicado?**  
A: Consulta [`QUICK_REFERENCE.md`](QUICK_REFERENCE.md)

**P: ¿Cómo compilo?**  
A: `npm run build` (frontend) y `anchor build` (blockchain)

**P: ¿Qué necesito instalar?**  
A: Node.js, Rust, Solana CLI, Anchor CLI (en `contracts/Anchor.toml`)

---

## 📊 Stats del Proyecto

- **Líneas de código Rust:** ~350  
- **Líneas de código TypeScript:** ~2000+
- **Componentes React:** 40+
- **Hooks personalizados:** 6
- **PDAs (Estructuras):** 4
- **Instrucciones:** 5
- **Páginas:** 7

---

## 💡 Pro Tips

1. **CHEATSHEET.md es tu amigo** - Tenlo abierto siempre
2. **QUICK_REFERENCE.md te ahorra 10 minutos** - Úsalo para ubicación
3. **CODE_TEMPLATES.md tiene ejemplos reales** - Copy-paste es OK
4. **ARCHITECTURE_VISUAL.md para debugging** - Dibuja los flujos
5. **PROJECT_CONTEXT_FOR_AI.md cuando estés perdido** - Es la biblia

---

## 📚 Documentación Generada

Estos archivos fueron generados por IA para facilitar colaboración entre múltiples IAs:

- **Completo:** Para entender cada pequeño detalle
- **Estructurado:** Fácil de navegar y buscar
- **Con ejemplos:** Código real del proyecto
- **Actualizable:** Pensado para evolucionar
- **Multi-nivel:** Desde rápido hasta profundo

**Última actualización:** Mayo 2026  
**Versión:** 1.0  
**Mantenedor:** Comunidad de IAs  

---

## 🚀 Próximas Tareas

> Estos archivos de contexto se pueden actualizar conforme evolucionan:

1. Cuando se agreguen nuevas instrucciones → Actualizar PROJECT_CONTEXT_FOR_AI.md
2. Cuando cambien ubicaciones → Actualizar QUICK_REFERENCE.md
3. Cuando se añadan patrones comunes → Actualizar CODE_TEMPLATES.md
4. Cuando evolucione arquitectura → Actualizar ARCHITECTURE_VISUAL.md

---

## ✨ Bienvenida

Bienvenid@ a Smart Networking. Estos documentos están diseñados para que puedas:**
- ✅ Entender la arquitectura rápidamente
- ✅ Encontrar exactamente qué archivo editar
- ✅ Copiar código listo para tu tarea
- ✅ Colaborar eficientemente con otros

**¿Listo para empezar?**
- ⚡ Prisa → [`CHEATSHEET.md`](CHEATSHEET.md)
- 🏃 Normal → [`PROJECT_CONTEXT_FOR_AI.md`](PROJECT_CONTEXT_FOR_AI.md)
- 🚶 Profundo → [`CONTEXT_GUIDE_FOR_AI.md`](CONTEXT_GUIDE_FOR_AI.md)

---

Hecho con ❤️ para futuras IAs  
Smart Networking 2026
