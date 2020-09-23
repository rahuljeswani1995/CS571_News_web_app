import React from 'react';
import { Navbar, Nav, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import {MdBookmark, MdBookmarkBorder} from 'react-icons/md';
import  ReactTooltip  from 'react-tooltip';

import AutoSearch from '../auto-search/auto-search';

import SourceSwitch from '../source-switch/source-switch';


const tabs = [
  { id: "home", name: "Home" },
  { id: "world", name: "World" },
  { id: "politics", name: "Politics" },
  { id: "business", name: "Business" },
  { id: "technology", name: "Technology" },
  { id: "sports", name: "Sports" },
];

class NavigationBar extends React.Component {

  handleToggle(checked) {
    this.props.handleToggleChange(checked);
  }

  render() {
    return <div id="title-div" className="row my-2 mx-0">
      <Navbar expand="md" variant="dark" className="nav-bar justify-content-start col-12 p-0">
        <Form className="p-0 col-lg-3 col-md-3 col-sm-4 col-xs-6 mx-2 my-2 mr-lg-0 mr-md-0">
          {/* todo: add blue border */}
          <AutoSearch tbValue={this.props.tbValue} />
        </Form>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="ml-2 mb-2 mb-sm-0" />
        <Navbar.Collapse id="responsive-navbar-nav" className="ml-2">
          <Nav className="mr-auto">
            {tabs.map(tab => {
              return <Nav.Link as={Link} to={`/${tab.id}`} onClick={() => { this.props.updateBkmkIcon(false) }}>{tab.name}</Nav.Link>
            })}
          </Nav>
          <Nav>
            <Nav.Link  as={Link} to="/favorites" onClick={() => { this.props.updateBkmkIcon(true) }}>
              <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                <span data-tip="Bookmark">
                {this.props.showFilledBkmkIcon ? <MdBookmark /> : <MdBookmarkBorder />}
                </span>
              </IconContext.Provider>
            </Nav.Link>
          </Nav>
          {this.props.showToggle ?
            <Form inline>
              <Navbar.Brand style={{fontSize: '17px'}} className="mx-2">NYTimes</Navbar.Brand>
              <SourceSwitch checked={this.props.toggleChecked} onSourceSwitch={(checked) => { this.handleToggle(checked) }} />
              <Navbar.Brand style={{fontSize: '17px'}} className="mx-2">Guardian</Navbar.Brand>
            </Form> :
            null
          }
        </Navbar.Collapse>

      </Navbar>
      <ReactTooltip effect="solid" place="bottom" />
    </div>
  }
}

export default NavigationBar;