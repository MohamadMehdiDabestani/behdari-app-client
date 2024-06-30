'use client'
import { Paper, Typography } from "@mui/material";

export const Item = (props: any) => {
  return (
    <Paper sx={{
        p : "0.5rem",
        "&>p" : {
            mb : "0.5rem"
        }
    }}>
      <Typography>نام : {props.fullName}</Typography>
      <Typography>{props.userId ? ` کد پرسنلی : ${props.personalCode}` : `کد ملی : ${props.nationalCode}`}</Typography>
      <Typography>تشخیص  : {props.doctorDiagnose}</Typography>
      <Typography variant="body2">تاریخ : {props.visitDate}</Typography>
      <Typography>ویزیت توسط: {props.doctorName}</Typography>
      <Typography>اورژانسی : {props.is_Emergency ? 'بله': 'خیر'}</Typography>
      <Typography>پذیرش با hsee : {props.is_Receptioned_By_HSE ? 'بله' :'خیر'}</Typography>
      {props.type == 1 && <Typography>دارو ها: {props.patientPrescriptions.map((e : any) => e.medicineName ?? e.packName).join(" | ")}</Typography>}
      {props.guestUserId &&  <Typography>کاربر مهمان : بله</Typography>}
    </Paper>
  );
};
