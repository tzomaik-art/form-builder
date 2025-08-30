'use client';

import { 
  Card, 
  Text, 
  TextField, 
  Checkbox, 
  Select, 
  ColorPicker, 
  RangeSlider,
  Stack,
  Layout
} from '@shopify/polaris';

interface FormSettingsProps {
  formData: any;
  onUpdate: (formData: any) => void;
}

export function FormSettings({ formData, onUpdate }: FormSettingsProps) {
  const handleUpdate = (path: string, value: any) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    onUpdate(newData);
  };

  return (
    <Layout>
      <Layout.Section>
        <Card>
          <div className="p-4">
            <Text variant="headingMd" as="h3">
              Basic Settings
            </Text>
            
            <Stack vertical spacing="loose">
              <TextField
                label="Form Name"
                value={formData.name}
                onChange={(value) => handleUpdate('name', value)}
              />
              
              <TextField
                label="Form Slug"
                value={formData.slug}
                onChange={(value) => handleUpdate('slug', value)}
                helpText="Used in the form URL (e.g., /forms/customer-registration)"
              />
              
              <Select
                label="Language"
                options={[
                  { label: 'English', value: 'en' },
                  { label: 'Deutsch', value: 'de' },
                  { label: 'Ελληνικά', value: 'el' }
                ]}
                value={formData.settings.locale}
                onChange={(value) => handleUpdate('settings.locale', value)}
              />
            </Stack>
          </div>
        </Card>
      </Layout.Section>
      
      <Layout.Section>
        <Card>
          <div className="p-4">
            <Text variant="headingMd" as="h3">
              Form Behavior
            </Text>
            
            <Stack vertical spacing="loose">
              <Checkbox
                label="Multi-step form"
                checked={formData.settings.multiStep}
                onChange={(checked) => handleUpdate('settings.multiStep', checked)}
              />
              
              <Checkbox
                label="Show progress bar"
                checked={formData.settings.showProgress}
                onChange={(checked) => handleUpdate('settings.showProgress', checked)}
              />
              
              <Checkbox
                label="GDPR consent checkbox"
                checked={formData.settings.gdprConsent}
                onChange={(checked) => handleUpdate('settings.gdprConsent', checked)}
              />
              
              {formData.settings.gdprConsent && (
                <TextField
                  label="GDPR consent text"
                  value={formData.settings.gdprText || ''}
                  onChange={(value) => handleUpdate('settings.gdprText', value)}
                  multiline={2}
                />
              )}
            </Stack>
          </div>
        </Card>
      </Layout.Section>
      
      <Layout.Section>
        <Card>
          <div className="p-4">
            <Text variant="headingMd" as="h3">
              Styling
            </Text>
            
            <Stack vertical spacing="loose">
              <Select
                label="Theme"
                options={[
                  { label: 'Light', value: 'light' },
                  { label: 'Dark', value: 'dark' }
                ]}
                value={formData.styling.theme}
                onChange={(value) => handleUpdate('styling.theme', value)}
              />
              
              <TextField
                label="Brand Color"
                value={formData.styling.brandColor}
                onChange={(value) => handleUpdate('styling.brandColor', value)}
                type="color"
              />
              
              <div>
                <Text variant="bodyMd" as="p">Corner Radius: {formData.styling.cornerRadius}px</Text>
                <RangeSlider
                  label="Corner radius"
                  value={formData.styling.cornerRadius}
                  min={0}
                  max={20}
                  onChange={(value) => handleUpdate('styling.cornerRadius', value)}
                />
              </div>
              
              <Select
                label="Input Size"
                options={[
                  { label: 'Small', value: 'sm' },
                  { label: 'Medium', value: 'md' },
                  { label: 'Large', value: 'lg' }
                ]}
                value={formData.styling.inputSize}
                onChange={(value) => handleUpdate('styling.inputSize', value)}
              />
              
              <Select
                label="Label Style"
                options={[
                  { label: 'Stacked', value: 'stacked' },
                  { label: 'Inline', value: 'inline' },
                  { label: 'Floating', value: 'floating' }
                ]}
                value={formData.styling.labelStyle}
                onChange={(value) => handleUpdate('styling.labelStyle', value)}
              />
              
              <TextField
                label="Submit Button Text"
                value={formData.styling.buttonText}
                onChange={(value) => handleUpdate('styling.buttonText', value)}
              />
            </Stack>
          </div>
        </Card>
      </Layout.Section>
      
      <Layout.Section>
        <Card>
          <div className="p-4">
            <Text variant="headingMd" as="h3">
              Spam Protection
            </Text>
            
            <Stack vertical spacing="loose">
              <Checkbox
                label="Enable honeypot protection"
                checked={formData.settings.spamProtection.honeypot}
                onChange={(checked) => handleUpdate('settings.spamProtection.honeypot', checked)}
              />
              
              <Checkbox
                label="Enable reCAPTCHA v3"
                checked={formData.settings.spamProtection.recaptcha}
                onChange={(checked) => handleUpdate('settings.spamProtection.recaptcha', checked)}
              />
              
              {formData.settings.spamProtection.recaptcha && (
                <TextField
                  label="reCAPTCHA Site Key"
                  value={formData.settings.spamProtection.recaptchaSiteKey || ''}
                  onChange={(value) => handleUpdate('settings.spamProtection.recaptchaSiteKey', value)}
                />
              )}
            </Stack>
          </div>
        </Card>
      </Layout.Section>
    </Layout>
  );
}