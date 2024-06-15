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
  FormProvider,
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
import { NestedItems } from "./nestedItems";
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
        // parentId: z.coerce.number({}).positive({}).int(),
        medicineInfo: z.array(
          z.object({
            medicineId: z.coerce.number({
              message: "دارو را انتخاب کنید",
            }).positive({
              message: "دارو را انتخاب کنید",

            }).int(),
            cost: z.coerce.number({
              message: "هزینه را وارد کنید",
            }).positive({
              message: "هزینه را وارد کنید",

            }),
          })
        ),
      })
    ),
  });
  type FormSchemaType = z.infer<typeof formSchema>;

  const rootForm = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      list: [
        {
          packName: "",
          // parentId: 0,
          medicineInfo: [
            {
              cost: 0,
              medicineId: 0,
            },
          ],
        },
      ],
    },
  });
  const { handleSubmit, control, formState } = rootForm;
  const dynamicOptionFormPart = useFieldArray({
    name: "list",
    control: control,
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    console.log(data);
    const newData = data.list.map(e => ({...e , parentId : undefined}))
    const req = await axios.post<ApiResult>("/pack", newData);
    invalidCache("medicinesList");
    setSnack({
      show: true,
      text: req.data.message,
      type: "success",
    });
    router.push("/panel/pack");
  };

  return (
    <FormProvider {...rootForm}>
      <Paper
        sx={{
          p: "1rem",
        }}
        component='form'
        onSubmit={handleSubmit(onSubmit)}
      >
        {dynamicOptionFormPart.fields.map((e, idx) => (
          <Grid container key={e.id} columnSpacing={5}>
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
            {/* <Grid xs={6} md={3}>
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
            </Grid> */}
            <NestedItems index={idx} list={list} />
          </Grid>
        ))}
        <Button
          onClick={() => {
            dynamicOptionFormPart.append({
              medicineInfo: [
                {
                  cost: 0,
                  medicineId: 0,
                },
              ],
              packName: "",
              // parentId: 0,
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
    </FormProvider>
  );
};
