'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/shared/components/Navbar';

const WORKSPACE_PREFIXES = ['/dashboard', '/publishing', '/contentCreation', '/analytics', '/learningAndSupport', '/profileAndSetting'];

export default function NavbarVisibilityGate() {
  const pathname = usePathname();
  const hideNavbar = pathname ? WORKSPACE_PREFIXES.some((prefix) => pathname.startsWith(prefix)) : false;
  if (hideNavbar) {
    return null;
  }
  return <Navbar />;
}
