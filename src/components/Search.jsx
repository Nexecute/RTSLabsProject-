import React from "react";
import * as userService from "../services/userService";
import NewsStory from "./NewsStory";
import { Button, InputGroup } from "react-bootstrap";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { Formik, Form, Field } from "formik";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        search: "",
      },
      current: 1,
      nbHits: 0,
      hitsPerPage: 5,
      page: 0,
      nbPages: 0,
      mappedNews: "",
      storedSearch: [],
      paginationCheck: "",
    };
  }

  componentDidMount() {
    this.retrieveSearchNews("");
  }

  searchedWords = (searchTerm) => {
    let storage = this.state.storedSearch;
    if (searchTerm) {
      storage.push(searchTerm);
    }

    this.setState(() => ({ storedSearch: storage }));
  };

  handleSubmit = (values) => {
    this.retrieveSearchNews(values.search);
    this.searchedWords(values.search);
  };

  onChange = (page) => {
    this.setState(
      () => {
        return {
          current: page,
          page: page - 1,
        };
      },
      () => {
        this.state.paginationCheck.includes("story")
          ? this.retrieveSearchNews(this.state.storedSearch.slice(-1)[0])
          : this.retrieveNewsFrontPage();
      }
    );
  };

  retrieveSearchNews = (search) => {
    userService
      .getSearchNews(search, this.state.page, this.state.hitsPerPage)
      .then(this.onRetrieveSearchNewsSuccess)
      .catch(this.onRetrieveSearchNewsError);
  };

  onRetrieveSearchNewsSuccess = (response) => {
    this.setState(() => {
      return {
        mappedNews: response.data.hits.map(this.mapNews),
        nbHits: response.data.nbHits,
        hitsPerPage: response.data.hitsPerPage,
        page: response.data.page,
        nbPages: response.data.nbPages,
        paginationCheck: response.config.url,
      };
    });
  };

  onRetrieveSearchNewsError = (response) => {
    console.warn({ error: response });
  };

  retrieveNewsFrontPage = () => {
    userService
      .getHackerNews(this.state.page, this.state.hitsPerPage)
      .then(this.onRetrieveNewsFrontPageSuccess)
      .catch(this.onRetrieveNewsFrontPageError);
  };

  onRetrieveNewsFrontPageSuccess = (response) => {
    this.setState(() => {
      return {
        mappedNews: response.data.hits.map(this.mapNews),
        nbHits: response.data.nbHits,
        hitsPerPage: response.data.hitsPerPage,
        page: response.data.page,
        nbPages: response.data.nbPages,
        paginationCheck: response.config.url,
      };
    });
  };

  onRetrieveNewsFrontPageError = (response) => {
    console.warn({ error: response });
  };

  mapNews = (oneStory) => {
    return (
      <React.Fragment key={`News-${oneStory.title}`}>
        <NewsStory oneStory={oneStory} />
      </React.Fragment>
    );
  };

  historyClick = () => {
    let searchWords = this.state.storedSearch;
    let mapped = this.state.mappedNews.map((story) => story.key);
    this.props.history.push("/history", {
      typeOf: "LIST",
      payLoadList: mapped,
      payLoadTerms: searchWords,
    });
  };

  previousPageClick = () => {
    this.props.history.push("/");
  };

  render() {
    let styles = {
      marginRight: "500px",
      marginLeft: "480px",
      marginTop: "40px",
    };

    return (
      <React.Fragment>
        <br />
        <br />
        <>
          <Button
            variant="success"
            size="lg"
            active
            onClick={this.retrieveNewsFrontPage}
          >
            Click for Front Page News!
          </Button>{" "}
          <Button
            variant="warning"
            size="lg"
            active
            onClick={this.historyClick}
          >
            Click for Your Search History!
          </Button>{" "}
          <Button
            variant="secondary"
            size="lg"
            active
            onClick={this.previousPageClick}
          >
            Click for Home Page
          </Button>
        </>
        <br />
        <br />
        <div style={styles}>
          <Formik
            enableReinitialize={true}
            initialValues={this.state.formData}
            onSubmit={this.handleSubmit}
          >
            <Form>
              <InputGroup className="mb-3">
                <Field
                  type="text"
                  name="search"
                  placeholder="Search Stories by Title, Author, or Url"
                  className="form-control"
                />
                <Button variant="primary" type="submit" id="button-addon2">
                  Search!
                </Button>
              </InputGroup>
            </Form>
          </Formik>
        </div>
        <br />
        <br />
        <Pagination
          onChange={this.onChange}
          current={this.state.current}
          total={this.state.nbHits}
          pageSize={this.state.hitsPerPage}
        />
        <br />
        <div className="col-md-12 p-5">
          <div className="row">{this.state.mappedNews}</div>
        </div>
      </React.Fragment>
    );
  }
}

export default Search;
