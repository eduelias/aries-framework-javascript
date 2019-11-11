import { InitConfig } from './agent/types';
import * as dotenv from 'dotenv';

dotenv.config();

function config({
  url,
  label,
  walletName,
  walletKey,
  publicDid,
  publicDidSeed,
}: InitConfig): InitConfig {
  return {
    url: url || new URL(process.env.AGENT_URL || ''),
    label: label || process.env.AGENT_LABEL || '',
    walletName: walletName || process.env.WALLET_NAME || '',
    walletKey: walletKey || process.env.WALLET_KEY || '',
    publicDid: publicDid || process.env.PUBLIC_DID || '',
    publicDidSeed: publicDidSeed || process.env.PUBLIC_DID_SEED || '',
  }
}

export default config;