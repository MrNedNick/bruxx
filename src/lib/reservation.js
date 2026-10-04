import { ref } from 'vue'

// One reservation dialog for the whole site. Any button can open it, and the
// old site's deep links (#rezervace, #reservation) keep working.
export const reservationOpen = ref(false)

export const openReservation = () => (reservationOpen.value = true)
export const closeReservation = () => (reservationOpen.value = false)

export const RESERVATION_HASHES = ['#rezervace', '#reservation', '#reservierung']

// The booking widget the restaurant already uses (Bookio). It knows Czech and English.
export const bookingUrl = (lang) =>
  `https://www.bookiopro.com/bruxx/rs-widget?lang=${lang === 'cs' ? 'cs' : 'en'}&c1=022d77&c2=fff&c3=022d77`

export const PHONE = '+420 224 250 404'
export const PHONE_HREF = 'tel:+420224250404'
export const EMAIL = 'info@bruxx.cz'
export const ADDRESS = { street: 'Náměstí Míru 9', city: '120 00 Praha 2 – Vinohrady' }
export const MAPS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=Bruxx%2C+N%C3%A1m%C4%9Bst%C3%AD+M%C3%ADru+9%2C+Praha'
export const MAPS_EMBED =
  'https://www.google.com/maps?q=Bruxx,+N%C3%A1m%C4%9Bst%C3%AD+M%C3%ADru+9,+120+00+Praha&z=16&output=embed'
export const SOCIAL = {
  facebook: 'https://www.facebook.com/restauracebruxx/',
  instagram: 'https://www.instagram.com/bruxx_prague/',
}
export const TOGETHER = { site: 'https://www.tgthr.cz/', card: 'https://www.tgthr.cz/kupkartu/' }
export const PARLAMENT = 'https://www.vinohradskyparlament.cz/'
