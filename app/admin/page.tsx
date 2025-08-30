'use client';

import { Page, Layout, Card, Text, ProgressBar, Stack } from '@shopify/polaris';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalForms: 0,
    totalSubmissions: 0,
    activeCustomers: 0,
    conversionRate: 0
  });
  
  useEffect(() => {
    // Fetch dashboard stats
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  return (
    <Page
      title="Dashboard"
      subtitle="Overview of your form performance"
    >
      <Layout>
        <Layout.Section>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <div className="p-4">
                <Text variant="headingLg" as="h3">
                  {stats.totalForms}
                </Text>
                <Text variant="bodyMd" as="p" color="subdued">
                  Total Forms
                </Text>
              </div>
            </Card>
            
            <Card>
              <div className="p-4">
                <Text variant="headingLg" as="h3">
                  {stats.totalSubmissions}
                </Text>
                <Text variant="bodyMd" as="p" color="subdued">
                  Total Submissions
                </Text>
              </div>
            </Card>
            
            <Card>
              <div className="p-4">
                <Text variant="headingLg" as="h3">
                  {stats.activeCustomers}
                </Text>
                <Text variant="bodyMd" as="p" color="subdued">
                  Active Customers
                </Text>
              </div>
            </Card>
            
            <Card>
              <div className="p-4">
                <Text variant="headingLg" as="h3">
                  {stats.conversionRate}%
                </Text>
                <Text variant="bodyMd" as="p" color="subdued">
                  Conversion Rate
                </Text>
              </div>
            </Card>
          </div>
        </Layout.Section>
        
        <Layout.Section>
          <Card>
            <div className="p-4">
              <Text variant="headingMd" as="h3">
                Recent Activity
              </Text>
              <div className="mt-4">
                <Text variant="bodyMd" as="p" color="subdued">
                  No recent activity to show
                </Text>
              </div>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}