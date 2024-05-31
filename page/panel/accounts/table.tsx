"use client";
import { ApiResult } from "@/interface";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import useApi from "@/hooks/useApi";
import invalidCache from "@/utils/invalidCache";
import { useAtom } from "jotai";
import { snack } from "@/atom";
export const Table = ({ data }: ApiResult) => {
  const axios = useApi();
  const [_, setSnack] = useAtom(snack);
  const onDelete = async (id: any) => {
    try {
      const req = await axios.delete(`/User/${id}`);
      invalidCache("usersList");
      setSnack({
        show: true,
        text: req.data.message,
        type: "success",
      });
    } catch (error) {}
  };
  const columns: GridColDef[] = [
    {
      field: "fullName",
      renderCell(params) {
        return `${params.row.name} ${params.row.family}`;
      },
      headerName: "نام کامل",
      width: 150,
    },
    { field: "personalCode", headerName: "شماره ی پرسنلی", width: 150 },
    { field: "phoneNumber", headerName: "شماره ی همراه", width: 150 },
    {
      field: "actions",
      type: "actions",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          color='error'
          key={0}
          icon={<DeleteIcon />}
          onClick={() => onDelete(params.row.userId)}
          label='Delete'
        />,
      ],
    },
  ];
  console.log(data.users);
  return (
    <DataGrid getRowId={(row) => row.userId} rows={data.users} columns={columns} />
  );
};
