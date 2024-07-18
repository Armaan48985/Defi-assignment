import '@rainbow-me/rainbowkit/styles.css';
import ConnectButton from './ConnectButton';
import CryptoContext from './CryptoContext';
import '@rainbow-me/rainbowkit/styles.css';



export default function Home() {
  return (
    <CryptoContext>
      <h1>connect your wallet</h1>
      <ConnectButton/>
      {/* <SwapToken/> */}
    </CryptoContext>
  );
}
