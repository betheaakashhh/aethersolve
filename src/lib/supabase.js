// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role (for admin operations)
export const supabaseAdmin = () => {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin should only be used server-side');
  }
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
};

// Upload resume to Supabase Storage
export async function uploadResume(file, applicationId) {
  const fileExt = file.name.split('.').pop();
  const fileName = `resumes/${applicationId}-${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('applications')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;
  
  const { data: urlData } = supabase.storage
    .from('applications')
    .getPublicUrl(fileName);
    
  return urlData.publicUrl;
}

// Upload testimonial image
export async function uploadTestimonialImage(file, testimonialId) {
  const fileExt = file.name.split('.').pop();
  const fileName = `testimonials/${testimonialId}-${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('testimonials')
    .upload(fileName, file, { upsert: true });

  if (error) throw error;
  
  const { data: urlData } = supabase.storage
    .from('testimonials')
    .getPublicUrl(fileName);
    
  return urlData.publicUrl;
}
