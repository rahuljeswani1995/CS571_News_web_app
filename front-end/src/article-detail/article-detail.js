import React from 'react';
import { IconContext } from 'react-icons';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import CommentBox from './comment-box';
import { EmailIcon, FacebookIcon, TwitterIcon, EmailShareButton, FacebookShareButton, TwitterShareButton } from "react-share";
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import  ReactTooltip  from 'react-tooltip';

import './article-detail.css'
import { BACKEND_HOST, BOOKMARKS_KEY } from '../app-constants';

// const BOOKMARKS_KEY = "cs571_news_bookmarks";

class ArticleDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      articleDetail: {},
      isBookmarked: this.isArticleBookmarked(this.getArticleIdFromURL()),
      isLong: false,
      isExpanded: false
    };
    this.ref = React.createRef();
  }

  scroll(ref) {
    // if ref provided, scroll to that ref, if ref is null, scroll to top
    if (ref)
      ref.current.scrollIntoView({ behavior: 'smooth' });
    else if (ref === null)
      window.scrollTo({ top: 1, left: 0, behavior: 'smooth' });
  }

  isArticleBookmarked(articleId) {
    const bookmarks = window.localStorage.getItem(BOOKMARKS_KEY) ? JSON.parse(window.localStorage.getItem(BOOKMARKS_KEY)) : {};
    return bookmarks.hasOwnProperty(articleId);
  }

  getArticleIdFromURL() {
    return this.props.location.search.split("?id=")[1];
  }

  isArticleLong(description) {
    return description.split(". ").length > 4;
  }

  splitDescription(description) {
    const sentences = description.split(". ");
    return {
      part1: `${sentences.slice(0, 4).join(". ")}. `,
      part2: `${sentences.slice(4).join(". ")}. `
    }
  }

  componentDidMount() {
    // console.log("INSIDE ART DTL: " + JSON.stringify(this.props));
    this.props.updateToggleDisplay(false);
    this.props.updateBkmkIcon(false);
    this.props.resetTbValue();
    // if state.isBookmarked is false, load the article detail from server, else load it from local storage
    if (!this.state.isBookmarked) {
      this.fetchArticleDetail();
    }
    else {
      const bookmarks = window.localStorage.getItem(BOOKMARKS_KEY) ? JSON.parse(window.localStorage.getItem(BOOKMARKS_KEY)) : {};
      const articleDetail = bookmarks[this.getArticleIdFromURL()];
      if (articleDetail) {
        const isLong = articleDetail["description_2"] != null && articleDetail["description_2"] != undefined
        // if (isLong) {
        //   const splitDesc = this.splitDescription(articleDetail.description)
        //   articleDetail.description = splitDesc.part1;
        //   articleDetail["description_2"] = splitDesc.part2;
        // }
        this.setState({
          isLoaded: true,
          error: null,
          articleDetail: articleDetail,
          isLong: isLong
        })
      }
      else {
        // set error state

      }
    }
  }

  fetchArticleDetail() {
    const articleId = this.getArticleIdFromURL();
    // console.log(`Want detail for ID: ${articleId}`);
    fetch(`${BACKEND_HOST}/article?source=${this.props.source}&articleId=${articleId}`)
      .then(res => res.json())
      .then(
        (result) => {
          // console.log(`FETCHED: ${result}`);
          // split article description
          const articleDetail = result.result;
          const isLong = this.isArticleLong(articleDetail.description);
          if (isLong) {
            const splitDesc = this.splitDescription(articleDetail.description)
            articleDetail.description = splitDesc.part1;
            articleDetail["description_2"] = splitDesc.part2;
          }

          this.setState({
            isLoaded: true,
            articleDetail: articleDetail,
            error: null,
            isLong: isLong
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (e) => {
          this.setState({
            isLoaded: true,
            error: e,
            articleDetail: {}
          });
        }
      );
  }

  toggleBookmark(articleId) {
    // update state about article being bookmarked by checking local-storage
    const bookmarks = window.localStorage.getItem(BOOKMARKS_KEY) ? JSON.parse(window.localStorage.getItem(BOOKMARKS_KEY)) : {};
    let toastMessage;
    if (this.state.isBookmarked && bookmarks[articleId]) {
      delete bookmarks[articleId];
      this.setState({
        isBookmarked: false
      })
      toastMessage = `Removing ${this.state.articleDetail.title}`;
    }
    else {
      bookmarks[articleId] = { ...this.state.articleDetail, source: this.props.source };
      this.setState({
        isBookmarked: true
      })
      toastMessage = `Saving ${this.state.articleDetail.title}`;
    }

    toast(toastMessage);
    window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }

  render() {
    const { error, isLoaded, articleDetail } = this.state;
    if (!isLoaded) {
      return <div style={{width: '100%', marginTop: '20%', textAlign: 'center'}}>
      <Spinner style={{color: "#355ac9"}} animation="grow"/>
      <p>Loading</p>
    </div>
    }
    else if (error) {
      console.log(error);
      return <h1>ERROR </h1>
    }
    else {
      return <div className="m-3">
        <div className="row shadow p-3 m-1 rounded card-border">
          <h4 className="col-12 p-0"> <i>{articleDetail.title} </i></h4>
          <div className="col-12 row my-2">
            <div className="col-6">
              <i style={{ float: 'left' }}>{articleDetail.date}</i>
            </div>
            <div className="col-4 p-0">
              <div style={{float:"right"}}>
                <FacebookShareButton url={articleDetail.webUrl} hashtag={`#CS571_News_App`}>
                  <FacebookIcon data-tip="Facebook" round={true} size={30} />
                </FacebookShareButton>
                <TwitterShareButton url={articleDetail.webUrl} hashtags={[`CS571_News_App`]}>
                  <TwitterIcon data-tip="Twitter" round={true} size={30} />
                </TwitterShareButton>
                <EmailShareButton data-tip="Email" url={articleDetail.webUrl} subject={`#CS571_News_App`}>
                  <EmailIcon  round={true} size={30} />
                </EmailShareButton>
              </div>
              <div style={{clear: 'right'}} />
            </div>
            <div className="col-2 pr-0">
              <IconContext.Provider  value={{ color: "#e20f3b", size: "1.5em", style: { float: 'right', cursor: "pointer" } }}>
                <span style={{float: 'right'}} data-tip="Bookmark">
                {this.state.isBookmarked ? <FaBookmark onClick={() => this.toggleBookmark(articleDetail.id)} />
                  : <FaRegBookmark  onClick={() => this.toggleBookmark(articleDetail.id)} />}
                  </span>
              </IconContext.Provider>
            </div>
          </div>
          <img src={articleDetail.image} className="col-12 mt-2 p-0" />
          <div className="col-12 mt-2 p-0">
            <p>
              {articleDetail.description}
            </p>
            {this.state.isLong ?
              this.state.isExpanded ?
                <div>
                  <p ref={this.ref}>{articleDetail.description_2}</p>
                  <IconContext.Provider value={{ size: "1.5em", style: { float: 'right', cursor: "pointer" } }}>
                    <IoIosArrowUp onClick={() => { this.setState({ isExpanded: false }); setTimeout(() => { this.scroll(null) }, 0) }} />
                  </IconContext.Provider>
                </div>
                :
                <div>
                  <IconContext.Provider value={{ size: "1.5em", style: { float: 'right', cursor: "pointer" } }}>
                    <IoIosArrowDown onClick={() => { this.setState({ isExpanded: true }); setTimeout(() => { this.scroll(this.ref) }, 0) }} />
                  </IconContext.Provider>
                </div >
              : null
            }
          </div>
        </div>
        <CommentBox articleId={articleDetail.id} />
        <ReactTooltip place="top" effect="solid" />
      </div>
    }
  }
}

export default ArticleDetail;