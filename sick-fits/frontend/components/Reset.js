import { gql, useMutation } from '@apollo/client';

import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

const RESET_MUTATION = gql`
    mutation RESET_MUTATION(
        $email: String!
        $password: String!
        $token: String!
        ) {
        redeemUserPasswordResetToken(
            email: $email
            token: $token
            password: $password
        ) {
            message
            code
        }
    }
`;


export default function Reset({ token }) {
    const {  inputs, handleChange, resetForm } = useForm({
        email: '',
        password: '',
        token,
    });

    const [reset, { data, loading, error }] = useMutation(
        RESET_MUTATION,
        {
            variables: inputs,
        },
    );

    const successfullError = data?.redeemUserPasswordResetToken?.code 
        ? data?.redeemUserPasswordResetToken
        : undefined

    return (
        <Form method='POST' onSubmit={async (e) => {
            e.preventDefault()
            console.log(inputs);
            const res = await reset().catch(console.error)
            console.log('res: ', res);
            console.log({ data, error, loading });
            resetForm();

            // Send the email and password to the graphql API
        }}>
            <h2>Reset Your Password</h2>
            <DisplayError error={error || successfullError} />
            <fieldset>
                {
                    data?.sendUserPasswordResetLink === null && (
                        <p>Success! You can now sign in</p>
                    )
                }
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
                        placeholder="Your Password"
                        autoComplete='password'
                        value={inputs.password}
                        onChange={handleChange}
                    />
                </label>
                <button type='submit'>Request Reset</button>
            </fieldset>
        </Form>
    )
}
