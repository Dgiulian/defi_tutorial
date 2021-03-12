pragma solidity ^0.5.0;
import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    // Declare local variables
    string public name = "Dapp Token Farm";

    DappToken public dappToken;
    DaiToken public daiToken;

    //Executes only once when the contract is created
    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
    }
}
