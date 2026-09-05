import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Eye, ArrowRight, Star } from 'lucide-react';
import { listingsService, Listing } from '../lib/listings';

const HomePage: React.FC = () => {
  const [latestListings, setLatestListings] = useState<Listing[]>([]);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  const categories = [
    { 
      value: 'cat-climbers', 
      label: 'Катерушки за котки',
      path: '/cat-climbers',
      color: 'from-orange-500 to-pink-500'
    },
    {
      value: 'for-home',
      label: 'Декорации за дома',
      path: '/for-home',
      color: 'from-green-500 to-teal-500'
    },
    { 
      value: 'jewelry', 
      label: 'Накити',
      path: '/available',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  useEffect(() => {
    const fetchLatestListings = async () => {
      setLoading(true);
      const { listings, error } = await listingsService.getAllListings();

      if (!error && listings) {
        // Вземи последната обява от всяка категория
        const latestByCategory: Listing[] = [];
        categories.forEach(category => {
          const categoryListings = listings.filter(listing => listing.category === category.value);
          if (categoryListings.length > 0) {
            latestByCategory.push(categoryListings[0]); // Първата е най-новата заради сортирането
          }
        });
        setLatestListings(latestByCategory);
      }

      setLoading(false);
    };

    fetchLatestListings();
  }, []);

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      setFeaturedLoading(true);
      const { listings, error } = await listingsService.getFeaturedListings();

      if (!error && listings) {
        setFeaturedListings(listings);
      }

      setFeaturedLoading(false);
    };

    fetchFeaturedListings();
  }, []);

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" itemProp="name">
            Ръчно създадени красоти за теб, твоя дом и твоя домашен любимец
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" itemProp="description">
            Открийте най-новите обяви от всички категории
          </p>
        </div>

        {/* Latest Listings */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : latestListings.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Най-нови обяви</h2>
              <p className="text-gray-600">Последните публикации от всяка категория</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {latestListings.map((listing) => {
                const categoryInfo = getCategoryInfo(listing.category);
                return (
                  <div key={listing.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                    {/* Category Header */}
                    <div className={`bg-gradient-to-r ${categoryInfo?.color || 'from-gray-500 to-gray-600'} p-4`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white text-sm font-medium">
                          {categoryInfo?.label || listing.category}
                        </span>
                        <div className="flex items-center space-x-1 text-white text-xs">
                          <Clock size={12} />
                          <span>{formatDate(listing.created_at)}</span>
                        </div>
                      </div>
                      <Link
                        to={categoryInfo?.path || '/'}
                        className="inline-flex items-center space-x-1 text-white hover:text-white/80 text-sm font-medium transition-colors"
                      >
                        <span>Виж повече от тази категория</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {listing.title}
                      </h3>
                      
                      {/* Основна снимка */}
                      {listing.images && listing.images.length > 0 && (
                        <div className="mb-4 overflow-auto max-h-64" style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#cbd5e1 #f1f5f9'
                        }}>
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-48 object-contain rounded-lg border border-gray-200 bg-gray-50"
                          />
                        </div>
                      )}
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {listing.description}
                      </p>

                      {listing.dimensions && (
                        <div className="flex items-center space-x-2 text-gray-500 text-sm mb-3">
                          <MapPin size={14} />
                          <span>Размери: {listing.dimensions}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {listing.price.toFixed(2)} €
                          </div>

                        </div>

                        <Link
                          to={`/listing/${listing.id}`}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                        >
                          <span>Детайли...</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Featured Listings Section */}
            {featuredLoading ? (
              <div className="mt-16">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                    <Star size={28} className="mr-2 text-yellow-500" />
                    Най-търсените артикули
                  </h2>
                  <p className="text-gray-600">Специално подбрани за вас</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : featuredListings.length > 0 ? (
              <div className="mt-16">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                    <Star size={28} className="mr-2 text-yellow-500 fill-yellow-500" />
                    Най-търсените артикули
                  </h2>
                  <p className="text-gray-600">Специално подбрани за вас</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredListings.map((listing) => {
                    const categoryInfo = getCategoryInfo(listing.category);
                    return (
                      <div key={listing.id} className="bg-white rounded-2xl shadow-sm border-2 border-yellow-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                        {/* Category Header */}
                        <div className={`bg-gradient-to-r ${categoryInfo?.color || 'from-gray-500 to-gray-600'} p-4`}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-white text-sm font-medium">
                              {categoryInfo?.label || listing.category}
                            </span>
                            <div className="flex items-center space-x-1 text-white text-xs">
                              <Clock size={12} />
                              <span>{formatDate(listing.created_at)}</span>
                            </div>
                          </div>
                          <Link
                            to={categoryInfo?.path || '/'}
                            className="inline-flex items-center space-x-1 text-white hover:text-white/80 text-sm font-medium transition-colors"
                          >
                            <span>Виж повече от тази категория</span>
                            <ArrowRight size={14} />
                          </Link>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {listing.title}
                          </h3>

                          {/* Основна снимка */}
                          {listing.images && listing.images.length > 0 && (
                            <div className="mb-4 overflow-auto max-h-64" style={{
                              scrollbarWidth: 'thin',
                              scrollbarColor: '#cbd5e1 #f1f5f9'
                            }}>
                              <img
                                src={listing.images[0]}
                                alt={listing.title}
                                className="w-full h-48 object-contain rounded-lg border border-gray-200 bg-gray-50"
                              />
                            </div>
                          )}

                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {listing.description}
                          </p>

                          {listing.dimensions && (
                            <div className="flex items-center space-x-2 text-gray-500 text-sm mb-3">
                              <MapPin size={14} />
                              <span>Размери: {listing.dimensions}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-2xl font-bold text-green-600">
                                {listing.price.toFixed(2)} €
                              </div>
                            </div>

                            <Link
                              to={`/listing/${listing.id}`}
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                            >
                              <span>Детайли...</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Eye size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Няма обяви</h3>
            <p className="text-gray-600 mb-6">
              Все още няма публикувани обяви. Бъдете първите!
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default HomePage;