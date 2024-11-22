import React, { useEffect, useState } from "react";
import {
  Toolbar,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Card,
  CardContent,
  Box,
  Fab,
  Modal,
  Button,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ScanIcon from "@mui/icons-material/CropFree";
import BadgeIcon from "@mui/icons-material/Badge";
import { getAllCredentials } from "../restApi/serviceHandler";
import { useHistory, useLocation } from "react-router-dom";

export interface Credential {
  id: number;
  title: string;
  type: string;
  attributes: { label: string; value: string }[];
}

const CredentialsPage = (props: any) => {
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [credentials, setCredentialData] = useState<Credential[]>([]);
  const [value, setValue] = useState("credentials");
  const history = useHistory();
  const [visibleAttributes, setVisibleAttributes] = useState<{ [key: number]: boolean }>({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [init, setInit] = useState<boolean>(false);

  const toggleVisibility = (index: number) => {
    setVisibleAttributes((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle visibility for the attribute
    }));
  };

  const handleCardClick = (credential: Credential) => {
    setSelectedCredential(credential);
  };

  const handleCloseModal = () => {
    setSelectedCredential(null);
  };

  useEffect(() =>{
    if(props.setShow){
        props.setShow(false);
    }
    if(init === false){
        getAllCredentials(setCredentialData);
        setInit(true);
    }
    
  },[init]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: '75%',
        margin: '0 auto'
      }}
    >
      {/* App Bar */}
      
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, textAlign: "start" }}>
            Credentials
          </Typography>
        </Toolbar>

      {/* Credential Cards */}
      <Box style={{ flexGrow: 1, padding: "16px" }}>
        {credentials.map((credential) => (
          <Card
            key={credentials.indexOf(credential)}
            style={{ marginBottom: "16px", backgroundColor: "#f4f4f9", cursor: "pointer" }}
            onClick={() => handleCardClick(credential)}
          >
            <CardContent style={{ display: "flex", alignItems: "center" }}>
              <Box
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  marginRight: "16px",
                }}
              >
                {credential.title[0]}
              </Box>
              <div style={{ flex: 1 }}>
                <Typography variant="subtitle1" style={{ color: "#5a04bd" }}>
                  {credential.title}
                </Typography>
                <Typography variant="body2" style={{ color: "#333333" }}>
                  {credential.type}
                </Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="scan"
        style={{
          position: "fixed",
          bottom: "80px",
          right: "16px",
          backgroundColor: "#1e88e5",
        }}
      >
        <ScanIcon />
      </Fab>

      <BottomNavigation
    value={value}
    onChange={(event, newValue) => {
        if(newValue === 'home'){
            setValue(newValue);
            history.push('/' + queryParams.get('path') + '?threadId=' + queryParams.get('threadId') + '&redirectTo=' + queryParams.get('redirectTo'))
        }else if(newValue === 'credentials'){
            setValue(newValue);
            history.push('/credentials-page?threadId='+ queryParams.get('threadId') + '&redirectTo=' + queryParams.get('redirectTo') + "&path=" + queryParams.get('path'))
        }
        
    }}
    style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#5a04bd",
      boxShadow: "0px -2px 12px rgba(0, 0, 0, 0.1)",
    }}
  >
    <BottomNavigationAction
      label="Home"
      value="home"
      icon={<HomeIcon />}
      style={{ color: value === "home" ? "#b2f8d6" : "white" }}
    />
    <BottomNavigationAction
      label="Credentials"
      value="credentials"
      icon={<BadgeIcon />}
      style={{ color: value === "credentials" ? "#b2f8d6" : "white" }}
    />
  </BottomNavigation>

      {/* Credential Modal */}
      {selectedCredential && (
 <Modal open={Boolean(selectedCredential)} onClose={handleCloseModal}>
 <Box
   style={{
     position: "absolute",
     top: "50%",
     left: "50%",
     transform: "translate(-50%, -50%)",
     backgroundColor: "white",
     borderRadius: "8px",
     padding: "24px",
     width: "90%",
     maxWidth: "500px",
     boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
     overflowY: "auto",
     maxHeight: "90vh",
   }}
 >
   <Typography
     variant="h6"
     style={{
       backgroundColor: "#5a04bd",
       color: "white",
       padding: "16px",
       borderRadius: "4px",
       marginBottom: "16px",
       textAlign: "center",
       fontSize: "18px",
     }}
   >
     {selectedCredential.title}
   </Typography>
   {selectedCredential.attributes.map((attr: any, index: number) => (
     <Box
       key={index}
       style={{
         marginBottom: "12px",
         display: "flex",
         flexDirection: "column",
         alignItems: "flex-start",
         gap: "4px",
       }}
     >
       <Typography
         variant="body1"
         style={{
           fontWeight: "bold",
           color: "#5a04bd",
           fontSize: "14px",
           wordWrap: "break-word",
         }}
       >
         {attr.name}
       </Typography>
       <Typography
         variant="body2"
         style={{
           fontSize: "13px",
           color: "#333",
           wordWrap: "break-word",
           overflow: "hidden",
           textOverflow: "ellipsis",
           whiteSpace: "nowrap",
           width: "100%",
         }}
         title={visibleAttributes[index] ? attr.value : "******"}
       >
         {visibleAttributes[index]
           ? attr.value
           : "*".repeat(attr.value.length)} {/* Mask or show value */}
       </Typography>
       <Button
         variant="text"
         style={{
           color: "#5a04bd",
           fontSize: "12px",
           alignSelf: "flex-end",
         }}
         onClick={() => toggleVisibility(index)}
       >
         {visibleAttributes[index] ? "Hide" : "Unhide"} {/* Toggle button text */}
       </Button>
     </Box>
   ))}
   <Button
     fullWidth
     variant="contained"
     color="primary"
     onClick={handleCloseModal}
     style={{ marginTop: "16px", backgroundColor: "#5a04bd" }}
   >
     Close
   </Button>
 </Box>
</Modal>
)}

    </div>
  );
};

export default CredentialsPage;
