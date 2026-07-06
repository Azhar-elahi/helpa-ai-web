import { NextResponse } from "next/server"
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("id")
    if (!orderId) return NextResponse.json({ error: "Order ID required" }, { status: 400 })
    return NextResponse.json({ success: true, data: { orderId, status: "In Progress" } })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}