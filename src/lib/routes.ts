export const PUBLIC_ROUTES = [
  '/',
  '/guides/',
  '/tips/',
  '/how-to-get-more-drifters/',
  '/how-to-build-ship/',
  '/connect-high-buildings/',
  '/discovery-events/',
  '/platforms/',
  '/release-date/',
  '/price/',
  '/system-requirements/',
  '/troubleshooting/',
  '/resources/',
  '/production-chains/',
  '/ships/',
  '/exploration/',
  '/updates/',
  '/search/',
] as const

export type PublicRoute = (typeof PUBLIC_ROUTES)[number]

export const GUIDE_ROUTES = [
  '/tips/',
  '/how-to-get-more-drifters/',
  '/how-to-build-ship/',
  '/connect-high-buildings/',
  '/discovery-events/',
  '/platforms/',
  '/release-date/',
  '/price/',
  '/system-requirements/',
  '/troubleshooting/',
  '/resources/',
  '/production-chains/',
  '/ships/',
  '/exploration/',
  '/updates/',
] as const

export type GuideRoute = Exclude<PublicRoute, '/' | '/guides/'>
