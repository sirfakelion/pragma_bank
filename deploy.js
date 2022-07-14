const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
    //Compile them in our code
    // Compile them separately
    // http://127.0.0.1:7545

    const provider = new ethers.providers.JsonRpcProvider(
        process.env.ALCHEMY_URL
    );
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const encryptedJson = fs.readFileSync(
        "./.encryptedKeyAlchemy.json",
        "utf8"
    );
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        process.env.PRIVATE_KEY_PASSWORD
    );
    wallet = await wallet.connect(provider);
    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf8"
    );
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    );
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying, please wait...");
    const contract = await contractFactory.deploy();
    await contract.deployTransaction.wait(1);
    console.log(`Contract address: ${contract.address}`);
    const currentFavoriteNumber = await contract.retrieve();
    console.log(`Current favorite number: ${currentFavoriteNumber.toString()}`);
    const transactionResponse = await contract.store("7");
    const transactionReceipt = await transactionResponse.wait(1);
    const currentFavoriteNumberUpdated = await contract.retrieve();
    console.log(
        `Updated favorite number: ${currentFavoriteNumberUpdated.toString()}`
    );
    // podemos esperar un bloque más para asegurarnos que la cadena más larga sea quien lo implemente
    // const transactionReceipt = await contract.deployTransaction.wait(1);
    // console.log("Let's deploy with only transaction data!");
    // const nonce = await wallet.getTransactionCount();
    // console.log(nonce);
    // const tx = {
    //   nonce: nonce,
    //   gasPrice: ethers.utils.formatBytes32String("20000000000"),
    //   gasLimit: 1000000,
    //   to: null,
    //   value: 0,
    //   data: "0x6080604052600080556040518060400160405280600281526020016040518060400160405280600481526020017f4a6f616f00000000000000000000000000000000000000000000000000000000815250815250600160008201518160000155602082015181600101908162000076919062000307565b5050503480156200008657600080fd5b50620003ee565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200010f57607f821691505b602082108103620001255762000124620000c7565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200018f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000150565b6200019b868362000150565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620001e8620001e2620001dc84620001b3565b620001bd565b620001b3565b9050919050565b6000819050919050565b6200020483620001c7565b6200021c6200021382620001ef565b8484546200015d565b825550505050565b600090565b6200023362000224565b62000240818484620001f9565b505050565b5b8181101562000268576200025c60008262000229565b60018101905062000246565b5050565b601f821115620002b75762000281816200012b565b6200028c8462000140565b810160208510156200029c578190505b620002b4620002ab8562000140565b83018262000245565b50505b505050565b600082821c905092915050565b6000620002dc60001984600802620002bc565b1980831691505092915050565b6000620002f78383620002c9565b9150826002028217905092915050565b62000312826200008d565b67ffffffffffffffff8111156200032e576200032d62000098565b5b6200033a8254620000f6565b620003478282856200026c565b600060209050601f8311600181146200037f57600084156200036a578287015190505b620003768582620002e9565b865550620003e6565b601f1984166200038f866200012b565b60005b82811015620003b95784890151825560018201915060208501945060208101905062000392565b86831015620003d95784890151620003d5601f891682620002c9565b8355505b6001600288020188555050505b505050505050565b610a0e80620003fe6000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80632e64cec1146100675780632ebce631146100855780636057361d146100b65780636f760f41146100d257806377ec2b55146100ee5780638bab8dd51461010d575b600080fd5b61006f61013d565b60405161007c919061037c565b60405180910390f35b61009f600480360381019061009a91906103d7565b610146565b6040516100ad92919061049d565b60405180910390f35b6100d060048036038101906100cb91906103d7565b610202565b005b6100ec60048036038101906100e79190610602565b61020c565b005b6100f661029b565b60405161010492919061049d565b60405180910390f35b6101276004803603810190610122919061065e565b610335565b604051610134919061037c565b60405180910390f35b60008054905090565b6003818154811061015657600080fd5b906000526020600020906002020160009150905080600001549080600101805461017f906106d6565b80601f01602080910402602001604051908101604052809291908181526020018280546101ab906106d6565b80156101f85780601f106101cd576101008083540402835291602001916101f8565b820191906000526020600020905b8154815290600101906020018083116101db57829003601f168201915b5050505050905082565b8060008190555050565b60006040518060400160405280838152602001848152509050600381908060018154018082558091505060019003906000526020600020906002020160009091909190915060008201518160000155602082015181600101908161027091906108b3565b5050508160048460405161028491906109c1565b908152602001604051809103902081905550505050565b60018060000154908060010180546102b2906106d6565b80601f01602080910402602001604051908101604052809291908181526020018280546102de906106d6565b801561032b5780601f106103005761010080835404028352916020019161032b565b820191906000526020600020905b81548152906001019060200180831161030e57829003601f168201915b5050505050905082565b6004818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b6000819050919050565b61037681610363565b82525050565b6000602082019050610391600083018461036d565b92915050565b6000604051905090565b600080fd5b600080fd5b6103b481610363565b81146103bf57600080fd5b50565b6000813590506103d1816103ab565b92915050565b6000602082840312156103ed576103ec6103a1565b5b60006103fb848285016103c2565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561043e578082015181840152602081019050610423565b8381111561044d576000848401525b50505050565b6000601f19601f8301169050919050565b600061046f82610404565b610479818561040f565b9350610489818560208601610420565b61049281610453565b840191505092915050565b60006040820190506104b2600083018561036d565b81810360208301526104c48184610464565b90509392505050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61050f82610453565b810181811067ffffffffffffffff8211171561052e5761052d6104d7565b5b80604052505050565b6000610541610397565b905061054d8282610506565b919050565b600067ffffffffffffffff82111561056d5761056c6104d7565b5b61057682610453565b9050602081019050919050565b82818337600083830152505050565b60006105a56105a084610552565b610537565b9050828152602081018484840111156105c1576105c06104d2565b5b6105cc848285610583565b509392505050565b600082601f8301126105e9576105e86104cd565b5b81356105f9848260208601610592565b91505092915050565b60008060408385031215610619576106186103a1565b5b600083013567ffffffffffffffff811115610637576106366103a6565b5b610643858286016105d4565b9250506020610654858286016103c2565b9150509250929050565b600060208284031215610674576106736103a1565b5b600082013567ffffffffffffffff811115610692576106916103a6565b5b61069e848285016105d4565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806106ee57607f821691505b602082108103610701576107006106a7565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026107697fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8261072c565b610773868361072c565b95508019841693508086168417925050509392505050565b6000819050919050565b60006107b06107ab6107a684610363565b61078b565b610363565b9050919050565b6000819050919050565b6107ca83610795565b6107de6107d6826107b7565b848454610739565b825550505050565b600090565b6107f36107e6565b6107fe8184846107c1565b505050565b5b81811015610822576108176000826107eb565b600181019050610804565b5050565b601f8211156108675761083881610707565b6108418461071c565b81016020851015610850578190505b61086461085c8561071c565b830182610803565b50505b505050565b600082821c905092915050565b600061088a6000198460080261086c565b1980831691505092915050565b60006108a38383610879565b9150826002028217905092915050565b6108bc82610404565b67ffffffffffffffff8111156108d5576108d46104d7565b5b6108df82546106d6565b6108ea828285610826565b600060209050601f83116001811461091d576000841561090b578287015190505b6109158582610897565b86555061097d565b601f19841661092b86610707565b60005b828110156109535784890151825560018201915060208501945060208101905061092e565b86831015610970578489015161096c601f891682610879565b8355505b6001600288020188555050505b505050505050565b600081905092915050565b600061099b82610404565b6109a58185610985565b93506109b5818560208601610420565b80840191505092915050565b60006109cd8284610990565b91508190509291505056fea2646970667358221220749942a55a6eff14a55fcd86cfdaec737117b5fe61264403252056cf0b4869e464736f6c634300080f0033",
    //   chainId: 1337,
    // };
    // // const signedx = wallet.signTransaction(tx);
    // const sentTxResponse = await wallet.sendTransaction(tx);

    // await sentTxResponse.wait(1);
    // console.log(sentTxResponse);

    // console.log("Here is the deployment transaction: ");
    // console.log(contract.deployTransaction);
    // console.log("Here is the transaction receipt: ");
    // console.log(transactionReceipt);

    // console.log(contract);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });