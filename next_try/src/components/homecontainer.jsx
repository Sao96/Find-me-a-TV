import React, { Component } from "react";
import { Container, Col, Row, Pagination, PageItem } from "react-bootstrap";
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

//main body component that holds all TV's
//
class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = null;
    this.tvs = null;
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
        disp_count: 30,
        num_pages: Math.ceil(this.tvs.length / 30)
      });
    });
    // open the request with the verb and the url
    xhr.open("POST", "http://localhost:8080");

    xhr.setRequestHeader("Content-Type", "text/plain");
    // send the request
    xhr.send(JSON.stringify({ query: "SELECT * FROM WALMART" }));
  }

  update_curr_page(pageNumber) {
    console.log("current page: " + pageNumber);
    this.setState({ curr_page: pageNumber });
  }

  TVPagination(props) {
    let items = [];
    for (let number = 1; number <= this.state.num_pages; number++) {
      items.push(
        <PageItem
          key={number}
          onClick={this.update_curr_page.bind(this, number)}
          onChange={this.update_curr_page}
          active={number === this.state.curr_page}
        >
          {number}
        </PageItem>
      );
    }

    const paginationBasic = (
      <div className="center">
        <Pagination>{items}</Pagination>
      </div>
    );

    return paginationBasic;
  }

  // over here, we get the list of TVs & state of the home container.
  RenderTvs() {
    const start_index = this.state.disp_count * (this.state.curr_page - 1);
    const end_index = Math.min(
      this.tvs.length - 1,
      start_index + this.state.disp_count - 1
    );

    console.log(this.tvs.slice(start_index, end_index + 1));
    const build_tv_list = this.tvs
      .slice(start_index, end_index + 1)
      .map(tvs => (
        <Col>
          <ItemBox
            product_url={tvs.product_url}
            thumb_url={tvs.thumb_url}
            brand={tvs.brand}
            model={tvs.model}
            price={tvs.price}
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

  DisplayTv(props) {
    if (this.state === null) {
      return <ConcernFroge />;
    }

    return (
      <div>
        {this.RenderTvs()}
        <br></br>
        {this.TVPagination()}
      </div>
    );
  }

  render() {
    return <div id="homecontainer">{this.DisplayTv()}</div>;
  }
}

export default HomeContainer;
