'use client';

import { LoginForm } from './login-form';
import { siteConfig } from '@/config/site';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/shared/icons';

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-4 self-center font-medium flex-col">
          <Icons.logo className="size-16" />
          <Label className='text-2xl'>{siteConfig.name}</Label>
        </a>
        <LoginForm />
      </div>
    </div>
  );
}

