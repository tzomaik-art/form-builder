'use client';

import { Card, Text, Button, ButtonGroup } from '@shopify/polaris';
import { EditIcon, TrashIcon } from 'lucide-react';
import { FormField } from '@/types/form';

interface FieldItemProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (field: FormField) => void;
  onDelete: () => void;
}

export function FieldItem({ field, isSelected, onSelect, onUpdate, onDelete }: FieldItemProps) {
  const getFieldIcon = (type: string) => {
    const icons: Record<string, string> = {
      text: '📝',
      email: '📧',
      tel: '📞',
      textarea: '📄',
      number: '🔢',
      select: '📋',
      radio: '🔘',
      checkbox: '☑️',
      date: '📅',
      country: '🌍',
      file: '📎',
      social_name: '👤',
      bestellnummer_id: '🆔'
    };
    return icons[type] || '📝';
  };

  return (
    <Card>
      <div 
        className={`p-4 cursor-pointer border-2 rounded ${
          isSelected ? 'border-blue-400 bg-blue-50' : 'border-transparent'
        }`}
        onClick={onSelect}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{getFieldIcon(field.type)}</span>
            <div>
              <Text variant="bodyMd" as="p">
                {field.label}
              </Text>
              <Text variant="bodySm" as="p" color="subdued">
                {field.type} {field.required && '(required)'}
              </Text>
            </div>
          </div>
          
          <ButtonGroup>
            <Button
              size="slim"
              icon={EditIcon}
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            />
            <Button
              size="slim"
              icon={TrashIcon}
              tone="critical"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              disabled={field.type === 'social_name' || field.type === 'bestellnummer_id'}
            />
          </ButtonGroup>
        </div>
      </div>
    </Card>
  );
}