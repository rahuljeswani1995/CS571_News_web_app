import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import MainResults from './main-results/main-results';
import SearchResults from './search-results/search-results';
import NavigationBar from './navigation-bar/navigation-bar';
import ArticleDetail from './article-detail/article-detail';
import BookmarksViewer from './bookmarks-viewer/bookmarks-viewer';

import { BOOKMARKS_KEY } from './app-constants';
import { ToastContainer, Zoom, toast } from 'react-toastify';

const defaultSource = "guardian";

// toast.configure({
//   autoClose: 3000,
//   draggable: false
// });

// const BOOKMARKS_KEY = "cs571_news_bookmarks";

class App extends React.Component {
  constructor() {
    super();
    // check if localStorage has switch data
    this.state = {
      src: window.localStorage.getItem("news_source") || defaultSource,
      displayToggle: true,
      showFilledBkmkIcon: false,
      tbValue: ''
    };
    // Set up local storage object for bookmarks
    if (!window.localStorage.getItem(BOOKMARKS_KEY)) {
      window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify({}));
    }
    this.handleSrcSwitch = this.handleSrcSwitch.bind(this);
    this.resetTbValue = this.resetTbValue.bind(this);
  }

  isSrcSwitchChecked(sourceName) {
    return sourceName == defaultSource;
  }

  handleSrcSwitch(checked) {
    const updatedSrc = checked ? "guardian" : "nyt";
    window.localStorage.setItem("news_source", updatedSrc)
    this.setState({
      src: updatedSrc
    });
  }

  updateToggleDisplay = show => {
    this.setState({
      displayToggle: show
    });
  }

  updateBkmkIcon = isFavsTabOpen => {
    this.setState({
      showFilledBkmkIcon: isFavsTabOpen
    })
  }

  resetTbValue(value) {
    if (!value) {
      this.setState({
        tbValue: ''
      })
    }
    else {
      this.setState({
        tbValue: value
      })
    }
  }

  render() {
    return (
      <div className="App">
        <NavigationBar tbValue={this.state.tbValue} showToggle={this.state.displayToggle} showFilledBkmkIcon={this.state.showFilledBkmkIcon} updateBkmkIcon={this.updateBkmkIcon} toggleChecked={this.isSrcSwitchChecked(this.state.src)}
          handleToggleChange={this.handleSrcSwitch} />
        {/* Route tags for each path */}
        <Switch>
          <Route exact path='/favorites' render={(routeProps) => {
            return <BookmarksViewer resetTbValue={this.resetTbValue} {...routeProps} updateToggleDisplay={this.updateToggleDisplay} />
          }} />
          <Route exact path='/searchedResults' render={(routeProps) => {
            // this.setState({displayToggle: false});
            return <SearchResults resetTbValue={this.resetTbValue} {...routeProps} source={this.state.src} title={`Results`} updateToggleDisplay={this.updateToggleDisplay} />
          }} />
          <Route exact path='/article' render={(routeProps) => {
            return <ArticleDetail resetTbValue={this.resetTbValue} {...routeProps} source={this.state.src} updateBkmkIcon={this.updateBkmkIcon} updateToggleDisplay={this.updateToggleDisplay} />
          }} />
          {/* Keep always at the end otherwise this will block other routes (specific-to-general shd be the way 2 go) */}
          <Route exact path='/:id' render={(routeProps) => {
            return <MainResults resetTbValue={this.resetTbValue} {...routeProps} source={this.state.src} updateToggleDisplay={this.updateToggleDisplay} />
          }} />
          <Route exact path='/'>
            <Redirect to='/home' push />
          </Route>
        </Switch>
        <ToastContainer autoClose={2000} position={toast.POSITION.TOP_CENTER}
          toastClassName="toast-body" hideProgressBar={true} transition={Zoom} />
      </div>
    );
  }
}

export default App;
