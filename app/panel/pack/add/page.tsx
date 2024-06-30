import getUserToken from "@/actions/getUserToken";
import roleCheck from "@/actions/roleCheck";
import { roles ,unaccessPath} from "@/common";
import { ApiResult } from "@/interface";
import { AddPack } from "@/page";
import { redirect } from "next/navigation";
const getData = async (): Promise<any[]> => {
  try {
    const token = await getUserToken();
    const req = await fetch(
      `${process.env.API_END_POINT}/Medicine?TakeEntity=9999`,
      {
        next: {
          tags: ["medicinesList"],
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const json = (await req.json()) as ApiResult;
    console.log();
    return json.data.medicines.map((e: any) => ({ name: e.name, id: e.id }));
  } catch (error) {
    console.log(error);
    return [false];
  }
};

export default async function Page() {
  const check = await roleCheck([roles["admin"], roles["doctor"] , roles['nurse']]);
  if (!check) redirect(unaccessPath);
  const data = await getData();
  return <AddPack list={data} />;
}
