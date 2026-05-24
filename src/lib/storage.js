import { supabase } from './supabase';

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * @param {File} file - The file object to upload.
 * @param {string} bucket - The bucket name (default: 'assets').
 * @param {string} path - The folder path within the bucket.
 * @returns {Promise<string>} - The public URL of the uploaded file.
 */
export async function uploadFile(file, bucket = 'assets', path = '') {
  if (!supabase) throw new Error("Supabase client not initialized.");

  // Clean filename to avoid issues
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = path ? `${path}/${fileName}` : fileName;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
