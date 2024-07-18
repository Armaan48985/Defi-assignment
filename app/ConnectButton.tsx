import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';

export default function ConnectButton() {
  return (
    <RainbowConnectButton
      label="Connect"
      accountStatus="address"
      chainStatus="none"
      showBalance={false}
    />
  );
}
