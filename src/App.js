import React from 'react';
import { useEffect, useState } from 'react';
import './App.scss';
import Comment from './components/Comment';
import data from './data.json';

function App() {
	const [currentUser, setCurrentUser] = useState(data.currentUser);
	const [comments, setComments] = useState(data.comments);

	return (
		<div style={{ width: '60%', margin: 'auto' }}>
			{comments.map((comment) => (
				<React.Fragment key={comment.id}>
					<Comment
						content={comment.content}
						duration={comment.createdAt}
						count={comment.score}
						name={comment.user.username}
						avatar={comment.user.image.png}
						currentUser={comment.user.username === currentUser.username}
					/>
					{comment.replies && (
						<section className='comment-after'>
							{comment.replies.map((reply) => (
								<Comment
									key={reply.id}
									content={reply.content}
									duration={reply.createdAt}
									count={reply.score}
									name={reply.user.username}
									avatar={reply.user.image.png}
									currentUser={reply.user.username === currentUser.username}
								/>
							))}
						</section>
					)}
				</React.Fragment>
			))}
			<section className='comment flex'>
				<img
					src={process.env.PUBLIC_URL + currentUser.image.png}
					alt='current user'
					className='user'
				/>
				<textarea className='text' placeholder='Add comment...'></textarea>
				<button className='counter__button-text main_button'>SEND</button>
			</section>
		</div>
	);
}

export default App;
