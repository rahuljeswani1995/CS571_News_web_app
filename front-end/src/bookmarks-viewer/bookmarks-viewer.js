import React from 'react';
import SquareCard from '../square-card/square-card';
import { Container, Row, Col } from 'react-bootstrap';

import { BOOKMARKS_KEY } from '../app-constants';
// const BOOKMARKS_KEY = "cs571_news_bookmarks";

class BookmarksViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: []
    }
    this.onDeleteBkmk = this.onDeleteBkmk.bind(this);
  }

  componentDidMount() {
    this.props.updateToggleDisplay(false);
    this.props.resetTbValue();
    // load articles from localStorage
    const bookmarks = window.localStorage.getItem(BOOKMARKS_KEY) ? JSON.parse(window.localStorage.getItem(BOOKMARKS_KEY)) : {};
    const arr = [];
    Object.keys(bookmarks).forEach(id => {
      arr.push(bookmarks[id]);
    });
    this.setState({
      articles: arr
    });
  }

  // fn to covert 1d data to 2D matrix with "numCols" columns
  chunkifyData(data, numCols) {
    const matrix = [];
    const numRows = Math.ceil(data.length / numCols);
    let idx = 0;
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols && idx < data.length; j++, idx++) {
        row.push(data[idx]);
      }
      matrix.push(row);
    }
    return matrix;
  }

  onDeleteBkmk(articleId) {
    const bookmarks = window.localStorage.getItem(BOOKMARKS_KEY) ? JSON.parse(window.localStorage.getItem(BOOKMARKS_KEY)) : {};
    if (bookmarks[articleId]) {
      delete bookmarks[articleId];
      const arr = [];
      Object.keys(bookmarks).forEach(id => {
        arr.push(bookmarks[id]);
      });
      this.setState({
        articles: arr
      });
      window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
    else {
      console.error(`Unable to delete non-existent bookmark with id:  ${articleId}`);
    }
  }

  render() {
    if (this.state.articles && this.state.articles.length > 0) {
      const articles = this.state.articles;
      const rows = this.chunkifyData(articles, 4);
      return <div className="mx-2">
        <h4 className="mx-2">Favorites</h4>
        <Container fluid className="p-0">
          {rows.map((cols) =>
            <Row noGutters={true}>
              {cols.map((item) =>
                <Col lg={3} md={4} sm={6} xs={12} >
                  <SquareCard {...item} routerHistory={this.props.history} isBookmark={true} onDeleteBkmk={this.onDeleteBkmk} />
                </Col>
              )}
            </Row>
          )}
        </Container>
      </div>
    }
    else {
      return <div style={{ textAlign: 'center' }}>
        <h6>You have no saved articles.</h6>
      </div>
    }
  }
}

export default BookmarksViewer;