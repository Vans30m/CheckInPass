# CheckInPass Desktop (Electron)

This directory contains the Electron wrapper and builder configuration for packaging **CheckInPass** into Windows desktop executables (`.exe`), including both an **NSIS Installer (`.exe`)** and a **Standalone Portable (`.exe`)**.

---

## Prerequisites

1. Ensure root dependencies and frontend are built:
   ```bash
   cd ../checkinpass-web/frontend
   npm install
   npm run build
   ```

2. Install Electron build dependencies inside this directory:
   ```bash
   cd ../electron
   npm install
   ```

---

## Available Commands

### 1. Run in Development Mode
Connects directly to your local Vite development server (`http://localhost:5173`):
```bash
npm start
```

### 2. Build Windows Executable (.exe)
Generates the Windows installer and portable `.exe` packages:
```bash
npm run build:win
```

Output `.exe` binaries will be saved in:
```
electron/dist/
├── CheckInPass Setup 1.0.0.exe   # Full NSIS installer
└── CheckInPass 1.0.0.exe         # Portable executable (no install required)
```

---

## Configuration

Settings can be customized inside [package.json](package.json) under the `"build"` block:
- **`appId`**: Application identifier (`com.checkinpass.desktop`).
- **`productName`**: Windows application name (`CheckInPass`).
- **`win.target`**: Targets configured for 64-bit Windows (`nsis` installer + `portable`).

