
import { Fragment } from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import { Item } from "./Item";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import LocalHotelIcon from '@mui/icons-material/LocalHotel';
export const Items = () => {
  return (
    <Fragment>
      <Toolbar />
      <Divider />
      <List>
        <Item href="/panel/medicine" title='دارو ها' icon={<VaccinesIcon />} />
        <Item href="/panel/patient" title='بیماران' icon={<LocalHotelIcon />} />
        
      </List>
    </Fragment>
  );
};
