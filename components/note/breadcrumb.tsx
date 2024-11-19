import { ChevronRight } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function BreadcrumbWithDropdown({ path }: { path: string }) {
  const segments = path.split("/").filter((segment) => segment !== "");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, idx) => (
          <>
            {idx !== 0 && (
              <BreadcrumbSeparator key={idx + "s"}>
                <ChevronRight />
              </BreadcrumbSeparator>
            )}
            <BreadcrumbItem key={idx}>{segment}</BreadcrumbItem>
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
