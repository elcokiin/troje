import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createApiKey, findApiKeysByUserId } from "@/db/api-keys"
import { generateApiKey, hashApiKey } from "@/lib/api-keys"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const keys = await findApiKeysByUserId(session.user.id)

    return NextResponse.json({ keys })
  } catch (error) {
    console.error("Failed to fetch API keys:", error)
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const name = typeof body?.name === "string" ? body.name.trim() : ""

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const fullKey = generateApiKey()
    const keyHash = hashApiKey(fullKey)
    const keyPreview = fullKey.slice(-4)

    const key = await createApiKey({
      user_id: session.user.id,
      name,
      key_hash: keyHash,
      key_preview: keyPreview,
    })

    return NextResponse.json(
      {
        key: {
          ...key,
          full_key: fullKey,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to create API key:", error)
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}
