import React from "react";
import type { ReactNode } from "react";

export default function Spacer({ children }: { children: ReactNode }) {
  return <div className="m-2">{children}</div>;
}
