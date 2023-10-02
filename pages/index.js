import { useState } from "react";
import {
  useAddress,
  useTokenBalance,
  useContractWrite,
  useMetamask,
  useContract,
  useDisconnect,
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
  const disconnect = useDisconnect();

  const { contract: tokenContract, isLoading: tokenContractIsLoading } =
    useContract(tokenAddress, tokenAbi);
  console.log("🚀 ~ file: index.js:19 ~ Home ~ tokenContract:", tokenContract);

  const { data: tokenBalance, isLoading: tokenBalanceIsLoading } =
    useTokenBalance(tokenContract, address);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {!address ? (
        <div className="text-center">
          <p className="text-2xl font-semibold mb-4 text-blue-600">
            Please Connect your wallet to mint{" "}
            <b className="text-blue-800">Token(TKN)</b>
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 py-2 px-4 rounded-full"
            onClick={connectWithMetamask}>
            Connect
          </button>
        </div>
      ) : (
        <div className="text-center">
          {tokenContractIsLoading ? (
            <div className="text-xl font-semibold text-gray-600">
              Loading !!!
            </div>
          ) : (
            <>
              <p className="text-2xl font-semibold mb-4 text-blue-600">
                Your TKN Balance
              </p>
              <span className="text-3xl font-bold">
                {tokenBalanceIsLoading ? (
                  <>Loading!!!! Balance</>
                ) : (
                  <>
                    {" "}
                    {Number(tokenBalance?.displayValue).toLocaleString()}{" "}
                    <span className="text-blue-800">
                      {tokenBalance?.symbol}
                    </span>
                  </>
                )}
              </span>
              <p className="mt-4">
                {tokenBalance?.displayValue === "0"
                  ? "Want some token?? Mint more"
                  : "Get Started By Minting some token"}
              </p>
              {/* <br /> */}
              <div className="mt-6">
                <input
                  className="border border-gray-300 p-3 rounded"
                  placeholder="Enter an amount 😉😏"
                  disabled={mintIsLoading}
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                />
                <button
                  className={`${
                    mintIsLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white font-semibold py-3 px-4 rounded-full ml-2`}
                  disabled={mintIsLoading}
                  onClick={mintToken}>
                  {mintIsLoading ? "Minting..." : "Mint"}
                </button>
              </div>
            </>
          )}
          {/* <br /> */}
          <button
            onClick={disconnect}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full mt-6">
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
