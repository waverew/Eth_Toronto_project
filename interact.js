require("dotenv").config();
const fs = require("fs");
const { AccountId, PrivateKey, AccountCreateTransaction, Client, Hbar } = require("@hashgraph/sdk");
const { hethers } = require("@hashgraph/hethers");

const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

//const walletAddress = hethers.utils.getAddressFromAccount(signerId);

async function main() {
	// =============================================================================
	// STEP 1 - INITIALIZE A PROVIDER AND WALLET
    const privateKey = await PrivateKey.generateECDSAAsync();
    const publicKey = privateKey.publicKey;
    const transaction = new AccountCreateTransaction()
        .setKey(privateKey.publicKey)
        .setInitialBalance(new Hbar(1000));
    //Sign the transaction with the client operator private key and submit to a Hedera network
    const txResponse = await transaction.execute(client);
    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);
    //Get the account ID
    const newAccountId = receipt.accountId;

    console.log("private = " + privateKey);
    console.log("public = " + publicKey);
    console.log("account id = " + newAccountId);
	console.log(`\n- STEP 1 ===================================`);

	const provider = hethers.providers.getDefaultProvider("testnet");
    
	const eoaAccount = {
		account: newAccountId,
		privateKey: `0x${privateKey.toStringRaw()}`, // Convert private key to short format using .toStringRaw()
	};
	const wallet = new hethers.Wallet(eoaAccount, provider);
	console.log(`\n- Wallet address: ${wallet.address}`);
	console.log(`\n- Wallet public key: ${wallet.publicKey}`);

	// =============================================================================
	// STEP 2 - DEPLOY THE CONTRACT
	console.log(`\n- STEP 2 ===================================`);

	// Define the contract's properties
	const bytecode = fs.readFileSync("./LookupContract_sol_LookupContract.bin").toString();
	const abi = [
		"function register(bool _isCompany, string _zipCode) public",
		"function addComodityForSubmission(bytes32 _id, Comodity _comodity) public",
		"function addUserSubmission(address _company, bytes32 _id, UserSubmissions _userOrder) public",
		"function payBill(bytes32 orderId) public payable",
		"function claimEarnings(uint amount) public payable",
	];

	// Create a ContractFactory object
	const contract = new hethers.Contract("0x0000000000000000000000000000000002da4f47", abi, wallet);
    
	console.log("doin")
	console.log(`\n- STEP 3 ===================================`);

	// Setup a filter and event listener to know when an address receives/sends tokens
	// const filter = contract.filters.Transfer(walletAddress, null);

	// contract.once(filter, (from, to, amount, event) => {
	// 	console.log(`\n- Event: ${from} sent ${amount} tokens to ${to}`);
	// });

	// // Call contract functions
	const int = await contract.register(true, "M56 KSM",{ gasLimit: 300000 });
	// console.log(`\n- ERC20 token symbol: ${ercSymbol}`);

	// const ercTransfer = await contract.transfer(aliceAddress, 25, { gasLimit: 300000 });
	// console.log(`\n- Transaction ID for ERC20 transfer: ${ercTransfer.transactionId}`);

	// const wBalance = await contract.balanceOf(walletAddress, { gasLimit: 300000 });
	// const aBalance = await contract.balanceOf(aliceAddress, { gasLimit: 300000 });
	// console.log(`\n- Wallet ERC20 token (${ercSymbol}) balance: ${wBalance.toString()}`);
	// console.log(`\n- Alice's ERC20 token (${ercSymbol}) balance: ${aBalance.toString()}`);

	// console.log(`\n- DONE ===================================`);
}
main();