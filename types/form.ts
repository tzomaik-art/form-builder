export interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'country' | 'file' | 'hidden' | 'readonly' | 'social_name' | 'bestellnummer_id';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: ValidationRule[];
  conditional?: ConditionalLogic[];
  step: number;
  order: number;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'phone';
  value?: string | number;
  message: string;
}

export interface ConditionalLogic {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains';
  value: string;
  action: 'show' | 'hide';
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  order: number;
}

export interface FormStyling {
  theme: 'light' | 'dark';
  brandColor: string;
  cornerRadius: number;
  inputSize: 'sm' | 'md' | 'lg';
  labelStyle: 'stacked' | 'inline' | 'floating';
  buttonText: string;
}

export interface FormSettings {
  multiStep: boolean;
  showProgress: boolean;
  gdprConsent: boolean;
  gdprText?: string;
  spamProtection: {
    honeypot: boolean;
    recaptcha: boolean;
    recaptchaSiteKey?: string;
  };
  redirectUrl?: string;
  locale: 'en' | 'de' | 'el';
}

export interface Form {
  id: string;
  name: string;
  slug: string;
  fields: FormField[];
  steps?: FormStep[];
  styling: FormStyling;
  settings: FormSettings;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Submission {
  id: string;
  formId: string;
  customerId?: string;
  email: string;
  socialName: string;
  bestellId: string;
  payload: Record<string, any>;
  createdAt: Date;
}