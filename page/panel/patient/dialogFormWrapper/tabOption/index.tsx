import { CustomTabPanel, TabContainer } from "@/components";
import { Alert, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
interface Props {
  tabValue: number;
  onChangeTab: Dispatch<SetStateAction<number>>;
}
export const TabOption = ({ tabValue, onChangeTab }: Props) => {
  const { setValue, formState, control } = useFormContext<any>();
  useEffect(() => {
    switch (tabValue) {
      case 0:
        setValue("dispatch", {
          reason: "",
        });
        setValue("referral", undefined);
        setValue("other", undefined);
        break;
      case 1:
        setValue("dispatch", undefined);
        setValue("referral", {
          reason: "",
          expert: "",
        });
        setValue("other", undefined);
        break;
      case 2:
        setValue("dispatch", undefined);
        setValue("referral", undefined);
        setValue("other", undefined);
        break;
      case 3:
        setValue("dispatch", undefined);
        setValue("referral", undefined);
        setValue("other", {
          description: "",
        });
        break;
      default:
    }
  }, [tabValue]);
  return (
    <Fragment>
      <TabContainer
        columns={["اعزام", "ارجاع", "تجویز", "سایر"]}
        setValue={onChangeTab}
        value={tabValue}
        sx={{
          mb: "2rem",
        }}
      >
        <CustomTabPanel value={tabValue} index={0}>
          <Controller
            name='dispatch.reason'
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label='دلیل'
                error={!!(formState.errors as any).dispatch?.reason}
                helperText={(formState.errors as any).dispatch?.reason?.message}
                {...field}
                sx={{
                  mb: "2rem",
                }}
              />
            )}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <Controller
            name='referral.reason'
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label='دلیل'
                error={!!(formState.errors as any).referral?.reason}
                helperText={(formState.errors as any).referral?.reason?.message}
                {...field}
                sx={{
                  mb: "2rem",
                }}
              />
            )}
          />
          <Controller
            name='referral.expert'
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label='متخصص'
                error={!!(formState.errors as any).referral?.expert}
                helperText={(formState.errors as any).referral?.expert?.message}
                {...field}
                sx={{
                  mb: "2rem",
                }}
              />
            )}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
            <Alert  severity="info" >برای تجویز شما میتوانید مستقیما دارو ها را برای بیمار تعریف کنید</Alert>
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={3}>
          <Controller
            name='other.description'
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label='توضیحات'
                error={!!(formState.errors as any).other?.description}
                helperText={
                  (formState.errors as any).other?.description?.message
                }
                {...field}
                sx={{
                  mb: "2rem",
                }}
              />
            )}
          />
        </CustomTabPanel>
      </TabContainer>
    </Fragment>
  );
};
