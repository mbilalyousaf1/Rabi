import { NextResponse } from "next/server";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }

  try {
    const { orderId, phone } = await request.json();

    if (!orderId || !phone) {
      return NextResponse.json(
        { error: "Order ID and phone number are required." },
        { status: 400 },
      );
    }

    // 1. Fetch the order to verify ownership and status
    const { data: order, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("status, created_at, customer_phone")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 },
      );
    }

    // 2. Verify phone number matches (basic auth)
    if (order.customer_phone !== phone) {
      return NextResponse.json(
        { error: "Unauthorized. Phone number does not match." },
        { status: 401 },
      );
    }

    // 3. Check if order is pending
    if (order.status !== "pending") {
      return NextResponse.json(
        { error: "Only pending orders can be cancelled." },
        { status: 400 },
      );
    }

    // 4. Check time window (10 minutes)
    const createdAt = new Date(order.created_at).getTime();
    const now = Date.now();
    const tenMinutesInMs = 10 * 60 * 1000;

    if (now - createdAt > tenMinutesInMs) {
      return NextResponse.json(
        { error: "Cancellation window (10 minutes) has passed. Please contact the restaurant." },
        { status: 400 },
      );
    }

    // 5. Update status to cancelled
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to cancel order." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, message: "Order cancelled successfully." });
  } catch (error) {
    console.error("Order cancellation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
