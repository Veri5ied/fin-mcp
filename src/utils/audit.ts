export async function logAudit(entry: any) {
  console.log("AUDIT LOG:", JSON.stringify(entry));
  // In production, write to DB or Redis for persistent logs
}
