import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  Warning: Supabase credentials not configured. Running in real-time-only mode (no persistence).');
  console.warn('   To enable persistence, add SUPABASE_URL and SUPABASE_SERVICE_KEY to server/.env');
}

// Create client even if credentials are missing (will fail gracefully on DB operations)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key'
);
