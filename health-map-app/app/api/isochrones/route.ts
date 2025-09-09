import { type NextRequest, NextResponse } from "next/server"

const ORS_API_KEY = process.env.ORS_API_KEY

export async function POST(request: NextRequest) {
  if (!ORS_API_KEY) {
    return NextResponse.json({ error: "ORS_API_KEY environment variable not configured" }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const minutes = searchParams.get("minutes") || "20"
  const profile = searchParams.get("profile") || "driving-car"
  const generalize = searchParams.get("generalize") || "30"

  try {
    const { locations } = await request.json()

    if (!locations || !Array.isArray(locations)) {
      return NextResponse.json({ error: "locations array required" }, { status: 400 })
    }

    const sampledLocations = locations.length > 60 ? sampleArray(locations, 60) : locations

    const batches = []
    for (let i = 0; i < sampledLocations.length; i += 5) {
      batches.push(sampledLocations.slice(i, i + 5))
    }

    const allFeatures: any[] = []

    for (const batch of batches) {
      try {
        const response = await fetch("https://api.openrouteservice.org/v2/isochrones/driving-car", {
          method: "POST",
          headers: {
            Authorization: ORS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locations: batch,
            range: [Number.parseInt(minutes) * 60],
            range_type: "time",
            attributes: ["area"],
            smoothing: Number.parseFloat(generalize),
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.features) {
            allFeatures.push(...data.features)
          }
        } else if (response.status === 429) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          const retryResponse = await fetch("https://api.openrouteservice.org/v2/isochrones/driving-car", {
            method: "POST",
            headers: {
              Authorization: ORS_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              locations: batch,
              range: [Number.parseInt(minutes) * 60],
              range_type: "time",
              attributes: ["area"],
              smoothing: Number.parseFloat(generalize),
            }),
          })

          if (retryResponse.ok) {
            const retryData = await retryResponse.json()
            if (retryData.features) {
              allFeatures.push(...retryData.features)
            }
          }
        }
      } catch (batchError) {
        console.error("Batch processing error:", batchError)
      }
    }

    if (allFeatures.length === 0) {
      const fallbackFeatures = createDistanceBasedCoverage(sampledLocations, Number.parseInt(minutes))
      allFeatures.push(...fallbackFeatures)
    }

    const result = {
      type: "FeatureCollection",
      features: allFeatures,
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Isochrones API error:", error)

    try {
      const { locations } = await request.json()
      const fallbackFeatures = createDistanceBasedCoverage(locations, Number.parseInt(minutes))

      return NextResponse.json(
        {
          type: "FeatureCollection",
          features: fallbackFeatures,
        },
        {
          headers: {
            "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
            "Content-Type": "application/json",
          },
        },
      )
    } catch (fallbackError) {
      return NextResponse.json({ error: "Failed to generate coverage data" }, { status: 500 })
    }
  }
}

function sampleArray<T>(array: T[], size: number): T[] {
  if (array.length <= size) return array
  const step = array.length / size
  const result: T[] = []
  for (let i = 0; i < size; i++) {
    result.push(array[Math.floor(i * step)])
  }
  return result
}

function createDistanceBasedCoverage(locations: number[][], minutes: number): any[] {
  const radiusKm = (minutes / 60) * 60
  const radiusDegrees = radiusKm / 111

  return locations.map((location, index) => {
    const [lng, lat] = location

    const points = []
    const numPoints = 16

    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI
      const x = lng + radiusDegrees * Math.cos(angle)
      const y = lat + radiusDegrees * Math.sin(angle)
      points.push([x, y])
    }

    return {
      type: "Feature",
      properties: {
        group_index: 0,
        value: minutes * 60,
        center: location,
      },
      geometry: {
        type: "Polygon",
        coordinates: [points],
      },
    }
  })
}
