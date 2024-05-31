import { Fragment, useEffect } from "react";
import {
  useFieldArray,
  useFormContext,
  useWatch,
  Controller,
} from "react-hook-form";
import Grid from "@mui/material/Unstable_Grid2";
import { Typography, MenuItem, TextField } from "@mui/material";

interface Props {
  index: number;
  medicines: any[];
}
export const NestedPacksItems = ({ index, medicines }: Props) => {
  const { formState, control, setValue } = useFormContext<any>();
  const packId = useWatch({
    control,
    name: `packs.${index}.packId`,
  });
  const medicinesOptions = useFieldArray({
    control,
    name: `packs.${index}.medicines`,
  });
  useEffect(() => {
    if (medicines) {
      medicines.map((e) => {
        medicinesOptions.append({
          MedicineId: e.id,
          chargeId: 0,
        });
      });
    }
  }, [medicines]);

  return (
    <Fragment>
      {medicinesOptions.fields.map((e, idx) => (
        <Fragment key={e.id}>
          <Grid
            xs={2}
            sx={{
              mb: "2rem",
              display : "flex",
              alignItems : 'center'
            }}
          >
            <Typography>{medicines[idx]?.name}</Typography>
          </Grid>
          <Grid
            xs={10}
            sx={{
              mb: "2rem",
              display : "flex",
              alignItems : 'center'
            }}
          >
            <Controller
              name={`packs.${index}.medicines.${idx}.chargeId`}
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  type='number'
                  label='شارژ'
                  error={
                    formState.errors.packs
                      ? !!(
                          formState.errors.packs[
                            index as any as keyof typeof formState.errors.packs
                          ] as any
                        )?.medicines[idx]?.chargeId
                      : false
                  }
                  helperText={
                    formState.errors.packs
                      ? (
                          formState.errors.packs[
                            index as any as keyof typeof formState.errors.packs
                          ] as any
                        )?.medicines[idx]?.chargeId?.message
                      : undefined
                  }
                  select
                  {...field}
                >
                  {medicines
                    .find((m: any) => m.id == e["MedicineId" as keyof typeof e])
                    ?.medicineCharges.map((option: any, idx: number) => (
                      <MenuItem key={idx} value={option.id}>
                        تعداد : {option.count} - تاریخ انقضا:{" "}
                        {option.expireDate}
                      </MenuItem>
                    ))}
                </TextField>
              )}
            />
          </Grid>
        </Fragment>
      ))}
    </Fragment>
  );
};
