import React from "react";

// Component for the actual display of a TV. May assign defaults or remove values if field is undefined.
// @props: all details about a specific tv to display.
// @return: a component that has all details to display about a TV
function ItemBox(props) {
  let tv_image, tv_price;

  if (props.thumb_url === "null") {
    tv_image = "../tv_unavail.png";
  } else {
    tv_image = props.thumb_url;
  }

  if (props.price === null) {
    tv_price = "";
  } else {
    tv_price = "$" + String(props.price);
  }

  return (
    <div className="itembox">
      <a href={props.product_url}>
        <img
          alt={"An image of TV " + props.model}
          className="image_size"
          id="item_img"
          src={tv_image}
        ></img>
      </a>
      <span>
        <br></br>
        <div className="text_pos">
          <span className="product-text">
            {String(props.brand) + " " + String(props.model)}
          </span>
          <br></br>
          <span className="price-text">{tv_price}</span>
        </div>
      </span>
    </div>
  );
}

export default ItemBox;
