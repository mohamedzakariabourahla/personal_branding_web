'use client';

import { Button, Stack } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type PublishingSection = 'accounts' | 'schedule';

export function PublishingHeader({ active }: { active: PublishingSection }) {
  const pathname = usePathname();
  const current = pathname?.includes('/schedule') ? 'schedule' : active;

  const tabs: { label: string; href: string; key: PublishingSection }[] = [
    { label: 'Manage accounts', href: '/publishing/accounts', key: 'accounts' },
    { label: 'Schedule posts', href: '/publishing/schedule', key: 'schedule' },
  ];

  return (
    <Stack direction="row" spacing={1.5} flexWrap="wrap">
      {tabs.map((tab) => {
        const selected = current === tab.key;
        return (
          <Button
            key={tab.key}
            component={Link}
            href={tab.href}
            variant={selected ? 'contained' : 'outlined'}
            color={selected ? 'primary' : 'inherit'}
            size="small"
            sx={{ borderRadius: 6, textTransform: 'none', fontWeight: 700 }}
          >
            {tab.label}
          </Button>
        );
      })}
    </Stack>
  );
}
