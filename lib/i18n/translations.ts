export const translations = {
  en: {
    form: {
      socialName: 'Social Name',
      bestellnummerId: 'Bestellnummer ID',
      submit: 'Submit',
      submitting: 'Submitting...',
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      invalidPhone: 'Please enter a valid phone number',
      success: 'Form submitted successfully!',
      error: 'There was an error submitting the form. Please try again.',
      gdprConsent: 'I agree to the privacy policy and terms of service',
      step: 'Step',
      of: 'of',
      next: 'Next',
      previous: 'Previous',
      saveToWhatsApp: 'Save ID to WhatsApp'
    },
    admin: {
      dashboard: 'Dashboard',
      forms: 'Forms',
      submissions: 'Submissions',
      settings: 'Settings',
      logs: 'Logs',
      createForm: 'Create Form',
      editForm: 'Edit Form',
      formName: 'Form Name',
      formSlug: 'Form Slug',
      active: 'Active',
      inactive: 'Inactive',
      submissions_count: 'Submissions',
      export: 'Export',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel'
    }
  },
  de: {
    form: {
      socialName: 'Social Name',
      bestellnummerId: 'Bestellnummer ID',
      submit: 'Registrieren',
      submitting: 'Wird gesendet...',
      required: 'Dieses Feld ist erforderlich',
      invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      invalidPhone: 'Bitte geben Sie eine gültige Telefonnummer ein',
      success: 'Formular erfolgreich gesendet!',
      error: 'Beim Senden des Formulars ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
      gdprConsent: 'Ich stimme der Datenschutzerklärung und den Nutzungsbedingungen zu',
      step: 'Schritt',
      of: 'von',
      next: 'Weiter',
      previous: 'Zurück',
      saveToWhatsApp: 'ID zu WhatsApp speichern'
    },
    admin: {
      dashboard: 'Dashboard',
      forms: 'Formulare',
      submissions: 'Einreichungen',
      settings: 'Einstellungen',
      logs: 'Protokolle',
      createForm: 'Formular erstellen',
      editForm: 'Formular bearbeiten',
      formName: 'Formularname',
      formSlug: 'Formular-Slug',
      active: 'Aktiv',
      inactive: 'Inaktiv',
      submissions_count: 'Einreichungen',
      export: 'Exportieren',
      delete: 'Löschen',
      save: 'Speichern',
      cancel: 'Abbrechen'
    }
  },
  el: {
    form: {
      socialName: 'Social Name',
      bestellnummerId: 'Bestellnummer ID',
      submit: 'Εγγραφή',
      submitting: 'Αποστολή...',
      required: 'Αυτό το πεδίο είναι υποχρεωτικό',
      invalidEmail: 'Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email',
      invalidPhone: 'Παρακαλώ εισάγετε έναν έγκυρο αριθμό τηλεφώνου',
      success: 'Η φόρμα υποβλήθηκε επιτυχώς!',
      error: 'Παρουσιάστηκε σφάλμα κατά την υποβολή της φόρμας. Παρακαλώ δοκιμάστε ξανά.',
      gdprConsent: 'Συμφωνώ με την πολιτική απορρήτου και τους όρους χρήσης',
      step: 'Βήμα',
      of: 'από',
      next: 'Επόμενο',
      previous: 'Προηγούμενο',
      saveToWhatsApp: 'Αποθήκευση ID στο WhatsApp'
    },
    admin: {
      dashboard: 'Ταμπλό',
      forms: 'Φόρμες',
      submissions: 'Υποβολές',
      settings: 'Ρυθμίσεις',
      logs: 'Αρχεία καταγραφής',
      createForm: 'Δημιουργία φόρμας',
      editForm: 'Επεξεργασία φόρμας',
      formName: 'Όνομα φόρμας',
      formSlug: 'Slug φόρμας',
      active: 'Ενεργό',
      inactive: 'Ανενεργό',
      submissions_count: 'Υποβολές',
      export: 'Εξαγωγή',
      delete: 'Διαγραφή',
      save: 'Αποθήκευση',
      cancel: 'Ακύρωση'
    }
  }
};

export type Locale = keyof typeof translations;

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}