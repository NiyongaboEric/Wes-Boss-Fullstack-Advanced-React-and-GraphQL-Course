import { gql, useMutation } from '@apollo/client';

import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from '../components/ErrorMessage';

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION($email: String!, $password: String!) {
        authenticateUserWithPassword(email: $email, password: $password) {
            ... on UserAuthenticationWithPasswordSuccess {
                item {
                    id
                    email
                    name
                }
            }
            ... on UserAuthenticationWithPasswordFailure {
                code
                message
            }
        }
    }
`;


export default function SignIn() {
    const {  inputs, handleChange, resetForm } = useForm({
        email: '',
        password: '',
    });

    const [signin, { data, loading }] = useMutation(
        SIGNIN_MUTATION,
        {
            variables: inputs,
            refetchQueries: [{ query: CURRENT_USER_QUERY }],
        },
    );

    const error = 
    data?.authenticateUserWithPassword.__typename === "UserAuthenticationWithPasswordFailure" 
    ? data?.authenticateUserWithPassword 
    : undefined;

    return (
        <Form method='POST' onSubmit={async (e) => {
            e.preventDefault()

            // Send the email and password to the graphql API
            await signin();
            resetForm();
        }}>
            <h2>Sign into your account</h2>
            <fieldset>
                <DisplayError 
                    error={error}
                />
                <label htmlFor='email'>
                    Email
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email Address"
                        autoComplete='email'
                        value={inputs.email}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor='password'>
                    Password
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete='password'
                        value={inputs.password}
                        onChange={handleChange}
                    />
                </label>
                <button type='submit'>Sign in!</button>
            </fieldset>
        </Form>
    )
}
