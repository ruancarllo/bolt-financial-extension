import React, { useState, useEffect } from 'react'
import { IntlProvider, FormattedMessage } from 'react-intl'
import { CreditCard, Settings } from 'lucide-react'
import enMessages from './locales/en.json'
import ptBRMessages from './locales/pt-BR.json'

const messages = {
  'en': enMessages,
  'pt-BR': ptBRMessages,
}

function App() {
  const [locale, setLocale] = useState('en')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    chrome.storage.sync.get(['locale', 'subscribed'], (result) => {
      if (result.locale) setLocale(result.locale)
      if (result.subscribed !== undefined) setSubscribed(result.subscribed)
    })
  }, [])

  const handleSubscribe = () => {
    chrome.runtime.sendMessage({ action: 'subscribe' }, (response) => {
      if (response.success) {
        setSubscribed(true)
        chrome.storage.sync.set({ subscribed: true })
      }
    })
  }

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'pt-BR' : 'en'
    setLocale(newLocale)
    chrome.storage.sync.set({ locale: newLocale })
  }

  return (
    <IntlProvider messages={messages[locale]} locale={locale}>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-4">
            <FormattedMessage id="appTitle" />
          </h1>
          {subscribed ? (
            <p className="text-green-600 mb-4">
              <FormattedMessage id="subscriptionActive" />
            </p>
          ) : (
            <div>
              <p className="mb-4">
                <FormattedMessage id="subscriptionOffer" />
              </p>
              <button
                onClick={handleSubscribe}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
              >
                <CreditCard className="mr-2" />
                <FormattedMessage id="subscribe" />
              </button>
            </div>
          )}
          <button
            onClick={toggleLocale}
            className="mt-4 flex items-center text-gray-600 hover:text-gray-800"
          >
            <Settings className="mr-2" />
            <FormattedMessage id="changeLanguage" />
          </button>
        </div>
      </div>
    </IntlProvider>
  )
}

export default App