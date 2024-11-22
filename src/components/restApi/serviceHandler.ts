import axios from "axios";
import { acceptOffer, acceptProofRequest, credentialAll, credentialInfo, credentialLatest, credentialSave, getAgentProofs, getConsentData, getCredentialInfo, getCredentialOffer } from "./restApi";
import { API_URL, AWSI_URL, PASSWORD, USERNAME } from "../../config";
import { json } from "stream/consumers";
import { threadId } from "worker_threads";
import { ICredential } from "../Credential/CredentialCreation";
import { Credential } from "../Credential/CredentialsPage";
import { jwtDecode } from "jwt-decode";



export const fetchCredential = async(threadId: string, setCredentialId: React.Dispatch<React.SetStateAction<string>>,  setCred: React.Dispatch<React.SetStateAction<any>>) =>{
    try{
        var objOffer = await getCredentialOffer(threadId);
        var cred = await getCredentialInfo (objOffer.data.data.results[0].credentialId);
        setCredentialId(objOffer.data.data.results[0].credentialId);
        localStorage.setItem("credentialId", objOffer.data.data.results[0].credentialId);
        setCred(cred.data.data);
        
    }catch(e){
        console.error(e);
    }

}

export const acceptCredentialOffer = async(credentialId: string, data: ICredential, redirectTo: string) =>{
    try{
        await acceptOffer(credentialId);
        await credentialSave(data);
        window.open(redirectTo, '_self');
    }catch(e){
        console.error(e);
    }
}

export const fetchConsentData = async(setConsent: React.Dispatch<React.SetStateAction<any>>) =>{
    try{
        var consent = await getConsentData();
        setConsent(consent.data); 
    }catch(e){
        console.error(e);
    }

}

export const sendSignal = async (userId: string, ) => {
    try {
     await axios.post("https://sesoman-backend-iwck.onrender.com/authenticate/" + userId)
    } catch (error) {
      console.error(error);
    }
  };
  
export const acceptProofRequestCred = async(threadId: string, redirectTo: string) => {
    try{
        var res1 = await getAgentProofs(threadId);
        var res2 = await acceptProofRequest(res1.data.data[0].id);
        window.open(redirectTo, '_self');
    }catch (error) {
      console.error(error);
    }
}

export const getCredential = async(setCred: React.Dispatch<React.SetStateAction<any>>) =>{
    try{
        var objCred = await credentialLatest()
        var cred = await getCredentialInfo(objCred.data.credentialId);
        setCred(cred.data.data);
        
    }catch(e){
        console.error(e);
    }

}

export const getAllCredentials = async(setCredential:  React.Dispatch<React.SetStateAction<Credential[]>>) =>{
     var credentialsObj = await credentialAll();
     var resultCred: Credential[] = [];
     credentialsObj.data.map(async(entry: any) =>{
        var cred = await credentialInfo(entry.credentialId);
        resultCred.push({
            id: 1,
            title: "Merlot Login Demo 191124 Cred Def",
            type: "ssi-abstraction-agent",
            attributes: cred?.data?.data?.offerMessage?.credential_preview?.attributes,
          });
          if(resultCred.length === credentialsObj?.data?.length){
            setCredential(resultCred);
          }
     });
     
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

export const getToken = async(setConsent: React.Dispatch<React.SetStateAction<any[]>>) =>{
    try{
      var obj = await axios.post('https://sesoman-backend-iwck.onrender.com/resource/view', {headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'mode': 'no-cors'
      }});
      var decodedToken: any = await decodeToken(obj.data);
      setConsent([decodedToken]);
    }catch(e){
      console.error(e);
    }
  }
