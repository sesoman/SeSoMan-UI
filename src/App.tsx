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
import { Invitation } from './components/Invitation/Invitation';
import { CredentialCreation } from './components/Credential/CredentialCreation';
import ConsentTable from './components/ConsentTable/ConsentTable';
import CredentialsPage from './components/Credential/CredentialsPage';

interface IStepper{
  index: number;
  steps: string[];
}

export interface IRoutes{
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setSteps?: React.Dispatch<React.SetStateAction<string[]>>; 
  setShow?:  React.Dispatch<React.SetStateAction<boolean>>; 
  credTypes?: string;
}

const Routes = (props: IRoutes) => {


  return(
    <HashRouter>
        <Switch>
          <Route path='/privacy-notice'>
            <PrivacyNotice setIndex={props.setIndex}/>
          </Route>
          <Route path='/data-protection-statement/:service'>
            <PrivacyNotice setIndex={props.setIndex} setSteps={props.setSteps}  />
          </Route>
          <Route path='/data-selection'>
            <DataSelection setIndex={props.setIndex} />
          </Route>
          <Route path='/login/:service'>
            <LoginPage 
              setIndex={props.setIndex}
              setShow={props.setShow}
              setSteps={props.setSteps}
            />
          </Route>
          <Route path='/connect/:service'>
            <LoginPage 
              setIndex={props.setIndex}
              setShow={props.setShow}
              setSteps={props.setSteps}
            />
          </Route>
          <Route path='/invitation/:service'>
            <Invitation
              setIndex={props.setIndex}
              setShow={props.setShow}
            />
          </Route>
          <Route path='/credential-creation'>
            <CredentialCreation
              setIndex={props.setIndex}
              setShow={props.setShow}
              credTypes={'New Credential Offer'}
            />
          </Route>
          <Route path='/credential-presentation'>
            <CredentialCreation
              setIndex={props.setIndex}
              setShow={props.setShow}
              credTypes={'New Proof Request'}
            />
          </Route>
          <Route path='/receipt-panel'>
            <ConsentTable
              setIndex={props.setIndex}
              setShow={props.setShow}
            />
          </Route>
          <Route path='/credentials-page'>
            <CredentialsPage
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

const StepperH = (props: IStepper) =>{
  return (
      <Stepper  activeStep={props.index} alternativeLabel>
        {props.steps?.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
  );
}

export function App(){
  const[position, setPosition] = useState<number>(0);
  const[show, setShow] = useState<boolean>(true);
  const[steps, setSteps] = useState<string[]>(['Login Confirmation','Privacy Notice ','Data Selection',]);

  return (
    <div className="App">
      <Title/>
      {
        show && <StepperH index={position} steps={steps}/>
      }
      
      <Routes 
        setIndex={setPosition}
        setShow={setShow}
        setSteps={setSteps}

      />
    </div>
  );
}

export default App;
