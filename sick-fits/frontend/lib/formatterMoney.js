export default function FormatMoney(amount = 0) {
    const options = {
        style: 'currency',
        currency: 'USD',
        minimumFractoryDigits: 2,
    }

    // check if its a clean dollar amount
    if (amount % 100 === 0) {
        options.minimumFractoryDigits = 0;
    }

    const formatter = Intl.NumberFormat('en-US', options);

    return formatter.format(amount / 100);
}
