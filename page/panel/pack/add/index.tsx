"use client";
import {
  MenuItem,
  InputLabel,
  Select,
  FormHelperText,
  TextField,
  FormControl,
  Paper,
  Button,
  Divider,
  Checkbox,
  ListItemText,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { ErrorMessage } from "@hookform/error-message";

import { z } from "zod";
import {
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useApi from "@/hooks/useApi";
import invalidCache from "@/utils/invalidCache";
import { snack } from "@/atom";
import { useAtom } from "jotai";
import { ApiResult } from "@/interface";
import { useRouter } from "next/navigation";
import { medicineType } from "@/common";
import { Fragment } from "react";
import AddIcon from "@mui/icons-material/Add";
interface Props {
  list: { id: number; name: string }[];
}
export const AddPack = ({ list }: Props) => {
  const axios = useApi();
  const [_, setSnack] = useAtom(snack);
  const router = useRouter();
  const formSchema = z.object({
    list: z.array(
      z.object({
        packName: z
          .string({
            message: "نام پک را وارد کنید",
          })
          .min(1, {
            message: "نام پک را وارد کنید",
          }),
        parentId: z.coerce.number({}).positive({}).int(),
        medicineInfo: z.array(
          z.object({
            medicineId: z.coerce.number({}).positive({}).int(),
            cost: z.coerce.number({}).positive({}),
          })
        ),
      })
    ),
  });
  type FormSchemaType = z.infer<typeof formSchema>;

  const { handleSubmit, control, formState } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      list: [
        {
          packName: "",
          parentId: 0,
          medicineInfo: [
            {
              cost: 0,
              medicineId: 0
            },
          ],
        },
      ],
    },
  });
  const dynamicOptionFormPart = useFieldArray({
    name: "list",
    control: control,
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    console.log(data)
    // const req = await axios.post<ApiResult>("/MedicineRange", newArray);
    // invalidCache("medicinesList");
    setSnack({
      show: true,
      text: "req.data.message",
      type: "success",
    });
    // router.push("/panel/medicine");
  };
 
  return (
    <Paper
      sx={{
        p: "1rem",
      }}
      component='form'
      onSubmit={handleSubmit(onSubmit)}
    >
      {dynamicOptionFormPart.fields.map((e, idx) => (
        <Grid container key={idx} columnSpacing={5}>
          <Grid xs={6} md={3}>
            <Controller
              name={`list.${idx}.packName`}
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label='نام پک'
                  error={
                    formState.errors.list
                      ? !!formState.errors.list[idx]?.packName
                      : false
                  }
                  helperText={
                    formState.errors.list
                      ? formState.errors.list[idx]?.packName?.message
                      : undefined
                  }
                  {...field}
                  sx={{
                    mb: "2rem",
                  }}
                />
              )}
            />
          </Grid>
          <Grid xs={6} md={3}>
            <Controller
              name={`list.${idx}.parentId`}
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  type='number'
                  label='والد'
                  error={
                    formState.errors.list
                      ? !!formState.errors.list[idx]?.parentId
                      : false
                  }
                  helperText={
                    formState.errors.list
                      ? formState.errors.list[idx]?.parentId?.message
                      : undefined
                  }
                  {...field}
                  sx={{
                    mb: "2rem",
                  }}
                />
              )}
            />
          </Grid>
          <Grid xs={12}>
            <Divider
              sx={{
                display: "flex",
              }}
            >
              لیست دارویی
              <AddIcon
                fontSize='small'
                color='primary'
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  dynamicOptionFormPart.update(idx, {
                    medicineInfo: [
                      ...dynamicOptionFormPart.fields[idx].medicineInfo,
                      {
                        cost: 0,
                        medicineId: 0
                      },
                    ],
                    packName: dynamicOptionFormPart.fields[idx].packName,
                    parentId: dynamicOptionFormPart.fields[idx].parentId,
                  });
                }}
              />
            </Divider>
          </Grid>
          {dynamicOptionFormPart.fields[idx].medicineInfo.map((e, iidx) => (
            <Fragment key={iidx}>
              <Grid xs={6}>
                <Controller
                  name={`list.${idx}.medicineInfo.${iidx}.medicineId`}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id='medicineLabel'>دارو ها</InputLabel>
                      <Select
                        labelId='medicineLabel'
                        {...field}
                        variant='filled'
                        fullWidth
                        renderValue={(selected: number) =>
                          list.find((e) => selected == e.id)?.name
                        }
                      >
                        {list.map((e, idx: number) => (
                          <MenuItem key={idx} value={e.id}>
                            <Checkbox
                              checked={field.value == e.id}
                            />
                            <ListItemText primary={e.name} />
                          </MenuItem>
                        ))}
                      </Select>
                      <ErrorMessage
                        errors={formState.errors}
                        name={`list.${idx}.medicineInfo.${iidx}.medicineId`}
                        render={({ message }) => (
                          <FormHelperText error={true}>
                            {message}
                          </FormHelperText>
                        )}
                      />
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid xs={6} key={iidx}>
                <Controller
                  name={`list.${idx}.medicineInfo.${iidx}.cost`}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <TextField
                       
                        fullWidth
                        label='هزینه'
                        {...field}
                      />
                      <ErrorMessage
                        errors={formState.errors}
                        name={`list.${idx}.medicineInfo.${iidx}.cost`}
                        render={({ message }) => (
                          <FormHelperText error={true}>
                            {message}
                          </FormHelperText>
                        )}
                      />
                    </FormControl>
                  )}
                />
              </Grid>
            </Fragment>
          ))}
        </Grid>
      ))}
      <Button
        onClick={() => {
          dynamicOptionFormPart.append({
            medicineInfo: [
              {
                cost: 0,
                medicineId: 0
              },
            ],
            packName: "",
            parentId: 0,
          });
        }}
        color='secondary'
      >
        جدید
      </Button>
      <Button
        sx={{
          ml: "2rem",
        }}
        type='submit'
      >
        ارسال
      </Button>
    </Paper>
  );
};
