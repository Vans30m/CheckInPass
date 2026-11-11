import { contextBridge } from 'electron';

// Expose protected capabilities to renderer safely
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
});

