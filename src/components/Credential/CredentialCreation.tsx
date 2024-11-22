import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Modal,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IRoutes } from "../../App";
import { acceptCredentialOffer, acceptProofRequestCred, fetchCredential, getCredential } from "../restApi/serviceHandler";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { acceptProofRequest } from "../restApi/restApi";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import BadgeIcon from "@mui/icons-material/Badge";

export interface ICredential{
  credentialId: string,
  email: string
}

export const CredentialCreation = (props: IRoutes) => {
    const [credential, setCredential] = useState<any>();
    const [credentialId, setCredentialId] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [title, setTitle] = useState<string>('');
    const [value, setValue] = useState("home");
    const [path, setPath] = useState<string>('');
    const history = useHistory();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewClick = () => {
        setIsModalOpen(true);
      };
    
      const handleClose = () => {
        setIsModalOpen(false);
      };
    
      const handleAccept = () => {
        if(props.credTypes=== 'New Credential Offer'){
          console.log("Accepted");
          var data: ICredential ={
            credentialId: credentialId,
            email: email
          }
          acceptCredentialOffer(credentialId, data, queryParams.get('redirectTo') || '');
        }else{
          acceptProofRequestCred(queryParams.get('threadId') || '', queryParams.get('redirectTo') || '');
          setIsModalOpen(false);
        }
        
      };
    
      const handleDecline = () => {
        console.log("Declined");
        setIsModalOpen(false);
      };

    useEffect(() =>{
        if(props.credTypes === 'New Credential Offer'){
          fetchCredential(queryParams.get('threadId') || '', setCredentialId, setCredential);
          setTitle("Credential Offer");
          setPath('credential-creation');
        }else if(props.credTypes === 'New Proof Request'){
          getCredential(setCredential)
          setTitle("Credential Request");
          setPath('credential-presentation');
          
        }
        
        props.setIndex(0);
        if(props.setShow){
            props.setShow(false);
        }
    }, [])
        useEffect(() =>{
            setEmail(credential?.offerMessage?.credential_preview?.attributes[8].value)
        }, [credential])

   
        return (
          <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
  {/* Header */}
  <Typography
    variant="h6"
    gutterBottom
    style={{
      fontWeight: 600,
      marginBottom: "16px",
      color: "#5a04bd",
      textAlign: "left",
    }}
  >
    Notifications (1)
  </Typography>

  {/* Notification Card */}
  <Card
    style={{
      marginBottom: "20px",
      borderRadius: "12px",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    }}
  >
    <CardContent style={{ display: "flex", alignItems: "center", padding: "20px" }}>
      <div style={{ flexGrow: 1 }}>
        <Typography
          variant="subtitle1"
          style={{
            fontWeight: 600,
            fontSize: "1rem",
            color: "#3f51b5",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {props?.credTypes || "Unknown Credential"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Credential
        </Typography>
      </div>
      <Button
        variant="contained"
        onClick={handleViewClick}
        style={{
          borderRadius: "20px",
          textTransform: "none",
          fontSize: "0.875rem",
          backgroundColor:"#5a04bd" 
        }}
      >
        View
      </Button>
    </CardContent>
  </Card>

  {/* SSI Image Section */}
  <div style={{ marginBottom: "20px", textAlign: "center" }}>

    <Typography
      variant="body2"
      style={{
        marginTop: "10px",
        color: "#5a04bd",
        fontStyle: "italic",
      }}
    >
      SSI empowers individuals with control over their personal data and digital identity.
    </Typography>
  </div>

  {/* Modal */}
  <Modal open={isModalOpen} onClose={handleClose}>
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        maxWidth: "500px",
        maxHeight: "90vh",
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.2)",
        overflowY: "auto",
      }}
    >
      {/* Close Icon */}
      <IconButton
        aria-label="close"
        onClick={handleClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          color: "#f44336",
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Modal Content */}
      <Typography
        variant="h5"
        gutterBottom
        style={{
          fontWeight: 600,
          fontSize: "1.25rem",
          marginBottom: "20px",
          color: "#5a04bd",
        }}
      >
        {title || "Credential Details"}
      </Typography>
      <div style={{ marginBottom: "16px" }}>
        {credential?.offerMessage?.credential_preview.attributes?.map((obj: any) => (
          <div
            key={obj.name}
            style={{
              marginBottom: "12px",
              padding: "8px 12px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              wordWrap: "break-word",
            }}
          >
            <Typography
              variant="body1"
              style={{
                fontWeight: 500,
                fontSize: "0.9rem",
                color: "#5a04bd",
              }}
            >
              <strong>{obj.name}:</strong> 
            </Typography>
            <p>{obj.value}</p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        <Button
          variant="contained"
          
          onClick={handleAccept}
          style={{
            flex: 1,
            textTransform: "none",
            fontSize: "0.9rem",
            padding: "10px 16px",
            backgroundColor:"#5a04bd"
          }}
        >
          Accept
        </Button>
        <Button
          variant="outlined"
          onClick={handleDecline}
          style={{
            flex: 1,
            textTransform: "none",
            fontSize: "0.9rem",
            padding: "10px 16px",
            color:"#5a04bd"
          }}
        >
          Decline
        </Button>
      </div>
    </div>
  </Modal>

  {/* Bottom Navigation */}
  <BottomNavigation
    value={value}
    onChange={(event, newValue) => {
      if(newValue === 'home' && path){
        setValue(newValue)
        history.push('/' + path + '?threadId=' + queryParams.get('threadId') + '&redirectTo=' + queryParams.get('redirectTo'))
      }else if(newValue === 'credentials' && path){
        setValue(newValue)
        history.push('/credentials-page?threadId='+ queryParams.get('threadId') + '&redirectTo=' + queryParams.get('redirectTo') + '&path=' + path)
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
</div>);
};
