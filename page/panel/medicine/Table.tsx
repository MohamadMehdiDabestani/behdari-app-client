"use client";
import { ApiResult } from "@/interface";
import { Box, Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowHeightParams,
  GridRowParams,
  GridToolbar,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { medicineType } from "@/common";
import useApi from "@/hooks/useApi";
import invalidCache from "@/utils/invalidCache";
import { snack } from "@/atom";
import { useAtom } from "jotai";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import usePagination from "@/hooks/usePagination";

export const Table = ({ data }: any) => {
  const router = useRouter();

  const axios = useApi();
  const [_, setSnack] = useAtom(snack);
  const onDelete = async (id: number) => {
    const req = await axios.delete<ApiResult>(`/Medicine/${id}`);
    invalidCache("medicinesList");
    setSnack({
      show: true,
      text: req.data.message,
      type: "success",
    });
  };

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
      cellClassName: (params) => {
        return params.row.medicineCharges.reduce((value: number, e: any) => {
          return value + e.count;
        }, 0) < params.row.countLimit
          ? "bg-error"
          : "";
      },
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
              <Typography variant='caption'>انقضا : {e.expireDate}</Typography>{" "}
              <Typography variant='caption'>تعداد : {e.count}</Typography>
            </Box>
          ))}
        </Box>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "عملیات",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          color='error'
          key={0}
          icon={<DeleteIcon />}
          onClick={() => onDelete(params.row.id)}
          label='Delete'
        />,
        <GridActionsCellItem
          color='info'
          key={1}
          icon={<AddIcon />}
          onClick={() => router.push(`/panel/medicine/charge/${params.row.id}`)}
          label='add'
        />,
        <GridActionsCellItem
          color='warning'
          key={2}
          icon={<ModeEditIcon />}
          onClick={() => router.push(`/panel/medicine/edit/${params.row.id}`)}
          label='add'
        />,
      ],
    },
  ];
  return (
    <DataGrid
      rows={data}
      getRowHeight={({ model }: GridRowHeightParams) => {
        if (model.medicineCharges) {
          if (model.medicineCharges.length > 10) return "auto";
          return 50 * model.medicineCharges.length;
        }
        return null;
      }}
      columns={columns}
      sx={{
        "& .bg-error": {
          bgcolor: (t) => t.palette.error.light,
        },
      }}
      pageSizeOptions={[5, 10, 25]}
      slots={{ toolbar: GridToolbar }}
      initialState={{
        pagination: { paginationModel: { pageSize: 5 } },

        columns: {
          columnVisibilityModel: {
            // Hide columns status and traderName, the other columns will remain visible
            // countLimit: false,
            // timeLimit: false,
          },
        },
      }}
    />
  );
};
