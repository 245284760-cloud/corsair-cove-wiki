import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AdsterraNativeBanner } from '@/components/site/adsterra-native-banner'
import {
  adsterraNativeBannerContainerId,
  adsterraNativeBannerSrc,
} from '@/components/site/adsterra-native-banner'

describe('Adsterra native banner configuration', () => {
  it('exposes the approved script URL and container ID', () => {
    expect(adsterraNativeBannerSrc).toBe(
      'https://pl30782761.effectivecpmnetwork.com/b108f424e9a3270260db6df33a9a36bb/invoke.js',
    )
    expect(adsterraNativeBannerContainerId).toBe(
      'container-b108f424e9a3270260db6df33a9a36bb',
    )
  })

  it('renders a labeled ad region with the configured container', () => {
    render(<AdsterraNativeBanner />)

    expect(screen.getByRole('region', { name: 'Sponsored content' })).toBeTruthy()
    expect(document.getElementById(adsterraNativeBannerContainerId)).toBeTruthy()
  })
})
