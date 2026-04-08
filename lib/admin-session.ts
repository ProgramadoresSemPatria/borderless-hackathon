// Edge-compatible HMAC-signed admin session cookie.
// Cookie format: `${base64url(payloadJson)}.${base64url(hmacSha256)}`

export const ADMIN_COOKIE = 'bl_admin_session'
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8 // 8h

type Payload = { exp: number }

function b64urlEncode(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlDecode(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4))
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/') + pad)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('ADMIN_SESSION_SECRET must be set and at least 16 chars')
  }
  return secret
}

export async function signSession(maxAgeSeconds = ADMIN_SESSION_MAX_AGE): Promise<string> {
  const payload: Payload = { exp: Math.floor(Date.now() / 1000) + maxAgeSeconds }
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload))
  const key = await hmacKey(getSecret())
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, payloadBytes))
  return `${b64urlEncode(payloadBytes)}.${b64urlEncode(sig)}`
}

export async function verifySession(token: string | undefined | null): Promise<boolean> {
  if (!token) return false
  const [p, s] = token.split('.')
  if (!p || !s) return false
  try {
    const payloadBytes = b64urlDecode(p)
    const sigBytes = b64urlDecode(s)
    const key = await hmacKey(getSecret())
    const ok = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes as BufferSource,
      payloadBytes as BufferSource
    )
    if (!ok) return false
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as Payload
    return typeof payload.exp === 'number' && payload.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}
