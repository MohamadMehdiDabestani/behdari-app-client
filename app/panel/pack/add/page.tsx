import { ApiResult } from "@/interface";
import { AddPack } from "@/page";
const getData = async (): Promise<any[]> => {
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
    console.log();
    return json.data.medicines.map((e: any) => ({ name: e.name, id: e.id }));
  } catch (error) {
    console.log(error);
    return [false];
  }
};

export default async function Page() {
  const data = await getData();
  console.log(data);
  return <AddPack list={data} />;
}
