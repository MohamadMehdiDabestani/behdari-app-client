"use client";
import { snack } from "@/atom";
import { CustomTabPanel, TabContainer, CreateGuestUser } from "@/components";
import useApi from "@/hooks/useApi";
import { ApiResult } from "@/interface";
import invalidCache from "@/utils/invalidCache";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
} from "@mui/material";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { ZodError, z } from "zod";
export const AddPantient = ({ data }: ApiResult) => {
  const [value, setValue] = useState<number>(0);
  const axios = useApi();
  const [_, setSnack] = useAtom(snack);
  const router = useRouter();

  const formSchema = z
    .object({
      reason: z
        .string({
          message: "دلیل را وارد کنید",
        })
        .min(1, "دلیل را وارد کنید"),
      is_Emergency: z.boolean(),
      personalCode: z
        .string({
          message: "کاربری را انتخاب کنید",
        })
        .optional()
        .nullable(),
      guestUserId: z.coerce
        .number({
          message: "کاربر مهمان را وارد کنید",
        })
        .optional()
        .nullable(),
    })
    .refine(
      (value) => {
        return !(!value.personalCode && !value.guestUserId);
      },
      {
        message: "کاربری را انتخاب کنید",
        path: ["personalCode"],
      }
    )
    .refine(
      (value) => {
        return !(value.personalCode && value.guestUserId);
      },
      {
        message: "شما نمیتوانید هم کاربر مهمان انتخاب کنید و هم کاربر داخلی",
        path: ["personalCode"],
      }
    );

  type FormSchemaType = z.infer<typeof formSchema>;
  const rootForm = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_Emergency: false,
    },
  });
  const { handleSubmit, control, formState } = rootForm;
  const onSubmit: SubmitHandler<FormSchemaType> = async (formData) => {
    try {
      const req = await axios.post<ApiResult>("/PatientQueue", formData);
      invalidCache("patientList");
      setSnack({
        show: true,
        text: req.data.message,
        type: "success",
      });
      router.push("/panel/patient");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <FormProvider {...rootForm}>
      <Paper
        sx={{ p: "1rem" }}
        component='form'
        onSubmit={handleSubmit(onSubmit)}
      >
        <TabContainer
          columns={["کارمند داخلی", "بیمار مهمان"]}
          setValue={setValue}
          value={value}
          sx={{
            mb: "2rem",
          }}
        >
          <CustomTabPanel value={value} index={0}>
            <Controller
              name='personalCode'
              control={control}
              render={({ field }) => (
                <Autocomplete
                  disablePortal
                  options={data as string[]}
                  fullWidth
                  value={field.value}
                  onChange={(e, newValue : any) => {
                    console.log('new value' , newValue)
                    field.onChange(newValue.id);
                  }}
                  renderInput={(params) => (
                    <TextField
                      error={!!formState.errors.personalCode}
                      helperText={formState.errors.personalCode?.message}
                      {...params}
                      label='کد پرسنلی'
                    />
                  )}
                />
              )}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <CreateGuestUser />
          </CustomTabPanel>
        </TabContainer>
        <Controller
          name='reason'
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              label='دلیل'
              error={!!formState.errors.reason}
              helperText={formState.errors.reason?.message}
              {...field}
              sx={{
                mb: "2rem",
              }}
            />
          )}
        />
        <Controller
          name='is_Emergency'
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} />}
              label='اورژانسی؟'
              labelPlacement='start'
              sx={{
                mb: "2rem",
              }}
            />
          )}
        />
        <Box>
          <Button type='submit'>ارسال</Button>
        </Box>
      </Paper>
    </FormProvider>
  );
};
