import React, { Component } from 'react';

class Main2 extends Component {

  myFunc(price,cropId){
    let quant = prompt("Enter quantity");
    let qty = parseInt(quant);
    this.props.purchaseStock(cropId,qty,price*qty)
  }

  render() {
    return (
      <div id="content">
        <h1>Add Crop (Middleman to Market)</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const quantity = this.cropQuantity.value
          const price = window.web3.utils.toWei(this.cropPrice.value, 'Ether')
          this.props.releaseStock(quantity, price)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="cropQuantity"
              type="text"
              ref={(input) => { this.cropQuantity = input }}
              className="form-control"
              placeholder="Crop Quantity"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="cropPrice"
              type="text"
              ref={(input) => { this.cropPrice = input }}
              className="form-control"
              placeholder="Crop Price"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Crop</button>
        </form>
        <p> </p>
        <h2>Buy Crop</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Qty</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="cropList">
          {this.props.crops.map((crop, key) => {
            return(
                <tr key={key}>
                <td>{parseInt(crop.quantity._hex)}</td>
                <td>{window.web3.utils.fromWei(crop.price._hex, 'Ether')} Eth</td>
                <td>{crop.owner}</td>
                <td>
                    { (crop.quantity>0)
                    ? 
                      <button type="submit" value="buy" id={key+"butt"} onClick={(price,id) => this.myFunc(crop.price._hex,crop.cropId)}>BUY</button>
                      : null
                    }
                    </td>
                </tr>
            )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main2;