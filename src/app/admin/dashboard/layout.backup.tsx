"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  LayoutDashboard,
  Building2,
  Car,
  GraduationCap,
  Calendar,
  FileText,
  MessageCircle,
  PenLine,
  LogOut,
  Bell,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Immobilier", href: "/admin/dashboard/immobilier", icon: Building2 },
  { title: "Véhicules", href: "/admin/dashboard/vehicules", icon: Car },
  { title: "Formations", href: "/admin/dashboard/formations", icon: GraduationCap },
  { title: "Réservations", href: "/admin/dashboard/reservations", icon: Calendar },
  { title: "Devis", href: "/admin/dashboard/devis", icon: FileText },
  { title: "Messages", href: "/admin/dashboard/messages", icon: MessageCircle, badge: true },
  { title: "Blog", href: "/admin/dashboard/blog", icon: PenLine },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Changé à false par défaut
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // Nouvel état pour mobile
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [adminName] = useState("Admin");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.log("Firebase signOut error (expected if not configured)");
    }
    document.cookie = "admin_session=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const getBreadcrumb = () => {
    const current = menuItems.find((item) => item.href === pathname);
    return current?.title || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md lg:hidden">
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-40 ${sidebarOpen ? "w-64" : "w-0 lg:w-20"} overflow-hidden`}>
        <div className="p-4 border-b border-gray-800">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="font-bold">STS</span>
            </div>
            {sidebarOpen && (
              <div>
                <div className="font-bold text-lg">Admin</div>
                <div className="text-xs text-gray-400">Espace Admin</div>
              </div>
            )}
          </Link>
        </div>

        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive ? "bg-green-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && unreadMessages > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadMessages}</span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      <main className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/admin/dashboard" className="hover:text-green-600">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{getBreadcrumb()}</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-500" />
              {unreadMessages > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{adminName.charAt(0)}</span>
              </div>
              <div className="hidden md:block">
                <div className="font-medium text-gray-900">{adminName}</div>
                <div className="text-xs text-gray-500">Administrateur</div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}