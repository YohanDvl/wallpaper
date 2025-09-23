import { Injectable } from '@angular/core';
import { supabase } from 'src/app/database/supabase';

@Injectable({
  providedIn: 'root'
})
export class UpLoader {
  async upload(bucket: string, name: string, type: string, d: string){


  const { data, error} =  await supabase.storage.from(bucket).upload(`/${name}`,
     Uint8Array.from(atob(d), c => c.charCodeAt(0)), {
      contentType: type,
      upsert: true,
      cacheControl: '3600',
    });
    console.log(error);
    console.log(data);

    return data?.path || '';
  }

  async getUrl(bucket: string, path: string): Promise<string>{

    const {data, error} = await supabase.storage.from(bucket).createSignedUrl(path, 86400);

    return data?.signedUrl || '';
  }

  // Lista archivos por prefijo (carpeta del usuario)
  async listByPrefix(bucket: string, prefix: string): Promise<string[]> {
    const { data, error } = await supabase.storage.from(bucket).list(prefix, {
      limit: 100,
      offset: 0,
    });
    if (error) {
      console.error(error);
      return [];
    }
    return (data ?? []).map((f) => `${prefix}/${f.name}`);
  }

  // Firma múltiples URLs a la vez
  async createSignedUrls(bucket: string, paths: string[], expiresIn = 86400): Promise<string[]> {
    if (!paths.length) return [];
    const { data, error } = await supabase.storage.from(bucket).createSignedUrls(paths, expiresIn);
    if (error) {
      console.error(error);
      return [];
    }
    return (data ?? []).map((d) => d.signedUrl);
  }

  // Helper: obtiene URLs firmadas de todos los archivos en la carpeta de un usuario
  async getUserFolderSignedUrls(bucket: string, userFolder: string): Promise<string[]> {
    const paths = await this.listByPrefix(bucket, userFolder);
    return this.createSignedUrls(bucket, paths);
  }

  // Elimina un archivo del bucket dado su path
  async delete(bucket: string, path: string): Promise<boolean> {
    const { data, error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      console.error('Error al eliminar', error);
      return false;
    }
    return true;
  }

  // Extrae el path interno de Storage a partir de un Signed URL
  // Formato típico: https://<proj>.supabase.co/storage/v1/object/sign/<bucket>/<path>?token=...
  extractPathFromSignedUrl(bucket: string, signedUrl: string): string | null {
    try {
      const marker = `/object/sign/${bucket}/`;
      const idx = signedUrl.indexOf(marker);
      if (idx === -1) return null;
      const after = signedUrl.substring(idx + marker.length);
      const q = after.indexOf('?');
      return q === -1 ? after : after.substring(0, q);
    } catch (e) {
      console.error('No se pudo extraer el path del Signed URL', e);
      return null;
    }
  }


  // async getUrls(bucket: string, path: string[]){

  //   const d = await supabase.storage.from(bucket).list('', {
  //     limit: 10,
  //     offset: 0,
  //   }
  // ).then((objeto) =>{
  //  return objeto.data?.map(p => p.name)
  // })

  //const {data, error} = await supabase.storage.from(bucket).createSignedUrls(path, 60)

  // }
}
