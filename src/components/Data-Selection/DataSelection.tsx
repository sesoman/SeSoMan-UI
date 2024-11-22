import {  Box, Button, Checkbox,  CircularProgress,  FormControlLabel, FormGroup,Modal,Typography } from "@mui/material";
import React, {useEffect, useState } from "react";
import "./DataSelection.css";
import axios from "axios";
import * as jose from 'jose';
import { API_URL } from '../../config';
import { IRoutes } from "../../App";
import bitmedia from '../assets/sokrates.png';
import karriereassistant from '../assets/SchuelerkarriereLogo.jpg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight} from "@fortawesome/pro-light-svg-icons";




export const DataSelection = (props: IRoutes) =>{
    const [allowedBasic, setAllowedBasic] = useState<string[]>([]);
    const [allowedGrades, setAllowedGrades] = useState<string[]>([]);
    const [data, setData] = useState<any>();
    const [open, setOpen] = useState<boolean>(false);

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
    
    const getDataStructure =  async() =>{
        try{
          var obj = await axios.get('https://merlot.sokrates-r3.test.eduapp.at/api/consent_descriptor',{headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
            });
          setData(obj.data);
        }catch(e){
          console.error(e);
        }
      };
    

    useEffect(() =>{
        props.setIndex(2);
        if(!data){
            getDataStructure();
        }
        
    })

    const getProperyFromResouces = (prop: string) =>{
        var array : [string, string][] = [];
        data?.consent_list.map((entry: any) =>{
            if(entry.data_category.categorie_name === prop){
                Object.entries(entry.data_category.fields).forEach(([key,value]) =>{
                    var key_str = key as string;
                    var value_str = value as string;
                    array.push([key_str, value_str]);
                });
            }
        });
        return array;
    }
    
    const getBasicData = () =>{
        return getProperyFromResouces('Stammdaten');
    }

    const getGrades = () =>{
        return getProperyFromResouces('Grades');
    }

    const sendPost = async(jwt: string) =>{
        return axios.post('https://sesoman-backend-iwck.onrender.com/resource/add',{
            "JWT": jwt
        },{
            headers:{
                'Content-Type': 'application/json'
            }
        });
    }

    const getDate = () =>{
        const currentDate = new Date();
        const monthOptions: Intl.DateTimeFormatOptions = { month: 'long' };
        const month = currentDate.toLocaleString('en-US', monthOptions);

        const dayOptions: Intl.DateTimeFormatOptions = { day: 'numeric' };
        const day = currentDate.toLocaleString('en-US', dayOptions);

        const year = currentDate.getFullYear();

        // Get the weekday in letters
        const weekdayOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
        const weekday = currentDate.toLocaleString('en-US', weekdayOptions);

        const hour = currentDate.getHours();
        const minutes = currentDate.getMinutes();

        return(`${month}, ${weekday} ${day}, ${year} ${hour}:${minutes}`);
    }

    const addEntryBasic = (entry: string) => {
        // Check if the entry already exists in the state
        if (!allowedBasic.includes(entry)) {
          // If the entry does not exist, add it to the state
          setAllowedBasic(prevState => [...prevState, entry]);
        }
      };

      const addEntryGrades = (entry: string) => {
        // Check if the entry already exists in the state
        if (!allowedGrades.includes(entry)) {
          // If the entry does not exist, add it to the state
          setAllowedGrades(prevState => [...prevState, entry]);
        }
      };

    
    const signJSON = async() =>{
        const secret = new TextEncoder().encode(API_URL);
        const alg = 'HS256';
        const jwt = await new jose.SignJWT({
            "Sokrates_Credentials": {
                'JWT': data.callback.Bearer,
                "URL": data.callback.URL
            },
            "Data_Selection":{
                "Stammdaten": allowedBasic,
                "Grades": allowedGrades
            },
            "Calling_Service": data.callback.Calling_Service,
            "Target_Service": data.callback.Target_Service,
            "Date": getDate(),
        })
        .setProtectedHeader({ alg })
        .setIssuer('https://sesoman-backend.onrender.com')
        .setAudience('Signed JSON for SK')
        .sign(secret);

        await sendPost(jwt);
        window.open(`https://karriereassistent.schuelerkarriere.de/auth/callback?token=${jwt}`, "_self")
    }

  
    return data == undefined ? <CircularProgress /> :(
        <div className='info'>
            <Typography className="title-match">
                We found a match!
            </Typography>
            <Typography>
                <div className='img-container'>
                    <img className='img_logo' src={bitmedia}/>
                    <FontAwesomeIcon color="#5a04bd" className="arrow-right" size={'4x'} icon={faArrowRight}/>
                    <img className='img_logo' src={karriereassistant}/>
                </div>
            </Typography>
            <Typography className='share-hint' fontSize={16}>
                Bitmedia can share the following data with Schuelerkarriere:
            </Typography>
            <div className='data-wrapper'>
                <div className='section-1'>
                    <Typography>
                        Basic Information
                    </Typography>
                    <div className='basic-data'>{
                        getBasicData().map((entry) =>
                            <FormGroup className="checkbox" >
                                <FormControlLabel className='checkbox'  control={<Checkbox size="small" onChange={() =>{addEntryBasic(entry[0])}}/>} label={entry[1]}  />
                            </FormGroup>
                        )}
                    </div>
                </div>
                <div className='section-2'>
                    <Typography>
                        Grades
                    </Typography>
                    <div className='grades'>
                        {getGrades().map((entry) =>
                            <FormGroup className="checkbox">
                                <FormControlLabel className='checkbox'  control={<Checkbox size="small" onChange={() =>{addEntryGrades(entry[0])}}/>} label={entry[1]}/>
                            </FormGroup>
                        )}
                    </div>
                </div>
            </div>
            <Button onClick={() =>{setOpen(true);}} size="small" variant="contained" className="transfer-btn">
                Transfer data
            </Button>
            <Modal
                open={open}
                onClose={() =>{setOpen(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Transfer Data notification
                  </Typography>
                  <Typography id="modal-modal-description" fontSize={15} sx={{ mt: 2 }}>
                    Are you sure you want to transfer the selected data?  Once confirmed, you will be redirected to Schülerkarriere
                  </Typography>
                  <div style={{display: 'flex', justifyContent: 'flex-start', marginTop: '15px'}}>
                    <Button sx={{backgroundColor: '#5a04bd', color: 'white', '&:hover':{backgroundColor: '#5a04bd'}}} size='small' variant="contained" onClick={() => {signJSON();}}>Confirm</Button>
                    <Button sx={{marginLeft: '10px', backgroundColor: '#5a04bd', '&:hover':{backgroundColor: '#5a04bd'}}} size='small' variant="contained" onClick={() => {setOpen(false);}}>Cancel</Button>
                  </div>
                </Box>
            </Modal>
        </div> 
    );
}