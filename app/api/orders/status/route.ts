import { NextResponse } from "next/server";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Order tracking service is not configured." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json(
      { error: "Phone number is required." },
      { status: 400 },
    );
  }

  // If both provided, find specific order
  if (orderId) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("id,status,created_at,customer_name,total_price")
      .eq("id", orderId)
      .eq("customer_phone", phone)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "Order not found. Please check your details." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data });
  }

  // If only phone provided, find recent orders (last 7 days, max 5)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("id,status,created_at,customer_name,total_price")
    .eq("customer_phone", phone)
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, isList: true });
}
