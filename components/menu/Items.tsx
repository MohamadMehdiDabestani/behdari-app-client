
import { Fragment } from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import { Item } from "./Item";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import LocalHotelIcon from '@mui/icons-material/LocalHotel';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
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
        <Item href="/panel/patient" title='بیماران' icon={<LocalHotelIcon />} />
        <Item href="/panel/pack" title='پک ها' icon={<MedicalServicesIcon />} />
      </List>
    </Fragment>
  );
};
