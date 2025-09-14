'use client';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function MainLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main
        className={`flex-1 ${isOpen ? 'ml-64' : 'ml-14'} overflow-y-auto pl-6 bg-white`}
      >
        {children}
      </main>
    </div>
  );
}
