import * as React from "react";
import {
  KeyRound,
  Settings,
} from "lucide-react";

import { NavPasswords } from "@/components/nav-passwords";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }) {
  const [userData, setUserData] = React.useState({
    name: "Username",
    email: "Email",
    avatar: "",
  });

  React.useEffect(() => {
    // Get user data from localStorage
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    
    if (username && email) {
      setUserData({
        name: username,
        email: email,
        avatar: "",
      });
    }
  }, []);

  const data = {
    user: userData,
    passwords: [
      {
        name: "All Passwords",
        url: "/dashboard",
        icon: KeyRound,
      },
    ],
    account: [
      {
        name: "Settings",
        url: `/dashboard?tab=Settings`,
        icon: Settings,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavPasswords passwords={data.passwords} account={data.account} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
