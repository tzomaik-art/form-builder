import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const shopId = 'demo-shop'; // In real app, get from session
    
    const shop = await prisma.shop.findUnique({
      where: { id: shopId }
    });
    
    const settings = shop?.settings || {};
    
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const shopId = 'demo-shop'; // In real app, get from session
    
    await prisma.shop.update({
      where: { id: shopId },
      data: { settings: body }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}