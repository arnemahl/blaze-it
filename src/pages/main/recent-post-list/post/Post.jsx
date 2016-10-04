import React from 'react';
import Button from 'components/button/Button';

import './Post.scss';

class AuthorAndLikes extends React.Component {

    addLike = () => {
        console.log('TODO: Implement adding like to post/comment');
    }

    render() {
        const {item} = this.props;

        return (
            <div className="author-and-likes">
                <span className="author">@{item.author}</span>
                <span className="date">{new Date(item.timestamp).toISOString()}</span>
                <span className="likes" onClick={this.addLike}>{item.likes || 0} &#10084;</span>
            </div>
        );
    }
}

class Post extends React.Component {

    state = {
        commentContent: '',
        comments: [
            {
                id: 'av984',
                timestamp: Date.now(),
                content: 'Dummy comment',
                author: 'dummy-user',
                likes: 0
            },
            {
                id: 'va89s',
                timestamp: Date.now(),
                content: 'Dummy comment',
                author: 'dummy-user',
                likes: 0
            }
        ]
    }

    onCommentChange = (event) => {
        this.setState({
            commentContent: event.target.value
        });
    }

    onSubmitComment = () => {
        console.log('TODO: Impelment submit comment');
    }

    render() {
        const {post} = this.props;

        return(
            <div className="post">
                <AuthorAndLikes item={post} />
                <div className="content">{post.content}</div>

                <div className="comment-list">
                    {this.state.comments.map(comment =>
                        <div className="comment" key={comment.id}>
                            <AuthorAndLikes item={comment} />
                            <div className="content">{comment.content}</div>
                        </div>
                    )}
                </div>

                <form className="comment-form">
                    <textarea
                        value={this.commentContent}
                        onChange={this.onCommentChange}
                        placeholder="Write a comment"
                        />
                    <Button className="button-submit-comment" onClick={this.onSubmitComment}>
                        Submit comment
                    </Button>
                </form>
            </div>
        );
    }
}

export default Post;
