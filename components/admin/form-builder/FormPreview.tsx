'use client';

import { Card, Text } from '@shopify/polaris';
import { StorefrontForm } from '@/components/storefront/StorefrontForm';

interface FormPreviewProps {
  formData: any;
}

export function FormPreview({ formData }: FormPreviewProps) {
  return (
    <Card>
      <div className="p-4">
        <Text variant="headingMd" as="h3">
          Form Preview
        </Text>
        
        <div className="mt-4 bg-gray-50 p-6 rounded-lg">
          <StorefrontForm
            form={formData}
            preview={true}
            onSubmit={() => {}}
          />
        </div>
      </div>
    </Card>
  );
}