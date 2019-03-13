import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Spin, Icon } from 'antd';
import { selectPosts, selectSearchTerm, selectSearchResult, selectIsSearching } from 'features/Post/selectors';
import { searchPostBegin, setSearchTerm } from 'features/Post/actions/searchPost';
import PostItem from 'features/Post/components/PostItem';

class Search extends Component {
  static propTypes = {
    posts: PropTypes.object.isRequired,
    searchTerm: PropTypes.string.isRequired,
    searchResult: PropTypes.array.isRequired,
    searchPost: PropTypes.func.isRequired,
    isSearching: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    this.props.searchPost(this.props.searchTerm);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.searchTerm !== nextProps.searchTerm) {
      this.props.searchPost(nextProps.searchTerm);
    }
  }

  handleClose = (e) => this.props.setSearchTerm(null);

  render() {
    const { searchTerm, searchResult, posts, isSearching } = this.props;

    const items = searchResult.map((key, index) =>
      <PostItem key={index + 1} rank={index + 1} post={posts[key]} lazyLoad={false} />
    )

    return (
      <div className="post-list">
        <div className="heading left-padded">
          <h3 className="search-heading">
            Results for &quot;{searchTerm}&quot;
            <Icon type="close-circle-o" className="close-button" onClick={this.handleClose} />
          </h3>
          <div className="heading-sub">
            <b>{searchResult.length}</b> products found
          </div>
        </div>
        <div className="results">
          {items}
          {isSearching && <Spin className="center-loading" key={0} />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  posts: selectPosts(),
  searchTerm: selectSearchTerm(),
  searchResult: selectSearchResult(),
  isSearching: selectIsSearching(),
});


const mapDispatchToProps = dispatch => ({
  searchPost: () => dispatch(searchPostBegin()),
  setSearchTerm: (term) => dispatch(setSearchTerm(term)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
