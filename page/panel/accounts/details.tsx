"use client";
import { useEffect, useState } from "react";
import { DialogForm } from "@/components";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useApi from "@/hooks/useApi";
import { ApiResult, DialogProps } from "@/interface";
import {
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

export const Details = ({open , setOpen} : DialogProps) => {
  
  const { push, replace } = useRouter();
  const pathname = usePathname();
  const rootParams = useSearchParams();
  const axios = useApi();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!open) {
      const params = new URLSearchParams(rootParams.toString());
      params.delete("id");
      replace(`${pathname}?${params.toString()}`);
    }
  }, [open]);
  useEffect(() => {
    (async () => {
      if (!rootParams.get("id")) return;
      const reqParams = new URLSearchParams();
      reqParams.set("userId", rootParams.get("id") as string);
      const req = await axios.get<ApiResult>(
        `/PatientPrescription/GetUserPrescriptions?${reqParams.toString()}`
      );
      setHistory(req.data.data as any[]);
    })();
  }, [rootParams]);

  return (
    <DialogForm open={open} onClick={() => setOpen(false)} fullWidth maxWidth='lg'>
      {history.length == 0 ? (
        <Alert severity='info'>اطلاعاتی یافت نشد</Alert>
      ) : (
        <List>
          {history.map((e) =>
            e.map((e: any, idx: number) => (
              <ListItem disablePadding key={idx}>
                <ListItemButton>
                  <ListItemText
                    primary={`${
                      e.packId
                        ? `نام پک : ${e.packName}`
                        : `نام دارو : ${e.medicineName}`
                    } - تاریخ : ${e.prescriptionDate} ${
                      e.medicineId ? `- تعداد : ${e.count}` : ``
                    }`}
                  />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      )}
    </DialogForm>
  );
};
