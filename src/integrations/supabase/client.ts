// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ffauditoblboiwtmkoaz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmYXVkaXRvYmxib2l3dG1rb2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4ODEwNzgsImV4cCI6MjA1NzQ1NzA3OH0.8QsW_EB_ug5tINI_tZ3yXZ8OKjNxYC3e6HeZVRRRJCU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);