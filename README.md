# Master thesis

This 6-month master thesis called "Decentralized Document Management" proposes a new way to send business documents by combining new upcoming technologies together such as blockchains (Ethereum) and decentralized storage (IPFS). It is composed of two parts: the server side and the client side.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This master thesis was fully developped under Linux. The linux distribution used was Ubuntu 16.04.1 LTS. Moreover, a core software is required on the server side in order to run this master thesis: NodeJS.

```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
```
Once NodeJS intalled, some packages such as IPFS, testRPC, Web3 and Ethereum JS.
```
--- TestRPC ---
npm install -g ethereumjs-testrpc
--- EthereumJS ---
npm install ethereumjs-blockchain
--- web3 ---
npm install web3
--- IPFS ---
npm install ipfs --global
```

### Installing

#### Server side

Once all this software are installed on the server side, an IPFS deamon should be launched.

```
ipfs daemon
```
Then, a local blockchain should be fired.
```
testrpc
```
Now, it is time to start the deployment of the app. The *Directory.sol* smart contract should be first deployed with *directoryDeployment.js*

```
node directoryDeployment.js previousDirAdress UserWallet
```
Secondly, the he *User.sol* smart contract should be first deployed with *userDeployment.js*

```
node userDeployment.js lastDirAdress provider
```
Thirdly, the he *document.sol* smart contract should be first deployed with *documentDeployment.js*

```
node documentDeployment.js userWallet lastDocAddress pathToDoc docName diretoryAddress
```
This step should be run as much document should be deployed on the blockchain. Futher improvments will com to automate this process.

#### Client side

Copy the content of the folder `webpage` on the client side. The, open the webpage.
```
chromium-browser index.html
```

Enter the address of the *User.sol* smart contract address, hit Go! and voilà your documents are here.


## Results

![alt tag](https://github.com/frenchieisverige/master-thesis/blob/master/doc/ressources/webpage_example.png)


## Built With

* [node.js](https://nodejs.org/en/) - JavaScript runtime
* [ethereumjs-testrpc](https://github.com/ethereumjs/testrpc) - Node.js based Ethereum client for testing and development
* [web3](https://github.com/ethereum/wiki/wiki/JavaScript-API) - Ethereum blockchain interactions API
* [ipfs](https://ipfs.io/) - Decentralized storage provider
* [browserify](browserify.org) - Bundling up all of your dependencies 
browserify.org

## Authors

* **Emmanuel SCHWARTZ** - *Initial work* - [PurpleBooth](https://github.com/frenchieisverige/)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.




