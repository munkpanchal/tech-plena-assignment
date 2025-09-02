import React from 'react';

import { ButtonPropTypes } from '../../types';

const Button: React.FC<ButtonPropTypes> = ({
    variant,
    rounded = false,
    icon,
    children = 'Button',
    size = 'md',
    className = '',
    onClick,
    disabled = false,
}) => {
    const base = 'flex items-center gap-[6px] px-4 py-2 font-medium capitalize';
    const variantClass =
        variant === 'primary'
            ? 'bg-primary text-[#18181B] border border-[#1F6619]'
            : 'bg-lightBlack text-white';
    const roundedClass = rounded ? 'rounded-full' : 'rounded-md';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    function getSizeClasses(size: string) {
        if (size === 'sm') {
            return 'text-xs py-1 px-2';
        } else if (size === 'lg') {
            return 'text-lg py-3 px-6';
        } else {
            return 'text-md py-2 px-4';
        }
    }

    const sizeClass = getSizeClasses(size);

    return (
        <button
            className={`${base} ${variantClass} ${sizeClass} ${roundedClass} ${disabledClass} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span className="text-xl">{icon}</span>}
            {children}
        </button>
    );
};

export default Button;
