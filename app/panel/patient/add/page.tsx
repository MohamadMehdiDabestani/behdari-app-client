import { ApiResult } from "@/interface";
import { AddPantient } from "@/page";

const getData = async (): Promise<ApiResult> => {
    try {
      const req = await fetch(`${process.env.API_END_POINT}/User?TakeEntity=9999`, {
        next: {
          tags: ["usersList"],
        },
      });
      const json = (await req.json()) as ApiResult;
      const list = json.data.users.map((e : any) => e.personalCode)
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
    const data = await getData()
    console.log(data)
  return <AddPantient  {...data} />;
}
