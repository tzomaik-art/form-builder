'use client';

import { Card, Text, EmptyState, Button } from '@shopify/polaris';
import { useDrop } from 'react-dnd';
import { FormField } from '@/types/form';
import { FieldItem } from './FieldItem';

interface FormCanvasProps {
  fields: FormField[];
  selectedField: FormField | null;
  onSelectField: (field: FormField) => void;
  onUpdateField: (field: FormField) => void;
  onDeleteField: (fieldId: string) => void;
}

export function FormCanvas({ 
  fields, 
  selectedField, 
  onSelectField, 
  onUpdateField, 
  onDeleteField 
}: FormCanvasProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'field',
    drop: (item: any) => {
      // Handle field reordering
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <div className="p-4">
        <Text variant="headingMd" as="h3">
          Form Canvas
        </Text>
        
        <div 
          ref={drop}
          className={`mt-4 min-h-96 border-2 border-dashed rounded-lg p-4 ${
            isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
        >
          {fields.length === 0 ? (
            <EmptyState
              heading="Start building your form"
              action={{
                content: 'Add your first field',
                onAction: () => {}
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>Drag fields from the palette to start building your form</p>
            </EmptyState>
          ) : (
            <div className="space-y-4">
              {sortedFields.map((field) => (
                <FieldItem
                  key={field.id}
                  field={field}
                  isSelected={selectedField?.id === field.id}
                  onSelect={() => onSelectField(field)}
                  onUpdate={onUpdateField}
                  onDelete={() => onDeleteField(field.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}