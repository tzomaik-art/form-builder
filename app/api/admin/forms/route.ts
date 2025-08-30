import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { FormSchema } from '@/lib/validation/form-schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId') || 'demo-shop';
    
    const forms = await prisma.form.findMany({
      where: { shopId },
      include: {
        _count: {
          select: { submissions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ forms });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const shopId = 'demo-shop'; // In real app, get from session
    
    // Validate form data
    const validatedData = FormSchema.parse(body);
    
    const form = await prisma.form.create({
      data: {
        shopId,
        name: validatedData.name,
        slug: validatedData.slug,
        schema: {
          fields: validatedData.fields,
          steps: validatedData.steps,
          styling: validatedData.styling,
          settings: validatedData.settings
        }
      }
    });
    
    return NextResponse.json({ form });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 });
  }
}