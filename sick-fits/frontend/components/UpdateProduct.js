import { gql, useMutation, useQuery } from '@apollo/client';
import router from 'next/router'

import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';

const SINGLE_PRODUCT_QUERY = gql`
    query SINGLE_PRODUCT_QUERY($id: ID!) {
        Product(where: { id: $id}) {
            id
            name
            description
            price
        }
    }
`;

const UPDATE_PRODUCT_MUTATION = gql`
    mutation UPDATE_PRODUCT_MUTATION(
        $id: ID!
        $name: String,
        $description: String,
        $price: Int,
    ) {
        updateProduct(
            id: $id,
            data: { name: $name, description: $description, price: $price, }
        ) {
            id
            name
            description
            price

        }
    }
`;

export default function UpdateProduct({ id }) {
    // 1. We need to get the existing product
    const { 
        loading, 
        error, 
        data 
    } = useQuery(SINGLE_PRODUCT_QUERY, {
        variables: {
            id,
        },
    });

    // 2. We need to get Mutation to update the product
    const [
        updateProduct, {
            data: updatedata, 
            error: updateError,
            loading: updateLoading
        },
    ] = useMutation(UPDATE_PRODUCT_MUTATION)

    // 2.5 Create some state for the form inputs
    const {inputs, handleChange, clearForm, resetForm } = useForm(data?.Product);

    async function onSubmit(e) {
        e.preventDefault();

        // Todo: Handle Submit
        const res = await updateProduct({
            variables: {
                id,
                data: {
                    name: inputs.name,
                    description: inputs.description,
                    price: inputs.price,
                },
                // Todo: Pass in updatesto product here
            }
        });
        router.push({
            pathname: `product/${res.data.updateProduct.id}`
        })
    }

    if (loading) return <p>Loading..</p>

    // 3 We need the form to handle the updates
    return (
        <Form onSubmit={onSubmit}>
            <DisplayError error={error || updateError} />
            <fieldset disabled={updateLoading} aria-busy={updateLoading}>

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

                <button type='submit'>Update Product</button>
            </fieldset>
            {/* <button type='button' onClick={clearForm}>Clear Form</button>      
            <button type='button' onClick={resetForm}>Reset Form</button>       */}
        </Form>
    )
} 