import { LayoutProps } from "@/types/layout";
import React from "react";

export const Empty = (props: LayoutProps) => {
  return <>{props.children}</>;
};
