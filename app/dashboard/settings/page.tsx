import { LogoutButton } from "@/components/logout-button";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="p-4 border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Account</h2>
        <LogoutButton />
      </div>
    </div>
  );
}
