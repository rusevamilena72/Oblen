import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Cat, Sofa, Gem, MessageCircle, ShoppingCart, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import OrderForm from '../OrderForm';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const adminPath = user ? '/profile' : '/login';

  const navigationItems = [
    { path: '/', label: 'Начало', icon: Home },
    { path: '/cat-climbers', label: 'Катерушки за котки', icon: Cat },
    { path: '/for-home', label: 'Декорации за дома', icon: Sofa },
    { path: '/available', label: 'Накити', icon: Gem },
    { path: '/contact', label: 'Свържи се с нас', icon: MessageCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleOrderClick = () => {
    setIsOrderFormOpen(true);
    setIsMenuOpen(false);
  };
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center mr-6 md:mr-10 shrink-0 opacity-100 hover:opacity-80 transition-opacity"
            itemProp="name"
          >
            <img src="/oblen-logo.png" alt="Фирма ОБЛЕН" className="h-10 w-auto" />
            <span className="sr-only">Фирма ОБЛЕН</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive(item.path)
                      ? 'bg-berry-50 text-berry-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Поръчай - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={handleOrderClick}
              className="flex items-center space-x-2 px-4 py-2 bg-berry-700 text-white rounded-lg hover:bg-berry-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-berry-500 transition-colors font-medium"
            >
              <ShoppingCart size={16} />
              <span>Поръчай</span>
            </button>
            <Link
              to={adminPath}
              title="Вход за администратор"
              aria-label="Вход за администратор"
              className="p-2 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink size={18} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-2">
            <nav className="flex flex-col space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                      isActive(item.path)
                        ? 'bg-berry-50 text-berry-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Поръчай - Mobile */}
              <div className="border-t border-gray-100 pt-2 mt-2">
                <button
                  onClick={handleOrderClick}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 text-white bg-berry-700 hover:bg-berry-800 mb-1"
                >
                  <ShoppingCart size={18} />
                  <span>Поръчай</span>
                </button>
                <Link
                  to={adminPath}
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Вход за администратор"
                  className="w-full px-4 py-2 rounded-lg text-xs font-medium flex items-center space-x-3 text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>Вход за администратор</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
      
      {/* Order Form Modal */}
      <OrderForm 
        isOpen={isOrderFormOpen} 
        onClose={() => setIsOrderFormOpen(false)} 
      />
    </header>
  );
};

export default Header;
