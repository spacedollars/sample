import { useAddress } from "../hooks/useConnectedAddress"
import ConnectButton from "./ConnectButton"
import MintButton from "./MintButton"


const App = () => {
  const address = useAddress()

  return (
      <main>
          <p></p>
        <h3><p className="text-center">Welcome to Lootopia!</p></h3>
        <hr />
        <div className="nes-container with-title">
          <p className="title">Wallet Configuration</p>
        <ConnectButton />
        </div>
        {address && (
          <section>
            <p></p>
            <div className="nes-container with-title">
              <p className="title">Weapons Loot</p>
              <MintButton />
            </div>
          </section>
        )}
      </main>
    
  )
}

export default App
