'use client';
import React, { useState } from 'react';
// import {Icon, Menu, X} from 'lucide-react'
import * as Icons from 'lucide-react';
import { useFetchData } from '@/hooks/useFetchData';
import { navLinks } from '@/constant/data';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div
      className={`${
        isOpen ? 'w-72' : 'w-20'
      } bg-grey900 text-white flex flex-col rounded-r-lg shadow-md transition-all fixed duration-300 h-full `}
    >
      <h2 className="p-8">finance</h2>
      <aside>
        <nav>
          {navLinks.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                href={item.href}
                key={index}
                className={`flex items-center h-1/6 p-2.5 pl-8 gap-2 font-mono ${isActive ? 'bg-white text-grey900 w-4/5 rounded-r-lg' : 'hover:text-grey500'}`}
              >
                <Icon
                  className={`w-5 h-5 fill-current ${isActive ? 'text-green' : 'fill-grey500'} transition [&>path]:fill-current`}
                />
                {/*<img src="" alt=""/>*/}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
