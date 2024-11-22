import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { CardT } from "./CardT";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faLongArrowAltRight } from "@fortawesome/pro-light-svg-icons";
import { Box, Button, IconButton, Modal, Paper, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import bitmedia from '../assets/sokrates.png';
import karriereassistant from '../assets/SchuelerkarriereLogo.jpg';
import hpi from '../assets/HPI.jpg';
import awsi from '../assets/AWSi.svg';
import imc from '../assets/IMC.png';
import headai from '../assets/Headai.png';
import lightcast from '../assets/lightcast.png';
import openteach from '../assets/OpenTeach.png';
import resources from './../../Resources.json';
import { useHistory } from "react-router-dom";



export const Dashboard = (props: any) =>{
    const [open, setOpen] = useState<boolean[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [target, setTarget] = useState<string>('');
    const [consumer, setConsumer] = useState<string>('')
    const [sok_data, setSokData] = useState<any>();
    const history = useHistory();

    useEffect(() =>{
      if(!sok_data){
          getDataStructure();
      }})

  
   
    const getTokens = async() =>{
      try{
        var obj = await axios.post('https://sesoman-backend-iwck.onrender.com/resource/view', {headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'mode': 'no-cors'
        }});
        getDataFromTokens(obj.data)
      }catch(e){
        console.error(e);
      }
    }

    const getDataStructure =  async() =>{
      try{
        var obj = await axios.get('https://merlot.sokrates-r3.test.eduapp.at/api/consent_descriptor',   {headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }});
        setSokData(obj.data);
      }catch(e){
        console.error(e);
      }
    };

    const getProperyFromResouces = (prop: string) =>{
      var array : [string, string][] = [];
      sok_data?.consent_list.map((entry: any) =>{
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

    const getBasicData = (val: string) =>{
      var res: string = '';
      getProperyFromResouces('Stammdaten').map((entry) =>{
          if(entry[0] === val){
            res =  entry[1];
          }
      });
      return res;
    }

    const getGrades = (val: string) =>{
      var res: string = '';
      getProperyFromResouces('Grades').map((entry) =>{
          if(entry[0] === val){
            res = entry[1];
          }
      });
      return res;
    }

    async function decodeToken(token: string) {
      try {
        const decodedToken = jwtDecode(token)
        return decodedToken; // Return the decoded payload
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }

    const assignResources = (provider: string, consumer: string) =>{
      var result: string[] = [];
      if(provider === 'AWSi'  && consumer === 'HPI academy'){
        result.push(awsi);
        result.push(hpi);
      }else if(provider === 'Headai' && consumer === 'IMC'){
        result.push(headai);
        result.push(imc);
      }else if(provider === 'Lightcast' && consumer === 'Open Teach'){
        result.push(lightcast);
        result.push(openteach);
      }
      return result;
    }

    const getDataFromTokens = async(tokens: any) =>{
      var new_data : any[] = [];
      var openStates: boolean[] = [];
      var iterator = 0;
      
      var obj: any = await decodeToken(tokens);
      obj['ProviderImage'] = bitmedia;
      obj['ConsumerImage'] = karriereassistant;
      obj['ProviderDesc'] = 'School administration system';
      obj['ConsumerDesc'] = 'Career recommendation system';

      new_data.push(obj);
      openStates.push(false);
      iterator = iterator + 1;
      
      resources.extra_fields.map((field) =>{
        var res = assignResources(field.Target_Service, field.Calling_Service);
        field['ProviderImage'] = res[0];
        field['ConsumerImage'] = res[1];
        new_data.push(field);
      })
      setData(new_data);
      console.log(new_data);
      setOpen(openStates);
    }

    const setOpenAtIndex = (val: number) => {
      setOpen(prevState => {
          const newState = [...prevState]; // Create a copy of the state array
          newState[val] = !newState[val]; // Modify the value at index 55
          return newState; // Set the state with the updated array
      });
  };

  function capitalizeFirstLetter(word: string): string {
    // Convert the word to lowercase
    const lowercasedWord = word.toLowerCase();
    
    // Capitalize the first letter and concatenate with the rest of the word
    const capitalizedWord = lowercasedWord.charAt(0).toUpperCase() + lowercasedWord.slice(1);
    
    return capitalizedWord;
  }


    const style = {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      pt: 2,
      px: 4,
      pb: 3,
    };

    useEffect(() =>{
      props.setShow(false)
      getTokens();
    },[]);

  



    return(
        <div className='timeline-wrapper'>
          <Typography className="dash-title" variant="h6">Dashboard</Typography>
            <div style={{position: 'relative', top: '20px'}}>
             <Timeline>
             {data.map((obj: any) =>
             <div key={data.indexOf(obj)} style={{ position: 'relative', left: '-4%'}}>
             <Typography className='timeline-title' fontSize={18}>{obj.Date}</Typography>
                <TimelineItem>
                  <TimelineOppositeContent color="text.secondary">
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <div className='card-wrapper'>
                        <CardT
                            title={obj.Target_Service}
                            subtitle={obj.ProviderDesc}
                            image={obj.ProviderImage}
                        />
                        <Paper onClick={() =>{
                          setOpenAtIndex(data.indexOf(obj));
                          setTarget(obj.Target_Service);
                          setConsumer(obj.Calling_Service);
                          
                          }} 
                          className="paper-container">
                            <FontAwesomeIcon className='arrow-right' color="#D3D3D3" icon={faLongArrowAltRight} size='5x' />
                            <Typography>Data Transfer</Typography>
                        </Paper>
                        
                        <CardT
                            title={obj.Calling_Service}
                            subtitle={obj.ConsumerDesc}
                            image={obj.ConsumerImage}
                        />
                    </div>
                  </TimelineContent>
                  <div>
                    <Modal
                      open={open[data.indexOf(obj)]}
                      onClose={() => setOpenAtIndex(data.indexOf(obj))}
                      aria-labelledby="parent-modal-title"
                      aria-describedby="parent-modal-description"
                    >
                      <Box sx={{...style,  width: 400 }}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                          <h2 id="parent-modal-title">Consent Receipt</h2>
                          <IconButton><FontAwesomeIcon icon={faDownload}/></IconButton>
                        </div>
                        <div>
                          <div style={{display: 'flex', alignItems: 'center'}}><Typography sx={{marginRight: '2px'}} fontSize={15}><b>Provider:</b></Typography><Typography fontSize={14}>{target}</Typography></div>
                          <div style={{display: 'flex', alignItems: 'center'}}><Typography sx={{marginRight: '2px'}} fontSize={15}><b>Consumer:</b></Typography><Typography fontSize={14}> {consumer}</Typography></div>
                          <Typography sx={{position: 'relative', top: '15px'}} fontSize={15}><b>You provided this data:</b></Typography>
                          <Typography sx={{position: 'relative', top: '20px'}} fontSize={14}><b>Legal Base:</b> Consent</Typography>
                          <Typography sx={{position: 'relative', top: '20px'}} fontSize={14}><b>Status:</b> Allowed</Typography>
                          <div style={{position: 'relative', top: '35px'}}>
                            <Typography fontSize={14}><b>Basic Information</b></Typography>
                            <ul style={{columns: '2', columnGap: '20px'}}>
                            {obj.Data_Selection.Stammdaten.map((entry: string) =>
                            <li key={entry}><Typography fontSize={13}>
                            {getBasicData(entry)}
                            </Typography></li>
                            )}
                            </ul>
                          </div>
                          <div style={{position: 'relative', top: '25px'}}>
                          {obj.Data_Selection.Grades && <Typography fontSize={14}><b>Grades</b></Typography>}
                            <ul style={{columns: '2', columnGap: '20px'}}>
                              {obj.Data_Selection.Grades.map((entry: string) =>
                                <li key={entry} style={{}}>
                                  <Typography fontSize={13}>
                                    {getGrades(entry)}
                                  </Typography>
                                </li>
                                )}
                            </ul>
                          </div>
                        </div>
                        <div style={{position: 'relative', bottom: '0', display: 'flex', justifyContent: 'space-between', marginTop: '50px'}}>
                          <Button  className='privacy-btn'onClick={() =>{history.push('/privacy-notice')}} sx={{marginRight: '5px', backgroundColor: '#5a04bd', '&:hover':{backgroundColor: '#5a04bd'}}} size='small' variant="contained">Privacy Notice</Button>
                          <Button className='revoke-btn' sx={{marginRight: '5px', backgroundColor: '#5a04bd', '&:hover':{backgroundColor: '#5a04bd'}}} size='small' variant="contained">Revoke consent</Button>
                        </div>
                      </Box>
                    </Modal>
                  </div>
                </TimelineItem>
                </div>)}
            </Timeline>
            </div>
        </div>
    )
}