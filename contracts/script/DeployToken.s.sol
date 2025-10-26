// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import "../src/ClaimableAirdrop.sol";

contract DeployToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        MockWrappedETH token = new MockWrappedETH();
        
        console.log("MockWrappedETH deployed to:", address(token));
        
        vm.stopBroadcast();
    }
}