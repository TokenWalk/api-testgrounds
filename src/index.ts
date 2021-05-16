const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

// ERC721 with art token extension
const artToken = JSON.parse(fs.readFileSync(path.join(__dirname + '/ArtToken.json')));

let provider = new ethers.providers.InfuraProvider("rinkeby", "292c366623594a44a3d5e76a68d1d9d2");

let wallet = new ethers.Wallet('0x011f5d8c37def36f4bd85f8b1a8e82bf104abdaac8c0710ab70e5f86dba180cc', provider)

let twAddress = '0xb4e4ad7b0A1dCF480592FcC8B0E008FBdE45e03D'
let twContract = new ethers.Contract(twAddress, artToken.abi, provider)
let twContractWithSigner = twContract.connect(wallet)

async function getBalance() {
	let balance = await wallet.getBalance();
	console.log(balance.toString())
}

async function createNFTCustomDomain(name, symbol, uri, numberOfEditions) {

}

async function createWithNFTTWDomain(numberOfEditions) {
	let _tx = await twContractWithSigner.mintEdition(numberOfEditions)

    provider.once(_tx.hash, (receipt) => {
        console.log('Transaction Minded: ' + receipt.transactionHash);
        console.log(receipt);
    })
}

async function deployTWDomain() {
    // Create an instance of a Contract Factory
    let factory = new ethers.ContractFactory(artToken.abi, artToken.bytecode, wallet);

    // Notice we pass in "Hello World" as the parameter to the constructor
    let contract = await factory.deploy("Walk", "TWD");

    // The address the Contract WILL have once mined
    // See: https://ropsten.etherscan.io/address/0x2bd9aaa2953f988153c8629926d22a6a5f69b14e
    console.log(contract.address);
    // "0x2bD9aAa2953F988153c8629926D22A6a5F69b14E"

    // The transaction that was sent to the network to deploy the Contract
    // See: https://ropsten.etherscan.io/tx/0x159b76843662a15bd67e482dcfbee55e8e44efad26c5a614245e12a00d4b1a51
    console.log(contract.deployTransaction.hash);
    // "0x159b76843662a15bd67e482dcfbee55e8e44efad26c5a614245e12a00d4b1a51"

    // The contract is NOT deployed yet; we must wait until it is mined
    await contract.deployed()
    console.log('transaction mined')
}

async function getMetadata(_nftAddress, _nftId) {
	let nftContract = new ethers.Contract(_nftAddress, artToken.abi, provider)
	let uri = await nftContract.tokenURI(_nftId)
	console.log(uri)
}

async function deployCustomDomain(name, symbol) {

}

async function deploySingleNFT() {

}

async function createNFTTW() {

}

async function isSigned(_nftId, _nftAddress) {
	let nftContract = new ethers.Contract(_nftAddress, artToken.abi, provider)

	try {
		let signature = await nftContract.getSignature(_nftId)
		//console.log(signature)
		return true
	} catch(err) {
		//console.log(err.reason)
		return false
	}
}

async function getSignature(_nftId) {
	try {
		let signature = await twContractWithSigner.getSignature(_nftId)
		//console.log(signature)
		return signature
	} catch(err) {
		//console.log(err.reason)
		return Error('signature does not exist')
	}
}

async function isSignableNFT(_nftAddress) {
	let nftContract = new ethers.Contract(_nftAddress, artToken.abi, provider)

	try {
		let signature = await nftContract.getSignature(1)
		return true
	} catch(err) {
		if(err.reason) {
			if(err.reason === 'cannot estimate gas; transaction may fail or may require manual gas limit') {
				return false
			}
			if(err.reason === 'ERC721Extensions: no signature exists for this Id') {
				return true
			}
		} else {
			return false
		}
	}
}

async function checkOwnership(_walletAddress, _nftAddress, _nftId) {
	let nftContract = new ethers.Contract(_nftAddress, artToken.abi, provider)
	let nftContractWithSigner = nftContract.connect(wallet)
	let owner = await nftContractWithSigner.ownerOf(_nftId)
	console.log(owner)
	console.log(owner === _walletAddress)

}

async function main() {
	getBalance()
	//deployTWDomain()
	//createWithNFTTWDomain(10)
	getMetadata('0xb4e4ad7b0A1dCF480592FcC8B0E008FBdE45e03D', 7)
	checkOwnership('0x1b4deF26044A75A26B808B4824E502Ab764c5027', '0xb4e4ad7b0A1dCF480592FcC8B0E008FBdE45e03D', 7)
	let signed = await isSigned(1, '0xb4e4ad7b0A1dCF480592FcC8B0E008FBdE45e03D')
	console.log('TokenId 1 is signed: ' + signed)
	let test = await isSignableNFT('0x58dd43b4991bfaf5a7e838766a4595262136f7fb')
	console.log('this nft is signable: ' + test)
}

main()
