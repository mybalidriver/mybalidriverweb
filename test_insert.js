const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const dbPayload = {
       id: crypto.randomUUID(),
       type: "Activities",
       title: "Test Activity",
       location: "Bali",
       price: 1000,
       duration: "1 Day",
       category: "Nature",
       rating: 5.0,
       reviews: 0,
       status: "Active",
       image: "",
       company_name: null,
       data: {}
    };

    const { data, error } = await supabase.from('listings').upsert(dbPayload);
    console.log("Error:", error);
    console.log("Data:", data);
}

test();
