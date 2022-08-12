import { gql, useMutation } from '@apollo/client';

import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION(
        $email: String!
        $name: String!
        $password: String!
    ) {
        createUser(
            data: {
                email: $email,
                name: $name,
                password: $password
            }
        ) {
            id
            email
            name
        }
    }
`;


export default function SignUp() {
    const {  inputs, handleChange, resetForm } = useForm({
        email: '',
        name: '',
        password: '',
    });

    const [signup, { data, loading, error }] = useMutation(
        SIGNUP_MUTATION,
        {
            variables: inputs,
        },
    );

    return (
        <Form method='POST' onSubmit={async (e) => {
            e.preventDefault()

            await signup();
            resetForm();
            // Send the email and password to the graphql API
        }}>
            <h2>Sign Up into your account</h2>
            <DisplayError error={error} />
            <fieldset>
                {
                    data?.createUser && (
                        <p>
                            Signed up with {data.createUser.email}
                            - Please Go Head and sign in 
                        </p>
                    )
                }
                <label htmlFor='name'>
                    Name
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        autoComplete='name'
                        value={inputs.name}
                        onChange={handleChange}
                    />
                </label>
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
