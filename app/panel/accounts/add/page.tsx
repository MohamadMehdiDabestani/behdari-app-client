import { ApiResult } from "@/interface";
import { Accounts, AddAccount } from "@/page";

const getData = async (): Promise<ApiResult> => {
  try {
    const [roles, permisions] = await Promise.all([
      fetch(`${process.env.API_END_POINT}/Role`),
      fetch(`${process.env.API_END_POINT}/Permission`),
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
  const {data} = await getData();

  return <AddAccount data={data} />;
}
