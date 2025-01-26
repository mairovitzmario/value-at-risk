import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { StocksProvider } from './contexts/StocksContext.jsx'

createRoot(document.getElementById('root')).render(


  <StocksProvider>
    <App />
  </StocksProvider>


)
