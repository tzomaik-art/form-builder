export interface EmailTemplate {
  subject: string;
  body: string;
}

export const defaultEmailTemplates: Record<string, EmailTemplate> = {
  en: {
    subject: 'Welcome! Your registration is confirmed',
    body: `Dear {{first_name}},

Thank you for registering with {{store_name}}!

Your details:
- Social Name: {{social_name}}
- Bestellnummer ID: {{bestell_id}}
- Email: {{email}}

Please save your Bestellnummer ID for future reference.

Best regards,
{{store_name}} Team`
  },
  de: {
    subject: 'Willkommen! Ihre Registrierung ist bestätigt',
    body: `Liebe/r {{first_name}},

Vielen Dank für Ihre Registrierung bei {{store_name}}!

Ihre Daten:
- Social Name: {{social_name}}
- Bestellnummer ID: {{bestell_id}}
- E-Mail: {{email}}

Bitte speichern Sie Ihre Bestellnummer ID für zukünftige Referenz.

Mit freundlichen Grüßen,
{{store_name}} Team`
  },
  el: {
    subject: 'Καλώς ήρθατε! Η εγγραφή σας επιβεβαιώθηκε',
    body: `Αγαπητέ/ή {{first_name}},

Σας ευχαριστούμε για την εγγραφή σας στο {{store_name}}!

Τα στοιχεία σας:
- Social Name: {{social_name}}
- Bestellnummer ID: {{bestell_id}}
- Email: {{email}}

Παρακαλώ αποθηκεύστε το Bestellnummer ID σας για μελλοντική αναφορά.

Με εκτίμηση,
Η ομάδα {{store_name}}`
  }
};

export function renderTemplate(template: string, variables: Record<string, string>): string {
  let rendered = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, value || '');
  }
  
  return rendered;
}