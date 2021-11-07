import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
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
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET } from '../constants/orderContants';
import Loader from '../components/Loader';
import Message from '../components/Message';

const OrderScreen = ({ match, history }) => {
	const orderId = match.params.id;

	const [clientId, setClientId] = useState('');
	const dispatch = useDispatch();

	const orderDetails = useSelector((state) => state.orderDetails);
	const { loading, error, order } = orderDetails;

	const orderPay = useSelector((state) => state.orderPay);
	const { loading: loadingPay, success: successPay } = orderPay;

	if (!loading && !error) {
		const addDecimals = (num) => {
			return (Math.round(num * 100) / 100).toFixed(2);
		};
		order.itemsPrice = addDecimals(
			order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
		);
	}

	useEffect(async () => {
		const { data: clientId } = await axios.get('/api/config/paypal');
		setClientId(clientId);
		if (successPay) {
			dispatch({ type: ORDER_PAY_RESET });
			dispatch(getOrderDetails(orderId));
		} else {
			dispatch(getOrderDetails(orderId));
		}
	}, [dispatch, orderId, successPay]);

	const createOrder = (data, actions) => {
		console.log(data);
		return actions.order.create({
			purchase_units: [
				{
					amount: {
						value: order.totalPrice,
					},
				},
			],
		});
	};

	const onApprove = (data, actions) => {
		console.log(data);
		return actions.order.capture().then(function (details) {
			// This function shows a transaction success message to your buyer.

			dispatch(payOrder(orderId, details));
		});
	};
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
									{!order.isPaid && (
										<ListGroup.Item>
											{loadingPay && <Loader />}
											{
												<PayPalScriptProvider
													options={{
														'client-id': clientId,
													}}
												>
													<PayPalButtons
														createOrder={(data, actions) =>
															createOrder(data, actions)
														}
														onApprove={(data, actions) =>
															onApprove(data, actions)
														}
													/>
												</PayPalScriptProvider>
											}
										</ListGroup.Item>
									)}
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
