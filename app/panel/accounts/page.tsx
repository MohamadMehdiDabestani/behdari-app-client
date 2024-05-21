import { ApiResult } from "@/interface";
import { Accounts } from "@/page";

const getData = async (): Promise<ApiResult> => {
  try {
    const req = await fetch(`${process.env.API_END_POINT}/User`, {
      next: {
        tags: ["usersList"],
      },
    });
    const json = (await req.json()) as ApiResult;
    const data = json.data
    console.log(data)
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
  const data = await getData();
  return <Accounts {...data} />;
}
