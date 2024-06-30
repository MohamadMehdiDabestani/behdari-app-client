import roleCheck from "@/actions/roleCheck";
import { ApiResult } from "@/interface";
import { ListPatient } from "@/page";
import {roles , unaccessPath} from '@/common'
import getUserToken from "@/actions/getUserToken";
import { redirect } from "next/navigation";
const getData = async (
  pageId: string | undefined,
  take: string | undefined
): Promise<ApiResult> => {
  try {
    let id,
      t = 0;
    if (!pageId) pageId = "1";
    if (!take) take = "15";
    id = Number(pageId);
    t = Number(take);
    const token = await getUserToken();

    const [req , isHse , isDoctor] = await Promise.all([
      fetch(
        `${process.env.API_END_POINT}/PatientQueue?PageId=${id}&TakeEntity=${t}`,
        {
          next: {
            tags: ["patientList"],
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
      roleCheck(['hsee']),
      roleCheck(['doctor' , roles['nurse']])
    ])
    const json = (await req.json()) as ApiResult;
    return {
      ...json,
      data : {
        ...json.data,
        isHse,
        isDoctor
      }
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

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    pageId?: string;
    take?: string;
  };
}) {
  const check = await roleCheck([roles["admin"],roles['hsee'], roles["doctor"] , roles['nurse']]);
  if (!check) redirect(unaccessPath);
  const data = await getData(searchParams?.pageId, searchParams?.take);
  //   console.log(data)
  return <ListPatient {...data} />;
}
