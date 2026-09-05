import { supabase } from './supabase'

export type Listing = {
  id: string
  user_id: string
  category: string
  subcategory?: string
  title: string
  description: string
  dimensions?: string
  price: number
  currency: string
  featured?: boolean
  created_at: string
  updated_at: string
}

export type CreateListingData = {
  category: string
  subcategory?: string
  title: string
  description: string
  dimensions?: string
  price: number
  currency: string
  featured?: boolean
  images?: string[]
}

// Функции за работа със снимки
export const imageService = {
  // Качване на снимка
  async uploadImage(file: File, userId: string, listingId: string): Promise<{ url: string | null; error: any }> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${listingId}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('listing-images')
      .upload(fileName, file)
    
    if (error) {
      return { url: null, error }
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('listing-images')
      .getPublicUrl(fileName)
    
    return { url: publicUrl, error: null }
  },

  // Изтриване на снимка
  async deleteImage(imageUrl: string): Promise<{ error: any }> {
    // Извличане на пътя от URL-а
    const urlParts = imageUrl.split('/listing-images/')
    if (urlParts.length < 2) {
      return { error: { message: 'Невалиден URL на снимка' } }
    }
    
    const filePath = urlParts[1]
    
    const { error } = await supabase.storage
      .from('listing-images')
      .remove([filePath])
    
    return { error }
  }
}

export const listingsService = {
  // Създаване на нова обява
  async createListing(data: CreateListingData) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { listing: null, error: { message: 'Трябва да влезете в профила си за да създадете обява' } }
    }

    const { data: listing, error } = await supabase
      .from('listings')
      .insert([{
        ...data,
        user_id: user.id
      }])
      .select()
      .single()
    
    return { listing, error }
  },

  // Получаване на всички обяви
  async getAllListings() {
    const { data: listings, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { listings, error }
  },

  // Получаване на обяви по категория
  async getListingsByCategory(category: string, subcategory?: string) {
    let query = supabase
      .from('listings')
      .select('*')
      .eq('category', category)

    if (subcategory) {
      query = query.eq('subcategory', subcategory)
    }

    const { data: listings, error } = await query
      .order('created_at', { ascending: false })

    return { listings, error }
  },

  // Получаване на обяви на потребител
  async getUserListings(userId: string) {
    const { data: listings, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    return { listings, error }
  },

  // Актуализиране на обява
  async updateListing(id: string, data: Partial<CreateListingData>) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { listing: null, error: { message: 'Трябва да влезете в профила си' } }
    }

    const { data: listing, error } = await supabase
      .from('listings')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()
    
    return { listing, error }
  },

  // Изтриване на обява
  async deleteListing(id: string) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: 'Трябва да влезете в профила си' } }
    }

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    return { error }
  },

  // Получаване на избрани обяви
  async getFeaturedListings() {
    const { data: listings, error } = await supabase
      .from('listings')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })

    return { listings, error }
  }
}