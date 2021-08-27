import React from "react";
import * as userService from "../services/newsService";
import NewsStory from "./NewsStory";
import { Button, InputGroup } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import en_US from "rc-pagination/es/locale/en_US";

const searchSchema = Yup.object().shape({
  search: Yup.string()
    .min(1)
    .required("Minimum One Character Required for Search"),
});

class Search extends React.Component {
  state = {
    formData: {
      search: "",
    },
    current: 1,
    nbHits: 0,
    hitsPerPage: 5,
    page: 0,
    nbPages: 0,
    mappedNews: "",
    searchWords: [],
    paginationCheck: "",
  };
  componentDidMount() {
    this.getFrontPageNews();
  }

  searchWords = (searchTerm) => {
    let newSearchWord = [...this.state.searchWords, searchTerm];
    this.setState(() => ({ searchWords: newSearchWord }));
  };

  handleSubmit = (values) => {
    this.getSearchNews(values.search);
    this.searchWords(values.search);
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
          ? this.getSearchNews(this.state.searchWords.slice(-1)[0])
          : this.getFrontPageNews();
      }
    );
  };

  getSearchNews = (search) => {
    userService
      .getSearchNews(search, this.state.page, this.state.hitsPerPage)
      .then(this.onGetSearchNewsSuccess)
      .catch(this.onGetSearchNewsError);
  };

  onGetSearchNewsSuccess = (response) => {
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
    sessionStorage.setItem("previousNews", JSON.stringify(response.data.hits));
  };

  onGetSearchNewsError = (response) => {
    console.warn({ error: response });
  };

  getFrontPageNews = () => {
    userService
      .getHackerNews(this.state.page, this.state.hitsPerPage)
      .then(this.onGetFrontPageNewsSuccess)
      .catch(this.onGetFrontPageNewsError);
  };

  onGetFrontPageNewsSuccess = (response) => {
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
    sessionStorage.setItem("previousNews", JSON.stringify(response.data.hits));
  };

  onGetFrontPageNewsError = (response) => {
    console.warn({ error: response });
  };

  mapNews = (oneStory) => {
    return (
      <React.Fragment key={`News-${oneStory.objectID}`}>
        <NewsStory oneStory={oneStory} />
      </React.Fragment>
    );
  };

  historyClick = () => {
    let searchWordsList = this.state.searchWords;
    let previousNewsStories = sessionStorage.getItem("previousNews");
    this.props.history.push("/history", {
      typeOf: "LIST",
      payLoadStories: previousNewsStories,
      payLoadTerms: searchWordsList,
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
            onClick={this.getFrontPageNews}
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
            validationSchema={searchSchema}
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
                <ErrorMessage
                  name="search"
                  component="div"
                  className="has-error"
                />
              </InputGroup>
            </Form>
          </Formik>
        </div>
        <br />
        <br />
        <Pagination
          locale={en_US}
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
