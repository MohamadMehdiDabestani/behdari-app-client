import { ApiResult } from "@/interface";
import { EditMedicine } from "@/page";
const getData = async (id: string | undefined): Promise<ApiResult> => {
  try {
    const req = await fetch(`${process.env.API_END_POINT}/Medicine/${id}`);
    const json = (await req.json()) as ApiResult;
    console.log(json);
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
  console.log("id", params?.id);
  const data = await getData(params?.id);
  return <EditMedicine {...data} />;
}
