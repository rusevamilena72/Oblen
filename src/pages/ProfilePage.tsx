import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Save, AlertCircle, CheckCircle, LogOut, Plus, Edit, Trash2, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { listingsService, Listing } from '../lib/listings'

const ProfilePage: React.FC = () => {
  const { user, updateProfile, updatePassword, signOut } = useAuth()
  const [username, setUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [listings, setListings] = useState<Listing[]>([])
  const [listingsLoading, setListingsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.user_metadata?.username) {
      setUsername(user.user_metadata.username)
    }
  }, [user])

  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user) return
      
      setListingsLoading(true)
      const { listings, error } = await listingsService.getUserListings(user.id)
      
      if (!error && listings) {
        setListings(listings)
      }
      
      setListingsLoading(false)
    }

    fetchUserListings()
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await updateProfile(username)
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Профилът е актуализиран успешно!')
    }
    
    setLoading(false)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (newPassword.length < 6) {
      setError('Паролата трябва да бъде поне 6 символа')
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Паролите не съвпадат')
      setLoading(false)
      return
    }

    const { error } = await updatePassword(newPassword)
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Паролата е променена успешно!')
      setNewPassword('')
      setConfirmPassword('')
    }
    
    setLoading(false)
  }

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете тази обява?')) {
      return
    }

    const { error } = await listingsService.deleteListing(id)
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Обявата е изтрита успешно!')
      // Refresh listings
      const { listings: updatedListings } = await listingsService.getUserListings(user!.id)
      if (updatedListings) {
        setListings(updatedListings)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      'cat-climbers': 'Катерушки за котки',
      'for-home': 'Декорации за дома',
      'jewelry': 'Накити'
    }
    return categories[category] || category
  }

  const getSubcategoryLabel = (subcategory: string) => {
    const subcategories: { [key: string]: string } = {
      'practical': 'Практично',
      'decorations': 'Декорации',
      'holidays': 'Празници'
    }
    return subcategories[subcategory] || subcategory
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  // Пагинация
  const totalPages = Math.ceil(listings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentListings = listings.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Моят профил</h1>
                  <p className="text-blue-100">Управлявайте вашия акаунт</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <LogOut size={20} />
                <span>Излизане</span>
              </button>
            </div>
          </div>

          {/* Create Listing Button */}
          <div className="mb-6">
            <Link
              to="/create-listing"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors font-medium"
            >
              <Plus size={20} />
              <span>Нова обява</span>
            </Link>
          </div>

          <div className="p-6 space-y-8">
            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                <AlertCircle size={20} className="text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-green-700 text-sm">{success}</span>
              </div>
            )}

            {/* Profile Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Информация за профила</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail size={20} className="text-gray-400" />
                  <span className="text-gray-600">Имейл:</span>
                  <span className="font-medium text-gray-900">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User size={20} className="text-gray-400" />
                  <span className="text-gray-600">Потребителско име:</span>
                  <span className="font-medium text-gray-900">
                    {user.user_metadata?.username || 'Не е зададено'}
                  </span>
                </div>
              </div>
            </div>

            {/* Update Profile Form */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Редактиране на профил</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Потребителско име
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Въведете потребителско име"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save size={20} />
                  <span>{loading ? 'Запазване...' : 'Запази промените'}</span>
                </button>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="border-t pt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Промяна на парола</h2>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    Нова парола
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Въведете нова парола (мин. 6 символа)"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Потвърдете паролата
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Потвърдете новата парола"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Lock size={20} />
                  <span>{loading ? 'Променяне...' : 'Променете паролата'}</span>
                </button>
              </form>
            </div>

            {/* User Listings */}
            <div className="border-t pt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Моите обяви</h2>
                {listings.length > 0 && (
                  <span className="text-sm text-gray-500">
                    Общо: {listings.length} обяви
                  </span>
                )}
              </div>
              
              {listingsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3 animate-pulse">
                      <div className="h-3 bg-gray-200 rounded mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : listings.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {currentListings.map((listing) => (
                      <div key={listing.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center flex-wrap gap-2 mb-1">
                              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded text-nowrap">
                                {getCategoryLabel(listing.category)}
                              </span>
                              {listing.subcategory && listing.category === 'for-home' && (
                                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded text-nowrap">
                                  {getSubcategoryLabel(listing.subcategory)}
                                </span>
                              )}
                              <div className="flex items-center space-x-1 text-gray-500 text-xs">
                                <Clock size={10} />
                                <span className="text-nowrap">{formatDate(listing.created_at)}</span>
                              </div>
                            </div>
                            
                            <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{listing.title}</h3>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {listing.dimensions && (
                                  <div className="flex items-center space-x-1 text-gray-500 text-xs">
                                    <MapPin size={10} />
                                    <span className="text-nowrap">{listing.dimensions}</span>
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm font-semibold text-green-600">
                                    {listing.price.toFixed(2)} €
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-3 flex-shrink-0">
                            <Link
                              to={`/edit-listing/${listing.id}`}
                              className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                            >
                              <Edit size={12} />
                              <span>Редактирай</span>
                            </Link>
                            <button
                              onClick={() => handleDeleteListing(listing.id)}
                              className="flex items-center space-x-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 size={12} />
                              <span>Изтрий</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        Показани {startIndex + 1}-{Math.min(endIndex, listings.length)} от {listings.length}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={goToPrevPage}
                          disabled={currentPage === 1}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft size={16} />
                          <span>Предишна</span>
                        </button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`px-3 py-1 text-sm rounded transition-colors ${
                                page === currentPage
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <span>Следваща</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Plus size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Няма обяви</h3>
                  <p className="text-gray-600 mb-4">
                    Все още не сте публикували обяви.
                  </p>
                </div>
              )}
            </div>
          </div>
          <Link
            to="/register"
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            <span>Регистрация</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage