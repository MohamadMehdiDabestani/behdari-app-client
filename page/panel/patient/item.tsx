"use client";
import { Box, Button, Paper, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import { patientQueueStatus } from "@/common";
import useApi from "@/hooks/useApi";
import { dialogForm, selectedUser, snack } from "@/atom";
import { useAtom } from "jotai";
import invalidCache from "@/utils/invalidCache";
import { usePathname, useRouter } from "next/navigation";
import { DialogProps } from "@/interface";
import { Dispatch, SetStateAction } from "react";
interface Props extends DialogProps {
  status: number;
  reason: string;
  visitDate: string;
  id: number;
  is_Emergency: boolean;
  isDoctor: boolean;
  guestUser?: {
    id: number;
    fullName: string;
    nationalCode: string;
  };
  user?: {
    id: number;
    fullName: string;
    personalCode: string;
  };
  setOpenDelete: Dispatch<SetStateAction<boolean>>;
}
export const Item = ({
  visitDate,
  is_Emergency,
  reason,
  guestUser,
  user,
  id,
  status,
  isDoctor,
  setOpen,
  setOpenDelete,
}: Props) => {
  const [_selectedUser, setSelectedUser] = useAtom(selectedUser);
  const { replace } = useRouter();
  const pathname = usePathname();
  const onDelete = async () => {
    const params = new URLSearchParams();
    params.set("id", String(id));
    params.delete("extra");
    replace(`${pathname}?${params.toString()}`);
    setOpenDelete(true);
  };
  const showDialog = () => {
    const params = new URLSearchParams();
    params.set("id", String(id));
    params.delete("extra");
    replace(`${pathname}?${params.toString()}`);
    setSelectedUser({
      id: guestUser ? guestUser.id : (user?.id as number),
      type: guestUser ? "guest" : "locale",
      fullName: guestUser ? guestUser.fullName : (user?.fullName as string),
      isEmergency: is_Emergency,
      personalCode: user?.personalCode,
    });
    setOpen(true);
  };
  return (
    <Paper
      sx={{
        p: "1rem",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Typography variant='subtitle1'>
          نام : {guestUser ? guestUser.fullName : user?.fullName}
        </Typography>
        <Box>
          {isDoctor && (
            <Button sx={{ mr: "0.5rem" }} size='small' onClick={showDialog}>
              درمان
            </Button>
          )}
          <Button
            size='small'
            color='error'
            variant='outlined'
            onClick={onDelete}
          >
            حذف
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          mt: "1rem",
          "&>*": {
            mb: "0.5rem !important",
          },
        }}
      >
        <Typography variant='body2'>تاریخ ثبت : {visitDate}</Typography>
        <Typography
          variant='body2'
          component='p'
          sx={{
            display: "flex",
          }}
        >
          اورژانسی :
          {is_Emergency ? (
            <DoneIcon color='error' fontSize='small' />
          ) : (
            <DoNotDisturbIcon color='info' fontSize='small' />
          )}
        </Typography>
        <Typography variant='body2'>
          {user
            ? `کد پرسنلی : ${user.personalCode}`
            : `کد ملی : ${guestUser?.nationalCode}`}
        </Typography>
        <Typography variant='body2'>
          وضعیت: {patientQueueStatus[status as keyof typeof patientQueueStatus]}
        </Typography>
        <Typography variant='body2'>توضیحات : </Typography>
        <Typography variant='body2'>{reason}</Typography>
      </Box>
    </Paper>
  );
};
