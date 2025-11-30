import { createClient } from 'npm:@supabase/supabase-js@2'
import { JWT } from 'npm:google-auth-library@9'
import serviceAccount from '../service-account.json' with { type: 'json' }

// const serviceAccount = {
//   client_email: Deno.env.get('FIREBASE_CLIENT_EMAIL'),
//   private_key: Deno.env.get('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
//   project_id: Deno.env.get('FIREBASE_PROJECT_ID'),
// }

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  try {
    // 1. Get current time in WIB (UTC+7)
    // Edge functions run in UTC.
    const now = new Date();
    // Add 7 hours to get WIB time
    const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    
    const currentHour = wibTime.getUTCHours().toString().padStart(2, '0');
    const currentMinute = wibTime.getUTCMinutes().toString().padStart(2, '0');
    const currentTimeString = `${currentHour}:${currentMinute}:00`;
    const currentDay = wibTime.getUTCDay(); // 0 = Sunday

    console.log(`Checking reminders for WIB time: ${currentTimeString}, Day: ${currentDay}`);

    // 2. Find matching reminders
    // Note: We cast reminder_time to text to compare HH:MM:SS
    const { data: reminders, error: reminderError } = await supabase
      .from('savings_reminders')
      .select('user_id, title, body')
      .eq('is_active', true)
      .eq('reminder_time', currentTimeString)
      .contains('days', [currentDay]);

    if (reminderError) throw reminderError;

    if (!reminders || reminders.length === 0) {
      return new Response(JSON.stringify({ message: 'No reminders scheduled for this time' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Get FCM tokens for these users
    const userIds = [...new Set(reminders.map(r => r.user_id))];
    const { data: devices, error: deviceError } = await supabase
      .from('user_devices')
      .select('user_id, fcm_token')
      .in('user_id', userIds);

    if (deviceError) throw deviceError;

    if (!devices || devices.length === 0) {
      return new Response(JSON.stringify({ message: 'Reminders found but no devices registered' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. Send Notifications
    const accessToken = await getAccessToken({
      clientEmail: serviceAccount.client_email!,
      privateKey: serviceAccount.private_key!,
    });

    const results = [];

    for (const reminder of reminders) {
      const userDevices = devices.filter(d => d.user_id === reminder.user_id);
      
      for (const device of userDevices) {
        try {
          const res = await fetch(
            `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                message: {
                  token: device.fcm_token,
                  notification: {
                    title: reminder.title,
                    body: reminder.body,
                  },
                  webpush: {
                    fcm_options: {
                      link: '/dashboard/finance'
                    }
                  }
                },
              }),
            }
          );
          results.push(await res.json());
        } catch (e) {
          console.error(`Failed to send to ${device.fcm_token}`, e);
          results.push({ error: e.message });
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      sent_count: results.length,
      results 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

const getAccessToken = ({
  clientEmail,
  privateKey,
}: {
  clientEmail: string
  privateKey: string
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const jwtClient = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    })
    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens!.access_token!)
    })
  })
}
