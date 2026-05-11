import { NextResponse } from "next/server";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Order service is not configured." },
      { status: 500 },
    );
  }

  const body = await request.json();
  const {
    customer_name,
    customer_email,
    customer_phone,
    customer_address,
    notes,
    items,
    total_price,
    coordinates,
  } = body ?? {};

  if (!customer_name || !customer_phone || !customer_address) {
    return NextResponse.json(
      { error: "Missing required customer details." },
      { status: 400 },
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "Order must contain at least one item." },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert([
      {
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        notes,
        items,
        total_price,
        coordinates,
        status: "pending",
      },
    ])
    .select("id,status,created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
