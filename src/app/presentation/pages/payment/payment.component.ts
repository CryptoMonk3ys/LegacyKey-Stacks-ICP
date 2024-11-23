import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayServiceUseCase } from '../../../domain/usecase/pay-service.use-case';
import { Blockchain } from '../../../domain/type/blockchain.type';
import { GetAccountUseCase } from '../../../domain/usecase/get-account.use-case';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoaderDialog } from '../../components/dialogs/loader/loader.dialog';
//import '@polkadot/api-augment';
//import { web3Accounts, web3Enable, web3FromAddress,web3FromSource } from '@polkadot/extension-dapp';
//import { decodeAddress, ProgramMetadata, GearApi} from "@gear-js/api";
import { pagar } from './RegistroSC';
import { Buffer } from 'buffer';
import { StacksTestnet } from '@stacks/network';
import { openContractCall, getUserData } from '@stacks/connect';
import { PostConditionMode } from '@stacks/transactions';
import { someCV,bufferCV,standardPrincipalCV, principalCV, uintCV, listCV, trueCV, optionalCVOf} from '@stacks/transactions';
import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  createAssetInfo,
  makeStandardFungiblePostCondition,
  bufferCVFromString, Pc
} from '@stacks/transactions';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  walletChain: Blockchain = "ethereum";
  wallterAddress: string | null = null;
  asset = "usdt";
  amount = 100;
  errorMessage: string | null = null;
  dialogRef?: MatDialogRef<LoaderDialog>;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private getAccountUseCase: GetAccountUseCase,
    private payServiceUseCase: PayServiceUseCase
  ) {
  }

  ngOnInit(): void {
    this.getAccountUseCase.execute()
      .then(acc => {
        this.wallterAddress = acc.address;
      });
  }

  async pago() {
    this.goToNext();
    /*         
    const pago=await pagar();
    await this.config();
    
    if (pago){
      this.goToNext();
    } */

  }

  async onPay() {
    
    if (this.wallterAddress == null) {
      return;
    }

    //await this.pago();
    this.showLoader();
    
    this.payServiceUseCase.execute({
      walletChain: this.walletChain,
      walletAddress: this.wallterAddress,
      asset: this.asset,
      amount: this.amount
    }).then(() => {
      this.onSuccessPayment();
    }).catch(e => {
      console.log(e);
      this.errorMessage = e.message;
    }).finally(() => {
      this.dialogRef?.close();
    });
  }

  onSuccessPayment() {
    this.showPopup(
      "Payment successful",
      "Your payment has been successfully generated! Now let's confirm your inheritance information.",
      "Continue",
      "success"
    );
  }

  showPopup(title: string, description: string, button: string, icon?: string) {
    const success = confirm(title + "\n" + description);
    if (success) {
      this.goToNext();
    }
  }

  goToNext() {
    this.router.navigate(['contract'])
      .catch();
  }

  showLoader() {
    this.dialogRef = this.dialog.open(LoaderDialog, {
      disableClose: true
    });
  }
}
