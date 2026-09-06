import React from 'react';
import { useState } from 'react';
import { Phone, Mail, MessageCircle, ShoppingCart } from 'lucide-react';
import OrderForm from '../components/OrderForm';
import QuestionForm from '../components/QuestionForm';

const ContactPage: React.FC = () => {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);

  const handleOrder = () => {
    setIsOrderFormOpen(true);
  };

  const handleQuestion = () => {
    setIsQuestionFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-berry-600 to-berry-800 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <MessageCircle size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Свържи се с нас
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Информация за поръчки и начини за контакт
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-berry-600 to-berry-800 px-6 py-8">
            <h2 className="text-2xl font-bold text-white text-center">
              Начин за поръчване
            </h2>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Information Text */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Всички поръчки, които са в наличност се изпълняват до една седмица.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  За индивидуални поръчки, моля свържете се с нас чрез:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>На телефон 0878 245 236</li>
                  <li>Имейл: oblenbg@gmail.com</li>
                  <li>Използвайте бутон „Задай въпрос"</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Артикулите се доставят с ЕКОНТ.
                </p>
                <p className="text-gray-700 leading-relaxed font-medium">
                  Плащането е при получаване на пратката като има възможност за преглед.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={handleOrder}
                className="flex items-center justify-center space-x-3 px-8 py-4 bg-berry-700 text-white rounded-lg hover:bg-berry-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-berry-500 transition-colors font-medium text-lg"
              >
                <ShoppingCart size={24} />
                <span>Поръчай</span>
              </button>

              <button
                onClick={handleQuestion}
                className="flex items-center justify-center space-x-3 px-8 py-4 bg-white text-berry-700 border-2 border-berry-700 rounded-lg hover:bg-berry-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-berry-500 transition-colors font-medium text-lg"
              >
                <MessageCircle size={24} />
                <span>Задай въпрос</span>
              </button>
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Контактна информация
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-wood-100 rounded-full flex items-center justify-center">
                    <Phone size={24} className="text-wood-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Телефон</h4>
                    <a
                      href="tel:+359878245236"
                      className="text-wood-700 hover:text-wood-800 transition-colors"
                    >
                      0878 245 236
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-berry-100 rounded-full flex items-center justify-center">
                    <Mail size={24} className="text-berry-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Имейл</h4>
                    <a
                      href="mailto:oblenbg@gmail.com"
                      className="text-berry-700 hover:text-berry-800 transition-colors"
                    >
                      oblenbg@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Form Modal */}
        <OrderForm 
          isOpen={isOrderFormOpen} 
          onClose={() => setIsOrderFormOpen(false)} 
        />

        {/* Question Form Modal */}
        <QuestionForm 
          isOpen={isQuestionFormOpen} 
          onClose={() => setIsQuestionFormOpen(false)} 
        />
      </div>
    </div>
  );
};

export default ContactPage;
