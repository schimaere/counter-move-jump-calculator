import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";

// PUT - Update a measurement
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid measurement ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, legLength, height90Degree, weightKg } = body;

    // Validate input
    if (!name || legLength === undefined || height90Degree === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, legLength, height90Degree" },
        { status: 400 }
      );
    }

    const legLengthNum = parseFloat(legLength);
    const height90DegreeNum = parseFloat(height90Degree);
    const weightKgNum = weightKg !== undefined && weightKg !== null && weightKg !== "" 
      ? parseFloat(weightKg) 
      : null;

    if (
      isNaN(legLengthNum) ||
      isNaN(height90DegreeNum) ||
      legLengthNum < 0 ||
      height90DegreeNum < 0
    ) {
      return NextResponse.json(
        { error: "Invalid numeric values" },
        { status: 400 }
      );
    }

    if (weightKgNum !== null && (isNaN(weightKgNum) || weightKgNum < 0)) {
      return NextResponse.json(
        { error: "Invalid weight value" },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE measurements
      SET name = ${name}, leg_length = ${legLengthNum}, height_90_degree = ${height90DegreeNum}, weight_kg = ${weightKgNum}
      WHERE id = ${id}
      RETURNING id, name, leg_length, height_90_degree, weight_kg, created_at
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Measurement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      measurement: result[0],
      message: "Measurement updated successfully",
    });
  } catch (error) {
    console.error("Error updating measurement:", error);
    return NextResponse.json(
      { error: "Failed to update measurement" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a measurement
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid measurement ID" }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM measurements
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Measurement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Measurement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting measurement:", error);
    return NextResponse.json(
      { error: "Failed to delete measurement" },
      { status: 500 }
    );
  }
}

