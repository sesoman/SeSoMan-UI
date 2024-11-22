import { faDownload } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

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

export const ConsentReceiptFatma = (props: any) =>{
    const [sok_data, setSokData] = useState<any>();
    const history = useHistory();

    useEffect(() =>{
        if(!sok_data){
            getDataStructure();
        }
        console.log(props)
    }, [props])

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


    return(
        <Modal
             open={props.open}
             onClose={() => props.handleClose(false)}
             aria-labelledby="parent-modal-title"
             aria-describedby="parent-modal-description"
           >
             <Box sx={{...style,  width: 400 }}>
               <div style={{display: 'flex', justifyContent: 'space-between'}}>
                 <h2 id="parent-modal-title">Consent Receipt</h2>
                 <IconButton><FontAwesomeIcon icon={faDownload}/></IconButton>
               </div>
               <div>
                 <div style={{display: 'flex', alignItems: 'center'}}><Typography sx={{marginRight: '2px'}} fontSize={15}><b>Provider:</b></Typography><Typography fontSize={14}>Sokrates</Typography></div>
                 <div style={{display: 'flex', alignItems: 'center'}}><Typography sx={{marginRight: '2px'}} fontSize={15}><b>Consumer:</b></Typography><Typography fontSize={14}>Karriereassistent</Typography></div>
                 <Typography sx={{position: 'relative', top: '15px'}} fontSize={15}><b>You provided this data:</b></Typography>
                 <Typography sx={{position: 'relative', top: '20px'}} fontSize={14}><b>Legal Base:</b> Consent</Typography>
                 <Typography sx={{position: 'relative', top: '20px'}} fontSize={14}><b>Status:</b> Allowed</Typography>
                 <div style={{position: 'relative', top: '35px'}}>
                   <Typography fontSize={14}><b>Basic Information</b></Typography>
                   <ul style={{columns: '2', columnGap: '20px'}}>
                   {props.obj?.Data_Selection?.Stammdaten.map((entry: string) =>
                   <li key={entry}><Typography fontSize={13}>
                   {getBasicData(entry)}
                   </Typography></li>
                   )}
                   </ul>
                 </div>
                 <div style={{position: 'relative', top: '25px'}}>
                 {props.obj?.Data_Selection?.Grades && <Typography fontSize={14}><b>Grades</b></Typography>}
                   <ul style={{columns: '2', columnGap: '20px'}}>
                     {props.obj?.Data_Selection?.Grades.map((entry: string) =>
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
               </div>
             </Box>
           </Modal>
    );
}