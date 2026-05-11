import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminSession";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Missing SUPABASE_SERVICE_ROLE_KEY in environment." },
      { status: 500 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Missing SUPABASE_SERVICE_ROLE_KEY in environment." },
      { status: 500 },
    );
  }

  const { id, status, items } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
  }

  const updateData: any = {};
  if (status) updateData.status = status;
  if (items) {
    updateData.items = items;
    // Recalculate total price
    updateData.total_price = items.reduce(
      (sum: number, item: any) => sum + (item.price * item.quantity),
      0
    );
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update(updateData)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, totalPrice: updateData.total_price });
}
