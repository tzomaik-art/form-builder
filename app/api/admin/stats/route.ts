import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const shopId = 'demo-shop'; // In real app, get from session
    
    const [totalForms, totalSubmissions] = await Promise.all([
      prisma.form.count({ where: { shopId } }),
      prisma.submission.count({ where: { shopId } })
    ]);
    
    const stats = {
      totalForms,
      totalSubmissions,
      activeCustomers: totalSubmissions, // Simplified for demo
      conversionRate: totalSubmissions > 0 ? Math.round((totalSubmissions / (totalSubmissions * 1.5)) * 100) : 0
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}