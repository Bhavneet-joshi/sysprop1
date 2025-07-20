import React from 'react'
import { Link, useLocation } from 'wouter'

const Header: React.FC = () => {
  const [location] = useLocation()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Contract Management System
            </Link>
          </div>
          
          <nav className="flex space-x-8">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === '/' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/contracts" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === '/contracts' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Contracts
            </Link>
            <Link 
              href="/login" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === '/login' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header 