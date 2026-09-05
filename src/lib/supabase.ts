import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export type User = {
  id: string
  email: string
  username: string
  created_at: string
}

export const authService = {
  // Регистрация
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          display_name: username
        }
      }
    })
    return { data, error }
  },

  // Вход
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Излизане
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Актуализиране на профил
  async updateProfile(username: string) {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        username: username,
        display_name: username
      }
    })
    return { data, error }
  },

  // Промяна на парола
  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: password
    })
    return { data, error }
  },

  // Получаване на текущия потребител
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Слушане за промени в удостоверяването
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}