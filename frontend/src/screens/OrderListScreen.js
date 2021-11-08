import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../actions/orderActions';

import Loader from '../components/Loader';
import Message from '../components/Message';

const OrderListScreen = ({ history, match }) => {
	const dispatch = useDispatch();

	const ordersList = useSelector((state) => state.ordersList);
	const { loading, error, orders } = ordersList;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (!userInfo.isAdmin) {
			history.push('/login');
		}

		dispatch(listOrders());
	}, [dispatch, history, userInfo]);

	return (
		<>
			<Row className="align-items-center">
				<Col>
					<h1>Orders</h1>
				</Col>
			</Row>

			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<Table striped bordered hover responsive className="table-sm">
					<thead>
						<tr>
							<th>ID</th>
							<th>User Name</th>
							<th>Payment Method</th>
							<th>Total Price</th>
							<th>is Paid</th>
							<th>is Deliverd</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order, index) => (
							<tr key={index}>
								<td>{order._id}</td>
								<td>{order.user.name}</td>
								<td>$ {order.paymentMethod}</td>
								<td>{order.totalPrice}</td>

								<td>
									{order.isPaid ? (
										<i className="fas fa-check" style={{ color: 'green' }}>
											{' '}
										</i>
									) : (
										<i className="fas fa-times" style={{ color: 'red' }}>
											{' '}
										</i>
									)}
								</td>
								<td>
									{order.isDelivered ? (
										<i className="fas fa-check" style={{ color: 'green' }}>
											{' '}
										</i>
									) : (
										<i className="fas fa-times" style={{ color: 'red' }}>
											{' '}
										</i>
									)}
								</td>
								<td>
									<LinkContainer to={`/order/${order._id}/`}>
										<Button variant="light" className="btn-sm">
											<i className="fas fa-edit"></i>
										</Button>
									</LinkContainer>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
};

export default OrderListScreen;
