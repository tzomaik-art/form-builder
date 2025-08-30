import { z } from 'zod';

export const FieldType = z.enum([
  'text',
  'email', 
  'password',
  'tel',
  'textarea',
  'number',
  'select',
  'radio',
  'checkbox',
  'date',
  'country',
  'file',
  'hidden',
  'readonly',
  'social_name',
  'bestellnummer_id'
]);

export const ValidationRule = z.object({
  type: z.enum(['required', 'min', 'max', 'pattern', 'email', 'phone']),
  value: z.union([z.string(), z.number()]).optional(),
  message: z.string()
});

export const ConditionalLogic = z.object({
  field: z.string(),
  operator: z.enum(['equals', 'not_equals', 'contains', 'not_contains']),
  value: z.string(),
  action: z.enum(['show', 'hide'])
});

export const FormField = z.object({
  id: z.string(),
  type: FieldType,
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  validation: z.array(ValidationRule).optional(),
  conditional: z.array(ConditionalLogic).optional(),
  step: z.number().default(1),
  order: z.number()
});

export const FormStep = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  order: z.number()
});

export const FormStyling = z.object({
  theme: z.enum(['light', 'dark']).default('light'),
  brandColor: z.string().default('#ff00a8'),
  cornerRadius: z.number().default(8),
  inputSize: z.enum(['sm', 'md', 'lg']).default('md'),
  labelStyle: z.enum(['stacked', 'inline', 'floating']).default('stacked'),
  buttonText: z.string().default('Submit')
});

export const FormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Form name is required'),
  slug: z.string().min(1, 'Form slug is required'),
  fields: z.array(FormField),
  steps: z.array(FormStep).optional(),
  styling: FormStyling,
  settings: z.object({
    multiStep: z.boolean().default(false),
    showProgress: z.boolean().default(true),
    gdprConsent: z.boolean().default(false),
    gdprText: z.string().optional(),
    spamProtection: z.object({
      honeypot: z.boolean().default(true),
      recaptcha: z.boolean().default(false),
      recaptchaSiteKey: z.string().optional()
    }),
    redirectUrl: z.string().optional(),
    locale: z.enum(['en', 'de', 'el']).default('en')
  })
});

export type FormSchemaType = z.infer<typeof FormSchema>;
export type FormFieldType = z.infer<typeof FormField>;
export type FormStepType = z.infer<typeof FormStep>;

export const SubmissionSchema = z.object({
  formId: z.string(),
  fields: z.record(z.any()),
  honeypot: z.string().optional(),
  recaptchaToken: z.string().optional()
});

export type SubmissionType = z.infer<typeof SubmissionSchema>;