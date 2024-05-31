import { AlertColor } from "@mui/material";
import { atom } from "jotai";

interface Token {
  refreshToken: string;
  token: string;
  
}

export const token = atom<Token>({
  token: "",
  refreshToken : ""
});
