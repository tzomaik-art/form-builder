'use client';

import { Card, Text, Button, ButtonGroup, Stack } from '@shopify/polaris';
import { PlusIcon } from 'lucide-react';

interface FieldPaletteProps {
  onAddField: (fieldType: string) => void;
}

const fieldTypes = [
  { type: 'text', label: 'Text Input', icon: '📝' },
  { type: 'email', label: 'Email', icon: '📧' },
  { type: 'tel', label: 'Phone', icon: '📞' },
  { type: 'textarea', label: 'Textarea', icon: '📄' },
  { type: 'number', label: 'Number', icon: '🔢' },
  { type: 'select', label: 'Dropdown', icon: '📋' },
  { type: 'radio', label: 'Radio Buttons', icon: '🔘' },
  { type: 'checkbox', label: 'Checkboxes', icon: '☑️' },
  { type: 'date', label: 'Date Picker', icon: '📅' },
  { type: 'country', label: 'Country', icon: '🌍' },
  { type: 'file', label: 'File Upload', icon: '📎' }
];

const specialFields = [
  { type: 'social_name', label: 'Social Name', icon: '👤' },
  { type: 'bestellnummer_id', label: 'Bestellnummer ID', icon: '🆔' }
];

export function FieldPalette({ onAddField }: FieldPaletteProps) {
  return (
    <Card>
      <div className="p-4">
        <Text variant="headingMd" as="h3">
          Field Palette
        </Text>
        
        <div className="mt-4">
          <Text variant="headingSm" as="h4" color="subdued">
            Special Fields
          </Text>
          <Stack vertical spacing="tight">
            {specialFields.map(field => (
              <Button
                key={field.type}
                onClick={() => onAddField(field.type)}
                textAlign="left"
                size="slim"
                fullWidth
              >
                <div className="flex items-center space-x-2">
                  <span>{field.icon}</span>
                  <span>{field.label}</span>
                  <PlusIcon size={14} />
                </div>
              </Button>
            ))}
          </Stack>
        </div>
        
        <div className="mt-6">
          <Text variant="headingSm" as="h4" color="subdued">
            Form Fields
          </Text>
          <Stack vertical spacing="tight">
            {fieldTypes.map(field => (
              <Button
                key={field.type}
                onClick={() => onAddField(field.type)}
                textAlign="left"
                size="slim"
                fullWidth
              >
                <div className="flex items-center space-x-2">
                  <span>{field.icon}</span>
                  <span>{field.label}</span>
                  <PlusIcon size={14} />
                </div>
              </Button>
            ))}
          </Stack>
        </div>
      </div>
    </Card>
  );
}