export const DISCORD_CHANNELS = {
  pipeline: process.env.DISCORD_CH_PIPELINE!,
  control: process.env.DISCORD_CH_CONTROL!,
  marketing: process.env.DISCORD_CH_MARKETING!,
  followup: process.env.DISCORD_CH_FOLLOWUP!,
  dp: process.env.DISCORD_CH_DP!,
}

export async function sendDiscordMessage(channelId: string, content: string, embed?: any) {
  const token = process.env.DISCORD_BOT_TOKEN
  if (!token) {
    console.error("Missing DISCORD_BOT_TOKEN")
    return false
  }

  try {
    const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bot ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content,
        embeds: embed ? [embed] : undefined
      })
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`Discord API Error (${res.status}):`, errorText)
      return false
    }

    return true
  } catch (error) {
    console.error("Failed to send Discord message:", error)
    return false
  }
}

export function createLeadEmbed(lead: any, action: string, color: number = 0x5865F2) {
  return {
    title: `🚨 ${action}`,
    color: color,
    fields: [
      { name: "Name", value: lead.Name || "N/A", inline: true },
      { name: "Company/Niche", value: `${lead.Website || 'N/A'} (${lead.Niche || 'N/A'})`, inline: true },
      { name: "Email", value: lead.Email || "N/A", inline: true },
      { name: "Source", value: lead.Source || "Manual Entry", inline: true },
      { name: "Location", value: lead.Country || "Unknown", inline: true }
    ],
    footer: { text: "Helpa AI Admin System" },
    timestamp: new Date().toISOString()
  }
}
