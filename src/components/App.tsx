import { useAddress } from "../hooks/useConnectedAddress"
import SendButton from "./SendButton"
import ConnectButton from "./ConnectButton"
import ExecuteButton from "./ExecuteButton"
import MintButton from "./MintButton"


const App = () => {
  const address = useAddress()

  return (
    <main>
      <ConnectButton />

      {address && (
        <section>
          <SendButton />
          <ExecuteButton />
          <MintButton />
        </section>
      )}
    </main>
  )
}

export default App
