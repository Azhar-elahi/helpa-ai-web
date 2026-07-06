import Airtable from "airtable"

// Initialize base lazily or safely to prevent Vercel build crashes when env vars are absent
const getAirtableBase = () => {
  const apiKey = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY;
  if (!apiKey || !process.env.AIRTABLE_BASE_ID) {
    console.warn("Airtable environment variables are missing.")
    return null
  }
  return new Airtable({ apiKey: apiKey }).base(process.env.AIRTABLE_BASE_ID)
}

export const TABLES = {
  LEADS: "Leads",
  RAW_DUMP: "Raw Dump",
  ORDERS: "Orders",
  OUTREACH: "Outreach Log",
  DEAL: "Deal"
}

export async function fetchActiveLeads() {
  try {
    const base = getAirtableBase()
    if (!base) return []
    const records = await base(TABLES.LEADS).select({
      maxRecords: 100,
      sort: [{ field: "Timestamp", direction: "desc" }]
    }).all()

    return records.map(record => ({
      id: record.getId(),
      name: record.get("Name") || "Unknown",
      company: record.get("Website") || "N/A", // Reusing Website as company placeholder based on schema
      email: record.get("Email") || "N/A",
      source: "Airtable",
      value: record.get("LeadScore") || 0, // Mocking value via LeadScore
      status: record.get("Status") || "new",
      lastContact: record.get("Last_Contacted") || "Never",
      avatar: (record.get("Name") as string)?.substring(0, 2).toUpperCase() || "LD",
      niche: record.get("Niche") || "N/A",
      country: record.get("Country") || "N/A",
    }))
  } catch (error) {
    console.error("Airtable Fetch Error:", error)
    return []
  }
}

export async function addLead(data: any) {
  try {
    const base = getAirtableBase()
    if (!base) return null
    
    const fields: any = {
      "Name": data.name,
      "Email": data.email,
      "Status": data.status || "new",
      "Timestamp": new Date().toISOString()
    }
    
    if (data.company) fields["Website"] = data.company
    if (data.phone) fields["Phone"] = data.phone
    if (data.otp) fields["OTP"] = data.otp
    
    const record = await base(TABLES.LEADS).create([{ fields }])
    return record[0].getId()
  } catch (error) {
    console.error("Airtable Create Error:", error)
    return null
  }
}

export async function updateLeadStatus(id: string, newStatus: string) {
  try {
    const base = getAirtableBase()
    if (!base) return false
    await base(TABLES.LEADS).update([
      {
        id: id,
        fields: {
          "Status": newStatus
        }
      }
    ])
    return true
  } catch (error) {
    console.error("Airtable Update Error:", error)
    return false
  }
}

export async function findLeadByEmail(email: string): Promise<any> {
  try {
    const base = getAirtableBase()
    if (!base) return null
    const records = await base(TABLES.LEADS).select({
      filterByFormula: `{Email} = '${email}'`,
      maxRecords: 1
    }).firstPage()
    
    if (records.length > 0) {
      return {
        id: records[0].getId(),
        ...records[0].fields
      }
    }
    return null
  } catch (error) {
    console.error("Airtable Find Error:", error)
    return null
  }
}

export async function updateLeadOTP(id: string, otp: string) {
  try {
    const base = getAirtableBase()
    if (!base) return false
    await base(TABLES.LEADS).update([
      {
        id: id,
        fields: {
          "OTP": otp
        }
      }
    ])
    return true
  } catch (error) {
    console.error("Airtable OTP Update Error:", error)
    return false
  }
}

export async function activateTrial(id: string) {
  try {
    const base = getAirtableBase()
    if (!base) return false
    await base(TABLES.LEADS).update([
      {
        id: id,
        fields: {
          "Status": "Trial Active",
          "Trial_Start_Date": new Date().toISOString().split('T')[0],
          "OTP": "" // Clear OTP after use
        }
      }
    ])
    return true
  } catch (error) {
    console.error("Airtable Activate Trial Error:", error)
    return false
  }
}
