import getCookie from "@/actions/getCookie";
import getUserToken from "@/actions/getUserToken";
import roleCheck from "@/actions/roleCheck";
import { roles } from "@/common";
import { ApiResult } from "@/interface";
import { Accounts } from "@/page";
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
    return json;
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
  const check = await roleCheck([roles["admin"], roles["edari"]]);
  if (!check) redirect("/");
  const data = await getData();
  console.log(data.data.users);
  return <Accounts {...data} />;
}
