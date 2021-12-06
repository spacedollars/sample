import { ConnectType, useWallet } from "@terra-money/wallet-provider"
import { useAddress } from "../hooks/useConnectedAddress"

const ConnectButton = () => {
  const { connect, disconnect } = useWallet()
  const address = useAddress()

  return address ? (
    <div className="text-center">
      <p><code>{address}</code></p>      
      <p><button className="nes-btn" onClick={() => disconnect()}>Disconnect</button></p>
    </div>
  ) : (
    <div className="text-center">
      <button className="nes-btn" onClick={() => connect(ConnectType.EXTENSION)}>
        Connect extension
      </button>
      &nbsp;
      <button className="nes-btn" onClick={() => connect(ConnectType.WALLETCONNECT)}>
        Connect mobile
      </button>
    </div>
  )
}

export default ConnectButton
