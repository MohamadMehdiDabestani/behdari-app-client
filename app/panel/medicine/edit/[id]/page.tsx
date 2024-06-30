import getUserToken from "@/actions/getUserToken";
import roleCheck from "@/actions/roleCheck";
import { roles ,unaccessPath} from "@/common";
import { ApiResult } from "@/interface";
import { EditMedicine } from "@/page";
import { redirect } from "next/navigation";
const getData = async (id: string | undefined): Promise<ApiResult> => {
  try {
    const token = await getUserToken();
    const req = await fetch(`${process.env.API_END_POINT}/Medicine/${id}` , {
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

export default async function Page({ params }: { params: { id: string } }) {
  const check = await roleCheck([roles["admin"], roles["doctor"]]);
  if (!check) redirect(unaccessPath);
  const data = await getData(params?.id);
  return <EditMedicine {...data} />;
}
