import { TestBed } from '@angular/core/testing';

import { PolkadotWalletService } from './polkadot-wallet.service';

describe('BinanceService', () => {
  let service: PolkadotWalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolkadotWalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
