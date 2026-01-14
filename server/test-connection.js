import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config()

console.log('Testing Supabase connection...')
console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'))

try {
  const isLocal = process.env.DATABASE_URL?.includes('localhost') || process.env.DATABASE_URL?.includes('127.0.0.1');

  const sql = postgres(process.env.DATABASE_URL, {
    ssl: isLocal ? false : 'require',
    connect_timeout: 10,
    idle_timeout: 20
  })

  console.log('\nAttempting to connect...')

  const result = await sql`SELECT NOW() as current_time, version()`

  console.log('\n✅ Connection successful!')
  console.log('Current time:', result[0].current_time)
  console.log('PostgreSQL version:', result[0].version)

  await sql.end()
  console.log('\n✅ Test completed successfully!')
  process.exit(0)

} catch (error) {
  console.error('\n❌ Connection failed!')
  console.error('Error:', error.message)
  console.error('\nPossible solutions:')
  console.error('1. Check if Supabase project is paused')
  console.error('2. Verify password is correct: Magangits2025')
  console.error('3. Try connection pooler URL instead')
  console.error('4. Check firewall/network restrictions')
  process.exit(1)
}
