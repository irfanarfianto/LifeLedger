import { GraduationCap, Briefcase } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PersonaSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Tailored for You
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Whether you are a student or a professional, LifeLedger adapts to your needs.
          </p>
        </div>

        <div className="flex justify-center">
          <Tabs defaultValue="student" className="w-full max-w-3xl">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
            </TabsList>
            <TabsContent value="student">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>For Students</CardTitle>
                      <CardDescription>
                        Manage your semester budget and assignments.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-bold">Semester Budgeting</h4>
                      <p className="text-sm text-muted-foreground">
                        Input your total allowance per semester, and we'll help you
                        allocate a monthly limit so you never run out of cash.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold">Assignment Tracker</h4>
                      <p className="text-sm text-muted-foreground">
                        Track quizzes, papers, and exams. We sort them by grade
                        weight so you know what to focus on first.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="professional">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>For Professionals</CardTitle>
                      <CardDescription>
                        Handle reimbursements and verify your salary.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-bold">Reimbursement Tracking</h4>
                      <p className="text-sm text-muted-foreground">
                        Flag expenses as "Reimbursable". They won't affect your
                        personal spending reports but will track what's owed to you.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold">Salary Checker</h4>
                      <p className="text-sm text-muted-foreground">
                        Input your base salary, allowances, and deductions. We'll
                        validate if the net amount hitting your account is correct.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
