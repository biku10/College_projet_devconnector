import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getSinglePost } from '../../actions/post';
import PostItem from '../Posts/PostItem';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
const Post = ({ getSinglePost, posts: { post, loading }, match }) => {
  useEffect(() => {
    getSinglePost(match.params.id);
  }, getSinglePost);
  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to='/posts'>
        <button className='btn btn-light'>Go to the Post feed </button>
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className='comments'>
        {post.comments.map(comment => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  getSinglePost: PropTypes.func.isRequired,
  posts: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  posts: state.post,
});

export default connect(mapStateToProps, { getSinglePost })(Post);
