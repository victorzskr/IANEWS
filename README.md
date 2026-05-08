# AgoraAI

AgoraAI es una aplicacion web minimalista para desarrolladores que quieren estar al dia de las noticias mas relevantes sobre inteligencia artificial.

La primera version se centra en una experiencia sencilla de timeline. Las noticias se cargan desde `content/news.json`, se validan durante el build y cada item enlaza directamente a su fuente original.

## Idea del producto

Los desarrolladores que trabajan con herramientas, modelos, agentes, APIs e infraestructura de IA necesitan una forma ligera de seguir novedades importantes sin revisar varias fuentes cada dia. AgoraAI busca ofrecer una timeline diaria, enfocada y facil de consultar.

## Alcance inicial

- Interfaz web minimalista.
- Layout basado en timeline.
- Buscador para filtrar noticias.
- Noticias cargadas desde un archivo JSON estatico.
- Cada noticia abre el articulo o post original.
- Actualizaciones de contenido aprobadas por una persona mediante un heartbeat diario de Codex.
- Metadatos editoriales para fuente, cuenta, confianza y por que importa cada noticia.

## Fuentes de contenido

La fuente inicial es X, con el objetivo de seguir actualizaciones relevantes de cuentas y comunidades relacionadas con desarrollo en IA.

En el futuro, el proyecto puede ampliarse a otras fuentes como:

- Blogs de empresas de IA.
- Blogs de ingenieria.
- Feeds de lanzamientos de producto.
- RSS.
- Webs publicas que permitan scraping.

## Modelo de datos

La estructura inicial del JSON puede verse asi:

```json
[
  {
    "id": "2026-05-05-example",
    "title": "Example AI development news",
    "summary": "Short description of why this news matters.",
    "source": "X",
    "url": "https://example.com/news",
    "publishedAt": "2026-05-05T09:00:00Z",
    "tags": ["ai", "developer-tools"]
  }
]
```

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Comandos utiles:

- `pnpm build`: valida y compila el proyecto.
- `pnpm check`: ejecuta las comprobaciones de Astro.
- `pnpm test:unit`: ejecuta los tests unitarios.
- `pnpm test:e2e`: ejecuta los tests end-to-end.

## Flujo de contenido

La curacion diaria se gestiona con el heartbeat `daily-content-curation-agoraai`. Propone noticias nuevas que no esten duplicadas, espera aprobacion y despues la actualizacion aprobada se valida, commitea y publica.

Consulta `docs/content-curation-workflow.md` para ver el flujo completo.

## Roadmap

1. Ampliar la cobertura real mas alla de X.
2. Sustituir URLs de ejemplo por fuentes aprobadas en vivo.
3. Anadir automatizacion de deploy despues de CI.
4. Incorporar filtros mas completos y vistas de archivo.

## Estado

El proyecto ya cuenta con una timeline estatica funcional, buscador, checks de CI y un workflow de curacion de contenido con aprobacion humana.
