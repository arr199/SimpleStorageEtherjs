import { ethers } from 'ethers'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
    const provider = new ethers.InfuraProvider(
        'sepolia',
        'da67924638114a29963ae1a01164dbe2',
    )
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider)
    const abi = fs.readFileSync('./simpleStorage_sol_SimpleStorage.abi', 'utf8')
    const bytecode = fs.readFileSync(
        './simpleStorage_sol_SimpleStorage.bin',
        'utf8',
    )

    // Creating and sending the transaction object
    // const tx = await signer.sendTransaction({
    //     to: '0x68461Da21DCb3C9eFe6EE079eC3b434f2d6E72E4',
    //     nonce: 15,
    //     gasLimit: 58000,
    //     gasPrice: ethers.parseUnits('15', 'gwei'),
    //     value: ethers.parseUnits('0.01', 'ether'),
    // })

    // console.log('Mining transaction...')
    // console.log(`https://sepolia.etherscan.io/tx/${tx.hash}`)
    // // Waiting for the transaction to be mined
    // const receipt = await tx.wait()
    // // The transaction is now on chain!
    // console.log(`Mined in block ${receipt?.blockNumber}`)

    const contractFactory = new ethers.ContractFactory(abi, bytecode, wallet)
    console.log('Deploying contract...')

    const contract = await contractFactory.deploy({
        gasLimit: 888440,
        gasPrice: ethers.parseUnits('15', 'gwei'),
    })

    const receipt = await contract.waitForDeployment()

    console.log(
        `Contract deployed at address: https://sepolia.etherscan.io/address/${await receipt.getAddress()}`,
    )
    const storeTransaction = await contract.store('42') // Use the store method on the contract
    console.log('Stored 42 in the contract')
    await provider.waitForTransaction(storeTransaction.hash)
    console.log((await contract.retrieve()).toString()) // Use the retrieve method on the contract
}
main()
