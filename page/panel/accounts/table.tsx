"use client";
import { Details } from "./details";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbar,
  GridRowParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import useApi from "@/hooks/useApi";
import invalidCache from "@/utils/invalidCache";
import { useAtom } from "jotai";
import { dialogForm, snack } from "@/atom";
import EditIcon from "@mui/icons-material/Edit";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import { Fragment, useState } from "react";
export const Table = ({ data }: any) => {
  const axios = useApi();
  const [_, setSnack] = useAtom(snack);
  const [open, setOpen] = useState(false);
  const { push, replace } = useRouter();
  const pathname = usePathname();
  const rootParams = useSearchParams();
  // const { paginationModel, setPaginationModel } = usePagination({
  //   pageSize: data.takeEntity as number,
  //   pageId: (data.pageId as number) - 1,
  //   cache: "usersList",
  // });
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
  const onDetails = (id: number) => {
    const params = new URLSearchParams();
    params.set("id", String(id));
    params.delete("extra");
    replace(`${pathname}?${params.toString()}`);
    setOpen(true);
  };
  const columns: GridColDef[] = [
    {
      field: "fullName",
      valueGetter: (value, row) => {
        return `${row.name} ${row.family}`;
      },
      headerName: "نام کامل",
      width: 150,
    },
    { field: "personalCode", headerName: "شماره ی پرسنلی", width: 150 },
    {
      field: "role",
      headerName: "نقش",
      width: 150,
      valueGetter(value , row) {
        return row.userRoles[0].roleName;
      },
    },
    { field: "phoneNumber", headerName: "شماره ی همراه", width: 150 },
    { field: "nationalCode", headerName: "کد ملی", width: 150 },
    { field: "telephone", headerName: "تلفن ثابت", width: 150 },
    {
      field: "actions",
      type: "actions",
      width: 200,
      headerName: "عملیات",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          color='error'
          key={0}
          icon={<DeleteIcon />}
          onClick={() => onDelete(params.row.userId)}
          label='Delete'
        />,
        <GridActionsCellItem
          color='warning'
          key={1}
          icon={<EditIcon />}
          onClick={() => push(`/panel/accounts/edit/${params.row.userId}`)}
          label='Edit'
        />,
        <GridActionsCellItem
          color='info'
          key={2}
          icon={<VaccinesIcon />}
          onClick={() => onDetails(params.row.userId)}
          label='Edit'
        />,
        <GridActionsCellItem
          color='info'
          key={3}
          icon={<MedicalInformationIcon />}
          // onClick={() => onDetails(params.row.userId)}
          label='Details'
        />,
      ],
    },
  ];
  return (
    <Fragment>
        <Details open={open} setOpen={setOpen} />
    <DataGrid
      getRowId={(row) => row.userId}
      rows={data}
      columns={columns}
      slots={{ toolbar: GridToolbar }}
      pageSizeOptions={[5, 10, 25]}
      initialState={{
        pagination: { paginationModel: { pageSize: 5 } },
      }}
      // paginationModel={paginationModel}
      // paginationMode='server'
      // onPaginationModelChange={setPaginationModel}
      // rowCount={data.allEntitiesCount}
      />
      </Fragment>
  );
};
