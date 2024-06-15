"use client";

import { dialogForm } from "@/atom";
import { Children } from "@/interface";
import { Dialog, DialogContent, DialogProps, DialogTitle } from "@mui/material";
import { useAtom } from "jotai";

interface Props extends DialogProps {}
export const DialogForm = (dialog: Props) => {
  const [open, setOpen] = useAtom(dialogForm);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog {...dialog} >
      {dialog.children}
    </Dialog>
  );
};
