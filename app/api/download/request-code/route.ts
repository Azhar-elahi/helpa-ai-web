import { NextResponse } from "next/server"
import { addLead, findLeadByEmail, updateLeadOTP } from "@/lib/airtable"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone } = body

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, Email, and Phone are required." }, { status: 400 })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // 1. Save or Update in Airtable
    const existingLead = await findLeadByEmail(email)
    
    if (existingLead) {
      await updateLeadOTP(existingLead.id, otp)
    } else {
      await addLead({
        name,
        email,
        phone,
        otp,
        status: "Pending Verification"
      })
    }

    // 2. Send Email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: `"NovaMac CRM" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Download Verification Code",
      text: `Hello ${name},\n\nYour verification code to download NovaMac CRM is: ${otp}\n\nThis code will grant you a 4-day trial.\n\nThanks,\nNovaMac Team`,
      html: `<p>Hello ${name},</p><p>Your verification code to download NovaMac CRM is: <strong style="font-size: 24px;">${otp}</strong></p><p>This code will grant you a 4-day trial.</p><p>Thanks,<br>NovaMac Team</p>`,
    }

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions)
    } else {
        console.warn("SMTP credentials missing, skipped sending email. OTP is:", otp)
        // For testing purposes when env is missing
    }

    return NextResponse.json({ success: true, message: "Code sent to email." })
  } catch (error: any) {
    console.error("Error requesting code:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
