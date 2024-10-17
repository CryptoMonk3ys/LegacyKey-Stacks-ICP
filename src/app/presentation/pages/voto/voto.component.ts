import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { voteValidator } from '../../../domain/model/legacy-contract.model';
import { GetAccountUseCase } from '../../../domain/usecase/get-account.use-case';
import { Blockchain } from '../../../domain/type/blockchain.type';
import { VoteLegacyUseCase } from '../../../domain/usecase/vote-legacy.use-case';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoaderDialog } from '../../components/dialogs/loader/loader.dialog';
//import '@polkadot/api-augment';
//import { web3Accounts, web3Enable, web3FromAddress,web3FromSource } from '@polkadot/extension-dapp';
//import { decodeAddress, ProgramMetadata, GearApi} from "@gear-js/api";
import { AppConfig, UserSession, getUserData, showConnect } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { AnchorMode } from '@stacks/transactions';
import { openContractCall } from '@stacks/connect';
import { PostConditionMode } from '@stacks/transactions';
import { stringCV, principalCV, uintCV, listCV, trueCV, optionalCVOf} from '@stacks/transactions';

@Component({
  selector: 'app-voto',
  templateUrl: './voto.component.html',
  styleUrls: ['./voto.component.scss']
})
export class VotoComponent implements OnInit {
  walletChain: Blockchain = "ethereum";
  wallterAddress: string | null = null;
  validator = new voteValidator();
  errorMessage: string | null = null;
  dialogRef?: MatDialogRef<LoaderDialog>;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private getAccountUseCase: GetAccountUseCase,
    private voteLegacyUseCase: VoteLegacyUseCase,
  ) {
  }

  ngOnInit(): void {
    this.getAccountUseCase.execute()
      .then(acc => {
        this.wallterAddress = acc.address;
      });
  }

  async voto() {
    /*
    if (this.wallterAddress == null || this.validator.idVote == null) {
      return;
    }*/

    this.showLoader();
    const signer = async () => {}
    const cantidad=uintCV(1);
    openContractCall({
        network: new StacksTestnet(),
        anchorMode: AnchorMode.Any, // which type of block the tx should be mined in

        contractAddress: 'ST2KMEEVZBBKN1AN856MB356GD3G3TTN8X8N0B05D',
        contractName: 'LegacyKeyV1',
        functionName: 'voteValidador',
        functionArgs: [cantidad],

        postConditionMode: PostConditionMode.Deny, // whether the tx should fail when unexpected assets are transferred
        postConditions: [], // for an example using post-conditions, see next example

        onFinish: response => {
          console.log('Voto procesado con éxito');
        },
        onCancel: () => {
          console.log('No se procesó el voto');
        },
    });

    signer().then(() => {
      this.onSuccessSave();
    }).catch(e => {
      console.log(e);
      this.errorMessage = e.message;
    }).finally(() => {
      this.dialogRef?.close();
    });
  }

  onSuccessSave() {
    this.showPopup(
      "Guardado satisfactorio",
      "¡Tu voto se ha guardo con éxito!",
      "Continuar",
      "success"
    );
  }

  showPopup(title: string, description: string, button: string, icon?: string) {
    const success = confirm(title + "\n" + description);
    if (success) {
      this.goToNext();
    }
  }

  showLoader() {
    this.dialogRef = this.dialog.open(LoaderDialog, {
      disableClose: true
    });
  }

  goToNext() {
    this.router.navigate(['menu'])
      .catch();
  }
}