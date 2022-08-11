import { useState } from 'react';
import { gql, useMutation } from '@apollo/client'
import router from 'next/router';

import useForm from '../lib/useForm';
import DisplayError from '../components/ErrorMessage';
import Form from '../components/styles/Form';
import { ALL_PRODUCTS_QUERY } from './Products';


const CREATE_PRODUCT_MUTATION = gql`
    mutation CREATE_PRODUCT_MUTATION(
        # Which variables are getting passed in?
        # And what types are they
        $name: String!
        $description: String!
        $price: Int!
        $image: Upload
    ) {
        createProduct(
            data: {
                name: $name,
                description: $description,
                price: $price,
                status: "AVAILABLE",
                photo: { 
                    create: {
                        image: $image,
                        altText: $name
                    } 
                }
            }
        ) {
            id,
            price,
            description,
            name
        }
    }
`;


export default function CreateProduct() {
    const {inputs, handleChange, clearForm, resetForm } = useForm({
        image: '',
        name: 'Nice Shoes',
        price: 3234,
        description: 'These are the best shoes',
    });

    const [
        createProduct,
        { loading, error, data }
    ] = useMutation(
        CREATE_PRODUCT_MUTATION,
        {
            variables: inputs,
            refetchQueries: [{ query: ALL_PRODUCTS_QUERY  }]
        }
    );

    async function onSubmit(e) {
        e.preventDefault();
        
        // Submit input to the backend
        const res = await createProduct();
        clearForm();
        // Go to that prduct's page
        router.push({
            pathname: `products/${res.data.createProduct.id}`
        })
    }

    return (
        <Form onSubmit={onSubmit}>
            <DisplayError error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
                <label htmlFor="image">
                    Image
                    <input
                        required
                        type="file"
                        id="image"
                        name="image"
                        placeholder="Name"
                        onChange={handleChange}
                    />
                </label> 

                <label htmlFor="name">
                    Name
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Name"
                        value={inputs.name}
                        onChange={handleChange}
                    />
                </label>
        
                <label htmlFor="price">
                    Price
                    <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="price"
                        value={inputs.price}
                        onChange={handleChange}
                    />
                </label>

                <label htmlFor="description">
                    Description
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        value={inputs.description}
                        onChange={handleChange}
                    />
                </label>

                <button type='submit'>+ Add Product</button>
            </fieldset>
            {/* <button type='button' onClick={clearForm}>Clear Form</button>      
            <button type='button' onClick={resetForm}>Reset Form</button>       */}
        </Form>
    )
}
