"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { CreateGuestUser, CustomTabPanel, TabContainer } from "@/components";
import { Autocomplete, TextField } from "@mui/material";
import useApi from "@/hooks/useApi";
import { ApiResult } from "@/interface";
export const ExtraInput = () => {
  const [value, setValue] = useState<number>(0);
  const { control, formState } = useFormContext<any>();
  const [data, setData] = useState<{label : string , id : string}[]>([]);
  const axios = useApi()
  useEffect(() => {
    (async () => {
      const req = await axios.get<ApiResult>("/User?TakeEntity=9999")
      setData(req.data.data.map((e : any) => ({
        label: `${e.personalCode} - ${e.name +' '+ e.family} - ${e.nationalCode}`,
        id : e.personalCode,
      })))
    })();
  }, []);
  return (
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
              options={data}
              fullWidth
              value={field.value}
              onChange={(e, newValue : any) => {
                field.onChange(newValue.id);
              }}
              renderInput={(params) => (
                <TextField
                  error={!!formState.errors.personalCode}
                  helperText={(formState.errors as any).personalCode?.message}
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
  );
};
