'use client';

import '@shopify/polaris/build/esm/styles.css';
import { AppProvider, Navigation, TopBar, Frame } from '@shopify/polaris';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  const toggleMobileNavigationActive = () =>
    setMobileNavigationActive((mobileNavigationActive) => !mobileNavigationActive);

  const navigationMarkup = (
    <Navigation location={pathname}>
      <Navigation.Section
        items={[
          {
            label: 'Dashboard',
            url: '/admin',
            exactMatch: true
          },
          {
            label: 'Forms',
            url: '/admin/forms'
          },
          {
            label: 'Submissions',
            url: '/admin/submissions'
          },
          {
            label: 'Settings',
            url: '/admin/settings'
          },
          {
            label: 'Logs',
            url: '/admin/logs'
          }
        ]}
      />
    </Navigation>
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      onNavigationToggle={toggleMobileNavigationActive}
    />
  );

  return (
    <AppProvider i18n={{}}>
      <Frame
        topBar={topBarMarkup}
        navigation={navigationMarkup}
        showMobileNavigation={mobileNavigationActive}
        onNavigationDismiss={toggleMobileNavigationActive}
      >
        {children}
      </Frame>
    </AppProvider>
  );
}