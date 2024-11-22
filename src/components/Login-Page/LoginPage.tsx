import React, { useEffect, useState } from "react";
import "./LoginPage.css"
import { Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import bitmedia from '../assets/sokrates.png';
import karriereassistant from '../assets/SchuelerkarriereLogo.jpg';
import hpi from '../assets/openHPI-Logo.jpg';
import awsi from '../assets/AWSi.svg';
import { useHistory } from 'react-router-dom';
import { IRoutes } from "../../App";
import axios from "axios";
import { deleteAllTransferData } from "../restApi/restApi";


export const LoginPage = (props: IRoutes) =>{
    const url: {service: string} = useParams();
    const [img, setImg] = useState<string>();
    const [text, setText] = useState<any>();
    const history = useHistory();
    const [standardText, setStandardText] = useState<string>('You are about to login with your SeSoMan account to the following service');
    const [userId, setUserId] = useState('');
    const handleClick = () => {
        if(url.service === 'bitmedia_mit'){
            window.open('https://merlot.sokrates-r3.test.eduapp.at/sesoman', '_self');
        }else if(url.service === 'hpi'){
            history.push('/data-protection-statement/hpi');
            //window.open('http://82.165.96.249/profile/', '_self');
        }else if (url.service === 'awsi'){
            history.push('/data-protection-statement/awsi?userId=' + userId);
        }else if (url.service === 'karriereassistant'){
            history.push('/privacy-notice');
        }
        
    };

    useEffect(() => {
        const params = window.location.hash.split('userid=')[1];
        setUserId(params ||'');
      }, []);

    useEffect(()=>{
        props.setIndex(0);
        if(url.service === 'bitmedia_mit'){
            setImg(bitmedia);
            setText('Do you want to continue?');
            if(props.setShow){
                props.setShow(false);
            }
        }else if(url.service === 'karriereassistant'){
            setImg(karriereassistant);
            setText(karriereStatement());
        }else if(url.service === 'hpi'){
            setImg(hpi);
            setText('Do you want to continue?');
            if(props.setShow && props.setSteps){
                props.setSteps(['Login Confirmation','Privacy Notice '])
            }
        }else if (url.service === 'awsi'){
            setImg(awsi);
            setStandardText('You are about to connect your SeSoMan Cloud Storage to the following service')
            if(props.setShow && props.setSteps){
                props.setShow(true);
                props.setSteps(['Login Confirmation','Privacy Notice '])
            }
        }
    },[])

    const karriereStatement = () =>{
        return(
            <div>
                <Typography fontSize={16}>
                Schülerkarriere doesn’t know you yet!
                </Typography>
                <p></p>
                <Typography fontSize={16}>
                If you authorize logging in with your SeSoMan account, Schülerkarriere can recognize you next time you login.
                </Typography>
                <p></p>
                <Typography fontSize={16}>
                Schülerkarriere can also contact you if some functions of the service you use require your consent.
                </Typography>
                <p></p>
                <Typography fontSize={16}>
                Do you agree to proceed with SeSoMan login?
                </Typography>
            </div>
        )
    }


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