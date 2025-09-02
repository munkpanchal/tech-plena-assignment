export type TokenType = {
    id: string;
    name: string;
    symbol: string;
    image: string;
    thumb: string;
    data: {
        price?: number;
        price_change_percentage_24h?: {
            usd: number;
        };
        sparkline?: string;
    };
    holdings?: number;
    value?: number;
    trending?: boolean;
};

export type PortfolioState = {
    watchlist: TokenType[];
    holdings: { [key: string]: TokenType };
    lastUpdated: string | null;
    isFetching: boolean;
    error: string | null;
};

export type ButtonPropTypes = {
    variant: 'primary' | 'secondary';
    rounded?: boolean;
    children?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
};
