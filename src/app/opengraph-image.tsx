import { ImageResponse } from 'next/og'

export const alt = 'Corsair Cove Wiki - verified guides for building a pirate haven'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{
      alignItems: 'center',
      background: 'linear-gradient(135deg, #082f49 0%, #155e75 58%, #b45309 100%)',
      color: '#fff7ed',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      padding: '72px',
      width: '100%',
    }}>
      <div style={{ color: '#fbbf24', display: 'flex', fontSize: 30, letterSpacing: 6, textTransform: 'uppercase' }}>
        Independent Strategy Wiki
      </div>
      <div style={{ display: 'flex', fontSize: 82, fontWeight: 800, marginTop: 30, textAlign: 'center' }}>
        Corsair Cove Wiki
      </div>
      <div style={{ display: 'flex', fontSize: 34, marginTop: 28, opacity: 0.9, textAlign: 'center' }}>
        Verified guides for settlements, production, ships, and the Seven Seas
      </div>
    </div>,
    size,
  )
}
