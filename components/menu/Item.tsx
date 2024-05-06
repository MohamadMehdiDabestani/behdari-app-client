import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  title: string;
  icon: ReactNode;
  href: string;
}
export const Item = ({ title, href, icon }: Props) => {
  return (
    <ListItem disablePadding>
      <ListItemButton
        sx={{
          "& a": {
            display: "flex",
            textDecoration: "none",
            color: (t) => t.palette.text.primary,
          },
        }}
      >
        <Link href={href}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText
            sx={{
              "& span": {
                fontWeight: "bold",
              },
            }}
            primary={title}
          />
        </Link>
      </ListItemButton>
    </ListItem>
  );
};
