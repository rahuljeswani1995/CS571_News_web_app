import React from 'react';
// import ReactDOM from 'react-dom';
import {Modal} from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import NewsCard from '../news-card/news-card';
import { BACKEND_HOST } from '../app-constants';
import { EmailIcon, FacebookIcon, TwitterIcon, EmailShareButton, FacebookShareButton, TwitterShareButton } from "react-share";
import { getSrcDisplayName } from '../utils'

class MainResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      showModal: false,
      modalTitle: null,
      shareUrl: null
    };
    this.handleCloseModal = this.handleCloseModal.bind(this)
  }

  refreshPageWithNewData() {
    this.fetchNewsData()
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          // handle erroneous results 
          this.setState({
            isLoaded: true,
            items: result,
            error: null
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (e) => {
          this.setState({
            isLoaded: true,
            error: e,
            items: []
          });
        }
      );
  }

  componentDidMount() {
    this.props.updateToggleDisplay(true);
    this.props.resetTbValue();
    this.refreshPageWithNewData();
  }

  componentDidUpdate(prevProps) {
    // to handle clicks from Home to World etc.
    // console.log("Compdidupdate called");
    if (this.props.source !== prevProps.source || this.props.match.params.id !== prevProps.match.params.id) {
      this.setState({
        isLoaded: false,
        items: []
      })
      this.refreshPageWithNewData();
    }
  }

  onShare(title, url) {
    // alert(`GOT: ${title}`);
    this.setState({ showModal: true, modalTitle: title, shareUrl: url })
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  extractSectionFromPath() {
    // make sanity checks
    return this.props.match.params.id;
  }

  fetchNewsData() {
    const baseUrl = BACKEND_HOST;
    const section = this.extractSectionFromPath();
    return fetch(`${baseUrl}/top_articles?source=${this.props.source}&section=${section}`);
  }
  render() {
    const { error, isLoaded, items, showModal, modalTitle, shareUrl } = this.state;
    if (!isLoaded) {
      return <div style={{width: '100%', marginTop: '20%', textAlign: 'center'}}>
        <Spinner style={{color: "#355ac9"}} animation="grow"/>
        <p>Loading</p>
      </div>
    }
    else if (error) {
    return <h1> An error occurred while loading {this.extractSectionFromPath()} articles from {this.props.source}</h1>
    }
    // console.log(JSON.stringify(this.props));
    return <div>
      {items.results.map(item => <NewsCard {...item} onShare={this.onShare.bind(this)} routerHistory={this.props.history} />)}
      <Modal backdrop="static" show={showModal} onHide={this.handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5 className="m-0">{getSrcDisplayName(this.props.source)}</h5>
            <h5 >{modalTitle}</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer style={{ justifyContent: 'center' }}>
          <div className="row no-gutters" style={{ textAlign: 'center', width: '100%' }}>
            <h5 className="col-12">Share via</h5>
            <div className="col-4">
              <FacebookShareButton url={shareUrl} hashtag={`#CS571_News_App`}>
                <FacebookIcon round={true} size={40} />
              </FacebookShareButton>
            </div>
            <div className="col-4">
              <TwitterShareButton url={shareUrl} hashtags={[`CS571_News_App`]}>
                <TwitterIcon round={true} size={40} />
              </TwitterShareButton>
            </div>
            <div className="col-4">
              <EmailShareButton url={shareUrl} subject={`#CS571_News_App`}>
                <EmailIcon round={true} size={40} />
              </EmailShareButton>
            </div>

          </div>
        </Modal.Footer>
      </Modal>
    </div>
  }
}

export default MainResults;