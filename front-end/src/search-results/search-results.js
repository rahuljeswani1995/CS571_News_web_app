import React from 'react';
import SquareCard from '../square-card/square-card';
import { Container, Row, Col } from 'react-bootstrap';
import { BACKEND_HOST } from '../app-constants';
import Spinner from 'react-bootstrap/Spinner';



class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };

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
            items: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  componentDidMount() {
    this.props.updateToggleDisplay(false);
    this.props.resetTbValue(this.extractSearchKeywordFromPath(this.props.location.search))
    this.refreshPageWithNewData();
  }

  componentDidUpdate(prevProps) {
    console.log("Compdidupdate called");
    if (this.props.source !== prevProps.source || this.extractSearchKeywordFromPath(this.props.location.search)
      !== this.extractSearchKeywordFromPath(prevProps.location.search)) {
      this.setState({
        isLoaded: false,
        items: []
      })
      this.refreshPageWithNewData();
    }
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

  extractSearchKeywordFromPath(srchStr) {
    // make sanity checks
    return srchStr.split("?q=")[1];
  }

  fetchNewsData() {
    const baseUrl = BACKEND_HOST;
    const qParam = this.extractSearchKeywordFromPath(this.props.location.search);
    return fetch(`${baseUrl}/searched_articles?source=${this.props.source}&phrase=${qParam}`);
  }
  render() {
    const { error, isLoaded, items } = this.state;
    // console.log(JSON.stringify(this.props));
    if (!isLoaded) {
      return <div style={{width: '100%', marginTop: '20%', textAlign: 'center'}}>
        <Spinner style={{color: "#355ac9"}} animation="grow"/>
        <p>Loading</p>
      </div>
    }
    else if (error) {
      return <h1> ...</h1>
    }
    else {
      const rows = this.chunkifyData(items.results, 4);
      if (items.results.length > 0) {
        return <div className="mx-2">
          <h4 className="mx-2">Results</h4>

          <Container fluid className="p-0">
            {rows.map((cols) =>
              <Row noGutters={true}>
                {cols.map((item) =>
                  <Col lg={3} md={4} sm={6} xs={12} >
                    <SquareCard {...item} routerHistory={this.props.history} source={this.props.source} />
                  </Col>
                )}
              </Row>
            )}
          </Container>
          </div>
      }
      else {
        return <div className="mx-2">
          <h4 className="mx-2">Results</h4>
          <p>No Results Found</p>
        </div>
      }

    }
  }
}

export default SearchResults;