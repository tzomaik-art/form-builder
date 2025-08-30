import { Resend } from 'resend';
import { renderTemplate } from './templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailVariables {
  social_name: string;
  bestell_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  store_name: string;
  form_submission: string;
}

export class EmailSender {
  async sendConfirmationEmail(
    to: string,
    template: { subject: string; body: string },
    variables: EmailVariables
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const subject = renderTemplate(template.subject, variables);
      const body = renderTemplate(template.body, variables);
      
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'noreply@formbuilder.app',
        to,
        subject,
        text: body
      });
      
      return { success: true };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}