import React from "react";
import Image, { ImageProps } from "next/image";

type LogoProps = {} & Omit<ImageProps, "src" | "alt">;

export const Logo = ({ ...rest }: LogoProps) => {
  return <Image src="/logo/small.png" alt="Logo" {...rest} />;
};

export default Logo;
