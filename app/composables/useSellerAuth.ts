export function useSellerAuth() {
  const config = useRuntimeConfig()
  const apiBase = config.public?.apiBase ?? '/api'
  const tokenState = useState<string | null>('seller_token', () => {
    if (process.client) return localStorage.getItem('seller_token')
    return null
  })

  function getToken() {
    return tokenState.value
  }

  async function login({ identifier, password, device = 'nuxt' }: { identifier: string; password: string; device?: string }) {
    const body = {
      identifier,
      password,
      device_name: device,
    }
    const res = await $fetch(`${apiBase}/api/seller/login`, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
    })

    const tok = res.token as string
    if (process.client && tok) {
      localStorage.setItem('seller_token', tok)
    }
    tokenState.value = tok
    return res
  }

  async function logout() {
    const t = tokenState.value
    if (!t) return
    try {
      await $fetch(`${apiBase}/api/seller/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${t}`, Accept: 'application/json' },
      })
    } catch (e) {
      // ignore
    }
    if (process.client) localStorage.removeItem('seller_token')
    tokenState.value = null
  }

  function authHeader() {
    const t = tokenState.value
    return t ? { Authorization: `Bearer ${t}` } : {}
  }

  return { login, logout, getToken, authHeader, tokenState }
}
