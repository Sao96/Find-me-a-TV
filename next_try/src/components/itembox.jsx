import React, { Component } from "react";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";

class ItemBox extends Component {
  render() {
    return (
      <div className="itembox">
        <a href={this.props.product_url}>
          <img
            className="image_size"
            id="item_img"
            src={this.props.thumb_url}
          ></img>
        </a>
        <span>
          <br></br>
          <div className="text_pos">
            <span className="product-text">
              {String(this.props.brand) + " " + String(this.props.model)}
            </span>
            <br></br>
            <span className="price-text">${this.props.price}</span>
          </div>
        </span>
      </div>
    );
  }
}

export default ItemBox;
