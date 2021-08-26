import "./App.css";
import Home from "./components/Home";
import Search from "./components/Search";
import History from "./components/History";
import { withRouter, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <div className="content">
        <Switch>
          <Route path="/" exact={true} component={Home} />
          <Route path="/search" exact={true} component={Search} />
          <Route path="/history" exact={true} component={History} />
        </Switch>
      </div>
    </div>
  );
}

export default withRouter(App);
