import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App.tsx'
import '../app.css'
import { AuthProvider } from '../contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)