import { useState, useEffect } from "react";
import { ethers } from "ethers";
import rentalTokenAbi from "../artifacts/contracts/RentalToken.sol/RentalToken.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [rentalToken, setRentalToken] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [tokenName, setTokenName] = useState(undefined);
  const [tokenAbbreviation, setTokenAbbreviation] = useState(undefined);
  const [totalSupply, setTotalSupply] = useState(undefined);
  const [propertyId, setPropertyId] = useState(0);
  const [location, setLocation] = useState("");
  const [rentAmount, setRentAmount] = useState(0);
  const [rechargeAmount, setRechargeAmount] = useState(0);

  const contractAddress = "0xYourContractAddressHere";
  const rentalTokenABI = rentalTokenAbi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account.length > 0) {
      console.log("Account connected: ", account);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getRentalTokenContract();
  };

  const getRentalTokenContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const rentalTokenContract = new ethers.Contract(contractAddress, rentalTokenABI, signer);

    setRentalToken(rentalTokenContract);
  };

  const getBalance = async () => {
    if (rentalToken) {
      setBalance((await rentalToken.getBalance()).toNumber());
    }
  };

  const getTotalSupply = async () => {
    if (rentalToken) {
      setTotalSupply((await rentalToken.getTotalSupply()).toNumber());
    }
  };

  const getTokenName = async () => {
    if (rentalToken) {
      setTokenName(await rentalToken.getTokenName());
    }
  };

  const getTokenAbbreviation = async () => {
    if (rentalToken) {
      setTokenAbbreviation(await rentalToken.getTokenAbbrv());
    }
  };

  const listProperty = async () => {
    if (rentalToken && location && rentAmount > 0) {
      let tx = await rentalToken.listProperty(location, rentAmount);
      await tx.wait();
      alert("Property listed successfully!");
    }
  };

  const rentProperty = async () => {
    if (rentalToken && propertyId >= 0) {
      let tx = await rentalToken.rentProperty(propertyId);
      await tx.wait();
      getBalance();
      alert("Property rented successfully!");
    }
  };

  const recharge = async () => {
    if (rentalToken && rechargeAmount > 0) {
      let tx = await rentalToken.rechargeAccount(rechargeAmount, { value: ethers.utils.parseEther(rechargeAmount.toString()) });
      await tx.wait();
      getTotalSupply();
      getBalance();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this application.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your MetaMask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    if (tokenName === undefined) {
      getTokenName();
      getTotalSupply();
    }

    if (tokenAbbreviation === undefined) {
      getTokenAbbreviation();
    }
    
    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Token Name: {tokenName}</p>
        <p>Token Abbreviation: {tokenAbbreviation}</p>
        <p>Total Supply: {totalSupply}</p>
        <p>Your Balance: {balance}</p>
        <div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Property Location"
          />
          <input
            type="number"
            value={rentAmount}
            onChange={(e) => setRentAmount(Number(e.target.value))}
            placeholder="Rent Amount"
          />
          <button onClick={listProperty}>List Property</button>
        </div>
        <div>
          <input
            type="number"
            value={propertyId}
            onChange={(e) => setPropertyId(Number(e.target.value))}
            placeholder="Property ID to Rent"
          />
          <button onClick={rentProperty}>Rent Property</button>
        </div>
        <div>
          <input
            type="number"
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(Number(e.target.value))}
            placeholder="Amount to recharge"
          />
          <button onClick={recharge}>Recharge Account</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Rental Token Manager!</h1>
      </header>
      {initUser()}
      <style jsx>
        {`
          .container {
            text-align: center;
          }
          input {
            margin: 0.5rem;
            padding: 0.5rem;
            width: 80%;
          }
          button {
            margin: 0.5rem;
            padding: 0.5rem 1rem;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
          }
          button:hover {
            background-color: #0056b3;
          }
        `}
      </style>
    </main>
  );
}
