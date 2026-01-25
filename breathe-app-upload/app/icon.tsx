import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#faf7f5',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #C4857A 0%, #9B8AAD 50%, #7C9885 100%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
