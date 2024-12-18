import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthContextProvider } from './context/AuthContext.jsx'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
    <AuthContextProvider>
    <App />
    </AuthContextProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
