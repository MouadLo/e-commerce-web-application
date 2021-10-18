import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import Rating from '../components/Rating';

const ProductScreen = ({ match }) => {
	const [product, setProduct] = useState(null);

	useEffect(async () => {
		const fetchProduct = async () => {
			const { data } = await axios.get(`/api/products/${match.params.id}`);
			console.log(data);
			setProduct(data);
		};
		fetchProduct();
	}, []);

	return (
		<>
			<Link className="btn btn-dark my-3" to="/">
				<i className="fas fa-arrow-left"></i> Go Back
			</Link>
			{product ? (
				<Row>
					<Col md={6}>
						<Image src={product.image} alt={product.name} fluid />
					</Col>
					<Col md={3}>
						<ListGroup variant="flush">
							<ListGroup.Item>
								<h3>{product.name}</h3>
							</ListGroup.Item>
							<ListGroup.Item>
								<Rating
									value={product.rating}
									text={`${product.numReviews} reviews`}
								/>
							</ListGroup.Item>
							<ListGroup.Item>Price: ${product.price}</ListGroup.Item>
							<ListGroup.Item>
								Description: {product.description}
							</ListGroup.Item>
						</ListGroup>
					</Col>
					<Col md={3}>
						<Card>
							<ListGroup>
								<ListGroup.Item>
									<Row>
										<Col>Price:</Col>
										<Col>
											<strong>${product.price}</strong>
										</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Status:</Col>
										<Col>
											{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
										</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Button
											className="btn-block"
											type="button"
											disabled={product.countInStock === 0}
										>
											Add To Cart
										</Button>
									</Row>
								</ListGroup.Item>
							</ListGroup>
						</Card>
					</Col>
				</Row>
			) : (
				<div>Product doesn't exist</div>
			)}
		</>
	);
};

export default ProductScreen;
