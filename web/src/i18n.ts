// i18n configuration for PackingList
const translations = {
    en: { appName: 'PackingList', description: 'Smart travel assistant with categorized packing lists' },
    de: { appName: 'PackingList', description: 'Smart travel assistant with categorized packing lists (DE)' },
} as const

export type Locale = keyof typeof translations
export const defaultLocale: Locale = 'en'
export const supportedLocales = Object.keys(translations) as Locale[]

export function t(key: keyof typeof translations.en, locale: Locale = defaultLocale): string {
    return translations[locale]?.[key] ?? translations.en[key] ?? key
}

export default translations
