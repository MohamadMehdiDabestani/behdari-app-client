import getUserToken from "@/actions/getUserToken";
import roleCheck from "@/actions/roleCheck";
import { unaccessPath, roles } from "@/common";
import { ApiResult } from "@/interface";
import { AddAccount } from "@/page";
import { redirect } from "next/navigation";

const getData = async (): Promise<ApiResult> => {
  try {
    const token = await getUserToken();
    const [roles, permisions] = await Promise.all([
      fetch(`${process.env.API_END_POINT}/Role`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch(`${process.env.API_END_POINT}/Permission`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);
    const roleJson = await roles.json();
    const permisionsJson = await permisions.json();
    return {
      data: {
        role: roleJson.data.roles,
        permisions: permisionsJson.data,
      },
      isSuccess: roleJson.isSuccess,
      message: roleJson.message,
      statusCode: roleJson.statusCode,
    };
  } catch (error) {
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
  if (!check) redirect(unaccessPath);
  const { data } = await getData();

  return <AddAccount data={data} />;
}
