import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bbox = searchParams.get("bbox")

  if (!bbox) {
    return NextResponse.json({ error: "bbox parameter required" }, { status: 400 })
  }

  try {
    const [west, south, east, north] = bbox.split(",").map(Number)

    // Overpass query for hospitals
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](${south},${west},${north},${east});
        way["amenity"="hospital"](${south},${west},${north},${east});
        relation["amenity"="hospital"](${south},${west},${north},${east});
      );
      out center;
    `

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
    })

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Overpass API error:", error)
    return NextResponse.json({ error: "Failed to fetch hospital data" }, { status: 500 })
  }
}
