import { createClient } from 'npm:@supabase/supabase-js@2'
import { JWT } from 'npm:google-auth-library@9'

interface Notification {
  id: string
  user_id: string
  title: string
  body: string
}

interface WebhookPayload {
  type: 'INSERT'
  table: string
  record: Notification
  schema: 'public'
}

const getPrivateKey = () => {
  const key = Deno.env.get('FIREBASE_PRIVATE_KEY') || '';
  // The key from env var often has literal "\n" characters (backslash + n)
  // We simply need to replace them with actual newlines.
  // We also remove any surrounding quotes just in case.
  return key.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
};

const serviceAccount = {
  project_id: Deno.env.get('FIREBASE_PROJECT_ID'),
  client_email: Deno.env.get('FIREBASE_CLIENT_EMAIL'),
  private_key: getPrivateKey(),
}


const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json()
  console.log(`[Push Function] Received webhook payload for user: ${payload.record.user_id}`);
  
  // Get the user's FCM token
  const { data, error } = await supabase
    .from('profiles')
    .select('fcm_token')
    .eq('id', payload.record.user_id)
    .single()

  if (error) {
    console.error(`[Push Function] Error fetching profile: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const fcmToken = data?.fcm_token as string

  if (!fcmToken) {
    console.warn(`[Push Function] No FCM token found for user ${payload.record.user_id}`);
    return new Response(JSON.stringify({ message: 'No FCM token found for user' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  console.log(`[Push Function] Found FCM token: ${fcmToken.substring(0, 10)}...`);

  try {
    console.log(`[Push Function] Private Key Check:`);
    console.log(`- Length: ${serviceAccount.private_key?.length}`);
    console.log(`- Starts with: ${serviceAccount.private_key?.substring(0, 30)}...`);
    console.log(`- Ends with: ...${serviceAccount.private_key?.substring(serviceAccount.private_key?.length - 30)}`);
    console.log(`- Contains actual newlines: ${serviceAccount.private_key}`);
    console.log(`- Contains escaped newlines (\\n): ${serviceAccount.private_key}`);

    const accessToken = await getAccessToken({
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    })

    console.log(`[Push Function] Sending notification to FCM...`);

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
            token: fcmToken,
            notification: {
              title: payload.record.title || 'LifeLedger Notification',
              body: payload.record.body,
            },
          },
        }),
      }
    )

    const resData = await res.json()
    
    if (res.status < 200 || 299 < res.status) {
      console.error('[Push Function] FCM Error Response:', JSON.stringify(resData))
      throw resData
    }

    console.log(`[Push Function] Notification sent successfully! Message ID: ${resData.name}`);

    return new Response(JSON.stringify(resData), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[Push Function] Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: err }), { status: 500 });
  }
})

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
