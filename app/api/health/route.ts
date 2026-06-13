import { NextResponse } from "next/server"
import { getDb } from "@/db/client"
import { users } from "@/db/schema"

export async function GET() {
  const timestamp = new Date().toISOString()

  try {
    const db = getDb()
    await db.select({ id: users.id }).from(users).limit(1)

    return NextResponse.json({
      status: "ok",
      timestamp,
      db: "connected",
    })
  } catch {
    return NextResponse.json(
      {
        status: "degraded",
        timestamp,
        db: "disconnected",
      },
      { status: 503 }
    )
  }
}
