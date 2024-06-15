import roleCheck from "@/actions/roleCheck";
import { Panel } from "@/page";
import { redirect } from "next/navigation";

export default async function Page() {
  // const check = await roleCheck(["admin"]);
  // if(!check) redirect("/")
  return <Panel />;
}
