import { createClient } from 'npm:@supabase/supabase-js@2'
import { JWT } from 'npm:google-auth-library@9'

const serviceAccount = {
  client_email: Deno.env.get('FIREBASE_CLIENT_EMAIL'),
  private_key: Deno.env.get('FIREBASE_PRIVATE_KEY'),
  project_id: Deno.env.get('FIREBASE_PROJECT_ID'),
}

interface Notification {
  id: string
  user_id: string
  body: string
}

interface WebhookPayload {
  type: 'INSERT'
  table: string
  record: Notification
  schema: 'public'
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json()
  const { data } = await supabase
    .from('profiles')
    .select('fcm_token')
    .eq('id', payload.record.user_id)
    .single()

  console.log("FCM Token:", data!.fcm_token);

  const fcmToken = data!.fcm_token as string

  const accessToken = await getAccessToken({
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
  })

  console.log("Service Account Email:", serviceAccount.client_email);
  console.log("Service Account Private Key:", serviceAccount.private_key);
  console.log("Service Account Project ID:", serviceAccount.project_id);

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
            title: `Notification from Supabase`,
            body: payload.record.body,
          },
        },
      }),
    }
  )

  const resData = await res.json()
  if (res.status < 200 || 299 < res.status) {
    throw resData
  }

  return new Response(JSON.stringify(resData), {
    headers: { 'Content-Type': 'application/json' },
  })
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
