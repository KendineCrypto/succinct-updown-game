import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ojklsfrzchgmabjacsuf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qa2xzZnJ6Y2hnbWFiamFjc3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDM4NzksImV4cCI6MjA2NTU3OTg3OX0.SnwRqJoujxRHpBrHmvfMRVa5xHq3uDG20FxwWNFmij4'
export const supabase = createClient(supabaseUrl, supabaseKey)
