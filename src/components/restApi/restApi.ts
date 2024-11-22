import axios from "axios";
import { threadId } from "worker_threads";


export const getCredentialOffer = async(threadId: string) => {
    return axios.get("https://ocm.dev.merlot-education.eu/attestation/v1/credential?threadId=" + threadId);
}

export const getCredentialInfo = async(credentialId: string) =>{
    return axios.get("https://ocm.dev.merlot-education.eu/attestation/v1/credential-info/" + credentialId);
}

export const acceptOffer = async(credentialId: string) =>{
    return axios.post("https://ocm.dev.merlot-education.eu/attestation/v1/accept-offer/" + credentialId);
}

export const getConsentData = async() =>{
    return axios.post("https://sesoman-backend-iwck.onrender.com/resource/data");
}

export const getAgentProofs = async(threadId: string) =>{
    return axios.get("https://ocm.dev.merlot-education.eu/proof/v1/agent-proofs?threadId=" + threadId)
}

export const acceptProofRequest = async(proofId: string) =>{
    return axios.post("https://ocm.dev.merlot-education.eu/proof/v1/accept-proof-request/" + proofId)
}

export const credentialSave = async(data: {credentialId: string, email: string}) =>{
    return axios.post("https://sesoman-backend-iwck.onrender.com/credential/save", data);
}

export const credentialAll= async() =>{
    return axios.post("https://sesoman-backend-iwck.onrender.com/credential/all");
}

export const credentialLatest = async() =>{
    return axios.post("https://sesoman-backend-iwck.onrender.com/credential/latest");
}

export const credentialInfo = async(credentialId: string) =>{
    return axios.get("https://ocm.dev.merlot-education.eu/attestation/v1/credential-info/" + credentialId);
}

export const deleteAllTransferData = async(setInit: React.Dispatch<React.SetStateAction<boolean>>) => {
    var res = await axios.delete("https://sesoman-backend-iwck.onrender.com/deleteAll");
    if(res){
        setInit(false);
    }
}
