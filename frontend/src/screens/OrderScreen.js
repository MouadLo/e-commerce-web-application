import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Row,
	Col,
	Image,
	ListGroup,
	Card,
	Button,
	Form,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById } from '../actions/orderActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const OrderScreen = ({ match, history }) => {
	const dispatch = useDispatch();

	const orderDetails = useSelector((state) => state.orderDetails);
	const { loading, error, order } = orderDetails;

	if (!loading && !error) {
		const addDecimals = (num) => {
			return (Math.round(num * 100) / 100).toFixed(2);
		};
		order.itemsPrice = addDecimals(
			order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
		);
	}

	const orderId = match.params.id;
	useEffect(async () => {
		dispatch(getOrderById(orderId));
	}, [dispatch, orderId]);

	return (
		<>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<>
					<h2>Order {order._id}</h2>
					<Row>
						<Col md={8}>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<h2>Shipping</h2>
									<p>
										<strong>Name: </strong> {order.user.name}
									</p>
									<p>
										<a href={`mailto:${order.user.email}`}>
											{order.user.email}
										</a>
									</p>
									<p>
										<strong>Address: </strong>
										{order.shippingAddress.address},{' '}
										{order.shippingAddress.city}{' '}
										{order.shippingAddress.postalCode}{' '}
										{order.shippingAddress.country}
									</p>
									{order.isDelivered ? (
										<Message variant="success">
											Delivered on {order.deliveredAt}{' '}
										</Message>
									) : (
										<Message variant="danger">Not Delivered</Message>
									)}
								</ListGroup.Item>
								<ListGroup.Item>
									<h2>Payment Method</h2>
									<p>
										<strong>Method: </strong>
										{order.paymentMethod}
									</p>
									{order.isPaid ? (
										<Message variant="success">Paid on {order.paidAt} </Message>
									) : (
										<Message variant="danger">Not Paid</Message>
									)}
								</ListGroup.Item>

								<ListGroup.Item>
									<h2>Order Items</h2>
									{order.orderItems.length === 0 ? (
										<Message>Order is empty</Message>
									) : (
										<ListGroup variant="flush">
											{order.orderItems.map((item, index) => (
												<Row key={index}>
													<Col md={1}>
														<Image
															src={item.image}
															alt={item.nam}
															fluid
															rounded
														/>
													</Col>
													<Col>
														<Link to={`/product/${item.product}`}>
															{item.name}
														</Link>
													</Col>
													<Col md={4}>
														{item.qty} x $ {item.price} = $
														{item.price * item.qty}
													</Col>
												</Row>
											))}
										</ListGroup>
									)}
								</ListGroup.Item>
							</ListGroup>
						</Col>
						<Col md={4}>
							<Card>
								<ListGroup variant="flush">
									<ListGroup.Item>
										<h2>Order Summary</h2>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Items</Col>
											<Col>$ {order.itemsPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Shipping</Col>
											<Col>$ {order.shippingPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Tax</Col>
											<Col>$ {order.taxPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Total</Col>
											<Col>$ {order.totalPrice}</Col>
										</Row>
									</ListGroup.Item>
								</ListGroup>
							</Card>
						</Col>
					</Row>
				</>
			)}
		</>
	);
};

export default OrderScreen;
