import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { BestellnummerIdGenerator } from '@/lib/redis';
import { getShopifyClient } from '@/lib/shopify/client';
import { EmailSender } from '@/lib/email/sender';
import { SubmissionSchema } from '@/lib/validation/form-schema';
import redis from '@/lib/redis';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const slug = params.slug;
    
    // Validate submission
    const validatedData = SubmissionSchema.parse(body);
    
    // Get form
    const form = await prisma.form.findUnique({
      where: { slug },
      include: { shop: true }
    });
    
    if (!form || !form.active) {
      return NextResponse.json({ error: 'Form not found or inactive' }, { status: 404 });
    }
    
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `ratelimit:${clientIp}`;
    const currentCount = await redis.incr(rateLimitKey);
    
    if (currentCount === 1) {
      await redis.expire(rateLimitKey, 60);
    }
    
    const shopSettings = form.shop.settings as any;
    const rateLimit = shopSettings.rateLimit || 10;
    
    if (currentCount > rateLimit) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    
    // Extract required fields
    const socialName = validatedData.fields.social_name;
    const email = validatedData.fields.email;
    
    if (!socialName || !email) {
      return NextResponse.json({ 
        error: 'Social Name and Email are required' 
      }, { status: 400 });
    }
    
    // Generate Bestellnummer ID
    const idGenerator = new BestellnummerIdGenerator(form.shopId);
    const bestellIdLength = shopSettings.bestellIdLength || 5;
    const prefix = shopSettings.bestellIdPrefix || '';
    const suffix = shopSettings.bestellIdSuffix || '';
    
    let bestellId: string;
    try {
      bestellId = await idGenerator.generateUniqueId(bestellIdLength, prefix, suffix);
    } catch (error) {
      return NextResponse.json({ 
        error: 'Failed to generate unique ID' 
      }, { status: 500 });
    }
    
    // Get Shopify client and check uniqueness
    const shopifyClient = await getShopifyClient(form.shop.shop);
    if (shopifyClient) {
      const exists = await shopifyClient.searchCustomerByBestellId(bestellId);
      if (exists) {
        await idGenerator.releaseReservation(bestellId);
        return NextResponse.json({ 
          error: 'ID collision detected, please try again' 
        }, { status: 500 });
      }
      
      // Create/update customer in Shopify
      const customerResult = await shopifyClient.createOrUpdateCustomer({
        email,
        firstName: validatedData.fields.firstName,
        lastName: validatedData.fields.lastName,
        phone: validatedData.fields.phone,
        socialName,
        bestellId
      });
      
      if (!customerResult.success) {
        await idGenerator.releaseReservation(bestellId);
        return NextResponse.json({ 
          error: 'Failed to create customer',
          details: customerResult.errors
        }, { status: 500 });
      }
    }
    
    // Save submission
    const submission = await prisma.submission.create({
      data: {
        formId: form.id,
        shopId: form.shopId,
        customerId: shopifyClient ? 'gid://shopify/Customer/123' : null,
        email,
        socialName,
        bestellId,
        payload: validatedData.fields,
        ipAddress: clientIp
      }
    });
    
    // Send email if enabled
    if (shopSettings.emailEnabled) {
      const emailSender = new EmailSender();
      const emailTemplate = shopSettings.emailTemplate || {
        subject: 'Welcome!',
        body: 'Thank you for registering!'
      };
      
      await emailSender.sendConfirmationEmail(
        email,
        emailTemplate,
        {
          social_name: socialName,
          bestell_id: bestellId,
          email,
          first_name: validatedData.fields.firstName || '',
          last_name: validatedData.fields.lastName || '',
          store_name: form.shop.shop,
          form_submission: JSON.stringify(validatedData.fields)
        }
      );
    }
    
    // Send webhook if configured
    if (shopSettings.webhookUrl) {
      fetch(shopSettings.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: form.id,
          submissionId: submission.id,
          socialName,
          bestellId,
          email,
          payload: validatedData.fields
        })
      }).catch(console.error);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        submissionId: submission.id,
        socialName,
        bestellId,
        email
      }
    });
    
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ 
      error: 'Failed to process submission' 
    }, { status: 500 });
  }
}