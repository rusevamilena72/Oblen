import React from 'react';
import { Heart, Github, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div>
              <span className="text-xl font-bold text-white" itemProp="name">Фирма ОБЛЕН</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md" itemProp="description">
              Ръчно изработени катерушки за котки, декорации за дома и накити — всяко изделие е направено на ръка, с внимание към детайла.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Бързи връзки</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <a href="/" className="hover:text-berry-300 transition-colors">Начало</a>
              <a href="/cat-climbers" className="hover:text-berry-300 transition-colors">Катерушки за котки</a>
              <a href="/for-home" className="hover:text-berry-300 transition-colors">Декорации за дома</a>
              <a href="/available" className="hover:text-berry-300 transition-colors">Накити</a>
              <a href="/contact" className="hover:text-berry-300 transition-colors">Свържи се с нас</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
          <p>© 2025 Фирма ОБЛЕН. Всички права запазени.</p>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Създадено с</span>
            <Heart size={16} className="text-red-500" />
            <span>в България</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
