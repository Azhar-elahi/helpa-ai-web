import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { command, args, user } = data

    // Forward the command to the Python Bot Webhook
    let botUrl = process.env.BOT_WEBHOOK_URL || "https://aghost-agency-production.up.railway.app/webhook/execute"
    
    // Auto-fix if user forgot to include the endpoint
    if (!botUrl.endsWith("/webhook/execute") && !botUrl.includes("discord.com/api/webhooks")) {
      botUrl = botUrl.replace(/\/$/, "") + "/webhook/execute"
    }

    if (botUrl.includes("discord.com/api/webhooks")) {
      throw new Error("Configuration Error: BOT_WEBHOOK_URL is set to a Discord Webhook. It must be set to your Python Bot URL (e.g., https://aghost-agency-production.up.railway.app/webhook/execute).")
    }

    const botResponse = await fetch(botUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command, args, user })
    })

    if (!botResponse.ok) {
      throw new Error(`Bot returned status ${botResponse.status}`)
    }

    const botData = await botResponse.json()

    if (!botData.success) {
      throw new Error(botData.error || "Unknown bot error")
    }

    return NextResponse.json({ success: true, message: `Command /${command} successfully executed by Swarm Engine.` })
  } catch (err: any) {
    const attemptedUrl = process.env.BOT_WEBHOOK_URL || "http://127.0.0.1:8080/webhook/execute"
    console.error(`Command Forwarding Error to ${attemptedUrl}:`, err)
    return NextResponse.json({ error: `${err.message} (Attempted: ${attemptedUrl})` }, { status: 500 })
  }
}
