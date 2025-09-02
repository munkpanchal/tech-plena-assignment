import { MdWallet } from 'react-icons/md';

import Button from './shared/Button';

const Header = () => {
    return (
        <header className="flex justify-between ">
            <div className="flex gap-3 items-center">
                <img src="/logo.png" alt="Token Portfolio" />
                <h2 className="text-xl font-semibold">Token Portfolio</h2>
            </div>
            <Button
                variant="primary"
                rounded
                onClick={() => alert('Button clicked!')}
                icon={<MdWallet />}
            >
                connect wallet
            </Button>
        </header>
    );
};

export default Header;
