import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("menu_items")
      .select("*")
      .order("category", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map database fields to frontend fields if they differ
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
