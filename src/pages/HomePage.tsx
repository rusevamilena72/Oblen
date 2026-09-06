import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Eye, Star } from 'lucide-react';
import { listingsService, Listing } from '../lib/listings';
import CategoryBadge from '../components/CategoryBadge';

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
    },
    {
      value: 'for-home',
      label: 'Декорации за дома',
      path: '/for-home',
    },
    {
      value: 'jewelry',
      label: 'Накити',
      path: '/available',
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
                    {/* Снимка на продукта */}
                    {listing.images && listing.images.length > 0 && (
                      <div className="w-full aspect-[4/3] bg-paper overflow-hidden">
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <CategoryBadge category={listing.category} />
                        <div className="flex items-center space-x-1 text-gray-400 text-xs shrink-0">
                          <Clock size={12} />
                          <span>{formatDate(listing.created_at)}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-ink mb-2 group-hover:text-berry-700 transition-colors">
                        {listing.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {listing.description}
                      </p>

                      {listing.dimensions && (
                        <div className="flex items-center space-x-2 text-gray-500 text-sm mb-3">
                          <MapPin size={14} />
                          <span>Размери: {listing.dimensions}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl font-bold text-berry-700">
                          {listing.price.toFixed(2)} €
                        </div>

                        <Link
                          to={`/listing/${listing.id}`}
                          className="text-berry-700 hover:text-berry-800 text-sm font-medium transition-colors"
                        >
                          Виж детайли →
                        </Link>
                      </div>

                      <Link
                        to={categoryInfo?.path || '/'}
                        className="inline-flex items-center gap-1 text-xs text-wood-700 hover:text-wood-800 transition-colors"
                      >
                        Виж повече от тази категория →
                      </Link>
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
                    <Star size={28} className="mr-2 text-wood-600" />
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
                    <Star size={28} className="mr-2 text-wood-600 fill-wood-600" />
                    Най-търсените артикули
                  </h2>
                  <p className="text-gray-600">Специално подбрани за вас</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredListings.map((listing) => {
                    const categoryInfo = getCategoryInfo(listing.category);
                    return (
                      <div key={listing.id} className="bg-white rounded-2xl shadow-sm border-2 border-wood-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                        {/* Снимка на продукта */}
                        {listing.images && listing.images.length > 0 && (
                          <div className="w-full aspect-[4/3] bg-paper overflow-hidden">
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <CategoryBadge category={listing.category} />
                            <div className="flex items-center space-x-1 text-gray-400 text-xs shrink-0">
                              <Clock size={12} />
                              <span>{formatDate(listing.created_at)}</span>
                            </div>
                          </div>

                          <h3 className="text-xl font-semibold text-ink mb-2 group-hover:text-berry-700 transition-colors">
                            {listing.title}
                          </h3>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {listing.description}
                          </p>

                          {listing.dimensions && (
                            <div className="flex items-center space-x-2 text-gray-500 text-sm mb-3">
                              <MapPin size={14} />
                              <span>Размери: {listing.dimensions}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between mb-3">
                            <div className="text-2xl font-bold text-berry-700">
                              {listing.price.toFixed(2)} €
                            </div>

                            <Link
                              to={`/listing/${listing.id}`}
                              className="text-berry-700 hover:text-berry-800 text-sm font-medium transition-colors"
                            >
                              Виж детайли →
                            </Link>
                          </div>

                          <Link
                            to={categoryInfo?.path || '/'}
                            className="inline-flex items-center gap-1 text-xs text-wood-700 hover:text-wood-800 transition-colors"
                          >
                            Виж повече от тази категория →
                          </Link>
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
