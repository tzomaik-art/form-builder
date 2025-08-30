'use client';

import { useState, useEffect } from 'react';
import { Page, Layout, Card, Text, TextField, Checkbox, Button, Stack, Select } from '@shopify/polaris';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    bestellIdLength: 5,
    bestellIdPrefix: '',
    bestellIdSuffix: '',
    emailEnabled: false,
    emailTemplate: {
      subject: 'Welcome! Your registration is confirmed',
      body: 'Thank you for registering!'
    },
    webhookUrl: '',
    rateLimit: 10
  });
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => setSettings(data.settings))
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Page
      title="Settings"
      primaryAction={{
        content: 'Save Settings',
        loading: saving,
        onAction: handleSave
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <div className="p-4">
              <Text variant="headingMd" as="h3">
                Bestellnummer ID Configuration
              </Text>
              
              <Stack vertical spacing="loose">
                <Select
                  label="ID Length (digits)"
                  options={[
                    { label: '4 digits', value: '4' },
                    { label: '5 digits', value: '5' },
                    { label: '6 digits', value: '6' },
                    { label: '7 digits', value: '7' },
                    { label: '8 digits', value: '8' },
                    { label: '9 digits', value: '9' },
                    { label: '10 digits', value: '10' }
                  ]}
                  value={settings.bestellIdLength.toString()}
                  onChange={(value) => handleUpdate('bestellIdLength', parseInt(value))}
                />
                
                <TextField
                  label="ID Prefix (optional)"
                  value={settings.bestellIdPrefix}
                  onChange={(value) => handleUpdate('bestellIdPrefix', value)}
                  helpText="Example: 'MA-' will create IDs like 'MA-12345'"
                />
                
                <TextField
                  label="ID Suffix (optional)"
                  value={settings.bestellIdSuffix}
                  onChange={(value) => handleUpdate('bestellIdSuffix', value)}
                  helpText="Example: '-2024' will create IDs like '12345-2024'"
                />
              </Stack>
            </div>
          </Card>
        </Layout.Section>
        
        <Layout.Section>
          <Card>
            <div className="p-4">
              <Text variant="headingMd" as="h3">
                Email Configuration
              </Text>
              
              <Stack vertical spacing="loose">
                <Checkbox
                  label="Enable email confirmations"
                  checked={settings.emailEnabled}
                  onChange={(checked) => handleUpdate('emailEnabled', checked)}
                />
                
                {settings.emailEnabled && (
                  <>
                    <TextField
                      label="Email Subject"
                      value={settings.emailTemplate.subject}
                      onChange={(value) => handleUpdate('emailTemplate', {
                        ...settings.emailTemplate,
                        subject: value
                      })}
                    />
                    
                    <TextField
                      label="Email Body"
                      value={settings.emailTemplate.body}
                      onChange={(value) => handleUpdate('emailTemplate', {
                        ...settings.emailTemplate,
                        body: value
                      })}
                      multiline={8}
                      helpText="Available variables: {{social_name}}, {{bestell_id}}, {{email}}, {{first_name}}, {{last_name}}, {{store_name}}"
                    />
                  </>
                )}
              </Stack>
            </div>
          </Card>
        </Layout.Section>
        
        <Layout.Section>
          <Card>
            <div className="p-4">
              <Text variant="headingMd" as="h3">
                Advanced Settings
              </Text>
              
              <Stack vertical spacing="loose">
                <TextField
                  label="Webhook URL"
                  value={settings.webhookUrl}
                  onChange={(value) => handleUpdate('webhookUrl', value)}
                  helpText="POST endpoint to receive form submissions"
                />
                
                <TextField
                  label="Rate Limit (submissions per minute)"
                  type="number"
                  value={settings.rateLimit.toString()}
                  onChange={(value) => handleUpdate('rateLimit', parseInt(value) || 10)}
                />
              </Stack>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}