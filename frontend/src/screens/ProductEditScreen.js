import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

function ProductEditScreen({ location, match, history }) {
	const productId = match.params.id;

	const [name, setName] = useState('');
	const [price, setPrice] = useState(0);
	const [image, setImage] = useState('');
	const [brand, setBrand] = useState('');
	const [category, setCategory] = useState('');
	const [description, setDescription] = useState('');
	const [countInStock, setCountInStock] = useState(0);
	const [uploading, setUploading] = useState(false);

	const dispatch = useDispatch();

	const productDetails = useSelector((state) => state.productDetails);
	const { loading, error, product } = productDetails;

	const productUpdate = useSelector((state) => state.productUpdate);
	const {
		loading: loadingUpdate,
		error: errorUpdate,
		success: successUpdate,
	} = productUpdate;

	useEffect(() => {
		if (!product || !product.name || product._id !== productId) {
			dispatch(listProductDetails(productId));
		} else if (successUpdate) {
			dispatch({ type: PRODUCT_UPDATE_RESET });
			dispatch(listProductDetails(productId));
		} else {
			setName(product.name);
			setPrice(product.price);
			setImage(product.image);
			setBrand(product.brand);
			setCategory(product.category);
			setDescription(product.description);
			setCountInStock(product.countInStock);
		}
	}, [dispatch, productId, product]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(
			updateProduct(productId, {
				name,
				price,
				image,
				brand,
				category,
				description,
				countInStock,
			})
		);
	};
	const uploadFileHandler = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('image', file);
		setUploading(true);
		try {
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			};
			const { data } = await axios.post('/api/upload', formData, config);
			setImage(data);
			setUploading(false);
		} catch (error) {
			console.error(error);
			setUploading(false);
		}
	};
	return (
		<>
			<Link to="/admin/productlist" className="btn btn-light my-3">
				Go Back
			</Link>
			<FormContainer>
				<h1>Edit Product</h1>

				{}
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant="danger">{error}</Message>
				) : (
					<>
						{errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
						{loadingUpdate ? (
							<Loader />
						) : (
							<>
								{successUpdate && (
									<Message variant="success">
										Product updated successfuly
									</Message>
								)}
								<Form onSubmit={submitHandler}>
									<Form.Group controlId="name">
										<Form.Label>Name</Form.Label>
										<Form.Control
											type="text"
											placeholder="Enter name"
											value={name}
											onChange={(e) => setName(e.target.value)}
										></Form.Control>
									</Form.Group>
									<Form.Group controlId="price">
										<Form.Label>Price</Form.Label>
										<Form.Control
											type="number"
											placeholder="Enter price"
											value={price}
											onChange={(e) => setPrice(e.target.value)}
										></Form.Control>
									</Form.Group>
									<Form.Group controlId="image">
										<Form.Label>Image</Form.Label>
										<Form.Control
											type="text"
											placeholder="Enter Image"
											value={image}
											onChange={(e) => setImage(e.target.value)}
										></Form.Control>
										<Form.File
											id="image-file"
											label="Choose file"
											custom
											onChange={uploadFileHandler}
										>
											{uploading && <Loader />}
										</Form.File>
									</Form.Group>
									<Form.Group controlId="brand">
										<Form.Label>Brand</Form.Label>
										<Form.Control
											type="text"
											placeholder="Enter brand"
											value={brand}
											onChange={(e) => setBrand(e.target.value)}
										></Form.Control>
										<Form.Group controlId="category">
											<Form.Label>Category</Form.Label>
											<Form.Control
												type="text"
												placeholder="Enter category"
												value={category}
												onChange={(e) => setCategory(e.target.value)}
											></Form.Control>
										</Form.Group>
										<Form.Group controlId="description">
											<Form.Label>Description</Form.Label>
											<Form.Control
												type="text"
												placeholder="Enter description"
												value={description}
												onChange={(e) => setDescription(e.target.value)}
											></Form.Control>
										</Form.Group>
										<Form.Group controlId="countInStock">
											<Form.Label>countInStock</Form.Label>
											<Form.Control
												type="number"
												placeholder="Enter Count In Stock"
												value={countInStock}
												onChange={(e) => setCountInStock(e.target.value)}
											></Form.Control>
										</Form.Group>
									</Form.Group>
									<Button type="submit" variant="primary">
										Update
									</Button>
								</Form>
							</>
						)}
					</>
				)}
			</FormContainer>
		</>
	);
}

export default ProductEditScreen;
