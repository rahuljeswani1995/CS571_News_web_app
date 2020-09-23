import React from 'react';
import { getBadgeBgForSection, getBadgeTxtClrForSection, getSrcDisplayName } from '../utils';
import { MdDelete, MdShare } from 'react-icons/md';
import { EmailIcon, FacebookIcon, TwitterIcon, EmailShareButton, FacebookShareButton, TwitterShareButton } from "react-share";
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

class SquareCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  onShare() {
    // alert(`GOT: ${title}`);
    this.setState({ showModal: true })
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  render() {
    // console.log(JSON.stringify(this.props.webUrl));
    return <div>
      <div className="row shadow-sm p-3 m-2 rounded card-border" style={{ cursor: 'pointer' }}
        onClick={() => { this.props.routerHistory.push(`/article?id=${this.props.id}`) }}>
        {/* TODO: add icons */}
        <h6 className="col-12 p-0"> <i>{this.props.title}</i>
          <span className="ml-1"><MdShare onClick={(event) => { event.preventDefault(); event.stopPropagation(); this.onShare() }} /> </span>
          {this.props.isBookmark ? <span className="ml-1"><MdDelete onClick={
            (event) => { event.preventDefault(); event.stopPropagation(); 
            this.props.onDeleteBkmk(this.props.id); toast(`Removing ${this.props.title}`) }} />
          </span> : null}
        </h6>
        <img src={this.props.image} className="col-12 mt-2 p-0" style={{ maxHeight: 350 + 'px' }} />
        <div className="col-12 mt-2 p-0">
          <i className="m-1" style={{ float: 'left', fontSize: '13px' }}>{this.props.date}</i>
          {/* TODO: add source badge */}
          {this.props.isBookmark ? <span className="badge m-1" style={{ float: "right", backgroundColor: getBadgeBgForSection(this.props.source), color: getBadgeTxtClrForSection(this.props.source) }}>
            {getSrcDisplayName(this.props.source)}</span> : null}
          <span className="badge m-1" style={{ float: "right", backgroundColor: getBadgeBgForSection(this.props.section), color: getBadgeTxtClrForSection(this.props.section) }}>{this.props.section.toUpperCase()}</span>
          <div style={{ clear: 'both' }} />
        </div>
      </div>
      <Modal backdrop="static" show={this.state.showModal} onHide={this.handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5 className="m-0">{getSrcDisplayName(this.props.source)}</h5>
            <h5 >{this.props.title}</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer style={{justifyContent: 'center'}}>
          <div className="row no-gutters" style={{ textAlign: 'center', width: "100%" }}>
            <h5 className="col-12">Share via</h5>
            <div className="col-4">
              <FacebookShareButton url={this.props.webUrl} hashtag={`#CS571_News_App`}>
                <FacebookIcon round={true} size={40} />
              </FacebookShareButton>
            </div>
            <div className="col-4">
              <TwitterShareButton url={this.props.webUrl} hashtags={[`CS571_News_App`]}>
                <TwitterIcon round={true} size={40} />
              </TwitterShareButton>
            </div>
            <div className="col-4">
              <EmailShareButton url={this.props.webUrl} subject={`#CS571_News_App`}>
                <EmailIcon round={true} size={40} />
              </EmailShareButton>
            </div>

          </div>
        </Modal.Footer>
      </Modal>
    </div>
  }
}

export default SquareCard;