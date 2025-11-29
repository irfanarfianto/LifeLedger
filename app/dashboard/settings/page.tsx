import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { CategorySettings } from "@/components/settings/category-settings";
import { SubscriptionSettings } from "@/components/settings/subscription-settings";
import { LogoutButton } from "@/components/logout-button";
import { getUserProfile } from "@/lib/actions/profile";
import { getCategories, getSubscriptions } from "@/lib/actions/finance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

async function SettingsContent() {
  const [profile, categories, subscriptions] = await Promise.all([
    getUserProfile(),
    getCategories(),
    getSubscriptions(),
  ]);

  return (
    <Tabs defaultValue="profile" className="space-y-4">
      <div className="w-full overflow-x-auto pb-2">
        <TabsList className="w-full justify-start inline-flex min-w-max">
          <TabsTrigger value="profile">Profil & Persona</TabsTrigger>
          <TabsTrigger value="categories">Kategori</TabsTrigger>
          <TabsTrigger value="subscriptions">Langganan</TabsTrigger>
          <TabsTrigger value="account">Akun</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="profile">
        <ProfileSettings profile={profile} />
      </TabsContent>
      
      <TabsContent value="categories">
        <CategorySettings categories={categories} />
      </TabsContent>
      
      <TabsContent value="subscriptions">
        <SubscriptionSettings subscriptions={subscriptions} />
      </TabsContent>

      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Akun</CardTitle>
            <CardDescription>
              Kelola akun dan sesi login Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Email: <span className="font-medium text-foreground">{profile?.email || "Tidak tersedia"}</span>
              </p>
            </div>
            <div className="pt-4 border-t">
              <LogoutButton />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

import { SettingsSkeleton } from "@/components/settings/settings-skeleton";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4 pb-20">
      <h1 className="text-2xl font-bold">Pengaturan</h1>
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}
