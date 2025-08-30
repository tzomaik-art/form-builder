'use client';

import { useState, useEffect } from 'react';
import { Page, Layout, Card, DataTable, Button, Badge, Text } from '@shopify/polaris';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

export default function FormsPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/forms')
      .then(res => res.json())
      .then(data => {
        setForms(data.forms || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading forms:', error);
        setLoading(false);
      });
  }, []);

  const rows = forms.map((form: any) => [
    form.name,
    form.slug,
    form.active ? <Badge status="success">Active</Badge> : <Badge>Inactive</Badge>,
    form._count?.submissions || 0,
    new Date(form.createdAt).toLocaleDateString(),
    <div key={form.id} className="flex space-x-2">
      <Link href={`/admin/forms/${form.id}/edit`}>
        <Button size="slim">Edit</Button>
      </Link>
      <Button size="slim" tone="critical">Delete</Button>
    </div>
  ]);

  const headings = [
    'Name',
    'Slug', 
    'Status',
    'Submissions',
    'Created',
    'Actions'
  ];

  return (
    <Page
      title="Forms"
      primaryAction={{
        content: 'Create Form',
        icon: PlusIcon,
        url: '/admin/forms/new'
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            {loading ? (
              <div className="p-4">
                <Text variant="bodyMd" as="p">Loading forms...</Text>
              </div>
            ) : (
              <DataTable
                columnContentTypes={[
                  'text',
                  'text', 
                  'text',
                  'numeric',
                  'text',
                  'text'
                ]}
                headings={headings}
                rows={rows}
              />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}