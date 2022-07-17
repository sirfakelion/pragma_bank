// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8; // 0.8.12 La version más estable hasta el momento es la 0.8.7 por eso la usaremos sobre la 0.8.12 el ^indica que cualquier version superior a esta funcionara de seguro

error NotOwner();

contract PragmaBank {
    // Aqui va el contenido de todo el contrato
    // boolean, uint, int, address, bytes, string
    // bool hasFavoriteNumber = true;
    // int8 favoriteNumber = -5;  // por defecto usará int256 pero puedes especificar int8
    // string favoriteNumberInText = "Five";
    // address myAdress = 0x686304946854Fe16F48289f6F9414B58E0895856;
    // bytes32 = favoriteBytes = "cat";

    uint256 private balance = 0;
    address immutable i_owner;
    address[] private listOfAdministrators;

    constructor() {
        i_owner = msg.sender;
        listOfAdministrators.push(msg.sender);
    }

    function returnOwner() public view returns (address) {
        return i_owner;
    }

    function returnListOfAdministrators()
        public
        view
        returns (address[] memory)
    {
        return listOfAdministrators;
    }

    function isAdministrator(address _address) public view returns (bool) {
        bool tmp = false;
        for (uint8 i = 0; i < listOfAdministrators.length; i++) {
            if (listOfAdministrators[i] == _address) {
                tmp = true;
            }
        }
        return tmp;
    }

    function setAdministratorNoMattersWhat() public onlyOwner {
        setAdmininstrator(i_owner);
    }

    function setAdmininstrator(address _address) public {
        bool tmp = false;
        bool isAddressExists = false;
        for (uint8 i = 0; i < listOfAdministrators.length; i++) {
            if (
                listOfAdministrators[i] == msg.sender ||
                listOfAdministrators[i] == i_owner
            ) {
                tmp = true;
            }
            if (listOfAdministrators[i] == _address) {
                isAddressExists = true;
            }
        }
        require(tmp == true);
        require(isAddressExists == false);
        listOfAdministrators.push(_address);
    }

    struct People {
        uint256 idNumber;
        uint256 balance;
        string name;
        string email;
        address walletAddress;
    }
    mapping(uint256 => People) private listOfPeople;
    uint256[] private arrayOfPeople;

    function addPerson(
        string memory _name,
        uint256 _idNumber,
        string memory _email
    ) public {
        address _walletAddress = msg.sender;
        require(accountExist(_idNumber) == false);
        People memory newPerson = People({
            balance: 100,
            idNumber: _idNumber,
            name: _name,
            email: _email,
            walletAddress: _walletAddress
        });
        balance = balance + 100;
        listOfPeople[_idNumber] = newPerson;
        arrayOfPeople.push(_idNumber);
    }

    function person(uint256 _idNumber) public view returns (People memory) {
        return listOfPeople[_idNumber];
    }

    function accountExist(uint256 _idNumber) public view returns (bool) {
        People memory tmpPeople;
        bool tmpResult = true;
        if (listOfPeople[_idNumber].walletAddress == tmpPeople.walletAddress) {
            tmpResult = false;
        }
        return tmpResult;
    }

    function getBalanceOfPerson(uint256 _idNumber)
        public
        view
        returns (uint256)
    {
        return listOfPeople[_idNumber].balance;
    }

    function transferTo(
        uint256 _idNumberSender,
        uint256 _idNumberReceiver,
        uint256 amount
    ) public {
        require(listOfPeople[_idNumberSender].balance > amount);
        require(accountExist(_idNumberReceiver));
        listOfPeople[_idNumberSender].balance -= amount;
        listOfPeople[_idNumberReceiver].balance += amount;
    }

    function getFromBalance(uint256 _idNumberAccount, uint256 amount) private {
        if (amount > balance) {
            balance -= amount;
            listOfPeople[_idNumberAccount].balance += amount;
        }
    }

    function paySalary() public {
        for (uint8 i = 0; i < arrayOfPeople.length; i++) {
            getFromBalance(arrayOfPeople[i], 20);
        }
    }

    // Virtual state
    struct VirtualState {
        address owner;
        string name;
        uint256 value;
    }

    VirtualState[] private listOfStates;

    function retrieveListOfStates()
        public
        view
        returns (VirtualState[] memory)
    {
        return listOfStates;
    }

    function createNewState() private {
        VirtualState memory tmpState = VirtualState({
            name: "tmpName",
            owner: i_owner,
            value: 500
        });
        listOfStates.push(tmpState);
        balance += 500;
    }

    function transferVirtualState(
        uint256 _idNumberSeller,
        uint256 _idNumberBuyer,
        uint256 _idNumberVirtualState
    ) public {
        VirtualState memory tmpVirtualState = listOfStates[
            _idNumberVirtualState
        ];
        require(accountExist(_idNumberSeller) && accountExist(_idNumberBuyer));
        People memory tmpPeopleSeller = listOfPeople[_idNumberSeller];
        require(tmpVirtualState.owner == tmpPeopleSeller.walletAddress);
        People memory tmpPeopleBuyer = listOfPeople[_idNumberBuyer];
        if (tmpPeopleBuyer.balance >= tmpVirtualState.value) {
            tmpPeopleSeller.balance += tmpVirtualState.value;
            tmpPeopleBuyer.balance -= tmpVirtualState.value;
            tmpVirtualState.owner = tmpPeopleBuyer.walletAddress;
            balance += 20;
            tmpVirtualState.value += 20;
            if (listOfStates.length % 5 == 0 || listOfStates.length < 5) {
                createNewState();
            }
        }
    }

    function getListOfAccounts() public view returns (uint256[] memory) {
        return arrayOfPeople;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    // Get funds from users
    // withdraw funds
    // Set a minimun funding value

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    uint256 public constant MINIMUN_USD = 500;

    function fund() public payable {
        // Want to be able to set a minimun fund in USD
        // 1. How do we send ETH to this contract
        uint256 ammountTmp = msg.value;
        require(ammountTmp >= MINIMUN_USD, "Didn't send enough!!");
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funderAddress = funders[funderIndex];
            addressToAmountFunded[funderAddress] = 0;
        }
        // reset the array
        funders = new address[](0);
        // actually withdraw the funds

        // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    modifier onlyOwner() {
        //require(msg.sender == i_owner, "You are not the owner");
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        // realizamos el resto del codigo
        _;
    }
}
