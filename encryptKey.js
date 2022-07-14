const ethers = require("ethers")
const fs = require("fs")
require("dotenv").config()

async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_METAMASK)

    const encryptedJsonKey = await wallet.encrypt(
        process.env.PRIVATE_KEY_PASSWORD,
        process.env.PRIVATE_KEY_METAMASK
    )
    console.log(encryptedJsonKey)
    fs.writeFileSync("./.encryptedKeyAlchemy.json", encryptedJsonKey)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
