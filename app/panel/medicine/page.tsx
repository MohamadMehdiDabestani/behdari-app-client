import { ApiResult } from "@/interface";
import { Medicine } from "@/page";
const getData = async (
  pageId: string | undefined,
  take: string | undefined
): Promise<ApiResult> => {
  try {
    let id,
      t = 0;
    if (!pageId) pageId = "1";
    if (!take) take = "8";
    id = Number(pageId);
    t = Number(take);
    const req = await fetch(
      `${process.env.API_END_POINT}/Medicine?PageId=${id}&TakeEntity=${t}`,
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

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    pageId?: string;
    take?: string;
  };
}) {
  const data = await getData(searchParams?.pageId, searchParams?.take);
  return <Medicine {...data} />;
}
