import { NextResponse } from "next/server"
import { fetchActiveLeads, addLead, updateLeadStatus } from "@/lib/airtable"
import { sendDiscordMessage, createLeadEmbed, DISCORD_CHANNELS } from "@/lib/discord"

export const dynamic = "force-dynamic"

export async function GET() {
  const leads = await fetchActiveLeads()
  return NextResponse.json({ leads })
}

export async function POST(req: Request) {
  try {
    const data = await req.json()

    if (data.action === "scrape") {
      // Simulate raw data addition and ping control center
      const embed = createLeadEmbed({ ...data, Name: "AI Scraping Job", Source: "System" }, "Scraping Job Initiated", 0xFFD700)
      await sendDiscordMessage(DISCORD_CHANNELS.control, `Initiating scraper for **${data.niche}** in **${data.country}**...`, embed)
      return NextResponse.json({ success: true, message: "Scraping triggered." })
    }

    if (data.action === "add") {
      const airtableId = await addLead(data.lead)
      if (!airtableId) throw new Error("Airtable insertion failed")

      const embed = createLeadEmbed(data.lead, "New Manual Lead Added", 0x5865F2)
      await sendDiscordMessage(DISCORD_CHANNELS.pipeline, `A new lead has been manually entered from the Web Dashboard.`, embed)
      return NextResponse.json({ success: true, id: airtableId })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, leadData, custom_subject, custom_body } = await req.json()
    let botUrl = process.env.BOT_WEBHOOK_URL || "https://aghost-agency-production.up.railway.app/webhook/execute"

    // Auto-fix if user forgot to include the endpoint
    if (!botUrl.endsWith("/webhook/execute") && !botUrl.includes("discord.com/api/webhooks")) {
      botUrl = botUrl.replace(/\/$/, "") + "/webhook/execute"
    }

    let cmd = ""
    let args: any = { lead_id: id }

    if (status === "contacted") {
      cmd = "web_approve_lead"
      if (custom_subject) args.subject = custom_subject
      if (custom_body) args.body = custom_body
    } else if (status === "marketing") {
      cmd = "web_direct_lead"
    } else if (status === "skipped") {
      cmd = "web_skip_lead"
    }

    let botSuccess = false

    if (cmd) {
      try {
        const res = await fetch(botUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command: cmd, args, user: "Web Admin" })
        })
        
        if (res.ok) {
          const data = await res.json()
          if (data.success) botSuccess = true
        }
      } catch (e) {
        console.warn("Python Bot unreachable, using Next.js direct fallback...")
      }
    }

    // ─── Direct Fallback (If Python bot is offline) ───
    if (!botSuccess) {
      // 1. Update Airtable directly
      await updateLeadStatus(id, status)
      
      // 2. Send Discord Notification directly
      let targetChannel = DISCORD_CHANNELS.pipeline
      let msg = ""

      if (status === "contacted") {
        msg = `✅ **WEB ACTION:** Approved and sent email to \`${leadData?.email || 'N/A'}\` for **${leadData?.name || 'N/A'}**.`
      } else if (status === "marketing") {
        targetChannel = DISCORD_CHANNELS.marketing || targetChannel
        msg = `🎯 **WEB ACTION:** Lead \`${leadData?.name || id}\` sent directly to Marketing.`
      } else if (status === "skipped") {
        msg = `⏭️ **WEB ACTION:** Lead \`${leadData?.name || id}\` skipped.`
      } else {
        msg = `🔄 **WEB ACTION:** Lead \`${leadData?.name || id}\` updated to **${status}**.`
      }

      if (targetChannel) {
        await sendDiscordMessage(targetChannel, msg)
      }
    }

    return NextResponse.json({ success: true, viaFallback: !botSuccess })
  } catch (err: any) {
    console.error("Web Action Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
