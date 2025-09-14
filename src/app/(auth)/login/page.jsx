'use client';
import React from 'react';
import { LoginForm } from '@/app/(auth)/login/LoginForm';
import Image from 'next/image';

const Page = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="assets/images/illustration-authentication.svg"
          alt="login"
          width={400}
          height={40}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center card_wrap">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
