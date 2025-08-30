'use client';

import { Card, Text, TextField, Checkbox, Select, Button, Stack } from '@shopify/polaris';
import { FormField } from '@/types/form';

interface FieldPropertiesPanelProps {
  field: FormField | null;
  onUpdateField: (field: FormField) => void;
}

export function FieldPropertiesPanel({ field, onUpdateField }: FieldPropertiesPanelProps) {
  if (!field) {
    return (
      <Card>
        <div className="p-4">
          <Text variant="headingMd" as="h3">
            Field Properties
          </Text>
          <div className="mt-4">
            <Text variant="bodyMd" as="p" color="subdued">
              Select a field to edit its properties
            </Text>
          </div>
        </div>
      </Card>
    );
  }

  const handleUpdate = (updates: Partial<FormField>) => {
    onUpdateField({ ...field, ...updates });
  };

  const isReadonly = field.type === 'bestellnummer_id';
  const isRequired = field.type === 'social_name';

  return (
    <Card>
      <div className="p-4">
        <Text variant="headingMd" as="h3">
          Field Properties
        </Text>
        
        <Stack vertical spacing="loose">
          <TextField
            label="Label"
            value={field.label}
            onChange={(value) => handleUpdate({ label: value })}
            disabled={isReadonly}
          />
          
          <TextField
            label="Placeholder"
            value={field.placeholder || ''}
            onChange={(value) => handleUpdate({ placeholder: value })}
            disabled={isReadonly}
          />
          
          <Checkbox
            label="Required"
            checked={field.required || isRequired}
            onChange={(checked) => handleUpdate({ required: checked })}
            disabled={isRequired || isReadonly}
          />
          
          {field.type === 'select' || field.type === 'radio' || field.type === 'checkbox' ? (
            <div>
              <Text variant="bodyMd" as="p">Options</Text>
              <TextField
                label="Options (one per line)"
                value={(field.options || []).join('\n')}
                onChange={(value) => handleUpdate({ 
                  options: value.split('\n').filter(opt => opt.trim()) 
                })}
                multiline={4}
              />
            </div>
          ) : null}
          
          {field.type === 'bestellnummer_id' && (
            <div className="bg-yellow-50 p-3 rounded">
              <Text variant="bodySm" as="p">
                This field is automatically generated and cannot be edited by customers.
                The ID length is configured in Settings.
              </Text>
            </div>
          )}
          
          {field.type === 'social_name' && (
            <div className="bg-blue-50 p-3 rounded">
              <Text variant="bodySm" as="p">
                This field is required and will be saved as both a metafield and tag.
              </Text>
            </div>
          )}
        </Stack>
      </div>
    </Card>
  );
}