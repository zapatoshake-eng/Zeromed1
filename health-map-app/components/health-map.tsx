"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface Hospital {
  id: string
  lat: number
  lon: number
  name?: string
  operator?: string
  phone?: string
  website?: string
  emergency?: string
  addr_street?: string
  addr_city?: string
  addr_postcode?: string
  opening_hours?: string
  wheelchair?: string
  beds?: string
  speciality?: string
}

interface CoverageData {
  type: string
  features: any[]
  totalArea?: number
  avgRadius?: number
}

export function HealthMap() {
  const [isLoading, setIsLoading] = useState(false)
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([])
  const [coverage, setCoverage] = useState<CoverageData | null>(null)
  const [currentRegion, setCurrentRegion] = useState("New York")
  const [error, setError] = useState<string | null>(null)
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterBy, setFilterBy] = useState("all")
  const [isRegionsCollapsed, setIsRegionsCollapsed] = useState(false)
  const [regionSearchTerm, setRegionSearchTerm] = useState("")

  const regions = [
    { name: "New York", bbox: "-74.2591,40.4774,-73.7004,40.9176", center: { lat: 40.7128, lon: -74.006 } },
    { name: "London", bbox: "-0.5103,51.2868,0.3340,51.6918", center: { lat: 51.5074, lon: -0.1278 } },
    { name: "Tokyo", bbox: "139.3629,35.5322,140.1441,35.8986", center: { lat: 35.6762, lon: 139.6503 } },
    { name: "Sydney", bbox: "150.5209,-34.1692,151.3430,-33.5781", center: { lat: -33.8688, lon: 151.2093 } },
    { name: "Paris", bbox: "2.2241,48.8155,2.4699,48.9021", center: { lat: 48.8566, lon: 2.3522 } },
    { name: "Berlin", bbox: "13.0883,52.3382,13.7611,52.6755", center: { lat: 52.52, lon: 13.405 } },
    { name: "Toronto", bbox: "-73.9830,45.4215,-73.4759,45.7044", center: { lat: 45.5017, lon: -73.5673 } },
    { name: "Singapore", bbox: "103.6057,1.2966,104.0305,1.4784", center: { lat: 1.3521, lon: 103.8198 } },
    { name: "Mumbai", bbox: "72.7757,18.8900,72.9781,19.2760", center: { lat: 19.076, lon: 72.8777 } },
    { name: "São Paulo", bbox: "-46.8252,-23.7781,-46.3651,-23.3567", center: { lat: -23.5505, lon: -46.6333 } },
    { name: "Dubai", bbox: "54.8973,24.7136,55.5731,25.4052", center: { lat: 25.2048, lon: 55.2708 } },
    { name: "Mexico City", bbox: "-99.3654,19.2465,-98.9406,19.5926", center: { lat: 19.4326, lon: -99.1332 } },
    { name: "Los Angeles", bbox: "-118.6682,33.7037,-118.1553,34.3373", center: { lat: 34.0522, lon: -118.2437 } },
    { name: "Chicago", bbox: "-87.9401,41.6445,-87.5240,42.0230", center: { lat: 41.8781, lon: -87.6298 } },
    { name: "Shanghai", bbox: "121.1270,31.0456,121.7744,31.4131", center: { lat: 31.2304, lon: 121.4737 } },
    { name: "Beijing", bbox: "116.0670,39.6424,116.7834,40.1853", center: { lat: 39.9042, lon: 116.4074 } },
    { name: "Moscow", bbox: "37.3193,55.4919,37.9678,55.9579", center: { lat: 55.7558, lon: 37.6176 } },
    { name: "Istanbul", bbox: "28.6700,40.8533,29.3026,41.2291", center: { lat: 41.0082, lon: 28.9784 } },
    { name: "Cairo", bbox: "31.0456,29.8587,31.4978,30.1618", center: { lat: 30.0444, lon: 31.2357 } },
    { name: "Lagos", bbox: "3.1792,6.4281,3.6964,6.7027", center: { lat: 6.5244, lon: 3.3792 } },
    { name: "Buenos Aires", bbox: "-58.5315,-34.7054,-58.3354,-34.5265", center: { lat: -34.6118, lon: -58.396 } },
    { name: "Rio de Janeiro", bbox: "-43.7958,-23.0824,-43.0969,-22.7460", center: { lat: -22.9068, lon: -43.1729 } },
    { name: "Bangkok", bbox: "100.3277,13.4942,100.9377,13.9546", center: { lat: 13.7563, lon: 100.5018 } },
    { name: "Jakarta", bbox: "106.6894,-6.3676,107.1569,-6.0840", center: { lat: -6.2088, lon: 106.8456 } },
    { name: "Manila", bbox: "120.8994,14.4074,121.1854,14.7417", center: { lat: 14.5995, lon: 120.9842 } },
    { name: "Seoul", bbox: "126.7342,37.4138,127.2693,37.7015", center: { lat: 37.5665, lon: 126.978 } },
    { name: "Delhi", bbox: "76.8388,28.4089,77.3464,28.8833", center: { lat: 28.7041, lon: 77.1025 } },
    { name: "Karachi", bbox: "66.8303,24.7136,67.2847,25.0700", center: { lat: 24.8607, lon: 67.0011 } },
    { name: "Dhaka", bbox: "90.2934,23.6850,90.5357,23.8859", center: { lat: 23.8103, lon: 90.4125 } },
    { name: "Kolkata", bbox: "88.2636,22.4699,88.4255,22.6203", center: { lat: 22.5726, lon: 88.3639 } },
    { name: "Madrid", bbox: "-3.8317,40.3119,-3.5617,40.5640", center: { lat: 40.4168, lon: -3.7038 } },
    { name: "Rome", bbox: "12.3536,41.8003,12.6328,42.0103", center: { lat: 41.9028, lon: 12.4964 } },
    { name: "Barcelona", bbox: "2.0524,41.3200,2.2280,41.4695", center: { lat: 41.3851, lon: 2.1734 } },
    { name: "Amsterdam", bbox: "4.7283,52.2784,5.0681,52.4311", center: { lat: 52.3676, lon: 4.9041 } },
    { name: "Vienna", bbox: "16.1827,48.1186,16.5773,48.3233", center: { lat: 48.2082, lon: 16.3738 } },
    { name: "Prague", bbox: "14.2244,49.9419,14.7068,50.1774", center: { lat: 50.0755, lon: 14.4378 } },
    { name: "Stockholm", bbox: "17.8094,59.2741,18.2648,59.4128", center: { lat: 59.3293, lon: 18.0686 } },
    { name: "Copenhagen", bbox: "12.4533,55.6159,12.6508,55.7273", center: { lat: 55.6761, lon: 12.5683 } },
    { name: "Helsinki", bbox: "24.7828,60.1098,25.1548,60.2551", center: { lat: 60.1699, lon: 24.9384 } },
    { name: "Oslo", bbox: "10.6450,59.8937,10.8271,59.9753", center: { lat: 59.9139, lon: 10.7522 } },
    { name: "Zurich", bbox: "8.4609,47.3188,8.6204,47.4339", center: { lat: 47.3769, lon: 8.5417 } },
    { name: "Brussels", bbox: "4.2979,50.7909,4.4370,50.8929", center: { lat: 50.8503, lon: 4.3517 } },
    { name: "Lisbon", bbox: "-9.2297,38.6918,-9.0975,38.7755", center: { lat: 38.7223, lon: -9.1393 } },
    { name: "Warsaw", bbox: "20.8518,52.0977,21.2711,52.3679", center: { lat: 52.2297, lon: 21.0122 } },
    { name: "Budapest", bbox: "18.9548,47.4138,19.3261,47.5665", center: { lat: 47.4979, lon: 19.0402 } },
    { name: "Athens", bbox: "23.6177,37.9364,23.7794,38.0243", center: { lat: 37.9838, lon: 23.7275 } },
    { name: "Montreal", bbox: "-73.9830,45.4215,-73.4759,45.7044", center: { lat: 45.5017, lon: -73.5673 } },
    { name: "Vancouver", bbox: "-123.2741,49.1985,-123.0240,49.3157", center: { lat: 49.2827, lon: -123.1207 } },
    { name: "Miami", bbox: "-80.3203,25.7138,-80.1347,25.8551", center: { lat: 25.7617, lon: -80.1918 } },
    { name: "San Francisco", bbox: "-122.5150,37.7081,-122.3549,37.8339", center: { lat: 37.7749, lon: -122.4194 } },
    { name: "Boston", bbox: "-71.1912,42.2279,-70.9865,42.4072", center: { lat: 42.3601, lon: -71.0589 } },
    { name: "Washington DC", bbox: "-77.1198,38.8032,-76.9093,38.9955", center: { lat: 38.9072, lon: -77.0369 } },
    { name: "Atlanta", bbox: "-84.5515,33.6478,-84.2897,33.8868", center: { lat: 33.749, lon: -84.388 } },
    { name: "Houston", bbox: "-95.8236,29.5228,-95.0140,30.1107", center: { lat: 29.7604, lon: -95.3698 } },
    { name: "Phoenix", bbox: "-112.3740,33.2948,-111.9294,33.7112", center: { lat: 33.4484, lon: -112.074 } },
    { name: "Denver", bbox: "-105.1178,39.6143,-104.8694,39.9143", center: { lat: 39.7392, lon: -104.9903 } },
    { name: "Seattle", bbox: "-122.4598,47.4810,-122.2244,47.7341", center: { lat: 47.6062, lon: -122.3321 } },
    { name: "Las Vegas", bbox: "-115.3738,36.0395,-115.0618,36.2719", center: { lat: 36.1699, lon: -115.1398 } },
    { name: "Detroit", bbox: "-83.2873,42.2553,-82.9105,42.4504", center: { lat: 42.3314, lon: -83.0458 } },
    { name: "Philadelphia", bbox: "-75.2804,39.8670,-74.9558,40.1379", center: { lat: 39.9526, lon: -75.1652 } },
    { name: "Hong Kong", bbox: "113.8259,22.1435,114.4411,22.5618", center: { lat: 22.3193, lon: 114.1694 } },
    { name: "Taipei", bbox: "121.4627,24.9659,121.6414,25.2120", center: { lat: 25.033, lon: 121.5654 } },
    { name: "Kuala Lumpur", bbox: "101.5851,3.0738,101.7595,3.2387", center: { lat: 3.139, lon: 101.6869 } },
    { name: "Ho Chi Minh City", bbox: "106.6296,10.6910,106.8356,10.8542", center: { lat: 10.8231, lon: 106.6297 } },
    { name: "Bangalore", bbox: "77.4601,12.8339,77.7840,13.1394", center: { lat: 12.9716, lon: 77.5946 } },
    { name: "Chennai", bbox: "80.1482,12.8342,80.3464,13.2277", center: { lat: 13.0827, lon: 80.2707 } },
    { name: "Hyderabad", bbox: "78.2479,17.2473,78.6274,17.5616", center: { lat: 17.385, lon: 78.4867 } },
    { name: "Pune", bbox: "73.7004,18.4088,73.9997,18.6298", center: { lat: 18.5204, lon: 73.8567 } },
    { name: "Ahmedabad", bbox: "72.4194,22.9734,72.6947,23.1394", center: { lat: 23.0225, lon: 72.5714 } },
    { name: "Jaipur", bbox: "75.6897,26.8147,75.8792,26.9924", center: { lat: 26.9124, lon: 75.7873 } },
    { name: "Casablanca", bbox: "-7.6992,33.5731,-7.5123,33.6405", center: { lat: 33.5731, lon: -7.5898 } },
    { name: "Johannesburg", bbox: "27.9116,-26.2023,28.1816,-26.0448", center: { lat: -26.2041, lon: 28.0473 } },
    { name: "Cape Town", bbox: "18.3741,-34.0928,18.4896,-33.8567", center: { lat: -33.9249, lon: 18.4241 } },
    { name: "Nairobi", bbox: "36.6509,-1.4442,36.8866,-1.1630", center: { lat: -1.2921, lon: 36.8219 } },
    { name: "Addis Ababa", bbox: "38.6517,8.8742,38.8677,9.0778", center: { lat: 9.032, lon: 38.7469 } },
    { name: "Accra", bbox: "-0.2974,5.4877,-0.1063,5.6037", center: { lat: 5.6037, lon: -0.187 } },
    { name: "Dakar", bbox: "-17.5334,14.6037,-17.4441,14.7645", center: { lat: 14.7167, lon: -17.4677 } },
    { name: "Algiers", bbox: "2.9916,36.6892,3.1477,36.7937", center: { lat: 36.7538, lon: 3.0588 } },
    { name: "Tunis", bbox: "10.0865,36.7755,10.2297,36.8685", center: { lat: 36.8065, lon: 10.1815 } },
    { name: "Rabat", bbox: "-6.8498,33.9716,-6.8063,34.0531", center: { lat: 34.0209, lon: -6.8326 } },
    { name: "Lima", bbox: "-77.1943,-12.2072,-76.8479,-11.9099", center: { lat: -12.0464, lon: -77.0428 } },
    { name: "Bogotá", bbox: "-74.2271,4.4687,-74.0421,4.7110", center: { lat: 4.711, lon: -74.0721 } },
    { name: "Santiago", bbox: "-70.7908,-33.5693,-70.4926,-33.3507", center: { lat: -33.4489, lon: -70.6693 } },
    { name: "Caracas", bbox: "-67.0648,10.4016,-66.7498,10.5430", center: { lat: 10.4806, lon: -66.9036 } },
    { name: "Quito", bbox: "-78.5661,-0.3516,-78.4204,-0.1255", center: { lat: -0.1807, lon: -78.4678 } },
    { name: "La Paz", bbox: "-68.1193,-16.5255,-68.0590,-16.4955", center: { lat: -16.5, lon: -68.1193 } },
    { name: "Montevideo", bbox: "-56.2317,-34.9011,-56.1645,-34.8335", center: { lat: -34.9011, lon: -56.1645 } },
    { name: "Asunción", bbox: "-57.6866,-25.3634,-57.5704,-25.2637", center: { lat: -25.2637, lon: -57.5759 } },
    { name: "Guatemala City", bbox: "-90.5328,14.5906,-90.4929,14.6407", center: { lat: 14.6349, lon: -90.5069 } },
    { name: "San José", bbox: "-84.1557,9.9281,-84.0527,9.9281", center: { lat: 9.9281, lon: -84.0784 } },
  ]

  const filteredRegions = regions.filter((region) => region.name.toLowerCase().includes(regionSearchTerm.toLowerCase()))

  const fetchHospitalData = async (bbox: string, regionName: string) => {
    setIsLoading(true)
    setError(null)
    setCurrentRegion(regionName)
    setSelectedHospital(null)
    setSearchTerm("")

    try {
      console.log(`Fetching hospitals for ${regionName} with bbox: ${bbox}`)
      const response = await fetch(`/api/overpass?bbox=${bbox}`)

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Received data:", data)

      const hospitalData =
        data.elements
          ?.map((element: any) => ({
            id: element.id.toString(),
            lat: element.lat || element.center?.lat,
            lon: element.lon || element.center?.lon,
            name: element.tags?.name || "Unnamed Hospital",
            operator: element.tags?.operator,
            phone: element.tags?.phone,
            website: element.tags?.website,
            emergency: element.tags?.emergency,
            addr_street: element.tags?.["addr:street"],
            addr_city: element.tags?.["addr:city"],
            addr_postcode: element.tags?.["addr:postcode"],
            opening_hours: element.tags?.opening_hours,
            wheelchair: element.tags?.wheelchair,
            beds: element.tags?.beds,
            speciality: element.tags?.speciality || element.tags?.healthcare,
          }))
          .filter((h: Hospital) => h.lat && h.lon) || []

      setHospitals(hospitalData)
      setFilteredHospitals(hospitalData)
      console.log(`Found ${hospitalData.length} hospitals in ${regionName}`)

      if (hospitalData.length > 0) {
        await calculateCoverage(hospitalData.slice(0, 10))
      } else {
        setCoverage(null)
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch hospital data")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateCoverage = async (hospitalSample: Hospital[]) => {
    try {
      const locations = hospitalSample.map((h) => [h.lon, h.lat])
      console.log("Calculating coverage with locations:", locations)

      const response = await fetch("/api/isochrones?minutes=20&profile=driving-car&generalize=30", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locations }),
      })

      if (response.ok) {
        const coverageData = await response.json()
        console.log("Coverage response:", coverageData)

        let totalArea = 0
        if (coverageData.features) {
          coverageData.features.forEach((feature: any) => {
            if (feature.properties?.area) {
              totalArea += feature.properties.area
            }
          })
        }

        const avgRadius = Math.sqrt(totalArea / Math.PI / hospitalSample.length) / 1000

        setCoverage({
          ...coverageData,
          totalArea,
          avgRadius,
        })
      } else {
        console.error("Coverage API error:", response.status, await response.text())
      }
    } catch (error) {
      console.error("Error calculating coverage:", error)
    }
  }

  useEffect(() => {
    let filtered = hospitals

    if (searchTerm) {
      filtered = filtered.filter(
        (hospital) =>
          hospital.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.operator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.addr_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.speciality?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterBy !== "all") {
      filtered = filtered.filter((hospital) => {
        switch (filterBy) {
          case "emergency":
            return hospital.emergency === "yes"
          case "wheelchair":
            return hospital.wheelchair === "yes"
          case "has_phone":
            return hospital.phone
          case "has_website":
            return hospital.website
          default:
            return true
        }
      })
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "")
        case "operator":
          return (a.operator || "").localeCompare(b.operator || "")
        case "city":
          return (a.addr_city || "").localeCompare(b.addr_city || "")
        default:
          return 0
      }
    })

    setFilteredHospitals(filtered)
  }, [hospitals, searchTerm, sortBy, filterBy])

  const renderVisualMap = () => {
    const currentRegionData = regions.find((r) => r.name === currentRegion)
    if (!currentRegionData) return null

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${currentRegionData.bbox}&layer=mapnik&marker=${currentRegionData.center.lat}%2C${currentRegionData.center.lon}`

    return (
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden min-h-[400px] group">
        <iframe
          src={mapUrl}
          className="w-full h-[400px] border-0 rounded-lg pointer-events-none"
          title={`Map of ${currentRegion}`}
          loading="lazy"
          scrolling="no"
        />

        <div className="absolute inset-0 pointer-events-none">
          {hospitals.slice(0, 20).map((hospital, index) => {
            const [west, south, east, north] = currentRegionData.bbox.split(",").map(Number)
            const x = ((hospital.lon - west) / (east - west)) * 100
            const y = ((north - hospital.lat) / (north - south)) * 100

            if (x < 0 || x > 100 || y < 0 || y > 100) return null

            return (
              <div
                key={hospital.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group/marker animate-fade-in pointer-events-auto z-10"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  animationDelay: `${index * 0.1}s`,
                }}
                onClick={() => setSelectedHospital(hospital)}
              >
                <div className="relative">
                  <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg group-hover/marker:scale-150 transition-all duration-300 group-hover/marker:bg-red-600 animate-pulse border-2 border-white" />
                  <div className="absolute inset-0 w-4 h-4 bg-red-300/50 rounded-full animate-ping group-hover/marker:animate-none" />
                </div>
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-all duration-300 z-20 border border-primary/20 max-w-48">
                  <div className="font-semibold">{hospital.name}</div>
                  {hospital.addr_city && <div className="text-muted-foreground">{hospital.addr_city}</div>}
                  {hospital.emergency === "yes" && <div className="text-red-600 font-medium">🚨 Emergency</div>}
                </div>
              </div>
            )
          })}

          {coverage && coverage.features && (
            <div className="absolute inset-0">
              {coverage.features.slice(0, 8).map((_, index) => {
                const [west, south, east, north] = currentRegionData.bbox.split(",").map(Number)
                const hospitalSubset = hospitals.slice(index * 2, (index + 1) * 2)

                return hospitalSubset.map((hospital, subIndex) => {
                  const x = ((hospital.lon - west) / (east - west)) * 100
                  const y = ((north - hospital.lat) / (north - south)) * 100
                  const size = 80 + Math.random() * 40

                  if (x < -20 || x > 120 || y < -20 || y > 120) return null

                  return (
                    <div
                      key={`${index}-${subIndex}`}
                      className="absolute bg-primary/8 border-2 border-primary/20 rounded-full animate-pulse hover:bg-primary/15 transition-all duration-500 animate-fade-in"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        transform: "translate(-50%, -50%)",
                        animationDelay: `${(index * 2 + subIndex) * 0.3}s`,
                      }}
                    />
                  )
                })
              })}
            </div>
          )}
        </div>

        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-xs">
          <div className="font-semibold text-primary">{currentRegion}</div>
          <div className="text-muted-foreground">© OpenStreetMap contributors</div>
        </div>

        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-xs">
          <div className="font-semibold text-primary">{hospitals.length} Hospitals</div>
          <div className="text-muted-foreground">20-min coverage</div>
        </div>
      </div>
    )
  }

  const renderHospitalDetails = (hospital: Hospital) => (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-card-foreground">{hospital.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>📍</span>
            <span>
              {hospital.lat.toFixed(4)}, {hospital.lon.toFixed(4)}
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSelectedHospital(null)}>
          ✕
        </Button>
      </div>

      {(hospital.addr_street || hospital.addr_city || hospital.addr_postcode) && (
        <div className="space-y-2">
          <h4 className="font-semibold text-card-foreground flex items-center gap-2">
            <span>🏠</span>
            Address
          </h4>
          <div className="bg-muted/50 p-3 rounded-lg space-y-1">
            {hospital.addr_street && <p className="text-sm">{hospital.addr_street}</p>}
            <p className="text-sm">
              {hospital.addr_city && `${hospital.addr_city}`}
              {hospital.addr_postcode && ` ${hospital.addr_postcode}`}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="font-semibold text-card-foreground flex items-center gap-2">
          <span>📞</span>
          Contact Information
        </h4>
        <div className="space-y-3">
          {hospital.phone && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-sm">📞</span>
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <a href={`tel:${hospital.phone}`} className="text-sm text-primary hover:underline">
                  {hospital.phone}
                </a>
              </div>
            </div>
          )}
          {hospital.website && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-sm">🌐</span>
              </div>
              <div>
                <p className="text-sm font-medium">Website</p>
                <a
                  href={hospital.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Visit Website
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-card-foreground flex items-center gap-2">
          <span>🏥</span>
          Services & Facilities
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {hospital.emergency === "yes" && (
            <Badge variant="destructive" className="justify-center">
              🚨 Emergency Services
            </Badge>
          )}
          {hospital.wheelchair === "yes" && (
            <Badge variant="secondary" className="justify-center">
              ♿ Wheelchair Access
            </Badge>
          )}
          {hospital.beds && (
            <Badge variant="outline" className="justify-center">
              🛏️ {hospital.beds} Beds
            </Badge>
          )}
          {hospital.speciality && (
            <Badge variant="outline" className="justify-center">
              🩺 {hospital.speciality}
            </Badge>
          )}
        </div>
      </div>

      {(hospital.operator || hospital.opening_hours) && (
        <div className="space-y-2">
          <h4 className="font-semibold text-card-foreground flex items-center gap-2">
            <span>ℹ️</span>
            Additional Information
          </h4>
          <div className="space-y-2">
            {hospital.operator && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">🏢</span>
                <span>
                  <strong>Operator:</strong> {hospital.operator}
                </span>
              </div>
            )}
            {hospital.opening_hours && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">🕒</span>
                <span>
                  <strong>Hours:</strong> {hospital.opening_hours}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const coords = `${hospital.lat},${hospital.lon}`
            window.open(`https://www.google.com/maps/search/?api=1&query=${coords}`, "_blank")
          }}
          className="flex-1"
        >
          🗺️ View on Maps
        </Button>
        {hospital.phone && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`tel:${hospital.phone}`, "_self")}
            className="flex-1"
          >
            📞 Call
          </Button>
        )}
      </div>
    </div>
  )

  useEffect(() => {
    fetchHospitalData(regions[0].bbox, regions[0].name)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">Z</span>
                </div>
                <span className="font-semibold text-foreground">ZeroMed</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-xl font-semibold text-card-foreground">Global Hospital Coverage</h1>
            </div>
            <Badge variant="secondary" className="hidden md:flex">
              Real-time Data
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span>🗺️</span>
                Select Region
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRegionsCollapsed(!isRegionsCollapsed)}
                className="flex items-center gap-2"
              >
                {isRegionsCollapsed ? "Expand" : "Collapse"}
                <span className={`transition-transform ${isRegionsCollapsed ? "rotate-180" : ""}`}>▼</span>
              </Button>
            </div>
            {!isRegionsCollapsed && (
              <div className="pt-2">
                <Input
                  placeholder="Search cities (e.g., New York, London, Tokyo)..."
                  value={regionSearchTerm}
                  onChange={(e) => setRegionSearchTerm(e.target.value)}
                  className="w-full max-w-md"
                />
              </div>
            )}
          </CardHeader>
          {!isRegionsCollapsed && (
            <CardContent>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {filteredRegions.map((region) => (
                  <Button
                    key={region.name}
                    variant={currentRegion === region.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      fetchHospitalData(region.bbox, region.name)
                      setRegionSearchTerm("")
                    }}
                    disabled={isLoading}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    {region.name}
                  </Button>
                ))}
              </div>
              {regionSearchTerm && filteredRegions.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No cities found matching "{regionSearchTerm}"</p>
                  <Button variant="outline" size="sm" onClick={() => setRegionSearchTerm("")} className="mt-2">
                    Clear Search
                  </Button>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📍</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Region</p>
                  <p className="font-semibold text-card-foreground">{currentRegion}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🏥</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hospitals Found</p>
                  <p className="font-semibold text-card-foreground">{hospitals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Coverage</p>
                  <p className="font-semibold text-card-foreground">
                    {coverage?.avgRadius ? `${coverage.avgRadius.toFixed(1)} km` : "Calculating..."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-4 h-4 bg-primary rounded-full" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold text-card-foreground">{isLoading ? "Loading..." : "Ready"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <div className="h-2 w-2 bg-destructive rounded-full" />
                <p className="font-medium">Error: {error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🗺️</span>
                Interactive Map View
              </CardTitle>
            </CardHeader>
            <CardContent>{renderVisualMap()}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🏥</span>
                {selectedHospital ? "Hospital Details" : `Hospitals (${filteredHospitals.length})`}
              </CardTitle>
              {!selectedHospital && (
                <div className="space-y-3 pt-2">
                  <Input
                    placeholder="Search hospitals by name, operator, city, or specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Sort by Name</SelectItem>
                        <SelectItem value="operator">Sort by Operator</SelectItem>
                        <SelectItem value="city">Sort by City</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterBy} onValueChange={setFilterBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Hospitals</SelectItem>
                        <SelectItem value="emergency">Emergency Only</SelectItem>
                        <SelectItem value="wheelchair">Wheelchair Access</SelectItem>
                        <SelectItem value="has_phone">Has Phone</SelectItem>
                        <SelectItem value="has_website">Has Website</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {selectedHospital ? (
                <div className="animate-slide-up">{renderHospitalDetails(selectedHospital)}</div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="ml-2 animate-pulse">Fetching hospital data...</span>
                    </div>
                  ) : filteredHospitals.length > 0 ? (
                    filteredHospitals.map((hospital, index) => (
                      <div
                        key={hospital.id}
                        className="group p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-all duration-300 hover:shadow-md border border-transparent hover:border-primary/20 animate-slide-up hover:scale-[1.02]"
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onClick={() => setSelectedHospital(hospital)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <span className="text-lg">🏥</span>
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="font-semibold truncate text-card-foreground group-hover:text-primary transition-colors">
                              {hospital.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {hospital.addr_city || `${hospital.lat.toFixed(4)}, ${hospital.lon.toFixed(4)}`}
                            </p>
                            {hospital.operator && <p className="text-xs text-muted-foreground">{hospital.operator}</p>}
                            <div className="flex gap-1 mt-2">
                              {hospital.emergency === "yes" && (
                                <Badge variant="destructive" className="text-xs px-1 py-0">
                                  Emergency
                                </Badge>
                              )}
                              {hospital.wheelchair === "yes" && (
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  Accessible
                                </Badge>
                              )}
                              {hospital.phone && (
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  Phone
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="text-4xl mb-2">🏥</div>
                      <p>No hospitals found matching your criteria</p>
                      {searchTerm && (
                        <Button variant="outline" size="sm" onClick={() => setSearchTerm("")} className="mt-2">
                          Clear Search
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {coverage && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📊</span>
                Coverage Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{coverage.features?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Coverage Areas</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {coverage.avgRadius ? `${coverage.avgRadius.toFixed(1)}` : "0"}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Radius (km)</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">20</div>
                  <div className="text-sm text-muted-foreground">Minutes Drive Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
