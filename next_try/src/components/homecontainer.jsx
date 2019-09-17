import React, { Component } from "react";
import {
  Container,
  Col,
  Row,
  Pagination,
  PageItem,
  Form,
  Button
} from "react-bootstrap";
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
    this.theme = `
    .btn-flat {
      background: rgb(95, 218, 255);
      color: rgb(255, 255, 255);
      border: 2px solid rgba(0, 126, 148, 0.349);
      border-radius: 4px;
      padding: 5px 10px;
      font-family: 'Raleway', sans-serif;
    }
  `;
    this.getTvs("select * from walmart union all select * from amazon;");
  }

  FormGetOptions(field) {
    let field_only = new Array();

    for (let n = 0; n < this.tvs.length; n++) {
      if (this.tvs[n][field] != "NULL") field_only.push(this.tvs[n][field]);
    }

    //Convert to set to remove dupes, flip back to list.
    field_only = new Set(field_only);
    field_only = Array.from(field_only);

    let field_options = [];

    for (let n = 0; n < field_only.length; n++) {
      field_options.push(<option> {field_only[n]}</option>);
    }

    return field_options;
  }

  //form to get what we need to query.
  SearchSettings() {
    return (
      <div>
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridBrand">
              <Form.Control as="select">
                <option>Brand...</option>
                {this.FormGetOptions("brand")}
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPrice">
              <Form.Control as="select">
                <option>Price...</option>
                <option>Under $500</option>
                <option>Under $1000</option>
                <option>Under $1500</option>
                <option>Under $2000</option>
                <option>$2000+</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridStore">
              <Form.Control as="select">
                <option>Store...</option>
                <option>Amazon</option>
                <option>Walmart</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridDisplay Size">
              <Form.Control as="select">
                <option>Size...</option>
                <option>{"<"}30"</option>
                <option>{"<"}50"</option>
                <option>{"<"}60"</option>
                <option>{"<"}70"</option>
                <option>70+</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridTechnology">
              <Form.Control as="select">
                <option>Technology...</option>
                {this.FormGetOptions("display_tech")}
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridResolution">
              <Form.Control as="select">
                <option>Resolution...</option>
                {this.FormGetOptions("resolution")}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridSubmit">
              <style type="text/css"> {this.theme}</style>
              <Button variant="flat" type="submit">
                Search
              </Button>
            </Form.Group>
          </Form.Row>
        </Form>
      </div>
    );
  }

  // Obtain TVs from the database. Update state upon completion.
  getTvs(desired_query) {
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

    xhr.setRequestHeader("Content-Type", "application/json");
    // send the request
    xhr.send(JSON.stringify({ query: desired_query }));
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
        {this.SearchSettings()}
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
