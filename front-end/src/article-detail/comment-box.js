import React from 'react';
import commentBox from 'commentbox.io';

class CommentBox extends React.Component {

  componentDidMount() {

    this.removeCommentBox = commentBox('5766792777564160-proj');
  }

  componentWillUnmount() {

    this.removeCommentBox();
  }

  render() {
    return (
      <div className="commentbox" id={this.props.articleId}/>
    );
  }
}

export default CommentBox;