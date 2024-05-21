import { ApiResult } from "@/interface";
import { AddPack } from "@/page";
const getData = async (): Promise<ApiResult> => {
    try {
      const req = await fetch(
        `${process.env.API_END_POINT}/Medicine?TakeEntity=9999`,
        {
          next: {
            tags: ["medicinesList"],
          },
        }
      );
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
    const data = await getData()
//   console.log(data)
  return <AddPack {...data} />;
}
