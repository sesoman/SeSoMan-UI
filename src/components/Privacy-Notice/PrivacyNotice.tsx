import { Accordion, AccordionDetails, AccordionSummary, Avatar, Button,Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./PrivacyNotice.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBullseye, faCalendarAlt, faCircleChevronDown, faCogs, faDatabase, faExchangeAlt, faExclamationTriangle,  faGavel, faGlobe, faHandHolding, faHourglassHalf, faIdBadge,  faQuestionCircle,  faUserCheck, faUserLock } from "@fortawesome/pro-light-svg-icons";
import { IRoutes } from "../../App";
import resources from './../../Resources.json';
import { useHistory, useLocation, useParams } from "react-router-dom";
import { sendSignal } from "../restApi/serviceHandler";


export const PrivacyNotice = (props: IRoutes) => {
    const url: {service: string} = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [notice, setNotice] = useState<any>([]);
    
    useEffect(() =>{
        props.setIndex(1)
        if(url.service == undefined){
            setNotice(resources.karriereassitant);
        }else if(url.service === 'hpi' && props?.setSteps){
            props?.setSteps(['Login Confirmation','Privacy Notice ']);
            setNotice(resources.hpi)
        }else if(url.service === 'awsi' && props?.setSteps){
            props?.setSteps(['Login Confirmation','Privacy Notice ']);
            setNotice(resources.awsi);
        }
    },[]);


    const itemSpec = [
        'Purpose* ',
        'Identification of PII controller*',
        'PII collection/element*',
        'Collection method',
        'Timing & location of PII collection',
        'Method of use',
        'Geo-location of stored PII​*',
        '3rd Party transfer*',
        'Retention period​*',
        'Participation of PII principal',
        'Access to consent choice*',
        'Inquiry & complaint​*',
        'Basis for processing',
        'Risks',
        'Notice*'
    ];

    const icons= [
        faBullseye,
        faIdBadge,
        faDatabase,
        faHandHolding,
        faCalendarAlt,
        faCogs,
        faGlobe,
        faExchangeAlt,
        faHourglassHalf,
        faUserCheck,
        faUserLock,
        faQuestionCircle,
        faGavel,
        faExclamationTriangle,
        faBell
    ]

    const history = useHistory();

    const handleClick = () => {
        if(url.service === undefined){
            history.push('/data-selection');
        }else if (url.service === 'hpi'){
            window.open('http://82.165.96.249/profile/', '_self');
        }else if(url.service === 'awsi'){
            history.push('/receipt-panel?userId=' + queryParams.get('userId') + '&show=true');
        }
        
    };

    return(
        <div className='privacy-struct' style={{position: 'relative'}}>
            <Typography variant="h6">
                Privacy Notice
            </Typography>
            <Typography fontSize={15} className="info-msg">
            This Privacy Notice is aimed to give you important information about protection of your personal information. It also provides you with the relevant information about your rights in accordance with the General Data Protection Regulation (GDPR). Below we also inform you about which personal data we collect and for what purposes, how long we keep hold and whom we share your personal information with. Please read this Privacy Notice very carefully because it relates to your fundamental rights.
            </Typography>
            
            <div className="info-topics">
                {itemSpec.map((text) =>
                <Accordion key={text}>
                    <AccordionSummary
                        expandIcon={<FontAwesomeIcon icon={faCircleChevronDown} />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Avatar><FontAwesomeIcon color="#5a04bd" icon={icons[itemSpec.indexOf(text)]}/></Avatar>
                        <Typography fontSize={15} className="acc-text" variant='body1'>{text}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="html-description" dangerouslySetInnerHTML={{ __html: notice[itemSpec.indexOf(text)]}} />
                    </AccordionDetails>
                </Accordion>
                )}
            </div>
            <div className="btn-wrapper">
                <Button onClick={handleClick} className="accept-btn" size="small" variant="contained">Accept</Button>
                <Button className="decline-btn" size="small" variant="outlined">Decline</Button>
            </div>
        </div>
    );
}