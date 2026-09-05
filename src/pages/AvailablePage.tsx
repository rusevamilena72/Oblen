import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gem, Clock, MapPin, Plus, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { listingsService, Listing } from '../lib/listings';

const AvailablePage: React.FC = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const { listings, error } = await listingsService.getListingsByCategory('jewelry');
      
      if (!error && listings) {
        setListings(listings);
      }
      
      setLoading(false);
    };

    fetchListings();
  }, []);

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
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <Gem size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" itemProp="name">
            Накити
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" itemProp="description">
            Ръчно изработени накити и бижута
          </p>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
                  <div className="flex items-center justify-end">
                    <div className="flex items-center space-x-1 text-white text-xs">
                      <Clock size={12} />
                      <span>{formatDate(listing.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
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
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
                    >
                      <span>Детайли...</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Eye size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Няма обяви в тази категория</h3>
            <p className="text-gray-600 mb-6">
              Все още няма публикувани обяви за накити.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailablePage;