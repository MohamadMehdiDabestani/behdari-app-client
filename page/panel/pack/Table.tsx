"use client";
import { ApiResult } from "@/interface";
import { Box, Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowHeightParams,
  GridRowParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { medicineType } from "@/common";
import useApi from "@/hooks/useApi";
import invalidCache from "@/utils/invalidCache";
import { snack } from "@/atom";
import { useAtom } from "jotai";
import AddIcon from "@mui/icons-material/Add";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import usePagination from "@/hooks/usePagination";

export const Table = ({ data }: ApiResult) => {
  const router = useRouter();
  console.log(data);
  const { paginationModel, setPaginationModel } = usePagination({
    pageSize: data.takeEntity as number,
    pageId: (data.pageId as number) - 1,
    cache: "packsList",
  });

  const axios = useApi();
  const [_, setSnack] = useAtom(snack);
  const onDelete = async (id: number) => {
    const req = await axios.delete<ApiResult>(`/Pack/${id}`);
    invalidCache("packsList");
    setSnack({
      show: true,
      text: req.data.message,
      type: "success",
    });
  };

  const columns: GridColDef[] = [
    { field: "packName", headerName: "نام", width: 150 },
    {
      field: "medicines",
      headerName: "لیست دارویی",
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
          {params.row.medicinePacks.map((e: any, idx: number) => (
            <Box key={idx}>
              <Typography variant='caption'>نام : {e.name}</Typography>
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
        // <GridActionsCellItem
        //   color='info'
        //   key={1}
        //   icon={<AddIcon />}
        //   onClick={() => router.push(`/panel/medicine/charge/${params.row.id}`)}
        //   label='add'
        // />,
      ],
    },
  ];
  return (
    <DataGrid
      rows={data.packs}
      getRowHeight={({ model }: GridRowHeightParams) => {
        if (model.medicineCharges) {
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
      pageSizeOptions={[8]}
      paginationModel={paginationModel}
      paginationMode='server'
      onPaginationModelChange={setPaginationModel}
      rowCount={data.allEntitiesCount}
    />
  );
};
