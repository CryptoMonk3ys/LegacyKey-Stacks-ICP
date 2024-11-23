import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { LoginWeb3UseCase } from '../../../domain/usecase/login-web3.use-case';
import { IsPaidLegacyUseCase } from '../../../domain/usecase/is-paid-legacy.use-case';
//import {isPaidLegacyKeySC} from '../../../data/service/ethereum/ethereum.service';
import { Blockchain } from '../../../domain/type/blockchain.type';
import MPCTLSJSSDK from "@padolabs/mpctls-js-sdk";
declare let window: any;
//import '@polkadot/api-augment';
//import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private loginWeb3UseCase: LoginWeb3UseCase,
    private isPaidLegacyUseCase: IsPaidLegacyUseCase,
  ) {
  }

  ngOnInit(): void {
  }

  onPeraConnect() {
    this.loginWeb3UseCase
      .execute("pera")
      .then((accounts) => {
        this.router.navigate(['payment'])
          .catch();
      })
      .catch((error) => {
        // You MUST handle the reject because once the user closes the modal, peraWallet.connect() promise will be rejected.
        // For the async/await syntax you MUST use try/catch
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          // log the necessary errors
        }
      });
  }

  onMetamaskConnect() {
    this.loginWeb3UseCase
      .execute("metamask")
      .then((accounts) => {
        console.log(accounts);
        //this.goToNext("ethereum", accounts[0]);
        this.router.navigate(['menu'])
      })
      .catch((error) => {
        // You MUST handle the reject because once the user closes the modal, peraWallet.connect() promise will be rejected.
        // For the async/await syntax you MUST use try/catch
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          // log the necessary errors
        }
      });
  }

  onPolkadotConnect() {
    this.loginWeb3UseCase
      .execute("polkadot")
      .then((accounts) => {
        //this.goToNext("ethereum", accounts[0]);
        this.router.navigate(['menu'])
      })
      .catch((error) => {
        // You MUST handle the reject because once the user closes the modal, peraWallet.connect() promise will be rejected.
        // For the async/await syntax you MUST use try/catch
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          // log the necessary errors
        }
      });
  }

  onXverseConnect() {    
    this.loginWeb3UseCase
      .execute("xverse")
      .then((accounts) => {
        
        //this.goToNext("ethereum", accounts[0]);
        this.router.navigate(['menu'])
      })
      .catch((error) => {
        // You MUST handle the reject because once the user closes the modal, peraWallet.connect() promise will be rejected.
        // For the async/await syntax you MUST use try/catch
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          // log the necessary errors
        }
      });
  }

  onPadoConnect() { 
    this.loginWeb3UseCase
      .execute("pado")
      .then((accounts) => {
        
        this.goToNext("ethereum", accounts[0]);
        
      })
      .catch((error) => {
        // You MUST handle the reject because once the user closes the modal, peraWallet.connect() promise will be rejected.
        // For the async/await syntax you MUST use try/catch
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          // log the necessary errors
        }
      });
    
  }  

  goToNext(walletChain: Blockchain, account: string) {
    console.log(walletChain, account);
    this.isPaidLegacyUseCase.execute({
      walletChain,
      walletAddress: account
    }).then(isPaid => {
      console.log(isPaid);
      if (isPaid) {
        console.log("isPaid");
        this.router.navigate(['contract'])
      } else {
        this.router.navigate(['payment'])
      }
    }).catch(e => console.error(e));
  }
}
