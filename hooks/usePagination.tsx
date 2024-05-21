import invalidCache from "@/utils/invalidCache";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  pageId: number;
  pageSize: number;
  cache: string;
}
const usePagination = ({ cache, pageId, pageSize }: Props) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: pageSize,
    page: pageId,
  });
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (paginationModel.page == 0) {
      params.delete("pageId");
      params.delete("take");
    } else {
      params.set("pageId", String(paginationModel.page + 1));
      params.set("take", String(paginationModel.pageSize));
    }
    invalidCache(cache);
    replace(`${pathname}?${params.toString()}`);
  }, [paginationModel]);
  return {paginationModel, setPaginationModel};
};
export default usePagination