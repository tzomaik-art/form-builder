import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const form = await prisma.form.findUnique({
      where: { slug: params.slug },
      select: {
        id: true,
        name: true,
        slug: true,
        schema: true,
        active: true
      }
    });
    
    if (!form || !form.active) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }
    
    return NextResponse.json({ form });
  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json({ error: 'Failed to fetch form' }, { status: 500 });
  }
}