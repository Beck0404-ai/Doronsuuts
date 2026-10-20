import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://svyyezkqsulkscvzklbz.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2eXllemtxc3Vsa3NjdnprbGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0ODA1NDYsImV4cCI6MjEwODA1NjU0Nn0.39eMV1Bg00e6JIQcxY6ahnnxoq97MZ6R5cUIR8hQOg0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
