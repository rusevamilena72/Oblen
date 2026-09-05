import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Edit, Package, FileText, Ruler, DollarSign, AlertCircle, CheckCircle, Upload, X, Image, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { listingsService, CreateListingData, Listing, imageService } from '../lib/listings'

const EditListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [listing, setListing] = useState<Listing | null>(null)
  const [formData, setFormData] = useState<CreateListingData>({
    category: '',
    subcategory: '',
    title: '',
    description: '',
    dimensions: '',
    price: 0,
    currency: 'eur',
    featured: false
  })
  
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)

  const categories = [
    { value: 'cat-climbers', label: 'Катерушки за котки' },
    { value: 'for-home', label: 'Декорации за дома' },
    { value: 'jewelry', label: 'Накити' }
  ]

  const forHomeSubcategories = [
    { value: 'practical', label: 'Практично' },
    { value: 'decorations', label: 'Декорации' },
    { value: 'holidays', label: 'Празници' }
  ]

  const currencies = [
    { value: 'eur', label: 'EUR' }
  ]

  useEffect(() => {
    const fetchListing = async () => {
      if (!id || !user) return
      
      setFetchLoading(true)
      const { listings } = await listingsService.getUserListings(user.id)
      
      if (listings) {
        const currentListing = listings.find(l => l.id === id)
        if (currentListing) {
          setListing(currentListing)
          setExistingImages(currentListing.images || [])
          setFormData({
            category: currentListing.category,
            subcategory: currentListing.subcategory || '',
            title: currentListing.title,
            description: currentListing.description,
            dimensions: currentListing.dimensions || '',
            price: currentListing.price,
            currency: currentListing.currency,
            featured: currentListing.featured || false
          })
        } else {
          setError('Обявата не е намерена или нямате права да я редактирате')
        }
      }
      
      setFetchLoading(false)
    }

    fetchListing()
  }, [id, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'price' ? parseFloat(value) || 0 : value)
    }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Валидация на файловете
    const validFiles = files.filter(file => {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      const maxSize = 1024 * 1024 // 1MB
      
      if (!validTypes.includes(file.type)) {
        setError(`Файлът ${file.name} не е валиден формат. Използвайте PNG, JPG или WebP.`)
        return false
      }
      
      if (file.size > maxSize) {
        setError(`Файлът ${file.name} е твърде голям. Максималният размер е 1MB.`)
        return false
      }
      
      return true
    })
    
    // Ограничение до 5 снимки общо (съществуващи + нови)
    const totalImages = existingImages.length - imagesToDelete.length + selectedImages.length + validFiles.length
    if (totalImages > 5) {
      setError('Можете да имате максимум 5 снимки.')
      return
    }
    
    // Добавяне на новите файлове
    const newImages = [...selectedImages, ...validFiles]
    setSelectedImages(newImages)
    
    // Създаване на preview URL-и
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file))
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls])
    
    setError('')
  }

  const removeNewImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index)
    
    // Освобождаване на memory за премахнатия URL
    URL.revokeObjectURL(imagePreviewUrls[index])
    
    setSelectedImages(newImages)
    setImagePreviewUrls(newPreviewUrls)
  }

  const removeExistingImage = (imageUrl: string) => {
    setImagesToDelete(prev => [...prev, imageUrl])
  }

  const restoreExistingImage = (imageUrl: string) => {
    setImagesToDelete(prev => prev.filter(url => url !== imageUrl))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !id) {
      setError('Трябва да влезете в профила си, за да редактирате обява')
      return
    }

    if (!formData.category || !formData.title || !formData.description || formData.price <= 0) {
      setError('Моля, попълнете всички задължителни полета')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)
    setUploadingImages(true)

    // Изтриване на маркираните за изтриване снимки
    for (const imageUrl of imagesToDelete) {
      await imageService.deleteImage(imageUrl)
    }

    // Качване на новите снимки
    let newImageUrls: string[] = []
    if (selectedImages.length > 0) {
      for (const image of selectedImages) {
        const { url, error: uploadError } = await imageService.uploadImage(image, user.id, id!)
        
        if (uploadError) {
          setError(`Грешка при качване на снимка: ${uploadError.message}`)
          setLoading(false)
          setUploadingImages(false)
          return
        }
        
        if (url) {
          newImageUrls.push(url)
        }
      }
    }

    // Комбиниране на съществуващите (неизтрити) и новите снимки
    const remainingExistingImages = existingImages.filter(url => !imagesToDelete.includes(url))
    const allImages = [...remainingExistingImages, ...newImageUrls]

    const updatedFormData = {
      ...formData,
      images: allImages
    }

    const { listing, error } = await listingsService.updateListing(id, updatedFormData)
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      // Освобождаване на memory за preview URL-ите
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url))
      setTimeout(() => {
        navigate('/profile')
      }, 2000)
    }
    
    setLoading(false)
    setUploadingImages(false)
  }

  // Cleanup на preview URLs при unmount
  React.useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  if (!user) {
    navigate('/login')
    return null
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Обявата не е намерена</h1>
            <p className="text-gray-600 mb-6">Обявата не съществува или нямате права да я редактирате.</p>
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Обратно към профила
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Edit size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Редактиране на обява</h1>
                <p className="text-blue-100">Актуализирайте информацията за вашата обява</p>
              </div>
            </div>
          </div>

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
                  Обявата е актуализирана успешно! Пренасочване към профила...
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Категория */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Категория *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package size={20} className="text-gray-400" />
                  </div>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Изберете категория</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Подкатегория (само за "Декорации за дома") */}
              {formData.category === 'for-home' && (
                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
                    Подкатегория *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Package size={20} className="text-gray-400" />
                    </div>
                    <select
                      id="subcategory"
                      name="subcategory"
                      required
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Изберете подкатегория</option>
                      {forHomeSubcategories.map((subcategory) => (
                        <option key={subcategory.value} value={subcategory.value}>
                          {subcategory.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Име на артикула */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Име на артикула *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Въведете името на артикула"
                  />
                </div>
              </div>

              {/* Детайли */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Детайли *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                  placeholder="Опишете артикула подробно..."
                />
              </div>

              {/* Размери */}
              <div>
                <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-2">
                  Размери (незадължително)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Ruler size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="dimensions"
                    name="dimensions"
                    type="text"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="напр. 50x30x20 см"
                  />
                </div>
              </div>

              {/* Снимки */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Снимки (до 5 броя, макс. 1MB всяка)
                </label>
                
                {/* Съществуващи снимки */}
                {existingImages.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Текущи снимки:</h4>
                    <div className="overflow-auto max-h-80 p-2 border border-gray-200 rounded-lg" style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#cbd5e1 #f1f5f9'
                    }}>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {existingImages.map((imageUrl, index) => {
                        const isMarkedForDeletion = imagesToDelete.includes(imageUrl)
                        return (
                          <div key={imageUrl} className={`relative group ${isMarkedForDeletion ? 'opacity-50' : ''}`}>
                            <img
                              src={imageUrl}
                              alt={`Съществуваща снимка ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            />
                            {isMarkedForDeletion ? (
                              <button
                                type="button"
                                onClick={() => restoreExistingImage(imageUrl)}
                                className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 hover:bg-green-600 transition-colors"
                                title="Възстанови снимката"
                              >
                                <Plus size={16} />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeExistingImage(imageUrl)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                title="Маркирай за изтриване"
                              >
                                <X size={16} />
                              </button>
                            )}
                            {index === 0 && !isMarkedForDeletion && (
                              <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                Основна
                              </div>
                            )}
                            {isMarkedForDeletion && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                                <span className="text-white text-sm font-medium">За изтриване</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Upload Area за нови снимки */}
                {(existingImages.length - imagesToDelete.length + selectedImages.length) < 5 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload size={32} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Кликнете за качване на нови снимки или ги плъзнете тук
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG, WebP до 1MB
                      </span>
                    </label>
                  </div>
                )}

                {/* Preview на новите снимки */}
                {imagePreviewUrls.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Нови снимки:</h4>
                    <div className="overflow-auto max-h-80 p-2 border border-gray-200 rounded-lg" style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#cbd5e1 #f1f5f9'
                    }}>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Нова снимка ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Нова
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Цена */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Цена *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={handleInputChange}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                    Валута *
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    required
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Избрани артикули */}
              <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="featured" className="flex-1 cursor-pointer">
                  <div className="text-sm font-medium text-gray-900">
                    Показвай в "Най-търсените артикули"
                  </div>
                  <div className="text-sm text-gray-600">
                    Ако чекнете това поле, обявата ще се показва в секцията "Най-търсените артикули" на началната страница
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex space-x-4">
                <button
                  type="submit"
                 disabled={loading || success || uploadingImages}
                  className="flex-1 flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                 {uploadingImages ? (
                   <>
                     <Image size={20} className="animate-pulse" />
                     <span>Обработка на снимки...</span>
                   </>
                 ) : loading ? (
                   <>
                     <Edit size={20} />
                     <span>Запазване...</span>
                   </>
                 ) : (
                   <>
                     <Edit size={20} />
                     <span>Запази промените</span>
                   </>
                 )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Отказ
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditListingPage