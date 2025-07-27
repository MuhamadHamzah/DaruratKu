import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Search, User, LogOut, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Lapor Hilang', href: '/report', icon: PlusCircle },
    { name: 'Cari Barang', href: '/search', icon: Search },
    { name: 'Profil', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                DaruratKu
              </span>
            </Link>

            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block">Keluar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 sm:hidden">
          <div className="flex justify-around py-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="relative flex flex-col items-center p-2"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-100 rounded-lg"
                      initial={false}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <Icon
                    className={`w-5 h-5 relative z-10 ${
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-xs mt-1 relative z-10 ${
                      isActive ? 'text-blue-600 font-medium' : 'text-gray-400'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      {user && (
        <div className="hidden sm:block fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-2">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="relative group"
                  >
                    <motion.div
                      className={`p-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    
                    {/* Tooltip */}
                    <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}