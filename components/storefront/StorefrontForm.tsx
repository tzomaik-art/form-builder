'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField } from '@/types/form';
import { getTranslation } from '@/lib/i18n/translations';

interface StorefrontFormProps {
  form: any;
  preview?: boolean;
  onSubmit: (data: any) => void;
}

export function StorefrontForm({ form, preview = false, onSubmit }: StorefrontFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);
  
  const locale = form.settings?.locale || 'en';
  
  // Build validation schema
  const validationSchema = z.object(
    form.fields.reduce((acc: any, field: FormField) => {
      let validator = z.string();
      
      if (field.required) {
        validator = validator.min(1, getTranslation(locale as any, 'form.required'));
      }
      
      if (field.type === 'email') {
        validator = validator.email(getTranslation(locale as any, 'form.invalidEmail'));
      }
      
      acc[field.id] = field.required ? validator : validator.optional();
      return acc;
    }, {})
  );
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(validationSchema)
  });
  
  const onFormSubmit = async (data: any) => {
    if (preview) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/forms/${form.slug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitSuccess(true);
        setSubmissionData(result.data);
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitSuccess && submissionData) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {getTranslation(locale as any, 'form.success')}
          </h3>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600 mb-2">Your details:</p>
            <div className="space-y-1">
              <p><strong>Social Name:</strong> {submissionData.socialName}</p>
              <p><strong>Bestellnummer ID:</strong> {submissionData.bestellId}</p>
              <p><strong>Email:</strong> {submissionData.email}</p>
            </div>
          </div>
          
          <a
            href={`https://wa.me/?text=My%20Bestellnummer%20ID:%20${submissionData.bestellId}`}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mr-2">💬</span>
            {getTranslation(locale as any, 'form.saveToWhatsApp')}
          </a>
        </div>
      </div>
    );
  }
  
  const currentStepFields = form.fields.filter((field: FormField) => 
    !form.settings.multiStep || field.step === currentStep
  );
  
  const totalSteps = form.settings.multiStep 
    ? Math.max(...form.fields.map((f: FormField) => f.step)) 
    : 1;

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {form.settings.multiStep && form.settings.showProgress && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{getTranslation(locale as any, 'form.step')} {currentStep}</span>
              <span>{currentStep} {getTranslation(locale as any, 'form.of')} {totalSteps}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(currentStep / totalSteps) * 100}%`,
                  backgroundColor: form.styling.brandColor 
                }}
              />
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {currentStepFields.map((field: FormField) => (
            <div key={field.id}>
              <FormFieldComponent
                field={field}
                register={register}
                error={errors[field.id]}
                styling={form.styling}
                locale={locale}
                preview={preview}
              />
            </div>
          ))}
        </div>
        
        {/* Honeypot */}
        {form.settings.spamProtection.honeypot && (
          <input
            type="text"
            name="website"
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />
        )}
        
        {form.settings.gdprConsent && (
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="gdprConsent"
              required
              className="mt-1"
            />
            <label htmlFor="gdprConsent" className="text-sm text-gray-600">
              {form.settings.gdprText || getTranslation(locale as any, 'form.gdprConsent')}
            </label>
          </div>
        )}
        
        <div className="flex justify-between">
          {form.settings.multiStep && currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {getTranslation(locale as any, 'form.previous')}
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-3 rounded-lg text-white transition-colors ml-auto"
              style={{ backgroundColor: form.styling.brandColor }}
            >
              {getTranslation(locale as any, 'form.next')}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || preview}
              className="px-6 py-3 rounded-lg text-white transition-colors ml-auto disabled:opacity-50"
              style={{ backgroundColor: form.styling.brandColor }}
            >
              {isSubmitting 
                ? getTranslation(locale as any, 'form.submitting')
                : form.styling.buttonText || getTranslation(locale as any, 'form.submit')
              }
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function FormFieldComponent({ 
  field, 
  register, 
  error, 
  styling, 
  locale, 
  preview 
}: {
  field: FormField;
  register: any;
  error: any;
  styling: any;
  locale: string;
  preview: boolean;
}) {
  const inputClasses = `
    w-full px-4 py-3 border border-gray-300 rounded-lg
    focus:ring-2 focus:border-transparent transition-all
    ${styling.inputSize === 'sm' ? 'py-2 text-sm' : styling.inputSize === 'lg' ? 'py-4 text-lg' : ''}
    ${error ? 'border-red-500' : ''}
  `;
  
  const focusRingStyle = {
    '--tw-ring-color': styling.brandColor + '40'
  };

  if (field.type === 'bestellnummer_id') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
        </label>
        <input
          type="text"
          value={preview ? "12345" : "Auto-generated"}
          readOnly
          className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
        />
        <p className="mt-1 text-xs text-gray-500">
          This ID will be automatically generated when the form is submitted
        </p>
      </div>
    );
  }
  
  if (field.type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          {...register(field.id)}
          placeholder={field.placeholder}
          rows={4}
          className={inputClasses}
          style={focusRingStyle}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
      </div>
    );
  }
  
  if (field.type === 'select') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <select
          {...register(field.id)}
          className={inputClasses}
          style={focusRingStyle}
        >
          <option value="">Select an option</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
      </div>
    );
  }
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...register(field.id)}
        type={field.type}
        placeholder={field.placeholder}
        className={inputClasses}
        style={focusRingStyle}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
}