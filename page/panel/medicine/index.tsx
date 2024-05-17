"use client";
import { ApiResult } from "@/interface";
import { Box, Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowHeightParams,
  GridRowParams,
  GridRowsProp,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { medicineType } from "@/common";
import useApi from "@/hooks/useApi";
import invalidCache from "@/utils/invalidCache";
import { snack } from "@/atom";
import { useAtom } from "jotai";

export const Medicine = ({ data }: ApiResult) => {
  const axios = useApi()
  const [_,setSnack] = useAtom(snack)
  const onDelete = async (id : number) => {
  const req = await   axios.delete<ApiResult>(`/Medicine/${id}`);
    invalidCache("medicinesList");
      setSnack({
        show: true,
        text: req.data.message,
        type: "success",
      });
  }
  const columns: GridColDef[] = [
    { field: "name", headerName: "نام", width: 150 },
    {
      field: "type",
      headerName: "نوع",
      width: 150,
      valueGetter: (value: any) => {
        return medicineType[value as keyof typeof medicineType];
      },
    },
    { field: "timeLimit", headerName: "محدودیت زمانی", width: 150 },
    { field: "countLimit", headerName: "محدودیت تعداد", width: 150 },
    {
      field: "inventory",
      headerName: "موجودی",
      width: 250,
      renderCell: (params: any) => (
        <Box
          sx={{
            height: "100%",
            lineHeight: "normal",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {params.row.medicineCharges.map((e: any, idx: number) => (
            <Box key={idx}>
              <Typography variant='caption'>انقضا : {e.expireDate}</Typography>
              {" "}
              <Typography variant='caption'>تعداد : {e.count}</Typography>
            </Box>
          ))}
        </Box>
      ),
    },
    {
      field: "actions",
      type: "actions",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          color='error'
          key={0}
          icon={<DeleteIcon />}
          onClick={() => onDelete(params.row.id)}
          label='Delete'
        />,
      ],
    },
  ];
  return (
    <Box sx={{ height: "85vh", width: "100%" }}>
      <DataGrid
        rows={data.medicines}
        getRowHeight={({ model }: GridRowHeightParams) => {

          if (model.medicineCharges) {
            return 50  * model.medicineCharges.length;
          }

          return null;
        }}
        columns={columns}
        initialState={{
          columns: {
            columnVisibilityModel: {
              // Hide columns status and traderName, the other columns will remain visible
              countLimit: false,
              timeLimit: false,
            },
          },
        }}
      />
    </Box>
  );
};
