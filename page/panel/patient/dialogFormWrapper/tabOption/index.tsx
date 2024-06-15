import { selectedUser } from "@/atom";
import { CustomTabPanel, TabContainer } from "@/components";
import useApi from "@/hooks/useApi";
import { ApiResult } from "@/interface";
import {
  Alert,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useAtom } from "jotai";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
interface Props {
  tabValue: number;
  onChangeTab: Dispatch<SetStateAction<number>>;
}
export const TabOption = ({ tabValue, onChangeTab }: Props) => {
  const { setValue, formState, control } = useFormContext<any>();
  const [history, setHistory] = useState<any[]>([]);
  const [_selectedUser, _] = useAtom(selectedUser);
  const axios = useApi();
  useEffect(() => {
    switch (tabValue) {
      case 0:
        setValue("dispatch", undefined);
        setValue("referral", undefined);
        setValue("other", undefined);
        break;
      case 1:
        setValue("dispatch", {
          reason: "",
        });
        setValue("referral", undefined);
        setValue("other", undefined);
        break;
      case 2:
        setValue("dispatch", undefined);
        setValue("referral", {
          reason: "",
          expert: "",
        });
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
  useEffect(() => {
    (async () => {
      const params = new URLSearchParams();
      if (_selectedUser.type == "locale")
        params.set("userId", `${_selectedUser.id}`);
      else params.set("guestUserId", `${_selectedUser.id}`);
      const req = await axios.get<ApiResult>(
        `/PatientPrescription/GetUserPrescriptions?${params.toString()}`
      );
      setHistory(req.data.data as any[]);
    })();
  }, [_selectedUser]);
  return (
    <Fragment>
      <TabContainer
        columns={["تجویز", "اعزام", "ارجاع", "سایر", "اقدامات انجام شده"]}
        setValue={onChangeTab}
        value={tabValue}
        sx={{
          mb: "2rem",
        }}
      >
        <CustomTabPanel value={tabValue} index={0}>
          <Alert severity='info'>
            برای تجویز شما میتوانید مستقیما دارو ها را برای بیمار تعریف کنید
          </Alert>
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
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
        <CustomTabPanel value={tabValue} index={1}>
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
        <CustomTabPanel value={tabValue} index={4}>
          {history.length == 0 ? (
            <Alert severity='info'>اطلاعاتی یافت نشد</Alert>
          ) : (
            <List>
              {history.map((e) =>
                e.map((e: any, idx: number) => (
                  <ListItem disablePadding key={idx}>
                    <ListItemButton>
                      <ListItemText
                        primary={`${
                          e.packId
                            ? `نام پک : ${e.packName}`
                            : `نام دارو : ${e.medicineName}`
                        } - تاریخ : ${e.prescriptionDate} ${e.medicineId ? `- تعداد : ${e.count}` : ``}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              )}
            </List>
          )}
        </CustomTabPanel>
      </TabContainer>
    </Fragment>
  );
};
