import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const start = Date.now()
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    const dbTime = Date.now() - start
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      responseTime: `${dbTime}ms`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}