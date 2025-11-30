import { createClient } from 'npm:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  // Assume UTC+7 (WIB) for now as default for Indonesian users
  // In a real app, we should store user's timezone
  const now = new Date()
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000)
  const wibTime = new Date(utcTime + (7 * 60 * 60 * 1000))
  
  const currentDay = wibTime.getDay() // 0 = Sunday
  const currentHour = wibTime.getHours().toString().padStart(2, '0')
  const currentMinute = wibTime.getMinutes().toString().padStart(2, '0')
  const currentTime = `${currentHour}:${currentMinute}`

  console.log(`[Cron] Server Time (UTC): ${now.toISOString()}`)
  console.log(`[Cron] Target Time (WIB): ${wibTime.toISOString()}`)
  console.log(`[Cron] Checking reminders for Day: ${currentDay} (0=Sun), Time: ${currentTime}`)

  try {
    // 1. Get matching reminders
    // We need to use 'contains' for array column, but supabase-js .contains() is for JSONB or Array
    // For integer array, .cs() (contains) should work
    // We use .like() to match "HH:MM" even if DB has "HH:MM:SS"
    const { data: reminders, error: fetchError } = await supabase
      .from('savings_reminders')
      .select('user_id, title, body, reminder_time, days')
      .eq('is_active', true)
      .eq('reminder_time', `${currentTime}:00`) // Match exact time HH:MM:00
      .contains('days', [currentDay]) // Use .contains() with array for array column

    console.log(`[Cron] Querying: time like '${currentTime}%', day contains ${currentDay}`)

    if (fetchError) {
      console.error('Error fetching reminders:', fetchError)
      return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 })
    }

    if (!reminders || reminders.length === 0) {
      console.log('No reminders found for this time.')
      return new Response(JSON.stringify({ message: 'No reminders to send' }), { status: 200 })
    }

    console.log(`Found ${reminders.length} reminders to send.`)

    // 2. Insert into notifications table
    // This will trigger the 'push' edge function via webhook
    const notifications = reminders.map(r => ({
      user_id: r.user_id,
      title: r.title, // Include title from reminder
      body: r.body
    }))

    // Note: The 'push' function currently hardcodes title to "LifeLedger Notification" or "Notification from Supabase".
    // If we want custom titles, we should update the 'push' function and 'notifications' table schema.
    // For now, we'll just send the body.

    const { error: insertError } = await supabase
      .from('notifications')
      .insert(notifications)

    if (insertError) {
      console.error('Error inserting notifications:', insertError)
      return new Response(JSON.stringify({ error: insertError.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ 
      message: `Successfully sent ${notifications.length} reminders`,
      sent_to: notifications.map(n => n.user_id)
    }), { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    })

  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
