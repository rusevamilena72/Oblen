import React, { useState } from 'react';
import { X, Mail, MessageCircle, Send, AlertCircle, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

// EmailJS настройки
const EMAILJS_SERVICE_ID = "service_6222zog";
const EMAILJS_TEMPLATE_ID = "template_1ukx7po";
const EMAILJS_PUBLIC_KEY = "ay1tIpMRRZBKxxi6C";

interface QuestionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ isOpen, onClose }) => {
  // Инициализация на EmailJS
  emailjs.init(EMAILJS_PUBLIC_KEY);
  
  const [formData, setFormData] = useState({
    email: '',
    question: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.question) {
      setError('Моля, попълнете всички задължителни полета');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Изпращане на имейл чрез EmailJS
      const templateParams = {
        to_email: 'rusevamilena72@gmail.com',
        from_email: formData.email,
        customer_email: formData.email,
        customer_details: 'Въпрос от клиент',
        order_details: formData.question,
        subject: 'Въпрос от сайта'
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      
      setSuccess(true);
      
      // Затваряне на формата и изчистване на данните след 2 секунди
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          email: '',
          question: ''
        });
      }, 2000);
      
    } catch (err) {
      setError('Възникна грешка при изпращането на въпроса. Моля, опитайте отново.');
    }
    
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-berry-600 to-berry-800 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <MessageCircle size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Задайте въпрос</h2>
                <p className="text-berry-100">Свържете се с нас за всякакви въпроси</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle size={20} className="text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
              <CheckCircle size={20} className="text-green-500" />
              <span className="text-green-700 text-sm">
                Въпросът е изпратен успешно! Ще получите отговор скоро.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Имейл */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Вашият имейл *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-berry-500 focus:border-berry-500 transition-colors"
                  placeholder="Въведете вашия имейл адрес"
                />
              </div>
            </div>

            {/* Въпрос */}
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                Вашият въпрос *
              </label>
              <textarea
                id="question"
                name="question"
                required
                rows={5}
                value={formData.question}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-berry-500 focus:border-berry-500 transition-colors resize-vertical"
                placeholder="Опишете вашия въпрос подробно..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-berry-700 hover:bg-berry-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-berry-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Изпращане...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Изпрати въпроса</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-wood-50 rounded-lg">
            <p className="text-sm text-wood-700">
              <strong>Забележка:</strong> След натискане на "Изпрати въпроса" вашето запитване ще бъде 
              изпратено директно до нас. Ще получите отговор на посочения имейл адрес.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;
