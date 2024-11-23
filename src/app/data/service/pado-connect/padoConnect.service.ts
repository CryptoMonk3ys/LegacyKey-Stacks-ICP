import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Web3 from 'web3';
import { WalletRepository } from '../../../domain/repository/wallet.repository';
//import '@polkadot/api-augment';
//import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
//import { decodeAddress} from "@gear-js/api";
//import { AppConfig, UserSession, getUserData, showConnect } from '@stacks/connect';
import { EthereumService } from '../ethereum/ethereum.service';

import MPCTLSJSSDK from "@padolabs/mpctls-js-sdk";

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class padoService extends WalletRepository {
  /* private wallet: Web3 | null = null;

  private _currentAccountAddress: string | null = null;

  private _accountAddress = new BehaviorSubject<string | null>(this._currentAccountAddress);
  public accountAddress = this._accountAddress.asObservable(); */
  
  constructor() {
    
    super();   

    /* if (typeof window.ethereum !== 'undefined') {
      this.wallet = new Web3(window.ethereum);
    } */
  }
  
  connect = async(): Promise<string[]> => {
    
    /*
    const allInjected = await web3Enable('LegacyKey Dapp');
    const allAccounts = await web3Accounts();
    console.log( decodeAddress(allAccounts[0].address)  ); */
    
    return new Promise<string[]>(async (resolve, reject) => {
      const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("accounts: ", accounts);
      const ethereumService = new EthereumService(); 
      const isPOH= await ethereumService.isProofOfHumanity(accounts[0]);
      console.log("isPOH: ", isPOH);
      if(!isPOH){

        try {
          console.log("verify attestation");
          const sdkInstance = new MPCTLSJSSDK();
          try {
            const initAttestaionResult = await sdkInstance.initAttestation("https://legacykey.tech/img/icon/icon-02-primary.png");            
            const startAttestaionResult = await sdkInstance.startAttestation({
              chainID: 56,
              walletAddress: accounts[0],
              attestationTypeID: '3',
              attestationParameters: [],
            });      
            console.log("Attest successfully!");
            const verifyAttestationResult = sdkInstance.verifyAttestation(
              startAttestaionResult
            );      
            const sendToChainResult = await sdkInstance.sendToChain(
              startAttestaionResult,
              window.ethereum
            );
            console.log("Generated Proof:", startAttestaionResult);
            console.log("Proof on Chain:", sendToChainResult);
            console.log("Is Proof Valid:", verifyAttestationResult); 
          } catch (e) {
            alert(`Attest failed: ${e}`);
          }      
          
          
        } catch (err) {
          reject(err);
        }
        await ethereumService.proofOfHumanity(accounts[0]);
      } 
      
      resolve(accounts);
    });
  }

  /* private setAccountAddress(accountAddress: string | null) {
    this._currentAccountAddress = accountAddress;
    this._accountAddress.next(accountAddress);
  }

  getAccountAddress() {
    return this._currentAccountAddress;
  } */
}
