import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://ukxnsqlanxsvnflpzcqo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVreG5zcWxhbnhzdm5mbHB6Y3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2NDk0NzYsImV4cCI6MjAzMjIyNTQ3Nn0.jptLnfw296kmrZpoZ4v2mCX7cUzMzak0M7KwRUF1Lzs";
const supabase = createClient(supabaseUrl, supabaseKey);

// ttps://ukxnsqlanxsvnflpzcqo.supabase.co/rest/v1

export default supabase;
