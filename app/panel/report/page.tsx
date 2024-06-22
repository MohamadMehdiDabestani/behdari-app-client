import getUserToken from "@/actions/getUserToken";
import roleCheck from "@/actions/roleCheck";
import { roles } from "@/common";
import { ApiResult } from "@/interface";
import { ListPacks, Report } from "@/page";
import { redirect } from "next/navigation";
const getData = async (
  type?: string,
  startDate?: string,
  endDate?: string
): Promise<ApiResult> => {
  try {
    console.log(startDate);
    console.log(endDate);
    const selectedType = Number(type) ?? 0;
    if (!startDate || !endDate)
      return {
        data: [],
        isSuccess: false,
        message: "تاریخی مشخص کنید",
        statusCode: 404,
      };
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
        state: selectedType,
      }),
    });
    const json = (await req.json()) as ApiResult;
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
  };
}) {
  const check = await roleCheck([
    roles["admin"],
    roles["doctor"],
    roles["nurse"],
  ]);
  if (!check) redirect("/");
  const data = await getData(
    searchParams?.type,
    searchParams?.startDate,
    searchParams?.endDate
  );
  return <Report {...data} />;
}
