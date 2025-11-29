import {
  Calendar,
  CreditCard,
  Clock,
  Trophy,
  AlertTriangle,
  PiggyBank,
  Users,
  Search,
  LayoutGrid,
  Timer,
  FileText,
  CheckSquare,
} from "lucide-react";

const features = [
  {
    category: "Hybrid (Money x Time)",
    items: [
      {
        icon: Calendar,
        title: "Cost of Event",
        description: "Link expenses directly to your calendar events. See the real cost of your activities.",
      },
      {
        icon: CreditCard,
        title: "Subscription Manager",
        description: "Visualize recurring bills on your calendar. Never miss a payment again.",
      },
      {
        icon: Clock,
        title: "Time is Money",
        description: "Calculate your hourly rate and see the cost of procrastination.",
      },
      {
        icon: Trophy,
        title: "Productivity Rewards",
        description: "Unlock budget for entertainment when you complete high-priority tasks.",
      },
    ],
  },
  {
    category: "Finance",
    items: [
      {
        icon: AlertTriangle,
        title: "Low Balance Alert",
        description: "Get warned when your wallet is running low. Switch to 'Economy Mode' automatically.",
      },
      {
        icon: PiggyBank,
        title: "Smart Wishlist",
        description: "Track savings goals with daily calculation to reach your target.",
      },
      {
        icon: Users,
        title: "Split Bill",
        description: "Manage shared expenses and debts with friends easily.",
      },
      {
        icon: Search,
        title: "Leak Detector",
        description: "Identify small, frequent expenses that are draining your wallet.",
      },
    ],
  },
  {
    category: "Productivity",
    items: [
      {
        icon: LayoutGrid,
        title: "Eisenhower Matrix",
        description: "Auto-sort tasks by urgency and importance. Focus on what matters.",
      },
      {
        icon: Timer,
        title: "Focus Timer",
        description: "Integrated Pomodoro timer to boost your concentration.",
      },
      {
        icon: FileText,
        title: "Brain Dump",
        description: "Capture ideas quickly and convert them to tasks later.",
      },
      {
        icon: CheckSquare,
        title: "Habit Tracker",
        description: "Build good habits with daily checklists and streak tracking.",
      },
    ],
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Powerful Features
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Everything you need to manage your life, finances, and time in one place.
          </p>
        </div>
        
        <div className="space-y-16">
          {features.map((section, index) => (
            <div key={index} className="space-y-8">
              <h3 className="text-2xl font-bold text-center md:text-left border-b pb-2">
                {section.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex flex-col items-center md:items-start space-y-4 p-6 bg-background rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-bold">{item.title}</h4>
                    <p className="text-muted-foreground text-center md:text-left">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
