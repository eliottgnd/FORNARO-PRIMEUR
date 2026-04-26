import { NextResponse } from 'next/server'
import { City } from 'country-state-city'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  try {
    // Fetch all cities for France (Country Code 'FR')
    const allCities = City.getCitiesOfCountry('FR') || []

    // Filter cities based on the query (case-insensitive)
    const filteredCities = allCities
      .filter(city => city.name.toLowerCase().includes(query.toLowerCase()))
      .map(city => city.name)
      .slice(0, 6) // Limit results for performance and UI clarity

    // Remove duplicates
    const uniqueCities = Array.from(new Set(filteredCities))

    return NextResponse.json(uniqueCities)
  } catch (error) {
    console.error('City autocomplete error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
