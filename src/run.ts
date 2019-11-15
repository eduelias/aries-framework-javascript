import { RestAgency } from "./agency";

const steward = new RestAgency();
steward.run({
  url: new URL('http://localhost:3000'),
  label: 'Steward',
  walletName: 'Steward Wallet',
  walletKey: 'steward_key',
  publicDid: 'Th7MpTaRZVRYnPiabds81Y',
  publicDidSeed: '000000000000000000000000Steward1',
});
