
export const api_prefix = process.env.API_PREFIX || '/api/v1'

export const show_single_error_for_each_field = process.env.SHOW_SINGLE_VALIDATION_ERROR_FOR_EACH_FIELD === 'true' ? true : false

export const validation_message = process.env.VALIDATION_MESSAGE || 'Validation Errors'

export const algorithm = process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc'

export const encryption_key = process.env.ENCRYPTION_KEY || 'passwordplgdejolfafk34hugjnrhj12' // must be 32 chars

export const initialization_vector = process.env.INITIALIZATION_VECTOR || 'abcdefghijklmnop' // must be 16 chars

export const jwt_secret = process.env.JWT_SECRET || 'jfu7g89fyhugifjgk'

export const jwt_expire_access_token = (Number(process.env.JWT_EXPIRE_ACCESS_TOKEN_IN_DAYS) * 24 * 60 * 60) || 432000 // 5 days

export const jwt_expire_refresh_token = (Number(process.env.JWT_EXPIRE_REFRESH_TOKEN_IN_DAYS) * 24 * 60 * 60) || 604800 // 7 days

export const cookie_enabled = process.env.COOKIE_ENABLED === 'true' ? true : false

export const rate_limit_windowMS = (Number(process.env.RATE_LIMIT_MAX_MINUTES) * 60 * 1000) || 10 * 60 * 1000 // 10 mins

export const rate_limit_max_requests = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100