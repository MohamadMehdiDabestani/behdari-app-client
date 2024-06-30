import getUserToken from "@/actions/getUserToken";
import roleCheck from "@/actions/roleCheck";
import { roles ,unaccessPath} from "@/common";
import { ApiResult } from "@/interface";
import { Accounts, EditAccount } from "@/page";
import { redirect } from "next/navigation";

const getData = async (id: number): Promise<ApiResult> => {
  try {
    const token = await getUserToken();
    const [user, roles, permisions] = await Promise.all([
      fetch(`${process.env.API_END_POINT}/User/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
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
    const userJson = await user.json();
    return {
      data: {
        role: roleJson.data.roles,
        permisions: permisionsJson.data,
        user: userJson.data,
      },
      isSuccess: roleJson.isSuccess,
      message: roleJson.message,
      statusCode: roleJson.statusCode,
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

export default async function Page({ params }: { params: { id: string } }) {
  const check = await roleCheck([roles['admin'] , roles['edari']]);
  if(!check) redirect(unaccessPath)
  const { data } = await getData(Number(params.id));

  return <EditAccount data={data} />;
}
