import { useState, useEffect } from "react"
import { useWallet } from "@terra-money/wallet-provider"
import { MsgExecuteContract } from "@terra-money/terra.js"
import useConnectedAddress from "../hooks/useConnectedAddress"
import { useGasPrice } from "../hooks/useGasPrices"
import { LCDClient } from "@terra-money/terra.js"
import { sign } from "crypto"

const sdollar = "terra182pssdpcahrwt639ankmsjs25pjw3as9tyy46v" // testnet
const lootFactory = "terra1k8jryjfeqtff3d9tucx0gk2l0h6h360452h989" // testnet

const MintButton = () => {
  const { post, sign } = useWallet()
  const address = useConnectedAddress()
  const gasPrices = useGasPrice("uusd")
 
  const [minting, setMinting] = useState()
  let mintResponse: any

  if (!gasPrices) return null



  const mint = async () => {
    try {

      const msgs = [
        new MsgExecuteContract(
          address,
          sdollar,
          {
            "send": {
              "msg": "eyJidXkiOnt9fQ==",
              "amount": "100",
              "contract": lootFactory
            }
          },
          //new Coins([Coin.fromData({ amount: amount1, denom: "uusd" })])
        ),
      ]

      const txOptions = { msgs, gasPrices }
      try { 
        mintResponse = await sign(txOptions) 
        console.log(mintResponse)
        setMinting(mintResponse)
      } catch(e) { console.log(e) }

 
    } catch (error: any) {
      mintResponse = "Error minting"
      setMinting(mintResponse)
      console.log(error.name)
    }
  }
  return (
    <div>
      <div>
        <button onClick={mint}>Mint</button>
      </div>
      <div>
        <span>{minting}</span>
      </div>
    </div>
  )
}

export default MintButton
