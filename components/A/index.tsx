import Link, { LinkProps } from "next/link";
import { Typography, TypographyProps } from "@mui/material";
import { Children } from "@/interface";

interface Props extends Children {
  a: LinkProps;
  p: TypographyProps;
}

export const A = (props: Props) => {
 
  return (
    <Link {...props.a}>
      <Typography {...props.p}>{props.children}</Typography>
    </Link>
  );
};
