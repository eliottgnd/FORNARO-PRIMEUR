// Date d'ouverture des commandes : 1er décembre 2026, minuit heure de Paris (UTC+1 en hiver).
export const ORDERS_OPENING_DATE = new Date('2026-12-01T00:00:00+01:00')

export const ORDERS_OPENING_LABEL = '1er décembre'

export const ORDERS_CLOSED_MESSAGE = `Les commandes ouvrent le ${ORDERS_OPENING_LABEL}. Merci de votre patience !`

export function areOrdersOpen(now: Date = new Date()): boolean {
  return now.getTime() >= ORDERS_OPENING_DATE.getTime()
}
