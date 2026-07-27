# Simulador de vehículo autónomo

Aplicación web académica que representa la toma de decisiones de un vehículo
autónomo ante obstáculos detectados por sus sensores.

## Funciones principales

- Selección visual del obstáculo presente en la carretera.
- Lecturas automáticas de sensores.
- Radar con distancia segura de 12 metros.
- Frenado controlado y frenado de emergencia.
- Detención visual de la autopista cuando el vehículo llega a 0 km/h.
- Confirmación visual de que el vehículo se detuvo por el sensor.

## Ejecutar localmente

Se requiere Node.js 22.

```bash
npm ci
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Publicar en Vercel

1. Subir todos los archivos de este proyecto a la raíz de un repositorio de
   GitHub.
2. Importar el repositorio desde Vercel.
3. Seleccionar el framework `Next.js`.
4. Mantener la carpeta raíz en `./`.
5. Usar `npm ci` como comando de instalación.
6. Usar `npm run build` como comando de construcción.
7. Dejar vacío el campo `Output Directory`.
8. Presionar `Deploy`.

El archivo `vercel.json` ya contiene la configuración de construcción necesaria.

## Reemplazar una versión anterior

Estos archivos pueden copiarse sobre la versión anterior del repositorio. La
configuración nueva ignora los archivos antiguos de ChatGPT Sites durante la
compilación. Para mantener el repositorio ordenado, también se pueden eliminar
posteriormente `.openai`, `build`, `db`, `drizzle`, `examples`, `scripts`,
`worker` y `vite.config.ts`.
