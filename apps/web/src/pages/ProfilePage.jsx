import { useEffect, useMemo, useState } from 'react'

import { useAuth } from '../auth/AuthProvider'
import { TIMEZONE_OPTIONS, TimezoneId } from '../astrology/model'
import { fetchCurrentProfile, updateCurrentProfile } from '../services/profileApi'
import './ProfilePage.css'

function createEmptyProfile(user) {
  return {
    email: user?.email ?? '',
    display_name: '',
    birth_date: '',
    birth_time: '',
    birth_place_name: '',
    birth_latitude: '',
    birth_longitude: '',
    birth_timezone: TimezoneId.ASIA_YEKATERINBURG
  }
}

function normalizeProfile(profile, user) {
  return {
    ...createEmptyProfile(user),
    ...profile,
    birth_date: profile.birth_date ?? '',
    birth_time: profile.birth_time?.slice(0, 5) ?? '',
    birth_place_name: profile.birth_place_name ?? '',
    birth_latitude: profile.birth_latitude ?? '',
    birth_longitude: profile.birth_longitude ?? '',
    birth_timezone: profile.birth_timezone ?? TimezoneId.ASIA_YEKATERINBURG
  }
}

export default function ProfilePage({ onNavigate }) {
  const { configured, loading: authLoading, user, signOut } = useAuth()
  const [profile, setProfile] = useState(() => createEmptyProfile(user))
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState(null)

  const isReadyForChart = useMemo(() => (
    Boolean(
      profile.birth_date &&
      profile.birth_time &&
      profile.birth_latitude !== '' &&
      profile.birth_longitude !== '' &&
      profile.birth_timezone
    )
  ), [profile])

  useEffect(() => {
    if (!configured || authLoading || !user) {
      return
    }

    let isMounted = true
    setStatus('loading')
    setError('')

    fetchCurrentProfile(user.id)
      .then((data) => {
        if (!isMounted) {
          return
        }

        setProfile(normalizeProfile(data, user))
        setStatus('idle')
      })
      .catch((profileError) => {
        if (!isMounted) {
          return
        }

        setError(profileError.message)
        setStatus('error')
      })

    return () => {
      isMounted = false
    }
  }, [authLoading, configured, user])

  useEffect(() => {
    if (configured && !authLoading && !user) {
      onNavigate('login')
    }
  }, [authLoading, configured, onNavigate, user])

  function updateField(fieldName, value) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [fieldName]: value
    }))
  }

  function useBrowserTimezone() {
    updateField('birth_timezone', Intl.DateTimeFormat().resolvedOptions().timeZone)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('saving')
    setError('')
    setSavedAt(null)

    try {
      const data = await updateCurrentProfile(user.id, profile)

      setProfile(normalizeProfile(data, user))
      setSavedAt(new Date())
      setStatus('idle')
    } catch (saveError) {
      setError(saveError.message)
      setStatus('error')
    }
  }

  async function handleSignOut() {
    await signOut()
    onNavigate('login')
  }

  if (!configured) {
    return (
      <main className="profile-page">
        <section className="profile-page__shell">
          <p>Supabase не настроен. Добавьте переменные окружения для фронта.</p>
        </section>
      </main>
    )
  }

  if (authLoading) {
    return (
      <main className="profile-page">
        <section className="profile-page__shell">
          <p>Загружаем сессию...</p>
        </section>
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="profile-page">
      <section className="profile-page__shell">
        <header className="profile-page__header">
          <div>
            <p>Astra Liber</p>
            <h1>Профиль</h1>
          </div>

          <div className="profile-page__actions">
            <button type="button" onClick={() => onNavigate('chart')}>
              Карта
            </button>
            <button type="button" onClick={handleSignOut}>
              Выйти
            </button>
          </div>
        </header>

        <form className="profile-page__form" onSubmit={handleSubmit}>
          <section className="profile-page__section">
            <h2>Аккаунт</h2>

            <label className="profile-page__field">
              <span>Email</span>
              <input value={profile.email ?? user.email} disabled />
            </label>

            <label className="profile-page__field">
              <span>Имя</span>
              <input
                value={profile.display_name ?? ''}
                onChange={(event) => updateField('display_name', event.target.value)}
                placeholder="Как показывать вас в профиле"
              />
            </label>
          </section>

          <section className="profile-page__section">
            <div className="profile-page__section-head">
              <h2>Данные рождения</h2>
              <span className={isReadyForChart ? 'profile-page__badge profile-page__badge--ready' : 'profile-page__badge'}>
                {isReadyForChart ? 'Готово для карты' : 'Нужно заполнить'}
              </span>
            </div>

            <label className="profile-page__field">
              <span>Дата рождения</span>
              <input
                type="date"
                value={profile.birth_date}
                onChange={(event) => updateField('birth_date', event.target.value)}
              />
            </label>

            <label className="profile-page__field">
              <span>Время рождения</span>
              <input
                type="time"
                value={profile.birth_time}
                onChange={(event) => updateField('birth_time', event.target.value)}
              />
            </label>

            <label className="profile-page__field profile-page__field--wide">
              <span>Место рождения</span>
              <input
                value={profile.birth_place_name}
                onChange={(event) => updateField('birth_place_name', event.target.value)}
                placeholder="Город, страна"
              />
            </label>

            <label className="profile-page__field">
              <span>Широта</span>
              <input
                type="number"
                step="0.000001"
                value={profile.birth_latitude}
                onChange={(event) => updateField('birth_latitude', event.target.value)}
                placeholder="55.755826"
              />
            </label>

            <label className="profile-page__field">
              <span>Долгота</span>
              <input
                type="number"
                step="0.000001"
                value={profile.birth_longitude}
                onChange={(event) => updateField('birth_longitude', event.target.value)}
                placeholder="37.617300"
              />
            </label>

            <label className="profile-page__field profile-page__field--wide">
              <span>Часовой пояс рождения</span>
              <select
                value={profile.birth_timezone}
                onChange={(event) => updateField('birth_timezone', event.target.value)}
              >
                {TIMEZONE_OPTIONS.map((timezone) => (
                  <option key={timezone.id} value={timezone.id}>
                    {timezone.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="profile-page__secondary"
              onClick={useBrowserTimezone}
            >
              Использовать часовой пояс браузера
            </button>
          </section>

          <footer className="profile-page__footer">
            <button
              type="submit"
              className="profile-page__submit"
              disabled={status === 'saving' || status === 'loading'}
            >
              Сохранить
            </button>

            {savedAt && (
              <span>Сохранено {savedAt.toLocaleTimeString()}</span>
            )}
          </footer>

          {error && <p className="profile-page__error">{error}</p>}
        </form>
      </section>
    </main>
  )
}
