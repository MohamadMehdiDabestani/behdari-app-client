import Link, { LinkProps } from "next/link";
import { Typography, TypographyProps } from "@mui/material";

type Props = LinkProps & TypographyProps;

export const A = (props: Props) => {
  const link = props as LinkProps;
  const tp = props as TypographyProps;
  return (
    <Link {...link}>
      <Typography {...tp}>{props.children}</Typography>
    </Link>
  );
};
