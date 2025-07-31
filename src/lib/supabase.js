import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gbviyisjdyeeuiohtezx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdidml5aXNqZHllZXVpb2h0ZXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5OTQ3OTEsImV4cCI6MjA2OTU3MDc5MX0.vGveDSYzEJCNv04TlXsnLzXVFNemS5HaSb1PgAPkqWk'
export const supabase = createClient(supabaseUrl, supabaseKey)
