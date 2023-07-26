"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import Main from "@/components/main";
import { airlinesData } from "@/utils/data/airlines";

export default function Page() {
  const path = usePathname()?.substring(1);

  const data = path ? airlinesData[path] : airlinesData.default

  useEffect(() => {
    const root_theme: HTMLElement | null = document.querySelector(':root');
    if (root_theme) {
      data.styles.forEach((styleItem) => {
        root_theme.style.setProperty(styleItem.key, styleItem.value); 
      })
    }
  })
  
  return <Main specificAirlines={path} airlineData={data} />;
}
