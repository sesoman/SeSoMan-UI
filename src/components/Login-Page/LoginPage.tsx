import React, { useEffect, useState } from "react";
import "./LoginPage.css"
import { Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import bitmedia from '../assets/sokrates.png';
import karriereassistant from '../assets/SchuelerkarriereLogo.jpg';
import { useHistory } from 'react-router-dom';
import { IRoutes } from "../../App";


export const LoginPage = (props: IRoutes) =>{
    const url: {service: string} = useParams();
    const [img, setImg] = useState<string>();
    const [text, setText] = useState<any>();
    const history = useHistory();

    const handleClick = () => {
        if(url.service === 'bitmedia_mit'){
            window.open('https://merlot.sokrates-r3.test.eduapp.at/sesoman', '_self');
        }else if (url.service === 'karriereassistant'){
            history.push('/privacy-notice');
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
        }else if(url.service === 'karriereassistant'){
            setImg(karriereassistant);
            setText(karriereStatement());
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
                        You are about to login with your SeSoMan account to the following service
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