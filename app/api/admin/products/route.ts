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
    .from("menu_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const mappedData = data.map((item: any) => ({
    id: item.id,
    category: item.category,
    name: item.name,
    description: item.description,
    price: parseFloat(item.price),
    image: item.image,
    spiceLevel: item.spice_level,
    isVegetarian: item.is_vegetarian,
    isAvailable: item.is_available,
    isSpecialty: item.is_specialty || false,
  }));

  return NextResponse.json({ data: mappedData });
}

export async function POST(request: Request) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, price, category, image, spiceLevel, isVegetarian, isSpecialty } = body;

  const { data, error } = await supabaseAdmin.from("menu_items").insert([
    {
      name,
      description,
      price,
      category,
      image,
      spice_level: spiceLevel,
      is_vegetarian: isVegetarian,
      is_available: true,
      is_specialty: isSpecialty || false,
    },
  ]).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: data[0] });
}

export async function PATCH(request: Request) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
  }

  // Map frontend fields back to database fields
  const dbUpdates: any = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.image !== undefined) dbUpdates.image = updates.image;
  if (updates.spiceLevel !== undefined) dbUpdates.spice_level = updates.spiceLevel;
  if (updates.isVegetarian !== undefined) dbUpdates.is_vegetarian = updates.isVegetarian;
  if (updates.isAvailable !== undefined) dbUpdates.is_available = updates.isAvailable;
  if (updates.isSpecialty !== undefined) dbUpdates.is_specialty = updates.isSpecialty;

  const { error } = await supabaseAdmin
    .from("menu_items")
    .update(dbUpdates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("menu_items").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
