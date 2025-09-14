'use client';
import React from 'react';
import { useFetchData } from '@/hooks/useFetchData';
import { navLinks } from '@/constant/data';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MinimizeIcon from '@assets/images/icon-minimize-menu.svg';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const MinIcon = MinimizeIcon;

  return (
    <div
      className={`${
        isOpen ? 'w-72' : 'w-20'
      } bg-grey900 text-white flex flex-col rounded-r-lg shadow-md transition-all fixed duration-300 h-full `}
    >
      <div
        className="flex items-center my-6"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen && <h2 className="p-8 font-bold text-3xl">finance</h2>}
        <MinIcon className={`${!isOpen && 'my-8 ml-6 justify-center'}`} />
      </div>

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
                {isOpen && item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
