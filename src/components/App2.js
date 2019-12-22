import React, { Component } from 'react';
// import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar'
// import Marketplace from '../abis/Marketplace.json'
import CropMarket from '../abis/CropMarket.json'
import Main2 from './Main2'

class App2 extends Component {

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = CropMarket.networks[networkId]
    if(networkData) {
      const cropmarket = web3.eth.Contract(CropMarket.abi, networkData.address)
      this.setState({ cropmarket })
      const cropCountHex = await cropmarket.methods.cropCount().call()
      const cropCount = parseInt(cropCountHex._hex)
      this.setState({cropCount})
      console.log(cropCount)
      for(let i = 1; i < cropCount; i++){
        const crop = await cropmarket.methods.crops(i).call()
        console.log(crop)
        this.setState({
          crops: [...this.state.crops, crop]
        })
      }
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      cropCount: 0,
      crops: [],
      loading: false
    }
    this.releaseStock = this.releaseStock.bind(this)
    this.purchaseStock = this.purchaseStock.bind(this)
  }

  releaseStock(quantity, price){
      // this.setState({})
      this.state.cropmarket.methods.releaseStock(quantity,price).send({from: this.state.account})
      .once('receipt',(receipt) => {
        console.log('Success');
      })
    }

    purchaseStock(cropid,quantity,total){
      this.state.cropmarket.methods.purchaseStock(cropid,quantity).send({from: this.state.account, value: total})
      .once('receipt',(receipt) => {
        console.log('Success');
      })
    }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
          <main role="main" className="col-lg-12 d-flex">
            { this.state.loading
              ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
              : <Main2
                crops={this.state.crops}
                releaseStock={this.releaseStock}
                purchaseStock={this.purchaseStock}
                />
            }
          </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App2;
