import MainBanner from "./mainbanner";
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

class Loading extends Component {
  render() {
    return (
      //  Credit: https://dribbble.com/shots/5092176-Newton-Loader
      <div class="gooey">
        <span class="dot"></span>
        <div class="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }
}

//main body component responsible for managing all content of the TV's
class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = null;
    this.tvs = null;
    this.curr_tvs = null;
    this.brand = React.createRef();
    this.price = React.createRef();
    this.store = React.createRef();
    this.display_size = React.createRef();
    this.technology = React.createRef();
    this.resolution = React.createRef();
    // get the first query of TV's, by default, display everything.
    this.getTvs({
      store: "Store...",
      brand: "Brand...",
      price: "Price...",
      display_size: "Size...",
      technology: "Technology...",
      resolution: "Resolution..."
    });
  }

  // function that creaters a list of all possible field options, based on the union of all store's tv's. Gets each defined value for @field based on the database.
  // @field: the search field to retrieve all possible values for
  // @return: a list of jsx elements containing each possible option
  FormGetOptions(field) {
    let field_only = new Array();

    for (let n = 0; n < this.tvs.length; n++) {
      console.log(this.tvs[n][field]);
      if (this.tvs[n][field] != "NULL" && this.tvs[n][field] != null)
        field_only.push(this.tvs[n][field]);
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

  // function that allows a user to narrow their search to query for TV's of their desired features
  // @return: a form for the user to narrow their search of TV's for
  SearchSettings() {
    const btn_theme = `
    .btn-flat {
      background: rgb(68, 189, 226);
      color: rgb(255, 255, 255);
      border: 2px solid rgba(0, 126, 148, 0.349);
      border-radius: 4px;
      padding: 5px 10px;
      font-family: 'Raleway', sans-serif;
    }
  `;
    return (
      <div>
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridBrand">
              <Form.Control as="select" ref={this.brand}>
                <option>Brand...</option>
                {this.FormGetOptions("brand")}
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPrice">
              <Form.Control as="select" ref={this.price}>
                <option>Price...</option>
                <option>Under $500</option>
                <option>Under $1000</option>
                <option>Under $1500</option>
                <option>Under $2000</option>
                <option>$2000+</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridStore">
              <Form.Control as="select" ref={this.store}>
                <option>Store...</option>
                <option>Amazon</option>
                <option>Walmart</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridDisplay Size">
              <Form.Control as="select" ref={this.display_size}>
                <option>Size...</option>
                <option>{"<"}30"</option>
                <option>{"<"}50"</option>
                <option>{"<"}60"</option>
                <option>{"<"}70"</option>
                <option>70"+</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridTechnology">
              <Form.Control as="select" ref={this.technology}>
                <option>Technology...</option>
                {this.FormGetOptions("display_tech")}
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridResolution">
              <Form.Control as="select" ref={this.resolution}>
                <option>Resolution...</option>
                {this.FormGetOptions("resolution")}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridSubmit">
              <style type="text/css"> {btn_theme}</style>
              <Button
                variant="flat"
                type="button"
                onClick={this.CustomSearch.bind(this)}
              >
                Search
              </Button>
            </Form.Group>
          </Form.Row>
        </Form>
      </div>
    );
  }

  // function that will build a query for TV's based on the user's desired features and update the current set of displayed TV's
  CustomSearch() {
    let custom_query = {
      store: this.store.current.value,
      brand: this.brand.current.value,
      price: this.price.current.value,
      display_size: this.display_size.current.value,
      technology: this.technology.current.value,
      resolution: this.resolution.current.value
    };

    this.getTvs(custom_query);
  }

  // Obtain TVs from the database. Update state upon completion.
  // @desired_query: the query to the psql database to get TV's with certain potential constraints.
  getTvs(desired_query) {
    var xhr = new XMLHttpRequest();

    // get a callback when the server responds
    xhr.addEventListener("load", () => {
      // update the state of the component with the result here

      this.curr_tvs = JSON.parse(xhr.responseText);

      if (this.tvs == null) this.tvs = this.curr_tvs;

      this.setState({
        active: true,
        curr_page: 1,
        disp_count: 30,
        num_pages: Math.ceil(this.curr_tvs.length / 30),
        query: desired_query
      });
    });
    // open the request with the verb and the url
    // xhr.open("POST", "localhost:8080");
    xhr.open("POST", "http://localhost:8080");

    xhr.setRequestHeader("Content-Type", "application/json");
    // send the request
    xhr.send(JSON.stringify(desired_query));
  }

  // a function to be bound with each page number on the pagination navigation bar. Upon clicking the desired page number, the state will change into the clicked number.
  // @pageNumber: the clicked page number
  update_curr_page(pageNumber) {
    this.setState({ curr_page: pageNumber });
  }

  // a function that takes the current TV results and paginates it based on how many tv's are displayed per page
  // @return: pagination of tv search results.
  TVPagination() {
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

  // partitions out a list of n tv's, where n is the number of tv's displayed per page, based on the current page state
  // @return: a component which displays n tv's, based on the current page state
  RenderTvs() {
    const start_index = this.state.disp_count * (this.state.curr_page - 1);
    const end_index = Math.min(
      this.curr_tvs.length - 1,
      start_index + this.state.disp_count - 1
    );

    const build_tv_list = this.curr_tvs
      .slice(start_index, end_index + 1)
      .map(tvs => (
        <div>
          <br></br> <br></br>
          <Col>
            <ItemBox
              product_url={tvs.product_url}
              thumb_url={tvs.thumb_url}
              brand={tvs.brand}
              model={tvs.model}
              price={tvs.price}
            />
          </Col>
        </div>
      ));
    return (
      <div>
        <Container>
          <Row>{build_tv_list}</Row>
          <br></br>
          <br></br>
          <br></br>
          {this.TVPagination()}
        </Container>
        {window.scrollTo(0, 0)}
      </div>
    );
  }

  // determines if the TV's have been loaded or not, if so, display them, else, leave a default component.
  // @return: a default waiting component if tv's are not loaded, and the tv's if they are.
  DisplayTv() {
    if (this.state === null) {
      return <Loading />;
    }

    return (
      <div>
        <MainBanner />
        {this.SearchSettings()}
        {this.RenderTvs()}
      </div>
    );
  }

  render() {
    return <div id="homecontainer">{this.DisplayTv()}</div>;
  }
}

export default HomeContainer;
