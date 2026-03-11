const numberFormatter = new Intl.NumberFormat('en-UG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

export const formatUGX = (value) => {
    const amount = Number(value ?? 0);
    if (!Number.isFinite(amount)) {
        return 'UGX 0';
    }

    return `UGX ${numberFormatter.format(amount)}`;
};

export default formatUGX;
