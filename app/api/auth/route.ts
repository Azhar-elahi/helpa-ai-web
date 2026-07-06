import { NextResponse } from "next/server"
export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (body.password === "admin123") return NextResponse.json({ success: true, token: "demo-token" })
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}