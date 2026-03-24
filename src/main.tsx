import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { ReloadPrompt } from "./Prompt";
// import 'jsvectormap/dist/css/jsvectormap.css';

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster/>
      <ReloadPrompt />
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
