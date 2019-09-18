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
    this.curr_tvs = null;
    this.brand = React.createRef();
    this.price = React.createRef();
    this.store = React.createRef();
    this.display_size = React.createRef();
    this.technology = React.createRef();
    this.resolution = React.createRef();
    this.theme = `
    .btn-flat {
      background: rgb(68, 189, 226);
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

  //build custom query
  CustomSearch() {
    let custom_query = "WITH TVS AS (SELECT * FROM ";
    if (this.store.current.value === "Store...") {
      custom_query = custom_query + "WALMART UNION ALL SELECT * FROM AMAZON)";
    } else {
      custom_query = custom_query + this.store.current.value + ")";
    }

    //the reason for 1=1 is to make forming the query much easier on the react code. Otherwise, need to check if any input is changed from default value.
    custom_query = custom_query + " SELECT * FROM TVS WHERE 1=1 ";

    if (this.brand.current.value !== "Brand...") {
      custom_query =
        custom_query + " AND (brand ='" + this.brand.current.value + "')";
    }

    //need to do more work for price since the input options are different than the true text into psql db
    switch (this.price.current.value) {
      case "Price...": {
        break;
      }

      case "Under $500": {
        custom_query = custom_query + " AND (price < 500)";
        break;
      }
      case "Under $1000": {
        custom_query = custom_query + " AND (price < 1000)";
        break;
      }
      case "Under $1500": {
        custom_query = custom_query + " AND (price < 1500)";
        break;
      }
      case "Under $2000": {
        custom_query = custom_query + " AND (price < 2000)";
        break;
      }
      case "$2000+": {
        custom_query = custom_query + " AND (price >= 2000)";
        break;
      }
      default: {
        console.log("Something went wrong. Are you changing the values?");
      }
    }

    switch (this.display_size.current.value) {
      case "Size...": {
        break;
      }

      case '<30"': {
        custom_query = custom_query + " AND (display_size < 30)";
        break;
      }
      case '<50"': {
        custom_query = custom_query + " AND (display_size < 50)";
        break;
      }
      case '<60"': {
        custom_query = custom_query + " AND (display_size < 60)";
        break;
      }
      case '<70"': {
        custom_query = custom_query + " AND (display_size < 70)";
        break;
      }
      case '70"+': {
        custom_query = custom_query + " AND (display_size >= 70)";
        break;
      }
      default: {
        console.log("Something went wrong. Are you changing the values?");
      }
    }

    if (this.technology.current.value !== "Technology...") {
      custom_query =
        custom_query +
        " AND (display_tech = '" +
        this.technology.current.value +
        "')";
    }

    if (this.resolution.current.value !== "Resolution...") {
      custom_query =
        custom_query +
        " AND (resolution ='" +
        this.resolution.current.value +
        "')";
    }

    console.log(custom_query);
    this.getTvs(custom_query);
  }

  // Obtain TVs from the database. Update state upon completion.
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
          className={"paginationLinkStyle"}
        >
          {number}
        </PageItem>
      );
    }

    const paginationBasic = (
      <div className="center">
        <Pagination variant="Info">{items}</Pagination>
      </div>
    );

    return paginationBasic;
  }

  // over here, we get the list of TVs & state of the home container.
  RenderTvs() {
    const start_index = this.state.disp_count * (this.state.curr_page - 1);
    const end_index = Math.min(
      this.curr_tvs.length - 1,
      start_index + this.state.disp_count - 1
    );

    console.log(this.curr_tvs.slice(start_index, end_index + 1));
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
        <br></br>
        <br></br>
        {this.TVPagination()}
      </div>
    );
  }

  render() {
    return (
      <div id="homecontainer">
        <style type="text/css"> {this.theme}</style>
        {this.DisplayTv()}
      </div>
    );
  }
}

export default HomeContainer;
