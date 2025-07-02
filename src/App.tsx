

import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import routes from './routes'
import Login from './pages/Login'
import PageNotFound from './pages/PageNotFound'
import Dashboard from './pages/Dashboard'
import { Toaster } from './components/ui/sonner'


function App() {
  
  return (
    <>
      <Routes>
        <Route path={routes.login} element={<Login />} />
        <Route path="/" element={<Navigate to={routes.login} />} />
        <Route path="/*" element={<PageNotFound />} />
        <Route path={routes.dashboard} element={<Dashboard />} />
      </Routes>
        <Toaster />
    </>
  )
}

export default App
