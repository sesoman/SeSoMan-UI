import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';
import './App.css';
import { PrivacyNotice } from './components/Privacy-Notice/PrivacyNotice';
import { HashRouter, Route, Switch} from  'react-router-dom';
import { DataSelection } from './components/Data-Selection/DataSelection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/pro-light-svg-icons';
import { LoginPage } from './components/Login-Page/LoginPage';
import { Dashboard } from './components/Dashboard/Dashboard';
import { useState } from 'react';

interface IStepper{
  index: number;
}

export interface IRoutes{
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setShow?:  React.Dispatch<React.SetStateAction<boolean>>;
}

const Routes = (props: IRoutes) => {


  return(
    <HashRouter>
        <Switch>
          <Route path='/privacy-notice'>
            <PrivacyNotice setIndex={props.setIndex}/>
          </Route>
          <Route path='/data-selection'>
            <DataSelection setIndex={props.setIndex}/>
          </Route>
          <Route path='/login/:service'>
            <LoginPage 
              setIndex={props.setIndex}
              setShow={props.setShow}
            />
          </Route>
          <Route path='/dashboard'>
            <Dashboard  setShow={props.setShow}/>
          </Route>
        </Switch>
        </HashRouter>
  );
}

const Title = () =>{
  return(
    <div className='title-wrapper'>
        <FontAwesomeIcon color={'white'} icon={faHandshake} size='2xl'/>
        <Typography  className='app-title' variant="h5">
          SeSoMan
        </Typography>
    </div>
  )
}

const StepperH = (position: IStepper) =>{
  const steps = [
    'Login Confirmation',
    'Privacy Notice ',
    'Data Selection',
  ];

  return (
      <Stepper  activeStep={position.index} alternativeLabel>
        {steps.map((label) => (
          <Step  key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
  );
}

export function App(){
  const[position, setPosition] = useState<number>(0);
  const[show, setShow] = useState<boolean>(true);

  return (
    <div className="App">
      <Title/>
      {
        show && <StepperH index={position}/>
      }
      
      <Routes 
        setIndex={setPosition}
        setShow={setShow}
      />
    </div>
  );
}

export default App;
