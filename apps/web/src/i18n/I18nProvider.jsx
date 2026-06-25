import {
  createContext,
  useContext,
  useMemo,
  useState
} from 'react'

import { createI18n, LOCALE_CODES } from './dictionary'

const STORAGE_KEY = 'ast.locale'

const I18nContext = createContext(null)

function readInitialLocale() {
  const savedLocale = window.localStorage.getItem(STORAGE_KEY)

  if (savedLocale) {
    return savedLocale
  }

  return navigator.language?.toLowerCase().startsWith('ru')
    ? LOCALE_CODES.RU
    : LOCALE_CODES.EN
}

export function I18nProvider({ children }) {
  const [localeCode, setLocaleCode] = useState(readInitialLocale)
  const i18n = useMemo(() => createI18n(localeCode), [localeCode])

  function setLocale(nextLocaleCode) {
    window.localStorage.setItem(STORAGE_KEY, nextLocaleCode)
    setLocaleCode(nextLocaleCode)
  }

  const value = useMemo(() => ({
    i18n,
    localeCode,
    setLocale
  }), [i18n, localeCode])

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider')
  }

  return context
}
