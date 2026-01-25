import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#faf7f5',
          borderRadius: 40,
        }}
      >
        {/* Flowing wave effect using overlapping circles */}
        <svg width="180" height="180" viewBox="0 0 180 180">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#C4857A" stopOpacity="0.9"/>
              <stop offset="50%" stopColor="#9B8AAD" stopOpacity="0.95"/>
              <stop offset="100%" stopColor="#7C9885" stopOpacity="0.9"/>
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#C4857A" stopOpacity="0.6"/>
              <stop offset="50%" stopColor="#9B8AAD" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#7C9885" stopOpacity="0.6"/>
            </linearGradient>
          </defs>
          <path
            d="M20 100 Q50 60, 90 85 Q130 110, 160 70"
            stroke="url(#grad1)"
            strokeWidth="30"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M28 108 Q62 78, 95 95 Q128 112, 152 82"
            stroke="url(#grad2)"
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="90" cy="135" r="5" fill="#C4857A" opacity="0.6"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
