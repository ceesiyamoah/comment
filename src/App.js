import React from 'react';
import { useState } from 'react';
import './App.scss';
import Comment from './components/Comment';
import Modal from './components/Modal/Modal';
import SolidButton from './components/SolidButton';
import data from './data.json';

function App() {
	const [currentUser] = useState(data.currentUser);
	const [comments, setComments] = useState(data.comments);
	const [modalOpen, setModalOpen] = useState(false);

	const [selectedId, setSelectedId] = useState(null);
	const [commentToAdd, setCommentToAdd] = useState('');
	const addComment = () => {
		if (!commentToAdd) {
			return;
		}

		const newCom = {
			id: new Date().getTime(),
			content: commentToAdd,
			createdAt: '1 minute ago',
			score: 0,
			user: { ...currentUser },
			replies: [],
		};
		setComments((prev) => [newCom, ...prev]);
		setCommentToAdd('');
	};

	const onChange = (id, sub) => {
		let toEdit = comments.find((comment) => comment.id === id);
		let index = [];
		if (toEdit) {
			index.push(comments.findIndex((comment) => comment.id === id));
		}
		if (!toEdit) {
			comments.forEach((comment, i) => {
				toEdit = comment.replies.find((item) => item.id === id);
				if (toEdit) {
					index = [i, comment.replies.findIndex((item) => item.id === id)];
				}
			});
		}
		const newComments = [...comments];
		if (index.length === 1) {
			if (sub) newComments[index[0]].score--;
			else newComments[index[0]].score++;
		} else {
			if (sub) newComments[index[0]].replies[index[1]].score--;
			else newComments[index[0]].replies[index[1]].score++;
		}

		setComments(newComments);
	};

	const onDeleteConfirm = () => {
		let toRemove = comments.findIndex((comment) => comment.id === selectedId);
		let index = [];
		if (toRemove !== -1) {
			index.push(comments.findIndex((comment) => comment.id === selectedId));
		} else {
			comments.forEach((comment, i) => {
				const ind = comment.replies.findIndex((item) => item.id === selectedId);
				if (ind !== -1) {
					index = [i, ind];
				}
			});
		}

		let newComments = [...comments];
		if (index.length === 1) {
			newComments = newComments.filter((comment) => comment.id !== selectedId);
		} else {
			// newComments[index[0]].replies = newComments[index[0]].replies.filter(
			// 	(item) => item.id !== selectedId
			// );
			newComments[index[0]] = {
				...newComments[index[0]],
				replies: newComments[index[0]].replies.filter(
					(item) => item.id !== selectedId
				),
			};
		}

		setComments(newComments);
		setModalOpen(false);
	};

	const onDelete = (id) => {
		setModalOpen(true);
		setSelectedId(id);
	};

	const onReply = (id) => {
		setSelectedId(id);
		let toEdit = comments.find((comment) => comment.id === id);

		let index = [];
		if (toEdit) {
			index.push(comments.findIndex((comment) => comment.id === id));
		}

		if (!toEdit) return;

		const newComments = [...comments];
		const newCom = {
			id: new Date().getTime(),
			content: '',
			createdAt: '1 minute ago',
			score: 0,
			user: { ...currentUser },
			replies: [],
		};

		if (index.length === 1) {
			newComments[index[0]].replies.unshift(newCom);
		}
		// else {
		// 	newComments[index[0]].replies[index[1]].replies = [newCom];
		// }

		setComments(newComments);
	};

	const onReplySubmit = (id, newContent) => {
		let toEdit = comments.findIndex((comment) => comment.id === selectedId);

		let index = [toEdit];
		index.push(
			comments[index[0]].replies.findIndex((comment) => comment.id === id)
		);
		if (toEdit === -1) return;
		let newComments = [...comments];

		newComments[index[0]].replies[index[1]].content = newContent;

		setComments(newComments);
		setSelectedId(null);
	};

	const onEdit = (id) => {};

	const [modalContent] = useState(
		<div>
			<p className='header'>Delete Comment</p>
			<p>
				Are you sure you want to delete this comment? This will remove the
				comment and can’t be undone.
			</p>
			<div className='button-holder	'>
				{[
					{
						text: 'NO, CANCEL',
						color: '#67727E',
						onClicked: () => setModalOpen(false),
					},
					{
						text: 'YES, DELETE',
						color: '#ED6368',
						onClicked: onDeleteConfirm,
					},
				].map((button) => (
					<SolidButton
						key={button.text}
						text={button.text}
						color={button.color}
						onClick={button.onClicked}
					/>
				))}
			</div>
		</div>
	);
	return (
		<>
			<Modal
				open={modalOpen}
				onClose={() => {
					setModalOpen(false);
				}}
			>
				{modalContent}
			</Modal>
			<div className='app'>
				{comments.map((comment) => (
					<React.Fragment key={comment.id}>
						<Comment
							content={comment.content}
							duration={comment.createdAt}
							count={comment.score}
							name={comment.user.username}
							avatar={comment.user.image.png}
							currentUser={comment.user.username === currentUser.username}
							onDelete={onDelete}
							onIncrease={() => onChange(comment.id, false)}
							onDecrease={() => onChange(comment.id, true)}
							onReply={onReply}
							id={comment.id}
							onReplySubmit={onReplySubmit}
							onEdit={onEdit}
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
										onDelete={onDelete}
										currentUser={reply.user.username === currentUser.username}
										onIncrease={() => onChange(reply.id, false)}
										onDecrease={() => onChange(reply.id, true)}
										id={reply.id}
										onReply={onReply}
										onReplySubmit={onReplySubmit}
										onEdit={onEdit}
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
					<textarea
						className='text'
						placeholder='Add comment...'
						required
						value={commentToAdd}
						onChange={(e) => setCommentToAdd(e.target.value)}
					></textarea>
					<SolidButton
						text='SEND'
						onClick={addComment}
						disabled={!commentToAdd}
					/>
				</section>
			</div>
		</>
	);
}

export default App;
