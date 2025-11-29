"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getBreadcrumbs } from "./getBreadcrumbs";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div className="flex items-center gap-2 text-sm">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.url} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium">{crumb.title}</span>
          ) : (
            <Link
              href={crumb.url}
              className="text-muted-foreground hover:text-foreground"
            >
              {crumb.title}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

