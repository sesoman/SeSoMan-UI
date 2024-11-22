import React, { useEffect, useState } from 'react';
import "./ConsentTable.css"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import { IRoutes } from '../../App';
import { fetchConsentData, getToken } from '../restApi/serviceHandler';
import ConsentReceiptModal from './ConsentReceipt';
import { faCheck, faCheckCircle, faClipboardCheck, faCogs, faDash, faHandshake } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MatchModal from './MatchModal';
import { useLocation } from 'react-router-dom';
import RevokeModal from './RevokeModel';
import { deleteAllTransferData } from '../restApi/restApi';
import { ConsentReceiptFatma } from './ConsentReceiptFatma';

type ConsentData = {
  consentId: string,
  provider: string,
  consumer: string,
  dataSource: string,
  date: string;
  revoke: string;
  proof: string;
  match: boolean;
};

const months = [
  "January", 
  "February", 
  "March", 
  "April", 
  "May", 
  "June", 
  "July", 
  "August", 
  "September", 
  "October", 
  "November", 
  "December"
];



const ConsentTable = (props: IRoutes) => {
  const [data, setData] = useState<ConsentData[]>([]);
  const [year, setYear] = useState<string>('2024');
  const [month, setMonth] = useState<string>('0');
  const [search, setSearch] = useState<string>('');
  const [consent, setConsent] = useState<any[]>([]);
  const[init, setInit] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [openMatch, setOpenMatch] = useState(false);
  const [modalData, setModalData] = useState<any>();
  const [copyData, setCopyData] = useState<ConsentData[]>([]);
  const [openReceiptFatma, setOpenReceiptFatma]= useState<boolean>(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const handleOpen = (date: string) =>{ 
    var obj = consent.filter((entry) => entry.creationDate === date);
    setModalData(obj[0]);
    setOpen(true);
  }
  const handleClose = () => setOpen(false);
  const handleCloseMatch = () => setOpenMatch(false);

  const [openRevoke, setOpenRevoke] = useState(false);

  // Handle dialog open
  const handleOpenRevokeModal = () => {
    setOpenRevoke(true);
  };

  // Handle dialog close
  const handleCloseRevokeModal = () => {
    setOpenRevoke(false);
  };

  // Handle revoke action
  const handleRevokeModal = () => {
    // Add revoke logic here
    console.log("Consent revoked");
    setOpenRevoke(false);
  };

  const handleFilter = () => {
    // Implement filtering logic (example provided for demonstration)
    const filteredData: any[] = [];
    var res = data;
    
    if(data.length === 0){
        res = copyData;
    }
    
    res.map(
      (item) =>{
        var data = splitDateIntoMonthAndYear(item.date);
        if(data.year.includes(year) && data.month.toString().includes((month + 1).toString())){
          filteredData.push(item);
        }
        
      });
    setData(filteredData);
  };

  useEffect(()=>{
    if(props.setShow){
      props.setShow(false);
    }

    if(init === false && queryParams.get('useCase') === 'fatma'){
        getToken(setConsent);
    }else if(init === false){
        fetchConsentData(setConsent);
        setInit(true)
    }
  },[init]);

  const splitDateIntoMonthAndYear = (isoDate: string): { month: number; year: string } => {
    const date = new Date(isoDate); // Parse the ISO string into a Date object
  
    const month = date.getMonth() + 1; // Get the month name
    const year = date.getFullYear().toString(); // Get the year as a string
  
    return { month, year };
  };

  useEffect(() =>{
    if(consent.length && queryParams.get('useCase') === null){
      var data: ConsentData[] = [];
      consent.map((entry: any) =>{
        data.push({
          consentId: entry.id,
          provider: entry.holder === 'SeSoMan' ?  "HPI" : "SeSoMan",
          consumer: entry.holder.toLowerCase() === 'awsi' ? "AWSi" : 'SeSoMan',
          dataSource: "HPI",
          date: entry.creationDate,
          revoke: 'Revoke',
          proof: 'View',
          match: entry.holder === 'SeSoMan' ? true : false
        });
      });
      setData(data);
      setCopyData(data);
    }else if(consent.length && queryParams.get('useCase') === 'fatma'){
      var data: ConsentData[] = [];
      consent.map((entry: any) =>{
        data.push({
          consentId: (consent.indexOf(entry) + 1).toString(),
          provider: entry.Target_Service,
          consumer: entry.Calling_Service,
          dataSource: entry.Target_Service,
          date: entry.Date,
          revoke: 'Revoke',
          proof: 'View',
          match: true
        });
      });
      setData(data);
      setCopyData(data);
    }else{
      setData([]);
    }
  },[consent])

  return (
    <Paper elevation={0} sx={{ padding: 2, width: "75%", margin: '0 auto'}}>
      <Typography variant="h6" gutterBottom>
        Dashboard
      </Typography>

      {/* Filter Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          size="small"
        >
          <MenuItem value="2023">2023</MenuItem>
          <MenuItem value="2024">2024</MenuItem>
        </Select>
        <Select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          size="small"
        >
          {months.map((entry) => <MenuItem value={months.indexOf(entry)}>{entry}</MenuItem>)}
          {/* Add more months as needed */}
        </Select>
        <Button sx={{backgroundColor: '#5a04bd'}} variant="contained" onClick={handleFilter}>
          Filter
        </Button>
      </div>
      {queryParams.get('useCase') !== null ?
      <ConsentReceiptFatma 
      open={open}
      handleClose={handleClose}
      obj={consent[0]}
      />:
      <ConsentReceiptModal 
        handleClose={handleClose}
        open={open}
        data={modalData}
      />
      }
      <MatchModal
        onClose={handleCloseMatch}
        open={openMatch}
        setInit={setInit}
      />
      <RevokeModal
        open={openRevoke}
        handleCloseRevokeModal={handleCloseRevokeModal}
        handleRevokeModal={handleRevokeModal}
      />

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Consent ID</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>Consumer</TableCell>
              <TableCell>Data Source</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Consent</TableCell>
              <TableCell>Receipt</TableCell>
              <TableCell>Match</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.consentId}</TableCell>
                <TableCell>{row.provider}</TableCell>
                <TableCell>{row.consumer}</TableCell>
                <TableCell>{row.dataSource}</TableCell>
                <TableCell>{new Date(row.date).toLocaleString("en-US", { year: "2-digit", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</TableCell>
                <TableCell>
                  <Button variant="text" onClick={handleOpenRevokeModal}  sx={{ textTransform: "none", padding: 0,  color: '#5a04bd' }}>
                        {row.revoke}
                  </Button>
                </TableCell>
                <TableCell>
                <Button variant="text" onClick={() => {handleOpen(row.date)}} sx={{ textTransform: "none", padding: 0, color: '#5a04bd' }}>
                        {row.proof}
                </Button>
                </TableCell>
                <TableCell>
                  
                    {
                      row.match && consent.length ===1 && queryParams.get('show') === 'true' &&
                      <Button>
                        <FontAwesomeIcon color={'#5a04bd'} icon={faHandshake} size='xl' onClick={()=>{setOpenMatch(true)}}/> 
                      </Button>
                    }
                    {row.match && consent.length ===1 && queryParams.get('show') === null &&
                      <Button disabled={true}>
                        <FontAwesomeIcon color={'#757575'} icon={faHandshake} size='xl' onClick={()=>{setOpenMatch(true)}}/> 
                      </Button>
                    }
                    {
                    !row.match && consent.length ===2 &&
                      <Button>
                        <FontAwesomeIcon color={'#5a04bd'} icon={faClipboardCheck} size='xl'/>
                      </Button>
                    }
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Buttons */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <Button sx={{color: '#5a04bd', borderColor: '#5a04bd'}} variant="outlined">Export to CSV</Button>
        {queryParams.get('delete') === 'true' &&  <Button onClick={async() =>{
          await deleteAllTransferData(setInit);}} 
          sx={{color: '#5a04bd', borderColor: '#5a04bd'}} 
          variant='outlined'>Delete data</Button>}
      </div>
    </Paper>
  );
};

export default ConsentTable;
