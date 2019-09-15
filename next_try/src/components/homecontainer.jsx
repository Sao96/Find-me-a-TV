import React, { Component } from "react";
import { Container, Col, Row } from "react-bootstrap";
import ItemBox from "./itembox";

class ConcernFroge extends Component {
  render() {
    return (
      <div>
        <img src="https://static-cdn.jtvnw.net/jtv_user_pictures/f5ea9bbf-8013-4c37-84b8-8f7608e8e833-profile_image-300x300.png"></img>{" "}
      </div>
    );
  }
}

function DisplayTv(props) {
  const curr_state = props.state;
  if (curr_state === null) {
    return <ConcernFroge />;
  }

  return <RenderTvs tvs={props.tvs} />;
}

// over here, we get the list of TVs & state of the home container.
function RenderTvs(props) {
  const tvs_list = props.tvs;

  const build_tv_list = tvs_list.map(tvs_list => (
    <Col>
      <ItemBox
        state={tvs_list.state}
        product_url={tvs_list.product_url}
        thumb_url={tvs_list.thumb_url}
        brand={tvs_list.brand}
        model={tvs_list.model}
        price={tvs_list.price}
      />
    </Col>
  ));
  return (
    <Container>
      <Row>{build_tv_list}</Row>
    </Container>
  );
}

class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = null;
    this.tvs = null;
    this.getTvs();
  }

  getTvs() {
    var xhr = new XMLHttpRequest();

    // get a callback when the server responds
    xhr.addEventListener("load", () => {
      // update the state of the component with the result here
      this.tvs = JSON.parse(xhr.responseText);
      this.setState({ update: true });
    });
    // open the request with the verb and the url
    xhr.open("POST", "http://localhost:8080");

    xhr.setRequestHeader("Content-Type", "text/plain");
    // send the request
    xhr.send(JSON.stringify({ query: "SELECT * FROM WALMART" }));
  }

  render() {
    return (
      <div id="homecontainer">
        <Container>
          <DisplayTv tvs={this.tvs} state={this.state} />
        </Container>
      </div>
    );
  }
}

export default HomeContainer;
