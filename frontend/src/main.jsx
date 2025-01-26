import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { StocksProvider } from './contexts/StocksContext.jsx'
import { StocksFormProvider } from './contexts/StocksFormContext.jsx'

createRoot(document.getElementById('root')).render(


  <StocksProvider>
    <StocksFormProvider>
      <App />
    </StocksFormProvider>
  </StocksProvider>


)
