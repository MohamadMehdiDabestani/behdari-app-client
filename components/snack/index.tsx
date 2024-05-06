'use client'
import { snack } from "@/atom";
import { Alert, Snackbar } from "@mui/material";
import { useAtom } from "jotai";

export const Snack = () => {
  const [s, setSnack] = useAtom(snack);
  const handleClose = () => {
    setSnack({
      show: false,
      // for better ui
      type : s.type,
      text : s.text,
    });
  };
  return (
    <Snackbar
      open={s.show}
      onClose={handleClose}
      autoHideDuration={6000}
    >
      <Alert severity={s.type}>{s.text}</Alert>
    </Snackbar>
  );
};
