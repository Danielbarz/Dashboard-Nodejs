import bcrypt from 'bcryptjs'
import sql from './src/config/database.js'

async function seedUsers() {
  try {
    console.log('🌱 Seeding users...')

    // Check if super admin exists
    const superAdminExists = await sql`
      SELECT id FROM users WHERE email = 'superadmin@telkom.co.id'
    `
    
    if (superAdminExists.length === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10)
      const now = new Date()
      
      await sql`
        INSERT INTO users (name, email, password, role, current_role_as, created_at, updated_at)
        VALUES ('Super Admin Telkom', 'superadmin@telkom.co.id', ${hashedPassword}, 'superadmin', 'superadmin', ${now}, ${now})
      `
      
      console.log('✅ Super Admin user created: superadmin@telkom.co.id / password123')
    } else {
      console.log('✅ Super Admin user already exists')
    }

    // Check if admin exists
    const adminExists = await sql`
      SELECT id FROM users WHERE email = 'admin@telkom.co.id'
    `
    
    if (adminExists.length === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10)
      const now = new Date()
      
      await sql`
        INSERT INTO users (name, email, password, role, current_role_as, created_at, updated_at)
        VALUES ('Admin Telkom', 'admin@telkom.co.id', ${hashedPassword}, 'admin', 'admin', ${now}, ${now})
      `
      
      console.log('✅ Admin user created: admin@telkom.co.id / password123')
    } else {
      console.log('✅ Admin user already exists')
    }

    // Check if test user exists
    const userExists = await sql`
      SELECT id FROM users WHERE email = 'user@telkom.co.id'
    `
    
    if (userExists.length === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10)
      const now = new Date()
      
      await sql`
        INSERT INTO users (name, email, password, role, current_role_as, created_at, updated_at)
        VALUES ('User Telkom', 'user@telkom.co.id', ${hashedPassword}, 'user', 'user', ${now}, ${now})
      `
      
      console.log('✅ Test user created: user@telkom.co.id / password123')
    } else {
      console.log('✅ Test user already exists')
    }

    console.log('\n✨ Users seeding completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding users:', error)
    process.exit(1)
  }
}

seedUsers()
