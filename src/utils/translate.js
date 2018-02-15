import faLocale from '../locales/fa.json'
import arLocale from '../locales/ar.json'

let locale = 'fa'
const locales = {
  FA: 'FA',
  AR: 'AR',
}

export function setLocale(loc) {
  locale = loc
}

export default function translate(item) {
  switch (locale) {
    case locales.AR:
      return arLocale[item]
    case locales.FA:
    default:
      return faLocale[item]
  }
}
