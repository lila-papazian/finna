import { navigationItems } from "@/lib/navigation";

export function getBreadcrumbs(pathname: string) {
  if (pathname === "/") {
    return [{ title: "Dashboard", url: "/" }];
  }

  const breadcrumbs: Array<{ title: string; url: string }> = [];

  for (const item of navigationItems) {
    if (item.url === pathname) {
      breadcrumbs.push({ title: item.title, url: item.url });
      return breadcrumbs;
    }

    if (item.subItems) {
      const subItem = item.subItems.find((sub) => sub.url === pathname);
      if (subItem) {
        breadcrumbs.push({ title: item.title, url: item.url });
        breadcrumbs.push({ title: subItem.title, url: subItem.url });
        return breadcrumbs;
      }
    }
  }

  return [{ title: "Dashboard", url: "/" }];
}
