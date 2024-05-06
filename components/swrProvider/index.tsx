"use client";
import { Children } from "@/interface";
import { SWRConfig } from "swr";
export const SWRProvider = ({ children }: Children) => {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
      }}
    >
      {children}
    </SWRConfig>
  );
};
