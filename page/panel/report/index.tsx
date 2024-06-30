"use client";
import { ApiResult } from "@/interface";
import { Filter } from "./filter";
import { Fragment, useEffect } from "react";
import { useAtom } from "jotai";
import { loading, snack } from "@/atom";
import { List } from "./list";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";
import { useSearchParams } from "next/navigation";
const visitDateMapKey = {
  0: "visitDate",
  1: "visitDate",
  2: "visitDate",
  3: "visitDate",
  4: "dispatchReceptionDate",
  5: "referralReceptionDate",
  6: "prescriptionReceptionDate",
  7: "otherReceptionDate",
};
export const Report = ({ message, isSuccess, data }: ApiResult) => {
  const [_, setSnack] = useAtom(snack);
  const [__, setLoading] = useAtom(loading);
  const params = useSearchParams();
  const type = Number(params.get("type") ?? 0);
  useEffect(() => {
    setLoading(false);
    setSnack({
      show: true,
      text: message,
      type: isSuccess ? "success" : "error",
    });
  }, [data]);
  const exportXLSX = () => {
    const exportData = data.map((e: any) => ({
      fullName: e.fullName,
      nationalCode: e.nationalCode,
      doctorName: e.doctorName,
      doctorDiagnose: e.doctorDiagnose,
      date : e[
        visitDateMapKey[
          type as keyof typeof visitDateMapKey
        ] as keyof typeof e
      ],
      isHsee : e.is_Receptioned_By_HSE ? "بله" : "خیر",
      isGuestUser : e.guestUserId ? "بله" : "خیر",
      medicines:e.patientPrescriptions ? e.patientPrescriptions
        .map((e: any) => e.medicineName ?? e.packName)
        .join(" | ") : "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.utils.sheet_add_aoa(worksheet, [["نام کامل", "کد ملی" , "نام دکتر" , "تشخیص دکتر","تاریخ" ,"پذیرش با HSEE" ,"کاربر مهمان", "دارو ها"]], {
      origin: "A1",
    });
    XLSX.writeFile(workbook, "Report.xlsx");
  };
  return (
    <Fragment>
      <Filter>
        <Button onClick={exportXLSX} color="secondary" sx={{ ml: "0.5rem" }}>
          دانلود به صورت اکسل
        </Button>
      </Filter>
      <List visitDateMapKey={visitDateMapKey} data={data as any[]} />
    </Fragment>
  );
};
