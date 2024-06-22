
import { Fragment } from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import { Item } from "./Item";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import AssessmentIcon from '@mui/icons-material/Assessment';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import EarbudsIcon from '@mui/icons-material/Earbuds';
export const Items = () => {
  return (
    <Fragment>
      <Toolbar />
      <Divider />

      <List>
        <Item href="/panel/accounts" title='مدیریت کاربران' icon={<SupervisedUserCircleIcon />} />
      </List>
      <Divider />
      <List>
        <Item href="/panel/medicine" title='دارو ها' icon={<VaccinesIcon />} />
        {/* <Item href="/panel/pack" title='پک ها' icon={<MedicalServicesIcon />} /> */}
      </List>
      <Divider />

      <List>
        <Item href="/panel/patient" title='لیست پذیرش' icon={<EarbudsIcon />} />
      </List>

      <Divider />
      <List>
        <Item href="/panel/report" title='گزارشات' icon={<AssessmentIcon />} />
      </List>
    </Fragment>
  );
};
