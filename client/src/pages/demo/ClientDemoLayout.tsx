import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const ClientDemoLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-md transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Client Demo</h2>
        </div>
        <nav className="mt-4">
          <ul>
            <li><Link href="/demo/client/dashboard" className="block p-4 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Dashboard</Link></li>
            <li><Link href="/demo/client/contracts" className="block p-4 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Contracts</Link></li>
            <li><Link href="/demo/client/contracts/view" className="block p-4 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Contract View</Link></li>
            <li><Link href="/demo/client/profile" className="block p-4 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Profile</Link></li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md md:hidden">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Client Demo</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ClientDemoLayout;