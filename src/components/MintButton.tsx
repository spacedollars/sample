import { useState, useEffect } from "react"
import { useWallet } from "@terra-money/wallet-provider"
import { MsgExecuteContract } from "@terra-money/terra.js"
import useConnectedAddress from "../hooks/useConnectedAddress"
import { useGasPrice } from "../hooks/useGasPrices"
import useLCDClient from "../hooks/useLCDClient"
var Bottleneck = require("bottleneck/es5");
const limiter = new Bottleneck({
    minTime: 100
});

const sdollar = "terra182pssdpcahrwt639ankmsjs25pjw3as9tyy46v" // testnet
const lootFactory = "terra1k8jryjfeqtff3d9tucx0gk2l0h6h360452h989" // testnet
const cw721Contract = "terra1e5p3yeuyw270mvydkxj3ewjkck8eh33fdj7q3d" // testnet


const MintButton = () => {
  const { post } = useWallet()
  const address = useConnectedAddress()
  const gasPrices = useGasPrice("uusd")
 
  const [minting, setMinting] = useState("")

  // Minting Quantity and Max Minting Quantity per user
  const [mintingQuantity, setMintingQuantity] = useState(0)
  const [maxMintingQuantity, setMaxMintingQuantity] = useState(0)
  const [txHash, setTxHash] = useState()
  const [mintingError, setMintingError] = useState("")
  let url: any;
  /*
  {
    "height": "6887450",
    "result": {
      "can_mint_more": true,
      "amount_minted": 1,
      "curr_num_tokens": 12,
      "max_tokens": 30,
      "limit_per_address": 10
    }
  }
  {"wallet_permissions":{"address":"terra1w03mtgc2gkmeqsvqf8a8zw5s2f30wfyduwnmnn"}}
*/
  const lcdClient = useLCDClient()
  useEffect(() => { 
    const getMintingQuantities = async () => {
      let walletPermissions: any;
      try {
        walletPermissions = await lcdClient.wasm.contractQuery(lootFactory, {
          "wallet_permissions":{"address":address}
        });
        setMaxMintingQuantity(walletPermissions.limit_per_address)
        setMintingQuantity(walletPermissions.amount_minted)
      } catch (e) {
          console.log(e)
      }
      console.log(walletPermissions);
    }
  
    getMintingQuantities()
  }, [])

  // View the loot
  const [loots, setLoots] = useState([{ 
    name: null,
    image: null,
    attributes: [null],
  }])
  useEffect(() => { 
    let lootsArray: any;
    const getLootInfo = async (tokens:any) => {
      try {
        await tokens.forEach(
          async (token:any) => {
            try {
              const tokenInfo = await limiter.schedule(() => lcdClient.wasm.contractQuery(cw721Contract, {
                "nft_info": { "token_id": token } 
              }));

              setLoots([...loots, tokenInfo.extension])
            }
            catch (e) {
              console.log(e)
            }
          }
        );
        return lootsArray;
        //setLoots([...loots, tokenInfo.extension])

      }
      catch (e) {
        console.log(e)
      }

    }
    const getLoots = async () => {
      let tokens: any;
      try {
        tokens = await lcdClient.wasm.contractQuery(cw721Contract, {
          "tokens":{"owner":address}
        });
        console.log(tokens.tokens);
        getLootInfo(tokens.tokens);
        
      } catch (e) {
          console.log(e)
      }
    }
  
    getLoots()
  }, [])
  
  
  let mintResponse: any;

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
        mintResponse = await post(txOptions) 
        setMinting("Minting Successful!");
        url = "https://finder.extraterrestrial.money/testnet/tx/" + mintResponse.result.txhash;
        setTxHash(url)
        setMintingQuantity(mintingQuantity+1)
      } catch(e) { console.log(e) }

 
    } catch (error: any) {
      mintResponse = "Error minting"
      setMintingError(mintResponse)
      console.log(error.name)
    }
  }




  return (
    <>
      <div>
        <div>
          <p className="text-center">Can mint: {mintingQuantity}/{maxMintingQuantity}</p>
        </div>
        <div className="text-center">
          <button className="nes-btn is-primary" onClick={mint}>Mint Weapons Loot</button>
        </div>
        {
          minting !== "" ?
          <div>
            <p></p>
            <p className="text-center">{minting}</p>
            <p className="text-center"><a target="_blank" rel="noreferrer" href={txHash}>View Transaction</a></p>
          </div>
          : 
          ""
        }
        {
          mintingError !== "" ?
          <div>
            <p className="text-center">{mintingError}</p>
          </div>
          : 
          ""
        }
      </div>

      <div>
        <div>
        <ul>
          { loots !== null ? loots.map((loot, i) => <li>{loot.name}</li>) : "" }
        </ul>
        </div>
      </div>
    </>
  )
}

export default MintButton
