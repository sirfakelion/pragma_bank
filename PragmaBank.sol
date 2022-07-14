// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8; // 0.8.12 La version más estable hasta el momento es la 0.8.7 por eso la usaremos sobre la 0.8.12 el ^indica que cualquier version superior a esta funcionara de seguro

contract PragmaBank {
    // Aqui va el contenido de todo el contrato
    // boolean, uint, int, address, bytes, string
    // bool hasFavoriteNumber = true;
    // int8 favoriteNumber = -5;  // por defecto usará int256 pero puedes especificar int8
    // string favoriteNumberInText = "Five";
    // address myAdress = 0x686304946854Fe16F48289f6F9414B58E0895856;
    // bytes32 = favoriteBytes = "cat";

    struct People {
        uint256 idNumber;
        uint256 balance;
        string name;
        string email;
        address walletAddress;
    }

    uint256 private favoriteNumber = 0; // por defecto usará uint256 pero puedes especificar uint8
    People public person = People({favoriteNumber: 2, name: "Joao"});

    People[] public listOfPeople;

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        People memory newPerson = People({
            name: _name,
            favoriteNumber: _favoriteNumber
        });
        listOfPeople.push(newPerson);
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }

    mapping(string => uint256) public nameToFavoriteNumber;

    // direccion del contrato: 0xd9145CCE52D386f254917e481eB44e9943F39138
    // 0xDA0bab807633f07f013f94DD0E6A4F96F8742B53
}
