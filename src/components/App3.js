import React, { Component } from 'react';
// import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar'
// import Marketplace from '../abis/Marketplace.json'
import CropMarket from '../abis/CropMarket.json'
import Main2 from './Main2'

class App3 extends Component {

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
      const userCountHex = await cropmarket.methods.userCount().call()
      const userCount = parseInt(userCountHex._hex)
      this.setState({userCount})
      console.log(userCountHex)
      for(let i = 1; i < userCount; i++){
        const user = await cropmarket.methods.userAccts(i).call()
        console.log(user)
        this.setState({
          users: [...this.state.users, user]
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
      userCount: 0,
      users: [],
      loading: false
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
          <main role="main" className="col-lg-12 d-flex">
          <table className="table">
            <thead>
                <tr>
                <th scope="col">Quantity</th>
                <th scope="col">Owner</th>
                </tr>
            </thead>
            <tbody>
            {this.state.users.map((user, key) => {
                return(
                    <tr key={key}>
                    <td>{parseInt(user.quantity._hex)}</td>
                    <td>{user.onwer}</td>
                    </tr>
                )
                })}
            </tbody>
            </table>
          </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App3;
