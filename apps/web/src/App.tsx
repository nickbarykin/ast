import { useEffect, useState } from 'react'

import ChartPage from './pages/ChartPage'
import { I18nProvider } from './i18n'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import { AuthProvider, useAuth } from './auth/AuthProvider'
import './App.css'

type AppRoute = 'chart' | 'login' | 'profile'

function getRouteFromHash(): AppRoute {
  const hash = window.location.hash.replace('#/', '')

  if (hash === 'login' || hash === 'profile' || hash === 'chart') {
    return hash
  }

  return 'chart'
}

function navigate(route: AppRoute) {
  window.location.hash = `/${route}`
}

function AppContent() {
  const [route, setRoute] = useState(getRouteFromHash)
  const { user } = useAuth()

  useEffect(() => {
    function handleHashChange() {
      setRoute(getRouteFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <>
      <nav className="app-nav" aria-label="Primary">
        <button type="button" onClick={() => navigate('chart')}>
          Карта
        </button>
        <button type="button" onClick={() => navigate(user ? 'profile' : 'login')}>
          {user ? 'Профиль' : 'Войти'}
        </button>
      </nav>

      {route === 'login' && <AuthPage onNavigate={navigate} />}
      {route === 'profile' && <ProfilePage onNavigate={navigate} />}
      {route === 'chart' && <ChartPage />}
    </>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </I18nProvider>
  )
}
