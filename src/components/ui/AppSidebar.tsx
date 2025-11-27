import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  TrendingDown,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  CreditCard,
  PiggyBank,
  Tags,
  Sparkles,
  Settings,
  ChevronDown,
} from "lucide-react";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: TrendingDown,
    subItems: [
      {
        title: "Expenses",
        url: "/expenses",
        icon: ArrowDownCircle,
      },
      {
        title: "Income",
        url: "/income",
        icon: ArrowUpCircle,
      },
    ],
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: Wallet,
    subItems: [
      {
        title: "Bank Accounts",
        url: "/accounts/bank",
        icon: CreditCard,
      },
      {
        title: "Savings",
        url: "/accounts/savings",
        icon: PiggyBank,
      },
    ],
  },
  {
    title: "Categories",
    url: "/categories",
    icon: Tags,
  },
  {
    title: "Goals",
    url: "/goals",
    icon: Sparkles,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>Finna</SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) =>
                item.subItems ? (
                  <Collapsible key={item.title} asChild defaultOpen={false}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton isActive={index === 0}>
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url}>
                                  <subItem.icon />
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
