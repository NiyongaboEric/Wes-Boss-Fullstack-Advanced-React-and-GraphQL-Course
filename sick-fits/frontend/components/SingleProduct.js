import { gql, useQuery } from '@apollo/client'
import Styled from 'styled-components';

import DisplayError from '../components/ErrorMessage';
import Head from 'next/head';

const ProductStyles = Styled.div`
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    min-height: 800px;
    max-width: var(--maxWidth);
    justify-content: center;
    align-items: top;
    gap: 2rem;

    img {
        width: 100%;
        object-fit: contain;
    }
`;

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY(
        $id: ID!
    ) {
        Product(
            where: { id: $id }
            ) {
                name
                price
                description
                id
                photo {
                    altText
                    image {
                        publicUrlTransformed
                    }
                }
            }
    }
`;


export default function SingleProduct({ id }) {
    console.log('....', id);
    const { data, loading, error } = useQuery(SINGLE_ITEM_QUERY, {
        variables: {
            id
        }
    });

    if(loading) return <p>Loading...</p>;
    if(error) return <DisplayError error={error}/>;
    const { Product } = data;
    return (
        <ProductStyles>
            <Head>
                <title>Sick Fits | {Product.name}</title>
            </Head>
            <img 
                src={Product.photo.image.publicUrlTransformed}
                alt={Product.photo.alt}
            />
            <div className='details'>
                <h2>{Product.name}</h2>
                <p>{Product.description}</p>
            </div>
        </ProductStyles>
    )
};
