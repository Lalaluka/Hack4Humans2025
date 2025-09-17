import * as React from "react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  ScanBarcode,
  ChartColumn,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type UserInfo = {
  name?: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
};

export type SidebarLayoutProps = {
  children: React.ReactNode;
  appName?: string; // "Ecomat"
  tagline?: string; // "Sustainable Choices"
  logoSrc?: string; // "/logo.png" oder "src/assets/logo.png"
  user?: UserInfo | null;
  version?: string; // "v0.0.1"
  supportEmail?: string; // "support@ecomat.app"
  supportHref?: string; // "/support"
  onLogout?: () => void;
  /** Wird aufgerufen, wenn ein neues Avatarbild ausgewählt wurde (Blob-URL). */
  onAvatarChange?: (blobUrl: string, file: File) => void;
};

export default function SidebarLayout({
  children,
  appName = "Ecomat",
  tagline = "Sustainable Choices",
  logoSrc = "src/assets/logo.png",
  user = null,
  version = "v0.0.1",
  supportEmail = "support@ecomat.app",
  supportHref = "/support",
  onLogout,
  onAvatarChange,
}: SidebarLayoutProps) {
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(
    user?.avatarUrl
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setAvatarUrl(user?.avatarUrl);
  }, [user?.avatarUrl]);

  const displayName = user?.name || user?.email || "Maximilian Ilts";
  const role = user?.role || "Admin";

  const handlePickAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setAvatarUrl(blobUrl);
    onAvatarChange?.(blobUrl, file);
  };

  const isActive = (path: string) => {
    if (typeof window === "undefined") return false;
    return window.location.pathname.startsWith(path);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar
          className="w-64 flex flex-col justify-between"
          variant="floating"
        >
          {/* HEADER: Logo + Name + Tagline */}
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2 min-w-0">
              {/* Logo */}
              <img
                src={logoSrc}
                alt={`${appName} Logo`}
                className="h-8 w-8 mt-2 rounded-sm object-contain"
                onError={(e) => {
                  // Fallback, falls Logo-Pfad nicht passt
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="min-w-0">
                <div className="font-semibold leading-tight truncate">
                  {appName}
                </div>
                <div className="text-xs text-muted-foreground leading-none truncate">
                  {tagline}
                </div>
              </div>
            </div>
            <Separator className="mt-3" />
          </SidebarHeader>

          {/* CONTENT */}
          <SidebarContent>
            {/* Hauptnavigation */}
            <SidebarGroup className="px-2">
              <SidebarGroupLabel className="text-gray-500">
                Navigation
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={cn(isActive("/scanner") && "bg-accent")}
                  >
                    <a href="/scanner" aria-label="Scanner">
                      <ScanBarcode className="mr-2 h-4 w-4" />
                      Scanner
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={cn(isActive("/comparison") && "bg-accent")}
                  >
                    <a href="/comparison" aria-label="Comparison">
                      <ChartColumn className="mr-2 h-4 w-4" />
                      Comparison
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            {/* Hilfe & Support */}
          </SidebarContent>

          {/* FOOTER: Version + Avatar/Account */}
          <SidebarFooter className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Version {version}
              </div>
            </div>

            <Separator />

            {/* Account + Dropdown */}
            <div className="pt-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="w-full flex items-center gap-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
                    aria-label="Account Menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={avatarUrl || "/src/assets/avatar.jpeg"}
                        alt="User"
                      />
                      <AvatarFallback>
                        {(displayName?.[0] || "G").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left min-w-0">
                      <div className="text-sm font-medium leading-tight truncate">
                        {displayName}
                      </div>
                      <div className="text-xs text-muted-foreground leading-none truncate">
                        {role}
                      </div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handlePickAvatar}
                  >
                    Bild ändern …
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setAvatarUrl(undefined)}
                  >
                    Bild entfernen
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={onLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Abmelden
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Hidden file input for avatar */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelected}
                className="hidden"
              />
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* MAIN */}
        <main className="flex-1 w-full overflow-x-hidden p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
