import React, { useState } from "react";
import AppContainer from "../../common/AppContainer";
import { Grid } from "@mui/material";
import { IPaymentDetails } from "../../../shared/interfaces/payment.interface";

const Failed = () => {
  const [paymentDetails, setPaymentDetails] = useState<IPaymentDetails>({
    id: null,
    name: "",
    startDate: "",
    cost: "",
  });

  return (
    <AppContainer
      back="/app/dashboard"
      label={`Transaction: ${paymentDetails.id}`}
      navbar
    >
      <Grid container>
        <Grid item xs={12} sx={{ fontSize: 25, fontWeight: 700, color: "red" }}>
          Failed
        </Grid>
      </Grid>
    </AppContainer>
  );
};

export default Failed;
