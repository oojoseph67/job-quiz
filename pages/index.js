import { useState } from "react";
import {
  useAddress,
  useTokenBalance,
  useConnectionStatus,
  useContractRead,
  useContractWrite,
  useMetamask,
  useContract,
} from "@thirdweb-dev/react";
import tokenAbi from "../blockchain/token.json";
import toast from "react-hot-toast";
import { ethers } from "ethers";

export default function Home() {
  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

  const [mintAmount, setMintAmount] = useState("");
  console.log("🚀 ~ file: index.js:18 ~ Home ~ mintAmount:", mintAmount);

  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const { contract: tokenContract, isLoading: tokenContractIsLoading } =
    useContract(tokenAddress, tokenAbi);
  console.log("🚀 ~ file: index.js:19 ~ Home ~ tokenContract:", tokenContract);

  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  console.log("🚀 ~ file: index.js:22 ~ Home ~ tokenBalance:", tokenBalance);

  const { mutateAsync: mint, isLoading: mintIsLoading } = useContractWrite(
    tokenContract,
    "mint"
  );

  const mintToken = async () => {
    const notification = toast.loading(`Minting !!! ${tokenBalance?.symbol}`);
    if (mintAmount === "") {
      toast.error(`Please input an amount you want to mint`, {
        id: notification,
      });
    } else {
      if (tokenBalance?.displayValue > "100000000") {
        toast.error(`You have enough token don't be greed 😐😒`, {
          id: notification,
        });
      } else {
        try {
          const mintAmountEther = ethers.utils.parseEther(mintAmount);
          const data = await mint({
            args: [address, mintAmountEther],
          });
          setMintAmount("");
          console.log("🚀 ~ file: index.js:47 ~ Home ~ data:", data);
          toast.success(`Approval Successfully`, {
            id: notification,
          });
        } catch (e) {
          toast.error(`Whoops ${e.reason}`, {
            id: notification,
          });
        }
      }
    }
  };

  return (
    <>
      {!address ? (
        <>
          <div>
            Please Connect your wallet to mint <b>Token(TKN</b>)
          </div>
          <button onClick={connectWithMetamask}>Connect</button>
        </>
      ) : (
        <>
          {tokenContractIsLoading ? (
            <>
              <div>Loading !!!</div>
            </>
          ) : (
            <>
              <div>Token Balance</div>
              <span>
                {Number(tokenBalance?.displayValue).toLocaleString()}{" "}
                {tokenBalance?.symbol}{" "}
              </span>
              <div>
                {tokenBalance?.displayValue > "0"
                  ? "Want some token?? Mint more"
                  : "Get Started By Minting some token"}
              </div>
              <div>
                <input
                  disabled={mintIsLoading}
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                />
                <button disabled={mintIsLoading} onClick={mintToken}>
                  {mintIsLoading ? "Minting !!!" : "Mint"}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
