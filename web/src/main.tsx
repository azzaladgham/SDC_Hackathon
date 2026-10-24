import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Disclaimer from './components/Disclaimer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <App />
    <Disclaimer />
  </StrictMode>,
)
