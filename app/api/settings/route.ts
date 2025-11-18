import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";

// GET - Retrieve user settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sql`
      SELECT frames_per_second
      FROM user_settings
      WHERE user_email = ${session.user.email}
    `;

    if (result.length === 0) {
      // Return default settings if none exist
      return NextResponse.json({ settings: { framesPerSecond: null } });
    }

    return NextResponse.json({
      settings: {
        framesPerSecond: result[0].frames_per_second,
      },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { framesPerSecond } = body;

    // Validate input
    if (framesPerSecond !== null && framesPerSecond !== undefined) {
      const fpsNum = parseFloat(framesPerSecond);
      if (isNaN(fpsNum) || fpsNum <= 0) {
        return NextResponse.json(
          { error: "Invalid frames per second value" },
          { status: 400 }
        );
      }

      // Use INSERT ... ON CONFLICT to upsert
      const result = await sql`
        INSERT INTO user_settings (user_email, frames_per_second, updated_at)
        VALUES (${session.user.email}, ${fpsNum}, CURRENT_TIMESTAMP)
        ON CONFLICT (user_email)
        DO UPDATE SET
          frames_per_second = ${fpsNum},
          updated_at = CURRENT_TIMESTAMP
        RETURNING frames_per_second
      `;

      return NextResponse.json({
        settings: {
          framesPerSecond: result[0].frames_per_second,
        },
        message: "Settings saved successfully",
      });
    } else {
      // Allow clearing the setting
      const result = await sql`
        INSERT INTO user_settings (user_email, frames_per_second, updated_at)
        VALUES (${session.user.email}, NULL, CURRENT_TIMESTAMP)
        ON CONFLICT (user_email)
        DO UPDATE SET
          frames_per_second = NULL,
          updated_at = CURRENT_TIMESTAMP
        RETURNING frames_per_second
      `;

      return NextResponse.json({
        settings: {
          framesPerSecond: result[0].frames_per_second,
        },
        message: "Settings saved successfully",
      });
    }
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}

