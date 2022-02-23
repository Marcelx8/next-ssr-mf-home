export type NavItem = {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href: string;
}

export type NavData = {
  navItems: NavItem[];
};

const loadNavData = async (): Promise<NavItem[]> => {
  const nav: NavItem[] = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "other",
      href: "/other",
    },
    {
      label: "UI",
      href: "/ui",
    },
  ];

  return nav;
}

export default loadNavData