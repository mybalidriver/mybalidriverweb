import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Initialize Supabase with the SERVICE ROLE KEY (Bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  // Verify User Session to ensure only admins can get notification alerts
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('id, service_name, created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return NextResponse.json({}, { status: 200 }); // Fail silently on no data
  return NextResponse.json(data);
}
