
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeletedPage() {
  const router = useRouter();
  useEffect(() => { router.push('/'); }, [router]);
  return null;
}
