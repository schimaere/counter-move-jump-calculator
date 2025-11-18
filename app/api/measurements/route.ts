import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

// GET - Retrieve measurements for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const measurements = await sql`
      SELECT 
        id,
        name,
        leg_length,
        height_90_degree,
        created_at
      FROM measurements
      WHERE user_email = ${session.user.email}
      ORDER BY created_at DESC
    `

    return NextResponse.json({ measurements })
  } catch (error) {
    console.error("Error fetching measurements:", error)
    return NextResponse.json(
      { error: "Failed to fetch measurements" },
      { status: 500 }
    )
  }
}

// POST - Create a new measurement
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, legLength, height90Degree } = body

    // Validate input
    if (!name || legLength === undefined || height90Degree === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, legLength, height90Degree" },
        { status: 400 }
      )
    }

    const legLengthNum = parseFloat(legLength)
    const height90DegreeNum = parseFloat(height90Degree)

    if (isNaN(legLengthNum) || isNaN(height90DegreeNum) || legLengthNum < 0 || height90DegreeNum < 0) {
      return NextResponse.json(
        { error: "Invalid numeric values" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO measurements (name, leg_length, height_90_degree, user_email)
      VALUES (${name}, ${legLengthNum}, ${height90DegreeNum}, ${session.user.email})
      RETURNING id, name, leg_length, height_90_degree, created_at
    `

    return NextResponse.json(
      { measurement: result[0], message: "Measurement saved successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error saving measurement:", error)
    return NextResponse.json(
      { error: "Failed to save measurement" },
      { status: 500 }
    )
  }
}

