"use client";

import Link from 'next/link';
import { useState } from 'react';

type MenuItem = {
  name: string;
  href: string;
  icon?: React.ReactNode;
};

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/' },
  { name: 'Fund Listing', href: '/fund' },
  { name: 'Fund Comparison', href: '/compare' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className={`bg-slate-800 text-white h-screen flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 flex justify-between items-center">
        <h2 className={`font-bold text-xl ${collapsed ? 'hidden' : 'block'}`}>Fund Portal</h2>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-slate-700"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="mt-8">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link href={item.href}>
                <span className={`flex items-center p-3 hover:bg-slate-700 rounded mx-2 ${collapsed ? 'justify-center' : ''}`}>
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  {!collapsed && <span>{item.name}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}