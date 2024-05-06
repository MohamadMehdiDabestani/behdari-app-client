import { AlertColor } from "@mui/material";
import { atom } from "jotai";

interface Snack {
  show: boolean;
  text: string;
  type?: AlertColor;
}

export const snack = atom<Snack>({
  show: false,
  text: "",
  type: "error",
});
