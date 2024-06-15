import getUserToken from "@/actions/getUserToken";
import roleCheck from "@/actions/roleCheck";
import { roles } from "@/common";
import { ApiResult } from "@/interface";
import { AddPantient } from "@/page";
import { redirect } from "next/navigation";

const getData = async (): Promise<ApiResult> => {
  try {
    const token = await getUserToken();
    const req = await fetch(`${process.env.API_END_POINT}/User`, {
      next: {
        tags: ["usersList"],
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = (await req.json()) as ApiResult;

    const list = json.data.map((e: any) => ({
      label: `${e.personalCode} - ${e.name + " " + e.family} - ${
        e.nationalCode
      }`,
      id: e.personalCode,
    }));
    return {
      data: list,
      isSuccess: true,
      message: json.message,
      statusCode: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      data: {},
      isSuccess: false,
      message: "مشکلی پیش آمده",
      statusCode: 500,
    };
  }
};

export default async function Page() {
  const check = await roleCheck([roles["admin"], roles["hsee"]]);
  if (!check) redirect("/");
  const data = await getData();
  return <AddPantient {...data} />;
}
