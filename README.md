# Smart-Networking-

Smart-Networking es una aplicación Web3 diseñada para mejorar el networking en eventos, hackathons y comunidades técnicas.

> Nota: la aplicación y la mayor parte de la interfaz están en inglés, pero este README incluye información clave en español para documentar el proyecto.

## Hackathon Project

Smart-Networking was developed during the Dev3Pack Hackathon as an experimental Web3 networking platform focused on improving how people connect during technical events, hackathons, and communities.

The project explores the idea of contextual networking through:
- on-chain attendance verification,
- portable reputation,
- AI-powered matchmaking,
- event discovery,
- peer reviews,
- and hybrid privacy using off-chain data with verifiable blockchain references.

This was my first time participating solo in a hackathon without entering with a predefined idea, focusing instead on solving a real problem I personally experience at events: networking is often random, inefficient, and difficult to maintain after the event ends.

Despite the limited time and working alone, the project achieved:
- Top 69 globally out of 349 projects
- Top 27 in LATAM out of 194 projects
- 4th place among projects from Venezuela

Hackathon project page:
https://hack.dev3pack.xyz/projects/jx74g77axh7x08d654wcz8wcm186fevc

## Información adicional

### Descripción

Smart-Networking es una plataforma que combina frontend React con lógica Web3 en Solana para facilitar el networking en eventos técnicos. La app permite crear eventos, hacer check-in, revisar participantes, recibir recomendaciones de match y gestionar reputación.

### Tecnologías principales

- React + TypeScript + Vite
- Tailwind CSS
- Solana + Anchor
- @solana/wallet-adapter (Phantom, Solflare, Slope, Torus)
- Radix UI + Framer Motion
- Supabase JS como posible capa de datos off-chain

### Estructura del repositorio

- `src/`: código del frontend y componentes UI
- `contracts/`: contrato Anchor y programa Rust en Solana
- `Docs/`: documentación y registros de uso de IA
- `Ai-Usage/`: historial de sesiones con IA, decisiones y cambios importantes

### Scripts útiles

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Observaciones

- La app está casi completamente en inglés.
- El README y la documentación del proyecto pueden ser bilingües para facilitar el mantenimiento y la presentación.
