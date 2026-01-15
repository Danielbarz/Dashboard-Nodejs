import bcrypt from 'bcryptjs'
import sql from './src/config/database.js'

const args = process.argv.slice(2)
const email = args[0] || 'admin.upload@telkom.co.id'
const password = args[1] || 'password123'
const name = args[2] || 'Admin Uploader'

async function createAdmin() {
  try {
    console.log(`🌱 Creating/Updating admin user: ${email}...`)

    const hashedPassword = await bcrypt.hash(password, 10)
    const now = new Date()

    // Check if user exists
    const userExists = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (userExists.length > 0) {
      // Update existing user to admin
      await sql`
        UPDATE users 
        SET 
          role = 'admin',
          current_role_as = 'admin',
          password = ${hashedPassword},
          updated_at = ${now}
        WHERE email = ${email}
      `
      console.log(`✅ User ${email} updated to Admin role successfully!`)
    } else {
      // Create new admin user
      await sql`
        INSERT INTO users (name, email, password, role, current_role_as, created_at, updated_at)
        VALUES (${name}, ${email}, ${hashedPassword}, 'admin', 'admin', ${now}, ${now})
      `
      console.log(`✅ Admin user created: ${email}`)
    }

    console.log(`🔑 Credentials: `)
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log('\n✨ Done!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin:', error)
    process.exit(1)
  }
}

createAdmin()
