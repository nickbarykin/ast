import ChartPage from './pages/ChartPage'
import { I18nProvider } from './i18n'

export default function App() {
  return (
    <I18nProvider>
      <ChartPage />
    </I18nProvider>
  )
}
