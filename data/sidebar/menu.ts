export interface MenuItem {
  title: string;
  icon?: string;
  icon2?: string;
  route: string;
  child?: any;
  roles: any;
  restrictedRoles?: string[];
  type: string;
}

export const menuItems: MenuItem[] = [
  {
    title: "Menu",
    icon: "",
    icon2: "",
    route: "",
    child: [],
    roles: [],
    type: "menuName",
  },
  {
    title: "Dashboard",
    icon: "dashboard",
    icon2: "dashboard",
    route: "/admin/dashboard",
    child: [],
    roles: [],
    type: "parent",
  },
  {
    title: "Profil",
    icon: "profil",
    icon2: "profil",
    route: "/admin/profil",
    child: [],
    roles: [],
    type: "parent",
  },
  {
    title: "Berita",
    icon: "berita",
    icon2: "berita",
    route: "/admin/berita",
    child: [],
    roles: [],
    type: "parent",
  },
  {
    title: "Program",
    icon: "program",
    icon2: "program",
    route: "/admin/program",
    child: [],
    roles: [],
    type: "parent",
  },
  {
    title: "Litbang",
    icon: "litbang",
    icon2: "litbang",
    route: "/admin/litbang",
    child: [],
    roles: [],
    type: "parent",
  },
  {
    title: "Cari Tenar",
    icon: "cari-tenar",
    icon2: "cari-tenar",
    route: "/admin/cari-tenar",
    child: [],
    roles: [],
    type: "parent",
  },
  {
    title: "Manajemen User",
    icon: "manajemen-user",
    icon2: "manajemen-user",
    route: "/admin/user",
    child: [],
    roles: [],
    restrictedRoles: ["Journalis"],
    type: "parent",
  },
];
