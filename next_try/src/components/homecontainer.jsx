import React, { Component } from "react";
import { Container, Col, Row, Pagination } from "react-bootstrap";
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

function TVPagination(props) {
  const curr_page = props.curr_page;
  const num_pages = props.num_pages;

  let items = [];
  for (let number = 1; number <= num_pages; number++) {
    items.push(
      <Pagination.Item key={number} active={number === curr_page}>
        {number}
      </Pagination.Item>
    );
  }

  const paginationBasic = (
    <div>
      <Pagination>{items}</Pagination>
    </div>
  );

  return paginationBasic;
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
    <div>
      <Container>
        <Row>{build_tv_list}</Row>
      </Container>
    </div>
  );
}

function DisplayTv(props) {
  if (props.state === null) {
    return <ConcernFroge />;
  }

  const active = props.state.active;

  const curr_page = props.state.curr_page;
  const num_pages = props.state.num_pages;

  return (
    <div>
      <RenderTvs tvs={props.tvs} />
      <TVPagination curr_page={curr_page} num_pages={num_pages} />
    </div>
  );
}

//main body component that holds all TV's
//
class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = null;
    this.tvs = null;
    this.tv_disp_count = 30;
    this.getTvs();
  }

  // Obtain TVs from the database. Update state upon completion.
  getTvs() {
    var xhr = new XMLHttpRequest();

    // get a callback when the server responds
    xhr.addEventListener("load", () => {
      // update the state of the component with the result here
      this.tvs = JSON.parse(xhr.responseText);
      this.setState({
        active: true,
        curr_page: 1,
        num_pages: Math.ceil(this.tvs.length / this.tv_disp_count)
      });
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
        <DisplayTv tvs={this.tvs} state={this.state} />
      </div>
    );
  }
}

export default HomeContainer;
