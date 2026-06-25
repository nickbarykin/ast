import { supabase } from './supabaseClient'

export async function fetchCurrentProfile(userId) {
  if (!supabase || !userId) {
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateCurrentProfile(userId, profile) {
  if (!supabase || !userId) {
    return null
  }

  const payload = {
    display_name: profile.display_name || null,
    birth_date: profile.birth_date || null,
    birth_time: profile.birth_time || null,
    birth_place_name: profile.birth_place_name || null,
    birth_latitude: profile.birth_latitude === '' ? null : Number(profile.birth_latitude),
    birth_longitude: profile.birth_longitude === '' ? null : Number(profile.birth_longitude),
    birth_timezone: profile.birth_timezone || null
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data
}
