import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full max-w-4xl p-5">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-4">Welcome, {user.email}</p>
      </div>
    </div>
  );
}
