import { useEffect, useState } from 'react'

import { useAuth } from '../auth/AuthProvider'
import { supabase } from '../services/supabaseClient'
import './AuthPage.css'

export default function AuthPage({ onNavigate }) {
  const { configured, user } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      onNavigate('profile')
    }
  }, [onNavigate, user])

  function updateField(fieldName, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [fieldName]: value
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('loading')
    setError('')
    setMessage('')

    try {
      const credentials = {
        email: form.email.trim(),
        password: form.password
      }

      const result = mode === 'login'
        ? await supabase.auth.signInWithPassword(credentials)
        : await supabase.auth.signUp(credentials)

      if (result.error) {
        throw result.error
      }

      if (result.data.session) {
        onNavigate('profile')
        return
      }

      setMessage('Проверьте почту и подтвердите регистрацию, затем войдите.')
      setStatus('success')
    } catch (authError) {
      setError(authError.message)
      setStatus('error')
    }
  }

  if (!configured) {
    return (
      <main className="auth-page">
        <section className="auth-page__panel">
          <h1>Astra Liber</h1>
          <p>
            Supabase не настроен. Добавьте `VITE_SUPABASE_URL` и
            `VITE_SUPABASE_ANON_KEY` в `web/.env.local`.
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <section className="auth-page__panel">
        <header className="auth-page__header">
          <p>Astra Liber</p>
          <h1>{mode === 'login' ? 'Вход' : 'Регистрация'}</h1>
        </header>

        <div className="auth-page__tabs" role="tablist" aria-label="Auth mode">
          <button
            type="button"
            className={mode === 'login' ? 'auth-page__tab auth-page__tab--active' : 'auth-page__tab'}
            onClick={() => setMode('login')}
          >
            Вход
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'auth-page__tab auth-page__tab--active' : 'auth-page__tab'}
            onClick={() => setMode('register')}
          >
            Регистрация
          </button>
        </div>

        <form className="auth-page__form" onSubmit={handleSubmit}>
          <label className="auth-page__field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              required
            />
          </label>

          <label className="auth-page__field">
            <span>Пароль</span>
            <input
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={6}
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="auth-page__submit"
            disabled={status === 'loading'}
          >
            {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        {message && <p className="auth-page__message">{message}</p>}
        {error && <p className="auth-page__error">{error}</p>}
      </section>
    </main>
  )
}
