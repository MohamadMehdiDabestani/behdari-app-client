import { Button, MenuItem, TextField } from "@mui/material";
import { Fragment, useEffect } from "react";
import {
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
  useWatch,
  useFormContext,
} from "react-hook-form";
import Grid from "@mui/material/Unstable_Grid2";

export const NestedMedicines = ({
  control,
  index,
  field,
  medicinesListState,
  onDelete
}: any) => {
  const { formState , setValue } = useFormContext<any>();
  const value = useWatch({
    name: `medicinesList.${index}.MedicineId`,
    control,
  });
  useEffect(() => {
    if(value > 0){
        setValue(`medicinesList.${index}.chargeId` , 0)
    }
  } , [value])
  return (
    <Fragment>
      <Grid xs={12} md={4}>
        <Controller
          name={`medicinesList.${index}.MedicineId`}
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              type='number'
              select
              label='دارو'
              error={
                formState.errors.medicinesList
                  ? !!(
                      formState.errors.medicinesList[
                        index as keyof typeof formState.errors.medicinesList
                      ] as any
                    )?.MedicineId
                  : false
              }
              helperText={
                formState.errors.medicinesList
                  ? (
                      formState.errors.medicinesList[
                        index as keyof typeof formState.errors.medicinesList
                      ] as any
                    )?.MedicineId?.message
                  : undefined
              }
              {...field}
              sx={{
                mb: "2rem",
              }}
            >
              {medicinesListState.map((option: any, idx: number) => (
                <MenuItem key={idx} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Grid>
      <Grid xs={12} md={4}>
        <Controller
          name={`medicinesList.${index}.chargeId`}
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              type='number'
              label='شارژ'
              error={
                formState.errors.medicinesList
                  ? !!(formState.errors.medicinesList[index as keyof typeof formState.errors.medicinesList] as any)?.chargeId
                  : false
              }
              helperText={
                formState.errors.medicinesList
                  ? (formState.errors.medicinesList[index as keyof typeof formState.errors.medicinesList] as any)?.chargeId?.message
                  : undefined
              }
              select
              {...field}
              sx={{
                mb: "2rem",
              }}
            >
              {medicinesListState
                .find(
                  (m : any) => m.id == value
                )
                ?.medicineCharges.map((option: any, idx: number) => (
                  <MenuItem key={idx} value={option.id}>
                    تعداد : {option.count} - تاریخ انقضا: {option.expireDate}
                  </MenuItem>
                ))}
            </TextField>
          )}
        />
      </Grid>
      <Grid xs={11} md={3}>
        <Controller
          name={`medicinesList.${index}.count`}
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              type='number'
              label='تعداد'
              error={
                formState.errors.medicinesList
                  ? !!(formState.errors.medicinesList[index as keyof typeof formState.errors.medicinesList] as any)?.count
                  : false
              }
              helperText={
                formState.errors.medicinesList
                  ? (formState.errors.medicinesList[index as keyof typeof formState.errors.medicinesList] as any)?.count?.message
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
      <Grid xs={1}>
        <Button onClick={onDelete} color="error">حذف</Button>
      </Grid>
    </Fragment>
  );
};
