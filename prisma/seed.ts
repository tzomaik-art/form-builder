import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create demo shop
  const shop = await prisma.shop.upsert({
    where: { shop: 'demo-shop.myshopify.com' },
    update: {},
    create: {
      id: 'demo-shop',
      shop: 'demo-shop.myshopify.com',
      accessToken: 'demo-token',
      settings: {
        bestellIdLength: 5,
        bestellIdPrefix: '',
        bestellIdSuffix: '',
        emailEnabled: true,
        emailTemplate: {
          subject: 'Welcome! Your registration is confirmed',
          body: 'Dear {{first_name}},\n\nThank you for registering!\n\nYour details:\n- Social Name: {{social_name}}\n- Bestellnummer ID: {{bestell_id}}\n- Email: {{email}}\n\nBest regards,\n{{store_name}} Team'
        },
        webhookUrl: '',
        rateLimit: 10
      }
    }
  });

  // Create demo form
  const form = await prisma.form.upsert({
    where: { slug: 'customer-registration' },
    update: {},
    create: {
      shopId: shop.id,
      name: 'Customer Registration',
      slug: 'customer-registration',
      schema: {
        fields: [
          {
            id: 'social_name',
            type: 'social_name',
            label: 'Social Name',
            placeholder: 'Enter your social media handle',
            required: true,
            step: 1,
            order: 0
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email Address',
            placeholder: 'Enter your email',
            required: true,
            step: 1,
            order: 1
          },
          {
            id: 'firstName',
            type: 'text',
            label: 'First Name',
            placeholder: 'Enter your first name',
            required: true,
            step: 1,
            order: 2
          },
          {
            id: 'lastName',
            type: 'text',
            label: 'Last Name',
            placeholder: 'Enter your last name',
            required: true,
            step: 1,
            order: 3
          },
          {
            id: 'bestellnummer_id',
            type: 'bestellnummer_id',
            label: 'Bestellnummer ID',
            required: false,
            step: 1,
            order: 4
          }
        ],
        styling: {
          theme: 'light',
          brandColor: '#ff00a8',
          cornerRadius: 8,
          inputSize: 'md',
          labelStyle: 'stacked',
          buttonText: 'Register'
        },
        settings: {
          multiStep: false,
          showProgress: true,
          gdprConsent: true,
          gdprText: 'I agree to the privacy policy and terms of service',
          spamProtection: {
            honeypot: true,
            recaptcha: false
          },
          locale: 'en'
        }
      },
      active: true
    }
  });

  console.log('✅ Seed data created successfully');
  console.log(`Demo shop: ${shop.shop}`);
  console.log(`Demo form: ${form.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });