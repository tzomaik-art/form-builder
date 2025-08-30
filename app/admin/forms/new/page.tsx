'use client';

import { FormBuilder } from '@/components/admin/form-builder/FormBuilder';
import { useRouter } from 'next/navigation';

export default function NewFormPage() {
  const router = useRouter();
  
  const handleSave = async (formData: any) => {
    try {
      const response = await fetch('/api/admin/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        router.push('/admin/forms');
      }
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };
  
  const handleCancel = () => {
    router.push('/admin/forms');
  };

  return (
    <FormBuilder
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}