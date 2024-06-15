
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { Fragment } from "react";
import { Table } from "./table";


export const Accounts = (props: any) => {
  return (
    <Fragment>
      <Link href='/panel/accounts/add'>
        <Button>ساخت حساب جدید</Button>
      </Link>
      <Box
        sx={{
          mt: "1rem",
          height: "85vh",
          width: "100%",
        }}
      >

        <Table {...props} />
      </Box>
    </Fragment>
  );
};
