'use client';

import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, Layout, Page, Button, ButtonGroup } from '@shopify/polaris';
import { FormCanvas } from './FormCanvas';
import { FieldPalette } from './FieldPalette';
import { FieldPropertiesPanel } from './FieldPropertiesPanel';
import { FormSettings } from './FormSettings';
import { FormPreview } from './FormPreview';
import { FormField } from '@/types/form';

interface FormBuilderProps {
  initialForm?: any;
  onSave: (formData: any) => void;
  onCancel: () => void;
}

export function FormBuilder({ initialForm, onSave, onCancel }: FormBuilderProps) {
  const [formData, setFormData] = useState(initialForm || {
    name: '',
    slug: '',
    fields: [],
    styling: {
      theme: 'light',
      brandColor: '#ff00a8',
      cornerRadius: 8,
      inputSize: 'md',
      labelStyle: 'stacked',
      buttonText: 'Submit'
    },
    settings: {
      multiStep: false,
      showProgress: true,
      gdprConsent: false,
      spamProtection: {
        honeypot: true,
        recaptcha: false
      },
      locale: 'en'
    }
  });
  
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'settings' | 'preview'>('builder');
  
  const handleAddField = (fieldType: string) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: fieldType as any,
      label: fieldType.charAt(0).toUpperCase() + fieldType.slice(1),
      required: false,
      step: 1,
      order: formData.fields.length
    };
    
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };
  
  const handleUpdateField = (updatedField: FormField) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === updatedField.id ? updatedField : field
      )
    }));
  };
  
  const handleDeleteField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    setSelectedField(null);
  };
  
  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Page
      title={initialForm ? 'Edit Form' : 'Create Form'}
      breadcrumbs={[{ content: 'Forms', url: '/admin/forms' }]}
      primaryAction={{
        content: 'Save Form',
        onAction: handleSave
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: onCancel
        }
      ]}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <div className="p-4">
              <ButtonGroup>
                <Button 
                  pressed={activeTab === 'builder'}
                  onClick={() => setActiveTab('builder')}
                >
                  Builder
                </Button>
                <Button 
                  pressed={activeTab === 'settings'}
                  onClick={() => setActiveTab('settings')}
                >
                  Settings
                </Button>
                <Button 
                  pressed={activeTab === 'preview'}
                  onClick={() => setActiveTab('preview')}
                >
                  Preview
                </Button>
              </ButtonGroup>
            </div>
          </Card>
        </Layout.Section>
        
        {activeTab === 'builder' && (
          <DndProvider backend={HTML5Backend}>
            <Layout.Section secondary>
              <FieldPalette onAddField={handleAddField} />
            </Layout.Section>
            <Layout.Section>
              <FormCanvas
                fields={formData.fields}
                selectedField={selectedField}
                onSelectField={setSelectedField}
                onUpdateField={handleUpdateField}
                onDeleteField={handleDeleteField}
              />
            </Layout.Section>
            <Layout.Section secondary>
              <FieldPropertiesPanel
                field={selectedField}
                onUpdateField={handleUpdateField}
              />
            </Layout.Section>
          </DndProvider>
        )}
        
        {activeTab === 'settings' && (
          <Layout.Section>
            <FormSettings
              formData={formData}
              onUpdate={setFormData}
            />
          </Layout.Section>
        )}
        
        {activeTab === 'preview' && (
          <Layout.Section>
            <FormPreview formData={formData} />
          </Layout.Section>
        )}
      </Layout>
    </Page>
  );
}