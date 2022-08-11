import Head from 'next/head';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';

import PaginationStyles from './styles/PaginationStyles';
import DisplayError from '../components/ErrorMessage';
import { perPage } from '../config';


export const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        _allProductsMeta {
            count
        }
    }
`;

export default function Pagination({ page }) {
    const { error, loading, data } = useQuery(PAGINATION_QUERY);
    if(loading) return 'Loading...';
    if(error) return <DisplayError error={error}/>
    const { count } = data._allProductsMeta;
    const pageCount = Math.ceil(count / perPage);

    return (
        <PaginationStyles>
            <Head>
                <title>Sick Fits - Page {page} of ____ </title>
            </Head>
            <Link 
                href={`/products/${page - 1}`}
            >
                <a aria-disabled={page <= 1 }>← Prev</a>
            </Link>
            <p>Page __ of {pageCount}</p>
            <p>{count} Items Total</p>
            <Link
                href={`/products/${ page + 1 }`}
            >
                <a aria-disabled={page >= pageCount}>Next →</a>
            </Link>
        </PaginationStyles>
    )
}
