import React from 'react';

/**
 * Pixel-crisp vector brand SVGs for tech, product, and fintech companies.
 * Official brand palettes and exact SVG geometries.
 */
export const BRAND_SVGS: Record<string, React.ReactNode> = {
  // Google
  google: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>
  ),

  // Microsoft
  microsoft: (
    <svg viewBox="0 0 23 23" width="100%" height="100%">
      <path fill="#f25022" d="M1 1h10v10H1z"/>
      <path fill="#7fba00" d="M12 1h10v10H12z"/>
      <path fill="#00a4ef" d="M1 12h10v10H1z"/>
      <path fill="#ffb900" d="M12 12h10v10H12z"/>
    </svg>
  ),

  // Apple
  apple: (
    <svg viewBox="0 0 170 170" width="100%" height="100%" fill="#FFFFFF">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.83-11.74-14.35-6.19-9.88-11.1-21.2-14.75-33.95-3.65-12.76-5.48-24.32-5.48-34.69 0-14.54 3.73-26.68 11.2-36.43 7.46-9.74 16.79-14.67 27.97-14.79 5.33 0 11.1 1.34 17.3 4.02 6.2 2.68 10.02 4.08 11.45 4.2 2.05-.22 6.1-1.68 12.16-4.38 6.06-2.7 11.53-3.95 16.42-3.77 15.1.78 26.6 6.32 34.5 16.63-12.43 7.55-18.5 18.06-18.2 31.54.29 10.55 4.3 19.33 12.02 26.33 7.72 7 17.06 11.13 28.02 12.39-2.73 8.35-6.28 17.08-10.64 26.2zM119.22 33.5c0-7.39 2.65-14.28 7.95-20.67 5.3-6.39 11.83-10.42 19.59-12.08.11 1.02.16 2.03.16 3.03 0 7.39-2.82 14.49-8.46 21.3-5.64 6.81-12.27 10.87-19.89 12.18-.32-1.25-.48-2.5-.48-3.76z"/>
    </svg>
  ),

  // Amazon
  amazon: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#FF9900" d="M1.6 15.4c4.3 3.2 10.2 4.9 15.6 2.2 2.4-1.2 4.5-3 6-5.2.4-.6-.2-1.2-.8-.8-1.5 1-3.2 1.8-5 2.2-4.9 1-10.1-.4-14.4-3.1-.7-.4-1.6.4-1.4 1.2z"/>
      <path fill="#FF9900" d="M22.8 11.6c-.3-.4-1.8-.2-2.7.1-.3.1-.3.4 0 .6 1.8 1.4 3.7.8 4-.2.1-.3-.2-1-.3-1.2z"/>
      <path fill="#FFFFFF" d="M14.5 8.7c0-1.8-1.1-2.9-3.2-2.9-2.2 0-3.5 1.2-3.8 2.6-.1.3.2.6.5.6l1.2-.1c.3 0 .4-.2.5-.4.2-.6.7-1 1.6-1 1.1 0 1.6.6 1.6 1.6v.5c-3.8.3-5.6 1.5-5.6 3.7 0 1.6 1.2 2.7 2.8 2.7 1.4 0 2.4-.7 2.8-1.7h.1v1.4c0 .3.2.5.5.5h1.3c.3 0 .5-.2.5-.5V8.7zm-1.6 4c-.3.9-1.1 1.5-2 1.5-.9 0-1.4-.6-1.4-1.4 0-1.2.9-1.9 3.4-2.1v2z"/>
    </svg>
  ),

  // Stripe
  stripe: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#635BFF"/>
      <path fill="#FFFFFF" d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697.5 12.834.5 7.67.5 4.093 3.272 4.093 7.828c0 5.485 5.568 6.309 8.243 7.425 2.148.895 2.877 1.638 2.877 2.658 0 1.054-.925 1.638-2.316 1.638-2.61 0-5.46-1.28-7.23-2.313L4.77 22.8c2.04.996 5.09 1.63 7.973 1.63 5.452 0 9.256-2.584 9.256-7.397 0-5.787-5.85-6.84-8.023-7.883z"/>
    </svg>
  ),

  // Uber
  uber: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#FFFFFF" d="M18.8 9.2v5.6c0 2.6-2.1 4.7-4.7 4.7h-4.2c-2.6 0-4.7-2.1-4.7-4.7V9.2h2.7v5.6c0 1.1.9 2 2 2h4.2c1.1 0 2-.9 2-2V9.2h2.7z"/>
    </svg>
  ),

  // Atlassian
  atlassian: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#0052CC" d="M11.53 2c-.2.27-.3.6-.26.93l2.84 10.63c.2.73.95 1.15 1.68.95.4-.11.72-.37.89-.73L21.9 3.5c.34-.69.05-1.52-.64-1.86-.31-.15-.67-.17-.99-.06L11.53 2z"/>
      <path fill="#2684FF" d="M2.1 20.5c-.34.69-.05 1.52.64 1.86.31.15.67.17.99.06l8.74-3.42c.2-.27.3-.6.26-.93l-2.84-10.63c-.2-.73-.95-1.15-1.68-.95-.4.11-.72.37-.89.73L2.1 20.5z"/>
    </svg>
  ),

  // Databricks
  databricks: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#FF3621" d="M1.2 5.6 12 0l10.8 5.6v2.8L12 2.8 1.2 8.4V5.6zm0 5.6L12 5.6l10.8 5.6v2.8L12 8.4 1.2 14v-2.8zm0 5.6L12 11.2l10.8 5.6v2.8L12 14 1.2 19.6v-2.8z"/>
    </svg>
  ),

  // Figma
  figma: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#0ACF83" d="M8 24a4 4 0 0 1-4-4 4 4 0 0 1 4-4h4v4a4 4 0 0 1-4 4z"/>
      <path fill="#A259FF" d="M4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z"/>
      <path fill="#F24E1E" d="M4 4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z"/>
      <path fill="#FF7262" d="M12 0h4a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-4V0z"/>
      <path fill="#1ABCFE" d="M20 12a4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 4 4z"/>
    </svg>
  ),

  // Notion
  notion: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#FFFFFF" d="M4.5 3.5l11-1.5c1.4-.2 2 .6 2.2 1.8l1.3 15.2c.2 1.5-.6 2.3-2 2.5l-11.5 1.5c-1.4.2-2.1-.5-2.3-1.8L1.9 6c-.2-1.4.7-2.3 2.1-2.5zm3 3.5v10.5l2.5-.3v-7.2l4.8 7.2h2.2V6.7l-2.5.3v7l-4.7-7H7.5z"/>
    </svg>
  ),

  // Goldman Sachs
  goldmansachs: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#7399C6"/>
      <text x="12" y="16.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="-0.5">GS</text>
    </svg>
  ),

  // DE Shaw
  deshaw: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#0A1E3F"/>
      <text x="12" y="15.5" fill="#C5A059" fontFamily="Georgia, serif" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="-0.3">DES</text>
    </svg>
  ),

  // Salesforce
  salesforce: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#00A1E0" d="M10 4.5c1.3-1.5 3.3-2.5 5.5-2.5 3.3 0 6.1 2.2 7 5.2 1.3.8 2.2 2.2 2.2 3.8 0 2.5-2 4.5-4.5 4.5H5.5C2.5 15.5 0 13 0 10s2.5-5.5 5.5-5.5c.8 0 1.5.2 2.2.5.6-1.5 1.8-2.6 3.3-3z"/>
    </svg>
  ),

  // Adobe
  adobe: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#FA0F00"/>
      <path fill="#FFFFFF" d="M14.7 3H22v18l-7.3-18zm-5.4 0H2v18l7.3-18zm2.7 6.4L16.2 21h-3.4l-1.6-4.2h-3.4l2.8-7.4h1.4z"/>
    </svg>
  ),

  // ServiceNow
  servicenow: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#81B5A1" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
  ),

  // NVIDIA
  nvidia: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#76B900" d="M8.2 8.6c1.3-1 2.8-1.5 4.5-1.5 3.5 0 6.4 2.8 6.4 6.3 0 1.8-.8 3.5-2.1 4.7l2.2 1.8c2-1.7 3.2-4.1 3.2-6.8 0-4.8-3.9-8.7-8.7-8.7-2.3 0-4.4.9-6 2.4l.5 1.8zm-3 2.5c-.7 1.1-1.1 2.4-1.1 3.8 0 3.7 2.8 6.7 6.4 7.1v-2.3c-2.4-.4-4.2-2.4-4.2-4.8 0-.9.3-1.8.8-2.5l-1.9-1.3zm6.8 3.8c0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6s.7-1.6 1.6-1.6c.9 0 1.6.7 1.6 1.6z"/>
    </svg>
  ),

  // Qualcomm
  qualcomm: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#3253DC"/>
      <text x="12" y="16.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="11" fontWeight="900" textAnchor="middle">Q</text>
    </svg>
  ),

  // Cisco
  cisco: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#049FD9" d="M2.5 13.5v5h1.5v-5h-1.5zm3.8-3v8h1.5v-8h-1.5zm3.8-3v11h1.5v-11h-1.5zm3.8 3v8h1.5v-8h-1.5zm3.8-6v14h1.5v-14h-1.5zm3.8 6v8h1.5v-8h-1.5z"/>
    </svg>
  ),

  // Airbnb
  airbnb: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#FF5A5F" d="M12 1c-4.2 0-7.3 3.6-7.3 8.3 0 5.4 5.2 11.2 7.3 13.7 2.1-2.5 7.3-8.3 7.3-13.7C19.3 4.6 16.2 1 12 1zm0 11.2c-1.8 0-3.2-1.4-3.2-3.2s1.4-3.2 3.2-3.2 3.2 1.4 3.2 3.2-1.4 3.2-3.2 3.2z"/>
    </svg>
  ),

  // Coinbase
  coinbase: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="12" r="11" fill="#0052FF"/>
      <rect x="8" y="8" width="8" height="8" rx="2" fill="#FFFFFF"/>
    </svg>
  ),

  // Snowflake
  snowflake: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#29B5E8" d="M12 0l1.8 4.2L12 6.5 10.2 4.2 12 0zm0 17.5l1.8 2.3L12 24l-1.8-4.2 1.8-2.3zM0 12l4.2-1.8L6.5 12l-2.3 1.8L0 12zm17.5 0l2.3-1.8L24 12l-4.2 1.8-2.3-1.8zm-7-2.5h3v3h-3v-3z"/>
    </svg>
  ),

  // LinkedIn
  linkedin: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#0A66C2"/>
      <path fill="#FFFFFF" d="M7.1 9.5H4.2v9.3h2.9V9.5zM5.7 8.2c1 0 1.8-.8 1.8-1.8 0-1-.8-1.8-1.8-1.8-1 0-1.8.8-1.8 1.8 0 1 .8 1.8 1.8 1.8zm14.1 10.6h-2.9v-4.7c0-1.2-.4-2-1.5-2-.8 0-1.3.5-1.5 1.1-.1.2-.1.5-.1.8v4.8H11s.1-8.5 0-9.3h2.9v1.3c.4-.6 1.1-1.5 2.7-1.5 2 0 3.5 1.3 3.5 4.1v5.4z"/>
    </svg>
  ),

  // Oracle
  oracle: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#C74634" d="M16.4 5.2H7.6C3.4 5.2 0 8.3 0 12s3.4 6.8 7.6 6.8h8.8c4.2 0 7.6-3.1 7.6-6.8s-3.4-6.8-7.6-6.8zm-.2 10.9H7.8C5 16.1 2.7 14.3 2.7 12s2.3-4.1 5.1-4.1h8.4c2.8 0 5.1 1.8 5.1 4.1s-2.3 4.1-5.1 4.1z"/>
    </svg>
  ),

  // SAP
  sap: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#008FD3"/>
      <text x="12" y="16.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="10" fontWeight="900" textAnchor="middle">SAP</text>
    </svg>
  ),

  // VMware
  vmware: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#607078"/>
      <text x="12" y="16" fill="#FFFFFF" fontFamily="sans-serif" fontSize="7.5" fontWeight="bold" textAnchor="middle">vmw</text>
    </svg>
  ),

  // PayPal
  paypal: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#003087" d="M7 4h7.5c3.2 0 5.5 2.1 5.5 5.2 0 3.8-3 6.3-6.5 6.3H9.8L8.2 22H5L7 4z"/>
      <path fill="#0079C1" d="M9.8 8h6c2.5 0 4.2 1.6 4.2 4 0 2.9-2.3 4.8-5 4.8h-2.8L10.8 22H8.5l2-11.5-.7-2.5z"/>
    </svg>
  ),

  // Visa
  visa: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#1A1F71"/>
      <text x="12" y="16" fill="#F7B600" fontFamily="sans-serif" fontSize="8.5" fontWeight="900" fontStyle="italic" textAnchor="middle">VISA</text>
    </svg>
  ),

  // American Express
  americanexpress: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#006FCF"/>
      <text x="12" y="15.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="7" fontWeight="bold" textAnchor="middle">AMEX</text>
    </svg>
  ),

  // JPMorgan Chase
  jpmorgan: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#0B2341"/>
      <text x="12" y="15.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="6.5" fontWeight="bold" textAnchor="middle">CHASE</text>
    </svg>
  ),

  // Morgan Stanley
  morganstanley: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#002B49"/>
      <text x="12" y="16" fill="#FFFFFF" fontFamily="Georgia, serif" fontSize="8.5" fontWeight="bold" textAnchor="middle">MS</text>
    </svg>
  ),

  // Postman
  postman: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="12" r="11" fill="#FF6C37"/>
      <path fill="#FFFFFF" d="M16 11l-7-4v3l4 2-4 2v3l7-4v-2z"/>
    </svg>
  ),

  // BrowserStack
  browserstack: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="9" cy="12" r="6" fill="#E45B25" opacity="0.9"/>
      <circle cx="15" cy="12" r="6" fill="#29A745" opacity="0.9"/>
    </svg>
  ),

  // Razorpay
  razorpay: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#0C2340"/>
      <path fill="#0070BA" d="M15 4l-7 9h5l-4 7 11-10h-6l1-6z"/>
    </svg>
  ),

  // Cred
  cred: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#0F0F0F"/>
      <path fill="#FFFFFF" d="M6 6h12v12H6V6zm2 2v8h8V8H8zm2 2h4v4h-4v-4z"/>
    </svg>
  ),

  // Zomato
  zomato: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#E23744"/>
      <text x="12" y="16.5" fill="#FFFFFF" fontFamily="system-ui, -apple-system, sans-serif" fontSize="12" fontWeight="900" fontStyle="italic" textAnchor="middle">z</text>
    </svg>
  ),

  // Paytm
  paytm: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#002E6E"/>
      <text x="12" y="15.5" fill="#00BAF2" fontFamily="system-ui, -apple-system, sans-serif" fontSize="6.5" fontWeight="900" textAnchor="middle">Paytm</text>
    </svg>
  ),

  // Blinkit
  blinkit: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#F8CB46"/>
      <text x="12" y="16.5" fill="#0C831F" fontFamily="system-ui, -apple-system, sans-serif" fontSize="12" fontWeight="900" textAnchor="middle">b</text>
    </svg>
  ),

  // Swiggy
  swiggy: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="12" r="11" fill="#FC8019"/>
      <path fill="#FFFFFF" d="M12 6a4 4 0 0 0-4 4c0 3.2 4 8 4 8s4-4.8 4-8a4 4 0 0 0-4-4zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
    </svg>
  ),

  // Zepto
  zepto: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#6A1B9A"/>
      <path fill="#FFD600" d="M13 2L5 13h5l-2 9 10-12h-6l1-8z"/>
    </svg>
  ),

  // Meesho
  meesho: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#820053"/>
      <text x="12" y="16.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="10" fontWeight="900" textAnchor="middle">M</text>
    </svg>
  ),

  // Flipkart
  flipkart: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#2874F0"/>
      <text x="12" y="16.5" fill="#FFEB3B" fontFamily="sans-serif" fontSize="11" fontWeight="900" fontStyle="italic" textAnchor="middle">f</text>
    </svg>
  ),

  // Walmart
  walmart: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#0071DC"/>
      <path fill="#FFC220" d="M12 7.5V3m0 18v-4.5M7.5 12H3m18 0h-4.5m-7.6-5.4L6 4.3m13.7 13.7-2.9-2.3M8.8 15.2l-2.8 2.8m13.7-13.7-2.8 2.8" stroke="#FFC220" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  ),

  // Nutanix
  nutanix: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#024DA1"/>
      <path fill="#FFFFFF" d="M5 8h4v8H5V8zm10 0h4v8h-4V8zm-5 3h4v5h-4v-5z"/>
    </svg>
  ),

  // Palo Alto Networks
  paloaltonetworks: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#FA582D"/>
      <path fill="#FFFFFF" d="M7 7h3v3H7zm7 0h3v3h-3zm-3.5 3.5h3v3h-3zm-3.5 3.5h3v3H7zm7 0h3v3h-3z"/>
    </svg>
  ),

  // Intuit
  intuit: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#0077C5"/>
      <text x="12" y="16" fill="#FFFFFF" fontFamily="sans-serif" fontSize="7.5" fontWeight="bold" textAnchor="middle">intuit</text>
    </svg>
  ),

  // Arcesium
  arcesium: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#0D2B45"/>
      <polygon points="12,4 19,9 19,15 12,20 5,15 5,9" fill="#20B2AA"/>
    </svg>
  ),

  // Tower Research Capital
  towerresearchcapital: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="12" r="11" fill="none" stroke="#C5A059" strokeWidth="1.8"/>
      <text x="12" y="15.5" fill="#C5A059" fontFamily="Georgia, serif" fontSize="8.5" fontWeight="bold" textAnchor="middle">TRC</text>
    </svg>
  ),

  // Media.net
  medianet: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#F47B20"/>
      <text x="12" y="15.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="6.5" fontWeight="900" textAnchor="middle">MEDIA</text>
    </svg>
  ),

  // Sprinklr
  sprinklr: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="12" r="11" fill="#FF5E00"/>
      <circle cx="12" cy="7" r="2" fill="#FFFFFF"/>
      <circle cx="12" cy="17" r="2" fill="#FFFFFF"/>
      <circle cx="7" cy="12" r="2" fill="#FFFFFF"/>
      <circle cx="17" cy="12" r="2" fill="#FFFFFF"/>
    </svg>
  ),

  // Zeta
  zeta: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#00B0FF"/>
      <path fill="#FFFFFF" d="M7 7h10l-7 10h7v-2"/>
    </svg>
  ),

  // Rippling
  rippling: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#FF4800"/>
      <path fill="#FFFFFF" d="M7 12c0-2.8 2.2-5 5-5v3c-1.1 0-2 .9-2 2s.9 2 2 2v3c-2.8 0-5-2.2-5-5zm7-5v10c2.8 0 5-2.2 5-5s-2.2-5-5-5z"/>
    </svg>
  ),

  // London Stock Exchange Group (LSEG)
  londonstockexchangegroup: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#001435"/>
      <text x="12" y="16" fill="#FFFFFF" fontFamily="sans-serif" fontSize="7.5" fontWeight="bold" textAnchor="middle">LSEG</text>
    </svg>
  ),

  // Datadog
  datadog: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="12" r="11" fill="#632CA6"/>
      <path fill="#FFFFFF" d="M9 7c1 0 2 1 2 2v2H9V9H7V7h2zm6 0c1 0 2 1 2 2v2h-2V9h-2V7h2zm-3 7c1.7 0 3-1.3 3-3H9c0 1.7 1.3 3 3 3z"/>
    </svg>
  ),

  // MongoDB
  mongodb: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#00ED64" d="M12 1.5c-.3 0-.6.1-.8.4C9.5 4.3 7 8.5 7 13.5c0 3.7 2.2 6.8 5 8.5 2.8-1.7 5-4.8 5-8.5 0-5-2.5-9.2-4.2-11.6-.2-.3-.5-.4-.8-.4zm0 2.5c1.3 2 3.5 5.5 3.5 9.5 0 2.8-1.5 5.2-3.5 6.6-2-1.4-3.5-3.8-3.5-6.6 0-4 2.2-7.5 3.5-9.5z"/>
    </svg>
  ),

  // Cloudflare
  cloudflare: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#F38020" d="M19.4 11.2c-.4-2.8-2.8-5-5.7-5-2.1 0-4 1.1-5 2.8-.5-.2-1.1-.3-1.7-.3-2.6 0-4.7 2.1-4.7 4.7 0 .3 0 .6.1.9C1 14.8 0 15.8 0 17c0 1.7 1.3 3 3 3h16.5c2.5 0 4.5-2 4.5-4.5 0-2.2-1.6-4.1-3.6-4.4-.3 0-.7.1-1 .1z"/>
    </svg>
  ),

  // Ramp
  ramp: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#DFFF00" d="M6 18L18 6v12H6z"/>
    </svg>
  ),

  // Brex
  brex: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#FF5000"/>
      <path fill="#FFFFFF" d="M7 6h5.5c2.5 0 4.5 1.6 4.5 3.8 0 1.4-.8 2.6-2 3.2 1.5.6 2.5 1.9 2.5 3.5 0 2.4-2.1 4.1-4.8 4.1H7V6zm3.2 5.8h2.2c1 0 1.8-.7 1.8-1.6s-.8-1.6-1.8-1.6h-2.2v3.2zm0 6h2.4c1.2 0 2.1-.8 2.1-1.8s-.9-1.8-2.1-1.8h-2.4v3.6z"/>
    </svg>
  ),

  // Rubrik
  rubrik: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#0096D6"/>
      <path fill="#FFFFFF" d="M12 4l6 4v8l-6 4-6-4V8l6-4zm0 3.2L8.5 9.3v5.4l3.5 2.1 3.5-2.1V9.3L12 7.2z"/>
    </svg>
  ),

  // Twilio
  twilio: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="12" r="11" fill="#F22F46"/>
      <circle cx="9" cy="9" r="2.2" fill="#FFFFFF"/>
      <circle cx="15" cy="9" r="2.2" fill="#FFFFFF"/>
      <circle cx="9" cy="15" r="2.2" fill="#FFFFFF"/>
      <circle cx="15" cy="15" r="2.2" fill="#FFFFFF"/>
    </svg>
  ),

  // Redis
  redis: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#DC382D"/>
      <polygon points="12,4 20,8 12,12 4,8" fill="#FFFFFF" opacity="0.9"/>
      <polygon points="4,8 12,12 12,20 4,16" fill="#FFFFFF" opacity="0.6"/>
      <polygon points="20,8 12,12 12,20 20,16" fill="#FFFFFF" opacity="0.75"/>
    </svg>
  ),

  // Harness
  harness: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#00ADE6"/>
      <path fill="#FFFFFF" d="M6 12l6-6 6 6-6 6-6-6zm4 0l2 2 2-2-2-2-2 2z"/>
    </svg>
  ),

  // Yugabyte
  yugabyte: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#FF6E42"/>
      <text x="12" y="16.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="11" fontWeight="900" textAnchor="middle">Y</text>
    </svg>
  ),

  // Cohesity
  cohesity: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#00BF6F"/>
      <text x="12" y="16.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="11" fontWeight="900" textAnchor="middle">C</text>
    </svg>
  ),

  // Pure Storage
  purestorage: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#FF5E00"/>
      <text x="12" y="16.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="11" fontWeight="900" textAnchor="middle">P//</text>
    </svg>
  ),

  // Gojek
  gojek: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="12" r="11" fill="#00AA13"/>
      <circle cx="12" cy="12" r="5" fill="#FFFFFF"/>
      <circle cx="12" cy="12" r="2.5" fill="#00AA13"/>
    </svg>
  ),

  // Expedia Group
  expediagroup: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#00355F"/>
      <path fill="#FFCC00" d="M5 13l6-3 6 3-2 1-4-2-4 2-2-1z"/>
      <circle cx="12" cy="7" r="2" fill="#FFCC00"/>
    </svg>
  ),

  // Agoda
  agoda: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="5" cy="12" r="2.2" fill="#E1251B"/>
      <circle cx="8.5" cy="8.5" r="2.2" fill="#F9A01B"/>
      <circle cx="12" cy="15.5" r="2.2" fill="#009900"/>
      <circle cx="15.5" cy="8.5" r="2.2" fill="#1877F2"/>
      <circle cx="19" cy="12" r="2.2" fill="#9C27B0"/>
    </svg>
  ),

  // InMobi
  inmobi: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#E41E26"/>
      <text x="12" y="16.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="8.5" fontWeight="bold" textAnchor="middle">inMobi</text>
    </svg>
  ),

  // ShareChat
  sharechat: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#25D366"/>
      <path fill="#FFFFFF" d="M12 4a8 8 0 0 0-7 12l-1 4 4-1a8 8 0 1 0 4-15z"/>
    </svg>
  ),

  // CrowdStrike
  crowdstrike: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#E10000"/>
      <path fill="#FFFFFF" d="M5 15l7-7 7 7-3 2-4-4-4 4z"/>
    </svg>
  ),

  // Roblox
  roblox: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#FFFFFF" d="M5.3 3L21 7.2l-4.2 15.7L1.1 18.7 5.3 3zm6.3 7.8l-1.3 4.9 4.9 1.3 1.3-4.9-4.9-1.3z"/>
    </svg>
  ),

  // GitLab
  gitlab: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#E24329" d="M12 21.5l3.8-11.7H8.2L12 21.5z"/>
      <path fill="#FC6D26" d="M12 21.5L8.2 9.8H1.7l10.3 11.7z"/>
      <path fill="#FCA326" d="M1.7 9.8l-1 3.2a1 1 0 00.4 1.1L12 21.5 1.7 9.8z"/>
      <path fill="#E24329" d="M1.7 9.8h6.5L5.7 2.2a.6.6 0 00-1.1 0L1.7 9.8z"/>
      <path fill="#FC6D26" d="M12 21.5l3.8-11.7h6.5L12 21.5z"/>
      <path fill="#FCA326" d="M22.3 9.8l1 3.2a1 1 0 01-.4 1.1L12 21.5l10.3-11.7z"/>
      <path fill="#E24329" d="M22.3 9.8h-6.5l2.5-7.6a.6.6 0 011.1 0l2.9 7.6z"/>
    </svg>
  ),

  // GitHub
  github: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#FFFFFF" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  ),

  // Brave
  brave: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#FB542B"/>
      <path fill="#FFFFFF" d="M12 2l7 4-1.5 8.5L12 22l-5.5-7.5L5 6l7-4z"/>
    </svg>
  ),

  // Canonical
  canonical: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#77216F"/>
      <circle cx="12" cy="12" r="7" stroke="#E95420" strokeWidth="2.5" fill="none"/>
    </svg>
  ),

  // Chargebee
  chargebee: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#FF5A5F"/>
      <circle cx="12" cy="12" r="6" fill="#FFFFFF"/>
    </svg>
  ),

  // Zerodha
  zerodha: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#387ED1"/>
      <text x="12" y="16.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="11" fontWeight="900" textAnchor="middle">Z</text>
    </svg>
  ),

  // Zoho
  zoho: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#E42528"/>
      <text x="12" y="16.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="8.5" fontWeight="900" textAnchor="middle">ZOHO</text>
    </svg>
  ),

  // Freshworks
  freshworks: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#F35C3E"/>
      <path fill="#FFFFFF" d="M12 4c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3.6-8 8-8zm0 3c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5z"/>
    </svg>
  ),

  // ThoughtWorks
  thoughtworks: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#003C71"/>
      <text x="12" y="16" fill="#FFFFFF" fontFamily="sans-serif" fontSize="8" fontWeight="bold" textAnchor="middle">/TW</text>
    </svg>
  ),

  // Infosys
  infosys: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#007CC3"/>
      <text x="12" y="16" fill="#FFFFFF" fontFamily="sans-serif" fontSize="7.5" fontWeight="bold" textAnchor="middle">Infosys</text>
    </svg>
  ),

  // Wipro
  wipro: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="8" cy="8.5" r="3.2" fill="#E01A22"/>
      <circle cx="16" cy="8.5" r="3.2" fill="#F48120"/>
      <circle cx="12" cy="15.5" r="3.2" fill="#2E86C1"/>
    </svg>
  ),

  // Cognizant
  cognizant: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#0033A0"/>
      <text x="12" y="16.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="11" fontWeight="900" textAnchor="middle">C</text>
    </svg>
  ),

  // DuckDuckGo
  duckduckgo: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="12" r="11" fill="#DE5833"/>
      <circle cx="12" cy="12" r="6" fill="#FFFFFF"/>
      <circle cx="12" cy="12" r="3" fill="#F6A800"/>
    </svg>
  ),

  // Semrush
  semrush: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#FF642D"/>
      <path fill="#FFFFFF" d="M6 14l6-6 6 6-3 3-3-3-3 3z"/>
    </svg>
  ),

  // Pulumi
  pulumi: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#8A3391"/>
      <text x="12" y="16.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="11" fontWeight="900" textAnchor="middle">P</text>
    </svg>
  ),

  // Replicate
  replicate: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <line x1="4" y1="12" x2="20" y2="12" stroke="#FFFFFF" strokeWidth="2.5"/>
      <line x1="12" y1="4" x2="12" y2="20" stroke="#FFFFFF" strokeWidth="2.5"/>
    </svg>
  ),

  // Toptal
  toptal: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#204ECF"/>
      <text x="12" y="16" fill="#FFFFFF" fontFamily="sans-serif" fontSize="9" fontWeight="bold" textAnchor="middle">top</text>
    </svg>
  ),

  // Automattic
  automattic: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#0087BE"/>
      <text x="12" y="16.5" fill="#FFFFFF" fontFamily="Georgia, serif" fontSize="11" fontWeight="bold" textAnchor="middle">(A)</text>
    </svg>
  ),

  // CleverTap
  clevertap: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#E84855"/>
      <circle cx="12" cy="12" r="5" fill="#FFFFFF"/>
    </svg>
  ),

  // Hasura
  hasura: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#1EB4D4"/>
      <polygon points="13,3 6,14 12,14 11,21 18,10 12,10" fill="#FFFFFF"/>
    </svg>
  ),

  // Hubstaff
  hubstaff: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#2D7FF9"/>
      <circle cx="12" cy="12" r="6" fill="#FFFFFF"/>
    </svg>
  ),

  // Octopus Deploy
  octopusdeploy: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#0D80D8"/>
      <circle cx="12" cy="10" r="4" fill="#FFFFFF"/>
      <path d="M8 14c0 3 8 3 8 0" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
    </svg>
  ),

  // Rocket Chat
  rocketchat: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#F5455C"/>
      <circle cx="12" cy="12" r="6" fill="#FFFFFF"/>
      <circle cx="12" cy="12" r="3" fill="#F5455C"/>
    </svg>
  ),

  // Cypress
  cypress: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#00BF88" d="M12 4a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm-1 12l-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9z"/>
    </svg>
  ),

  // Ko-fi
  kofi: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#FF5E5B"/>
      <path fill="#FFFFFF" d="M6 7h10c1 0 2 1 2 2v2c0 1-1 2-2 2H6V7zm11 2h1c.6 0 1 .4 1 1s-.4 1-1 1h-1V9zM6 15h9v2H6v-2z"/>
    </svg>
  ),

  // Motive
  motive: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#0057FF"/>
      <text x="12" y="16.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="11" fontWeight="900" textAnchor="middle">M</text>
    </svg>
  ),

  // MoEngage
  moengage: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#3855E0"/>
      <text x="12" y="16" fill="#FFFFFF" fontFamily="sans-serif" fontSize="8" fontWeight="bold" textAnchor="middle">mo</text>
    </svg>
  ),

  // Turing
  turing: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="12" r="11" fill="none" stroke="#00FFB2" strokeWidth="2"/>
      <text x="12" y="16.5" fill="#00FFB2" fontFamily="sans-serif" fontSize="11" fontWeight="900" textAnchor="middle">T</text>
    </svg>
  ),

  // EPAM Systems
  epam: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#39C2D7"/>
      <path fill="#FFFFFF" d="M4 7h16v2H4V7zm0 4h12v2H4v-2zm0 4h16v2H4v-2z"/>
      <path fill="#BED847" d="M18 11h2v2h-2v-2z"/>
    </svg>
  ),

  // Observe.AI
  observeai: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#0047FF"/>
      <circle cx="12" cy="12" r="6" fill="#FFFFFF" opacity="0.3"/>
      <circle cx="12" cy="12" r="3.5" fill="#FFFFFF"/>
    </svg>
  ),

  // Apollo
  apollo: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#2962FF"/>
      <path fill="#FFFFFF" d="M12 4l5.5 11h-3.2l-2.3-4.6-2.3 4.6H6.5L12 4zm0 6.8l1.4 2.8h-2.8l1.4-2.8z"/>
      <circle cx="12" cy="18" r="1.5" fill="#FFAB00"/>
    </svg>
  ),

  // AssemblyAI
  assemblyai: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#3B82F6" d="M12 5l6 14h-3.2l-1.3-3.2h-3L9.2 19H6l6-14zm0 4.2L10.9 13h2.2L12 9.2z"/>
    </svg>
  ),

  // LeadSquared
  leadsquared: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#007AFF"/>
      <rect x="6" y="6" width="5" height="5" rx="1" fill="#FFFFFF"/>
      <rect x="13" y="6" width="5" height="5" rx="1" fill="#FFFFFF" opacity="0.6"/>
      <rect x="6" y="13" width="5" height="5" rx="1" fill="#FFFFFF" opacity="0.6"/>
      <rect x="13" y="13" width="5" height="5" rx="1" fill="#FFFFFF"/>
    </svg>
  ),

  // Skit.ai
  skitai: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#4F46E5"/>
      <circle cx="12" cy="12" r="5" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2" fill="#00D26A"/>
    </svg>
  ),

  // Docker
  docker: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#2496ED"/>
      <path fill="#FFFFFF" d="M19.3 12.3c-.3-.2-.8-.2-1.2 0-.2-.6-.6-1.1-1.1-1.4l-.5-.3-.3.4c-.4.6-.4 1.3-.2 2-.5.3-1.2.4-1.9.4H4.5c-.3 0-.5.2-.5.5 0 2.8 1.8 5.2 4.4 6 1.1.3 2.3.4 3.6.4 5.3 0 9.7-3.6 10.3-8.8.2-.1.4-.3.5-.5.4-.6.6-1.3.6-2l-.1-.4-.5.1c-.6.2-1.1.4-1.5.7l-.5.3.3.5c.3.5.3 1.1.2 1.6zM8 7.5h2v2H8zm3 0h2v2h-2zm3 0h2v2h-2zm-6 3h2v2H8zm3 0h2v2h-2zm3 0h2v2h-2zm3 0h2v2h-2z"/>
    </svg>
  ),

  // Elastic
  elastic: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#005571"/>
      <circle cx="9" cy="8" r="2.5" fill="#FED10A"/>
      <circle cx="15" cy="8" r="2.5" fill="#00BFB3"/>
      <circle cx="12" cy="15" r="3.5" fill="#F04E98"/>
    </svg>
  ),

  // GitBook
  gitbook: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#3884FF"/>
      <path fill="#FFFFFF" d="M6 6.5C6 5.7 6.7 5 7.5 5H18v12H7.5C6.7 17 6 16.3 6 15.5v-9zm2 1.5v6.5c0 .3.2.5.5.5H16V8H8.5c-.3 0-.5.2-.5.5z"/>
    </svg>
  ),

  // Canny
  canny: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#5046E5"/>
      <path fill="#FFFFFF" d="M12 5a7 7 0 1 0 7 7h-2.5a4.5 4.5 0 1 1-4.5-4.5V5z"/>
    </svg>
  ),

  // Chromatic
  chromatic: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="8" r="3.5" fill="#FC521F"/>
      <circle cx="16" cy="15" r="3.5" fill="#FFAE00"/>
      <circle cx="8" cy="15" r="3.5" fill="#1EA7FD"/>
    </svg>
  ),

  // Netdata
  netdata: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#00AB44"/>
      <path fill="#FFFFFF" d="M6 14l3.5-5 3 4 2.5-3 3 4H6z"/>
    </svg>
  ),

  // Countly
  countly: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#28A745"/>
      <circle cx="9" cy="12" r="3" fill="#FFFFFF"/>
      <circle cx="15" cy="12" r="2" fill="#FFFFFF" opacity="0.7"/>
    </svg>
  ),

  // Daily Kos
  dailykos: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="5" fill="#F58220"/>
      <path fill="#FFFFFF" d="M7 6h3v12H7zm4 0h3l3.5 6L14 18h-3l3.5-6z"/>
    </svg>
  ),

  // PhonePe
  phonepe: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="6" fill="#5F259F"/>
      <path fill="#FFFFFF" d="M12.5 5h-3c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1s1-.4 1-1v-4.5h2c2.8 0 4.5-1.7 4.5-4.2s-1.7-4.3-4.5-4.3zm0 6.5h-2v-4.5h2c1.4 0 2.5.8 2.5 2.2s-1.1 2.3-2.5 2.3z"/>
    </svg>
  ),

  // Groww
  groww: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="12" r="10" fill="none" stroke="#00D09C" strokeWidth="3"/>
      <path fill="#00B2FF" d="M12 7l4 4h-3v6h-2v-6H8l4-4z"/>
    </svg>
  ),

  // Juspay
  juspay: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="6" fill="#0A2540"/>
      <path fill="#00D4FF" d="M14 6v8a4 4 0 0 1-4 4H7v-2.5h3a1.5 1.5 0 0 0 1.5-1.5V6H14z"/>
      <circle cx="12.5" cy="4.5" r="1.5" fill="#00D4FF"/>
    </svg>
  ),

  // Myntra
  myntra: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#F16521" d="M4 17l4-10 4 6-2 4H4z"/>
      <path fill="#E91E63" d="M12 13l4-6 4 10h-4l-2-4-2 0z"/>
    </svg>
  ),

  // Smallcase
  smallcase: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect x="3" y="11" width="8" height="8" rx="2" fill="#18B279"/>
      <rect x="13" y="5" width="8" height="14" rx="2" fill="#2EBD85"/>
      <rect x="3" y="5" width="8" height="4" rx="1.5" fill="#52E0A8"/>
    </svg>
  ),

  // Slice
  slice: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="6" fill="#8000FF"/>
      <path fill="#FFFFFF" d="M6 18L18 6v12H6z"/>
    </svg>
  ),

  // Jupiter Money
  jupiter: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="6" fill="#FF6433"/>
      <text x="12" y="17" fill="#FFFFFF" fontFamily="sans-serif" fontSize="13" fontWeight="900" textAnchor="middle">J</text>
    </svg>
  ),

  // Lenskart
  lenskart: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="7.5" cy="12" r="4.5" fill="none" stroke="#00C4FF" strokeWidth="2.2"/>
      <circle cx="16.5" cy="12" r="4.5" fill="none" stroke="#00C4FF" strokeWidth="2.2"/>
      <path fill="none" stroke="#00C4FF" strokeWidth="2.2" d="M12 12h0"/>
    </svg>
  ),

  // Target
  target: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="12" r="10" fill="#CC0000"/>
      <circle cx="12" cy="12" r="6.6" fill="#FFFFFF"/>
      <circle cx="12" cy="12" r="3.3" fill="#CC0000"/>
    </svg>
  ),

  // Samsung
  samsung: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <ellipse cx="12" cy="12" rx="11" ry="6" fill="#1428A0"/>
      <text x="12" y="14" fill="#FFFFFF" fontFamily="sans-serif" fontSize="4.5" fontWeight="900" letterSpacing="0.5" textAnchor="middle">SAMSUNG</text>
    </svg>
  ),

  // Accenture
  accenture: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path fill="#A100FF" d="M6 4l9 8-9 8h4.5l9-8-9-8H6z"/>
    </svg>
  ),

  // TCS
  tcs: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="6" fill="#00539B"/>
      <text x="12" y="15.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="7" fontWeight="900" letterSpacing="0.5" textAnchor="middle">TCS</text>
    </svg>
  ),

  // Capgemini
  capgemini: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="6" fill="#0070AD"/>
      <path fill="#FFFFFF" d="M12 5c-3 0-5 2-5 4.5 0 2 1.5 3.5 3 4.2L8 18h8l-2-4.3c1.5-.7 3-2.2 3-4.2C17 7 15 5 12 5z"/>
    </svg>
  ),

  // HCL Technologies
  hcl: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="6" fill="#005EB8"/>
      <text x="12" y="15.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="7" fontWeight="900" letterSpacing="0.5" textAnchor="middle">HCL</text>
    </svg>
  ),

  // Ola
  ola: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <circle cx="12" cy="12" r="9" fill="none" stroke="#A0D468" strokeWidth="3"/>
      <circle cx="12" cy="12" r="4.5" fill="#A0D468"/>
    </svg>
  ),

  // Udaan
  udaan: (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <rect width="24" height="24" rx="6" fill="#E53935"/>
      <text x="12" y="16.5" fill="#FFFFFF" fontFamily="sans-serif" fontSize="10" fontWeight="900" textAnchor="middle">U</text>
    </svg>
  ),
};

// Aliases and normalizations
const COMPANY_ALIASES: Record<string, string> = {
  'google': 'google',
  'microsoft': 'microsoft',
  'apple': 'apple',
  'amazon': 'amazon',
  'stripe': 'stripe',
  'uber': 'uber',
  'atlassian': 'atlassian',
  'databricks': 'databricks',
  'figma': 'figma',
  'notion': 'notion',
  'goldman sachs': 'goldmansachs',
  'de shaw': 'deshaw',
  'd e shaw': 'deshaw',
  'salesforce': 'salesforce',
  'adobe': 'adobe',
  'servicenow': 'servicenow',
  'nvidia': 'nvidia',
  'qualcomm': 'qualcomm',
  'cisco': 'cisco',
  'airbnb': 'airbnb',
  'coinbase': 'coinbase',
  'snowflake': 'snowflake',
  'linkedin': 'linkedin',
  'oracle': 'oracle',
  'sap': 'sap',
  'sap labs': 'sap',
  'vmware': 'vmware',
  'paypal': 'paypal',
  'visa': 'visa',
  'american express': 'americanexpress',
  'jpmorgan': 'jpmorgan',
  'jp morgan': 'jpmorgan',
  'jp morgan chase': 'jpmorgan',
  'morgan stanley': 'morganstanley',
  'tower research': 'towerresearchcapital',
  'tower research capital': 'towerresearchcapital',
  'media.net': 'medianet',
  'medianet': 'medianet',
  'arcesium': 'arcesium',
  'postman': 'postman',
  'browserstack': 'browserstack',
  'razorpay': 'razorpay',
  'cred': 'cred',
  'swiggy': 'swiggy',
  'zepto': 'zepto',
  'meesho': 'meesho',
  'flipkart': 'flipkart',
  'walmart': 'walmart',
  'walmart global tech': 'walmart',
  'nutanix': 'nutanix',
  'palo alto networks': 'paloaltonetworks',
  'intuit': 'intuit',
  'sprinklr': 'sprinklr',
  'zeta': 'zeta',
  'rippling': 'rippling',
  'lseg': 'londonstockexchangegroup',
  'london stock exchange group': 'londonstockexchangegroup',
  'datadog': 'datadog',
  'mongodb': 'mongodb',
  'cloudflare': 'cloudflare',
  'ramp': 'ramp',
  'brex': 'brex',
  'rubrik': 'rubrik',
  'twilio': 'twilio',
  'redis': 'redis',
  'harness': 'harness',
  'yugabyte': 'yugabyte',
  'cohesity': 'cohesity',
  'pure storage': 'purestorage',
  'gojek': 'gojek',
  'expedia group': 'expediagroup',
  'expedia': 'expediagroup',
  'agoda': 'agoda',
  'inmobi': 'inmobi',
  'sharechat': 'sharechat',
  'crowdstrike': 'crowdstrike',
  'roblox': 'roblox',
  'gitlab': 'gitlab',
  'github': 'github',
  'brave': 'brave',
  'canonical': 'canonical',
  'chargebee': 'chargebee',
  'zerodha': 'zerodha',
  'zoho': 'zoho',
  'freshworks': 'freshworks',
  'thoughtworks': 'thoughtworks',
  'infosys': 'infosys',
  'wipro': 'wipro',
  'cognizant': 'cognizant',
  'duckduckgo': 'duckduckgo',
  'semrush': 'semrush',
  'pulumi': 'pulumi',
  'replicate': 'replicate',
  'toptal': 'toptal',
  'automattic': 'automattic',
  'clevertap': 'clevertap',
  'hasura': 'hasura',
  'hubstaff': 'hubstaff',
  'octopus deploy': 'octopusdeploy',
  'rocket chat': 'rocketchat',
  'cypress': 'cypress',
  'ko-fi': 'kofi',
  'kofi': 'kofi',
  'motive': 'motive',
  'moengage': 'moengage',
  'turing': 'turing',
  'epam': 'epam',
  'epam systems': 'epam',
  'observe.ai': 'observeai',
  'observeai': 'observeai',
  'observe ai': 'observeai',
  'apollo': 'apollo',
  'apollo.io': 'apollo',
  'assemblyai': 'assemblyai',
  'assembly ai': 'assemblyai',
  'leadsquared': 'leadsquared',
  'skit.ai': 'skitai',
  'skitai': 'skitai',
  'skit ai': 'skitai',
  'docker': 'docker',
  'elastic': 'elastic',
  'gitbook': 'gitbook',
  'canny': 'canny',
  'chromatic': 'chromatic',
  'netdata': 'netdata',
  'netdata inc.': 'netdata',
  'netdata inc': 'netdata',
  'counlty': 'countly',
  'countly': 'countly',
  'daily kos': 'dailykos',
  'motive (india)': 'motive',
  'phonepe': 'phonepe',
  'phone pe': 'phonepe',
  'groww': 'groww',
  'juspay': 'juspay',
  'myntra': 'myntra',
  'smallcase': 'smallcase',
  'slice': 'slice',
  'jupiter money': 'jupiter',
  'jupiter': 'jupiter',
  'lenskart': 'lenskart',
  'target': 'target',
  'target india': 'target',
  'samsung': 'samsung',
  'samsung r&d': 'samsung',
  'accenture': 'accenture',
  'tcs': 'tcs',
  'capgemini': 'capgemini',
  'hcl': 'hcl',
  'hcl technologies': 'hcl',
  'ola': 'ola',
  'udaan': 'udaan',
  'zomato': 'zomato',
  'paytm': 'paytm',
  'blinkit': 'blinkit',
  'microsoft idc': 'microsoft',
  'google hyderabad': 'google',
  'amazon development centre': 'amazon',
  'amazon development center': 'amazon',
  'd.e. shaw & co': 'deshaw',
  'd.e. shaw': 'deshaw',
};

export function getBrandSvg(companyName: string): React.ReactNode | null {
  if (!companyName) return null;
  const raw = companyName.toLowerCase().trim();

  // Strip common suffixes like "India", "(India)", "Technologies", "Tech", "Labs", "Group", "(Broadcom)", "IDC", regional hubs, etc.
  const stripped = raw
    .replace(/\s*\((broadcom|india|kos media)\)/gi, '')
    .replace(/\s+(india|idc|development centre|development center|technologies|technology|tech|labs|inc|corporation|group|llc|ltd|co|hyderabad|bangalore|bengaluru|gurugram|noida|delhi|mumbai|pune)\b/gi, '')
    .trim();

  const key1 = COMPANY_ALIASES[raw];
  if (key1 && BRAND_SVGS[key1]) return BRAND_SVGS[key1];

  const key2 = COMPANY_ALIASES[stripped];
  if (key2 && BRAND_SVGS[key2]) return BRAND_SVGS[key2];

  const norm1 = raw.replace(/[^a-z0-9]/g, '');
  if (BRAND_SVGS[norm1]) return BRAND_SVGS[norm1];

  const norm2 = stripped.replace(/[^a-z0-9]/g, '');
  if (BRAND_SVGS[norm2]) return BRAND_SVGS[norm2];

  return null;
}

