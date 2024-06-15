import { ApiResult } from "@/interface";
import { Box, Button } from "@mui/material";
import { Table } from "./Table";
import Link from "next/link";

export const Medicine = (props: ApiResult) => {
  return (
    <Box sx={{ height: "85vh", width: "100%" }}>
      <Link  href='/panel/medicine/add'>
        <Button sx={{mb : "1rem"}}>ثبت داروی جدید</Button>
      </Link>
      <Link  href="/panel/pack">
        <Button sx={{mb : "1rem" , ml : "1rem"}}>پک ها</Button>
      </Link>
      
      <Table {...props} />
    </Box>
  );
};
