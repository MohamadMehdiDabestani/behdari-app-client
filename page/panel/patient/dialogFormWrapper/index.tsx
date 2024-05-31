"use client";
import { DialogForm } from "@/components";
import useApi from "@/hooks/useApi";
import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
  FormProvider,
} from "react-hook-form";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { ApiResult } from "@/interface";
import { NestedMedicines } from "./nestedMedicines";
import { NestedPacks } from "./nestedPacks";
import Divider from "@mui/material/Divider";
import { TabOption } from "./tabOption";
import { token } from "@/atom/token";
import { useAtom } from "jotai";
import invalidCache from "@/utils/invalidCache";
import { dialogForm, snack } from "@/atom";
import { ExtraInput } from "./extraInput";

const DialogFormWrapper = () => {
  const [userFullName, setUserFullName] = useState("");
  const [listPacks, setListPacks] = useState<any[]>([]);
  const [medicinesListState, setMedicinesListState] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState<number>(0);
  const params = useSearchParams();
  const axios = useApi();
  const [_token, setToken] = useAtom(token);
  const [_, setSnack] = useAtom(snack);
  const [open, setOpen] = useAtom(dialogForm);
  const mediciene = z.object({
    MedicineId: z.coerce
      .number({
        message: "دارو را انتخاب کنید",
      })
      .positive("دارو را انتخاب کنید")
      .int(),
    chargeId: z.coerce
      .number({
        message: "شارژ را انتخاب کنید",
      })
      .positive("شارژ را انتخاب کنید")
      .int(),
  });
  const medicinesList = z.array(
    mediciene.extend({
      count: z.coerce
        .number({
          message: "تعداد را انتخاب کنید",
        })
        .positive("تعداد را انتخاب کنید"),
    })
  );
  const packs = z.array(
    z.object({
      packId: z.coerce
        .number({
          message: "پک را انتخاب کنید",
        })
        .positive("پک را انتخاب کنید")
        .int(),
      medicines: z.array(mediciene),
    })
  );
  const otherOption = z.object({
    description: z
      .string({
        message: "توضیحات را وارد کنید",
      })
      .min(1, "توضیحات را وارد کنید"),
  });
  const dispatchOption = z.object({
    reason: z
      .string({
        message: "دلیل را وارد کنید",
      })
      .min(1, "دلیل را وارد کنید"),
  });
  const referralOption = z.object({
    reason: z
      .string({
        message: "دلیل را وارد کنید",
      })
      .min(1, "دلیل را وارد کنید"),
    expert: z
      .string({
        message: "متخصص را وارد کنید",
      })
      .min(1, "متخصص را وارد کنید"),
  });
  const formSchema = z
    .object({
      personalCode: z.string().optional(),
      guestUserId: z.coerce.number().positive().int().optional(),
      is_Emergency: z.boolean(),
      referral: referralOption.nullable().optional(),
      dispatch: dispatchOption.nullable().optional(),
      other: otherOption.nullable().optional(),
      packs,
      medicinesList,
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
      medicinesList: [],
      packs: [],
      is_Emergency: false,
      referral: undefined,
      dispatch: undefined,
      other: undefined,
    },
  });
  const medicinesOptionFormPart = useFieldArray({
    name: "medicinesList",
    control: rootForm.control,
  });
  const packsOptionFormPart = useFieldArray({
    name: "packs",
    control: rootForm.control,
  });
  useEffect(() => {
    (async () => {
      if (params.get("id")) {
        try {
          const id = params.get("id");
          const { data } = await axios.get<ApiResult>(`/PatientQueue/${id}`);
          rootForm.reset();
          if (data.data.guestUser) {
            setUserFullName(data.data.guestUser.fullName);
            rootForm.setValue("guestUserId", data.data.guestUser.id);
          } else {
            setUserFullName(data.data.user.fullName);
            rootForm.setValue("personalCode", data.data.user.personalCode);
          }
          rootForm.setValue("is_Emergency", data.data.is_Emergency);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [params]);
  useEffect(() => {
    (async () => {
      const [packsReq, medicinesReq] = await Promise.all([
        axios.get<ApiResult>("/pack"),
        axios.get<ApiResult>("/medicine"),
      ]);
      setListPacks(packsReq.data.data.packs);
      setMedicinesListState(medicinesReq.data.data.medicines);
    })();
  }, []);

  const onSubmit: SubmitHandler<FormSchemaType> = async (formData) => {
    try {
      let data: any = {};
      let state = 0;
      switch (tabValue) {
        case 0:
          data.reason = formData.dispatch?.reason;
          data.packs = formData.packs;
          data.medicines = formData.medicinesList;
          break;
        case 1:
          data.reason = formData.referral?.reason;
          data.expert = formData.referral?.expert;
          data.packs = formData.packs;
          data.medicines = formData.medicinesList;
          state = 1;
          break;
        case 2:
          data.packs = formData.packs;
          data.medicines = formData.medicinesList;
          state = 2;
          break;
        case 3:
          data.description = formData.other?.description;
          state = 3;
          break;
        default:
      }
      const req = await axios.post<ApiResult>("/Reception", {
        personalCode: formData.personalCode,
        guestUserId: formData.guestUserId,
        is_Emergency: formData.is_Emergency,
        state,
        receptionStateInfo: data,
      });
      invalidCache("patientList");
      setSnack({
        show: true,
        text: req.data.message,
        type: "success",
      });
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <DialogForm open={true} fullWidth maxWidth='lg'>
      <DialogTitle>{userFullName}</DialogTitle>
      <DialogContent>
        <FormProvider {...rootForm}>
          <Box component='form' onSubmit={rootForm.handleSubmit(onSubmit)}>
            {params.get("extra") && <ExtraInput />}
            <TabOption tabValue={tabValue} onChangeTab={setTabValue} />
            <Divider>دارو ها</Divider>
            <Button
              onClick={() => {
                medicinesOptionFormPart.append({
                  chargeId: 0,
                  count: 0,
                  MedicineId: 0,
                });
              }}
              color='secondary'
              sx={{
                mb : "1rem"
              }}
            >
              افزودن دارو
            </Button>
            <Grid container columnSpacing={5}>
              {medicinesOptionFormPart.fields.map((e, idx) => (
                <NestedMedicines
                  key={e.id}
                  control={rootForm.control}
                  index={idx}
                  field={e}
                  medicinesListState={medicinesListState}
                  onDelete={() => {
                    medicinesOptionFormPart.remove(idx);
                  }}
                />
              ))}
            </Grid>
            <Divider>پک ها</Divider>
            <Button
              onClick={() => {
                packsOptionFormPart.append({
                  packId: 0,
                  medicines: [],
                });
              }}
              color='secondary'
              sx={{
                mb : "1rem"
              }}
            >
              افزودن پک
            </Button>
            <Grid container columnSpacing={5}>
              {packsOptionFormPart.fields.map((e, idx) => (
                <NestedPacks
                  key={e.id}
                  control={rootForm.control}
                  index={idx}
                  field={e}
                  listPacks={listPacks}
                  onDelete={() => {
                    packsOptionFormPart.remove(idx);
                  }}
                />
              ))}
            </Grid>

            <Button sx={{ mt: "2rem" }} type='submit'>
              ارسال
            </Button>
          </Box>
        </FormProvider>
      </DialogContent>
    </DialogForm>
  );
};
export default DialogFormWrapper;
