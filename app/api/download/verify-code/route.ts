import { NextResponse } from "next/server"
import { findLeadByEmail, activateTrial } from "@/lib/airtable"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, otp } = body

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 })
    }

    const lead = await findLeadByEmail(email)
    
    if (!lead || lead.OTP !== otp) {
      return NextResponse.json({ error: "Invalid verification code." }, { status: 400 })
    }

    // Activate trial
    await activateTrial(lead.id)

    return NextResponse.json({ success: true, message: "Code verified. Download starting." })
  } catch (error: any) {
    console.error("Error verifying code:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
