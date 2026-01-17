import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pnalebmonjntxxhsqedt.supabase.co';
const supabaseAnonKey = 'sb_publishable_4XzrGkizCD6CYRYw564W6w_OGLuNMba';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
