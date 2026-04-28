import { kv } from './kv.js'
import { initializeDevCycle } from '@devcycle/nodejs-server-sdk'

const devcycleUser = {
  user_id: 'lzvr-short-server',
}

const devcycleDefaults = {
  'admin-api-key': '',
  'turnstile-enabled': false,
  'turnstile-site-key': '',
  'turnstile-secret-key': '',
}
const DEVCYCLE_INIT_TIMEOUT_MS = 5000

function timeoutAfter(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms)
  })
}

async function createDevCycleClient() {
  const serverKey = process.env.DEVCYCLE_SERVER_SDK_KEY || ''
  if (!serverKey) {
    console.warn('[DevCycle] DEVCYCLE_SERVER_SDK_KEY is not set; app config will use safe defaults')
    return null
  }

  let client
  try {
    client = initializeDevCycle(serverKey)
    await Promise.race([client.onClientInitialized(), timeoutAfter(DEVCYCLE_INIT_TIMEOUT_MS)])
    console.log('[DevCycle] client initialized')
  } catch (err) {
    console.error('[DevCycle] initialization failed; app config will use safe defaults:', err.message)
  }

  return client || null
}

const devcycle = await createDevCycleClient()

function variableValue(key) {
  const fallback = devcycleDefaults[key]
  if (!devcycle) return fallback

  try {
    return devcycle.variableValue(devcycleUser, key, fallback)
  } catch (err) {
    console.error(`[DevCycle] failed to read variable "${key}":`, err.message)
    return fallback
  }
}

export const env = {
  LINKS: kv,
  get ADMIN_API_KEY() {
    return variableValue('admin-api-key')
  },
  get TURNSTILE_ENABLED() {
    return variableValue('turnstile-enabled')
  },
  get TURNSTILE_SITE_KEY() {
    return variableValue('turnstile-site-key')
  },
  get TURNSTILE_SECRET_KEY() {
    return variableValue('turnstile-secret-key')
  },
}
