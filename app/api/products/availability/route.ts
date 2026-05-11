import { NextResponse } from "next/server";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ data: {} });
  }

  const { data, error } = await supabaseAdmin
    .from("product_availability")
    .select("product_name,is_available");

  if (error) {
    return NextResponse.json({ data: {} });
  }

  const availabilityMap = Object.fromEntries(
    (data || []).map((row) => [row.product_name, row.is_available]),
  );

  return NextResponse.json({ data: availabilityMap });
}
