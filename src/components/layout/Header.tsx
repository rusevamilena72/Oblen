import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Cat, Sofa, Gem, User, LogIn, Plus, MessageCircle, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import OrderForm from '../OrderForm';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navigationItems = [
    { path: '/', label: 'Начало', icon: Home },
    { path: '/cat-climbers', label: 'Катерушки за котки', icon: Cat },
    { path: '/for-home', label: 'Декорации за дома', icon: Sofa },
    { path: '/available', label: 'Накити', icon: Gem },
    { path: '/contact', label: 'Свържи се с нас', icon: MessageCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

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
            className="text-xl font-bold text-ink hover:text-berry-700 transition-colors"
            itemProp="name"
          >
            Фирма ОБЛЕН
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

          {/* Auth Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleOrderClick}
              className="flex items-center space-x-2 px-4 py-2 bg-berry-700 text-white rounded-lg hover:bg-berry-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-berry-500 transition-colors font-medium"
            >
              <ShoppingCart size={16} />
              <span>Поръчай</span>
            </button>
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <User size={16} />
                  <span>{user.user_metadata?.username || 'Профил'}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Излизане
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <LogIn size={16} />
                  <span>Вход</span>
                </Link>
              </div>
            )}
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
              
              {/* Auth Section - Mobile */}
              <div className="border-t border-gray-100 pt-2 mt-2">
                <button
                  onClick={handleOrderClick}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 text-white bg-berry-700 hover:bg-berry-800 mb-2"
                >
                  <ShoppingCart size={18} />
                  <span>Поръчай</span>
                </button>
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <User size={18} />
                      <span>{user.user_metadata?.username || 'Профил'}</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Излизане
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <LogIn size={18} />
                      <span>Вход</span>
                    </Link>
                  </>
                )}
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
