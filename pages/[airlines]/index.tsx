"use client";

import Main from "@/components/main";
import { usePathname } from "next/navigation";

export default function Page() {
  const path = usePathname()?.substring(1);

  return <Main specificAirlines={path} />;
}
