export const dbConfig = {
  // Connection pool settings
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  
  // Query optimization
  statement_timeout: '30s',
  idle_in_transaction_session_timeout: '30s',
}

export const getDatabaseUrl = () => {
  const baseUrl = process.env.DATABASE_URL
  if (!baseUrl) {
    throw new Error('DATABASE_URL is not defined')
  }
  
  // Add connection pooling parameters
  const url = new URL(baseUrl)
  url.searchParams.set('connection_limit', '10')
  url.searchParams.set('pool_timeout', '20')
  url.searchParams.set('statement_timeout', '30s')
  
  return url.toString()
}