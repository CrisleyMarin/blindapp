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

Luego abre la URL que muestre Vite, normalmente:

```text
http://127.0.0.1:5173/
```

## VS Code

Si ves un error como `Cannot find module ... vscode.git.Git.log`, VS Code esta intentando ejecutar el archivo activo en vez del proyecto.

Usa una de estas opciones:

- Terminal > New Terminal, luego `npm.cmd run dev`.
- Terminal > Run Task > `Run Blind Ambitions Dashboard`.
- Run and Debug > `Open Blind Ambitions Dashboard`.

## Estructura

- `src/App.jsx`: dashboard principal.
- `src/main.jsx`: entrada de React.
- `src/styles.css`: estilos globales base.
- `package.json`: scripts y dependencias.
