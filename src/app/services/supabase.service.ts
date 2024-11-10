import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = 'https://wctmohubesvzvmfgetew.supabase.co';
    const supabaseKey = environment.supabase.apiKey;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Función para subir la imagen al bucket
  async uploadProfileImage(file: File, randomString: string): Promise<string | null> {
    const filePath = `profiles/${randomString}${file.name}`;

    const { data, error } = await this.supabase.storage
      .from('clinica-vitalis-bucket')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error al subir la imagen:', error.message);
      return null;
    }

    // Generar la URL pública
    const { data: publicData } = this.supabase.storage
      .from('clinica-vitalis-bucket')
      .getPublicUrl(filePath);
    const publicURL = publicData?.publicUrl;
    return publicURL;
  }
}
