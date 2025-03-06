const crypto = require('crypto');
const Web3 = require('web3').default;
const Blockchain = require('C:/Users/apurv/VeriChain/backend/build/contracts/Blockchain.json');
const { bigIntSerializer } = require('C:/Users/apurv/VeriChain/backend/bigint-serialization.cjs');
const BN = require('bn.js'); // Import BN library

const web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/MbHGQA54I7GyOtqryrkna-NtUiodAOha', {
  handleRevert: true,
  numberFormat: 'STRING'
});

const contractAddress = '0x192b8B54b3c86f1Bd45804DC8AaD50ee9627604F';
const contract = new web3.eth.Contract(Blockchain.abi, contractAddress);

exports.verifyDigitalSignature = async (req, res) => {
  try {
    const { data, publicKey, signature, userAddress, privateKey } = req.body;

    if (!data || !publicKey || !signature || !userAddress || !privateKey) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const publicKeyBuffer = Buffer.from(publicKey, 'base64');
    const publicKeyObj = crypto.createPublicKey({
      key: publicKeyBuffer,
      type: 'spki',
      format: 'der'
    });

    const verifier = crypto.createVerify('SHA256');
    verifier.update(data);
    const isVerified = verifier.verify(publicKeyObj, Buffer.from(signature, 'base64'));

    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: "Digital signature verification failed"
      });
    }

    const transaction = contract.methods.addBlock(data, signature, publicKey);
    const gas = await transaction.estimateGas({ from: userAddress });
    
    const signedTx = await web3.eth.accounts.signTransaction(
      {
        to: contractAddress,
        data: transaction.encodeABI(),
        gas,
        gasPrice: await web3.eth.getGasPrice(),
        from: userAddress
      },
      privateKey
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    // Add null checks for receipt
    if (!receipt || !receipt.transactionHash) {
      throw new Error('Transaction receipt not received properly');
    }

    // Explicitly structure the response
    const responseData = {
      success: true,
      message: "Verification successful",
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber?.toString() || 'pending',
      status: receipt.status?.toString() || '0'
    };

    console.log("Transaction Details:", responseData);
    return res.status(200).json(responseData);

  } catch (error) {
    console.error("Transaction Error:", error);
    return res.status(500).json({
      success: false,
      message: "Transaction processing failed",
      error: error.message
    });
  }
};

exports.getBlocks = async (req, res) => {
  try {
    const { userAddress } = req.body;

    if (!userAddress) {
      return res.status(400).json({ message: "User  address is required" });
    }

    // Call the getBlocks function from the smart contract
    const blocks = await contract.methods.getBlocks().call({ from: userAddress });

    res.json({ message: "Blocks fetched successfully", blocks });
  } catch (error) {
    console.error("Error fetching blocks:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateBlock = async (req, res) => {
  try {
    const { userAddress, privateKey, newData } = req.body;

    if (!userAddress || !privateKey || !newData) {
      return res.status(400).json({ message: "All fields are required: userAddress, privateKey, and newData" });
    }

    // Fetch the current blocks for the user
    const blocks = await contract.methods.getBlocks().call({ from: userAddress });

    // Check if there are any blocks
    if (blocks.length === 0) {
      return res.status(400).json({ message: "No blocks found for the user" });
    }

    // Set the index to the last block
    const index = blocks.length - 1;

    // Call the updateBlock function from the smart contract
    const transaction = contract.methods.updateBlock(index, newData);

    // Estimate gas for the transaction
    const gas = await transaction.estimateGas({ from: userAddress });

    // Sign the transaction
    const signedTransaction = await web3.eth.accounts.signTransaction(
      {
        to: contractAddress,
        data: transaction.encodeABI(),
        gas: gas, // Use estimated gas
        gasPrice: await web3.eth.getGasPrice(), // Include the gas price
        from: userAddress,
      },
      privateKey
    );

    // Send the signed transaction
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    res.json({ message: "Block updated successfully", receipt });
  } catch (error) {
    console.error("Error updating block:", error);
    res.status(500).json({ error: error.message });
  }
};