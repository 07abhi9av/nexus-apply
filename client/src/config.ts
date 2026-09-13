/**
 * Application Runtime Configuration
 * Single source of truth for backend API base URL & deployment environment.
 */
export const API_BASE: string =
  typeof import.meta.env.VITE_API_URL === 'string'
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:4000';

export const isLocalDev: boolean =
  import.meta.env.DEV || API_BASE.includes('localhost') || API_BASE.includes('127.0.0.1');
