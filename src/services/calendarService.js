// Google Calendar integration scaffold
// This provides functions you can wire to OAuth tokens later

export async function addEvent({ title, description, start, end, location }) {
  // TODO: Implement Google Calendar API call using user OAuth token
  // For now, just simulate success
  await new Promise(r => setTimeout(r, 300));
  return { success: true, eventId: `evt_${Date.now()}` };
}

export async function listEvents({ timeMin, timeMax }) {
  await new Promise(r => setTimeout(r, 200));
  return { success: true, events: [] };
}


