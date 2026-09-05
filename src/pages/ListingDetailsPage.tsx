import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { listingsService, Listing } from '../lib/listings';

const ListingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      setLoading(true);
      const { listings, error } = await listingsService.getAllListings();
      
      if (!error && listings) {
        const foundListing = listings.find(l => l.id === id);
        setListing(foundListing || null);
      }
      
      setLoading(false);
    };

    fetchListing();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      'cat-climbers': 'Катерушки за котки',
      'for-home': 'Декорации за дома',
      'jewelry': 'Накити'
    };
    return categories[category] || category;
  };

  const getSubcategoryLabel = (subcategory: string) => {
    const subcategories: { [key: string]: string } = {
      'practical': 'Практично',
      'decorations': 'Декорации',
      'holidays': 'Празници'
    };
    return subcategories[subcategory] || subcategory;
  };

  const nextImage = () => {
    if (listing?.images && listing.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === listing.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (listing?.images && listing.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? listing.images!.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Обявата не е намерена</h1>
            <p className="text-gray-600 mb-6">Обявата, която търсите, не съществува или е била изтрита.</p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Обратно към началото</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Назад</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {getCategoryLabel(listing.category)}
                </span>
                {listing.subcategory && listing.category === 'for-home' && (
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {getSubcategoryLabel(listing.subcategory)}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1 text-gray-500 text-sm">
                <Clock size={16} />
                <span>{formatDate(listing.created_at)}</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {listing.price.toFixed(2)} €
                </div>

              </div>
              {listing.dimensions && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <MapPin size={16} />
                  <span>Размери: {listing.dimensions}</span>
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          {listing.images && listing.images.length > 0 && (
            <div className="relative">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <img
                  src={listing.images[currentImageIndex]}
                  alt={`${listing.title} - снимка ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              {/* Image Navigation */}
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  >
                    <ChevronRight size={24} />
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {listing.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex 
                            ? 'bg-white' 
                            : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Thumbnails */}
          {listing.images && listing.images.length > 1 && (
            <div className="p-6 border-b border-gray-100">
              <div
                className="overflow-x-auto"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e1 #f1f5f9'
                }}
              >
                <div className="flex space-x-4">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex
                        ? 'border-blue-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Описание</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsPage;