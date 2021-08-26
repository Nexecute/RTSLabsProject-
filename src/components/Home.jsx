import React from "react";

class Home extends React.Component {
  searchClick = () => {
    this.props.history.push("/search");
  };

  render() {
    return (
      <React.Fragment>
        <br />
        <br />
        <h1>Welcome to the Hacker News Algolia!</h1>
        <h2>Brought to you by RTS Labs</h2>
        <h2>Please Click on the Button Below to Begin your News Search</h2>
        <br />
        <br />
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={this.searchClick}
        >
          Click to Search the News
        </button>
      </React.Fragment>
    );
  }
}

export default Home;
