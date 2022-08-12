import { gql, useMutation } from '@apollo/client';

import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION($email: String!) {
        sendUserPasswordResetLink(email: $email) {
            message
            code
        }
    }
`;


export default function RequestReset() {
    const {  inputs, handleChange, resetForm } = useForm({
        email: '',
    });

    const [signup, { data, loading, error }] = useMutation(
        REQUEST_RESET_MUTATION,
        {
            variables: inputs,
        },
    );

    return (
        <Form method='POST' onSubmit={async (e) => {
            e.preventDefault()
            console.log(inputs);
            const res = await signup().catch(console.error)
            console.log('res: ', res);
            console.log({ data, error, loading });
            resetForm();

            // Send the email and password to the graphql API
        }}>
            <h2>Request a Password Reset</h2>
            <DisplayError error={error} />
            <fieldset>
                {
                    data?.sendUserPasswordResetLink === null && (
                        <p>Success! Check your email for a link</p>
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
                <button type='submit'>Request Reset</button>
            </fieldset>
        </Form>
    )
}
