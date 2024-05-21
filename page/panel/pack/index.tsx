import { ApiResult } from "@/interface";
import { Box, Button } from "@mui/material";
import { Table } from "./Table";
import Link from "next/link";

export const ListPacks = (props: ApiResult) => {
  return (
    <Box sx={{ height: "85vh", width: "100%" }}>
      <Link  href='/panel/pack/add'>
        <Button sx={{mb : "1rem"}}>ثبت پک جدید</Button>
      </Link>
      <Table {...props} />
    </Box>
  );
};
