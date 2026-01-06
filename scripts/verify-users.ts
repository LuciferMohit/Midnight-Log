
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const users = await prisma.user.findMany()
        console.log('--- User Registry ---')
        console.log(`Total Users: ${users.length}`)
        users.forEach(u => {
            console.log(`- ${u.name} (${u.email}) [ID: ${u.id}]`)
        })
        console.log('---------------------')
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
