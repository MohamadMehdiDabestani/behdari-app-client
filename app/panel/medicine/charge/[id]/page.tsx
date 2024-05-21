import { ApiResult } from "@/interface";
import { ChargeMedicine } from "@/page";
const getData = async (id : string): Promise<ApiResult> => {
    try {
      const req = await fetch(`${process.env.API_END_POINT}/Medicine/${id}`);
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
export default async function Page({ params }: { params: { id: string } }) {
    const data = await getData(params.id)
  return <ChargeMedicine {...data} />
}
