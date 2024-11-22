import React, { useEffect, useState } from "react";
import "./Invitation.css"
import { Button, Typography } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import bitmedia from '../assets/sokrates.png';
import { IRoutes } from "../../App";
import axios from "axios";

interface Invitation {
   invitationUrl: string,
   autoAcceptConnection: boolean
  }


export const Invitation = (props: IRoutes) =>{
    const url: {service: string} = useParams();
    const [img, setImg] = useState<string>();
    const [text, setText] = useState<any>();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [standardText, setStandardText] = useState<string>('You are about to connect your SeSoMan account to the following service');

    const handleClick = async () => {
        if(url.service === 'bitmedia_mit'){
            var requestData: Invitation = {
                invitationUrl: queryParams.get('token') || '',
                autoAcceptConnection: true
            }
            try{
                const response  = await axios.post('https://ocm.dev.merlot-education.eu/connection/v1/accept-connection-invitation', requestData, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if(response.status === 202){
                    window.open(queryParams.get('redirectTo') || '', '_self');
                }

            }catch(error){
                if (axios.isAxiosError(error)) {
                    console.error('error:', error.response?.data || error.message);
                }else {
                    console.error('Unexpected error:', error);
                }
                setStandardText("Error during connection. Please try again later!")
            }
            
            
        }
    };

    useEffect(()=>{
        props.setIndex(0);
        if(url.service === 'bitmedia_mit'){
            setImg(bitmedia);
            setText('Do you want to continue?');
            if(props.setShow){
                props.setShow(false);
            }
        }
    },[])



    return(
        <div className="login-wrapper">
            <div className="hint-section">
                    <Typography   fontSize={16}> 
                        {standardText}
                    </Typography>

                    <img className='service_logo' src={img}/>

                    <div className="q-mark">
                        {text}
                    </div>
                <div className='btn-container'>
                    <Button onClick={handleClick} className="yes-btn" size="small" variant="contained">Yes</Button>
                    <Button className="no-btn" size="small" variant="outlined">No</Button>
                </div>
            </div>
           
        </div>
    );
}