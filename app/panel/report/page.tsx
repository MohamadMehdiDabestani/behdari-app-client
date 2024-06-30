import getUserToken from "@/actions/getUserToken";
import roleCheck from "@/actions/roleCheck";
import { roles , unaccessPath } from "@/common";
import { ApiResult } from "@/interface";
import {  Report } from "@/page";
import { redirect } from "next/navigation";
const getData = async (
  type?: string,
  startDate?: string,
  endDate?: string,
  medicineName?: string,
  packName?: string,
  nationalCode?: string,
): Promise<ApiResult> => {
  try {
    const selectedType = Number(type) ?? 0;
    if (!startDate || !endDate)
      return {
        data: [],
        isSuccess: false,
        message: "تاریخی مشخص کنید",
        statusCode: 404,
      };
    const restData : any = {}
    if(medicineName) restData["medicineName"] = medicineName
    if(packName) restData["packName"] = packName
    if(nationalCode) restData["nationalCode"] = nationalCode
    const token = await getUserToken();
    const req = await fetch(`${process.env.API_END_POINT}/Report`, {
      next: {
        tags: ["reportList"],
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        start_Date: startDate,
        end_Date: endDate,
        type: selectedType,
        ...restData
      }),
    });
    const json = (await req.json()) as ApiResult;
    console.log("server" , json)
    return json;
  } catch (error) {
    console.log(error);
    return {
      data: [],
      isSuccess: false,
      message: "مشکلی پیش آمده",
      statusCode: 500,
    };
  }
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    type?: string;
    startDate?: string;
    endDate?: string;
    medicineName?: string;
    packName?: string;
    nationalCode?: string;
  };
}) {
  const check = await roleCheck([
    roles["admin"],
    roles["doctor"],
    roles["nurse"],
  ]);
  if (!check) redirect(unaccessPath);
  const data = await getData(
    searchParams?.type,
    searchParams?.startDate,
    searchParams?.endDate,
    searchParams?.medicineName,
    searchParams?.packName,
    searchParams?.nationalCode,
  );
  return <Report {...data} />;
}
