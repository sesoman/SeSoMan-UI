import React, { useEffect, useState } from "react";
import { Box, Modal, Typography, TextField, Button, Grid } from "@mui/material";

// Styling for the modal
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ConsentReceiptModal = (props: any) => {
  
  const [formData, setFormData] = useState({
    userId: "",
    consentDate: "",
    ipAddress: "",
    consentType: "",
    proof: "",
  });

  const [data, setData] = useState<any>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Consent Receipt:", formData);
    props.handleClose();
  };

  useEffect(() =>{
    console.log(props?.data)
    if(props?.data){
      setData(props?.data);
    }
  },[props?.data])

  return (
    <div>
      <Modal open={props.open} onClose={props.handleClose} aria-labelledby="consent-modal-title">
        <Box sx={style}>
          <Typography id="consent-modal-title" variant="h6" component="h2" gutterBottom>
            Consent Receipt
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
                <div style={{display: 'flex', alignItems: 'center'}}><Typography sx={{marginRight: '2px'}} fontSize={15}><b>Provider:</b></Typography><Typography fontSize={14}>{data?.holder === 'SeSoMan' ?  "HPI" : "SeSoMan"}</Typography></div>
                <div style={{display: 'flex', alignItems: 'center'}}><Typography sx={{marginRight: '2px'}} fontSize={15}><b>Data Source:</b></Typography><Typography fontSize={14}>{"HPI"}</Typography></div>
                <div style={{display: 'flex', alignItems: 'center'}}><Typography sx={{marginRight: '2px'}} fontSize={15}><b>Consumer:</b></Typography><Typography fontSize={14}>{data?.holder.toLowerCase() === 'awsi' ? "AWSi" : 'SeSoMan'}</Typography></div>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{position: 'relative'}} fontSize={14}><b>Legal Base:</b> Consent</Typography>
                <Typography sx={{position: 'relative' }} fontSize={14}><b>Status:</b> Allowed</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{position: 'relative', top: '15px'}} fontSize={15}><b>You provided this data:</b></Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography fontSize={14}><b>Courses</b></Typography>
                <ul style={{}}>
                    {data?.courses?.map((entry: any) =>
                        <li key={entry.title}>
                            <Typography fontSize={13}>
                                {entry.title} - {entry.date}
                            </Typography>
                        </li>
                    )}
                </ul>
            </Grid>
            <Grid item xs={12}>
              <Button sx={{backgroundColor: '#5a04bd'}} variant="contained" fullWidth onClick={handleSubmit}>
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default ConsentReceiptModal;