# Blind Ambitions Dashboard

Proyecto React listo para abrir en VS Code.

## Requisitos

- Node.js instalado.
- En PowerShell, usa `npm.cmd` si `npm` aparece bloqueado por la politica de ejecucion de scripts.

## Comandos

```bash
npm.cmd install
npm.cmd run dev
```

Esto arranca la API segura en `http://127.0.0.1:4000` y el dashboard en:

```text
http://127.0.0.1:5174/
```

Credenciales demo:

```text
admin@blindambitions.com
admin123
```

## VS Code

Si ves un error como `Cannot find module ... vscode.git.Git.log`, VS Code esta intentando ejecutar el archivo activo en vez del proyecto.

Usa una de estas opciones:

- Terminal > New Terminal, luego `npm.cmd run dev`.
- Terminal > Run Task > `Run Blind Ambitions Dashboard`.
- Run and Debug > `Open Blind Ambitions Dashboard`.

## Estructura

- `src/App.jsx`: dashboard principal.
- `src/services/api.js`: cliente HTTP del frontend.
- `server/src/index.js`: API local con cookie httpOnly, rate limit y validaciones basicas.
- `server/data/database.json`: base de datos local para desarrollo.
- `src/main.jsx`: entrada de React.
- `src/styles.css`: estilos globales base.
- `package.json`: scripts y dependencias.
