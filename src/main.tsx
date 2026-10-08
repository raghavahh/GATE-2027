import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

if (/^#(error|access_token)=/.test(location.hash)) {
  const p = new URLSearchParams(location.hash.slice(1));
  location.replace(`${location.pathname}#/auth?error=${encodeURIComponent(p.get('error_description') ?? p.get('error') ?? 'sign-in failed')}`);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
