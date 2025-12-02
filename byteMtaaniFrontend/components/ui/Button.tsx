import React from 'react';
import BaseButton from '../common/Button';

interface LegacyProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text?: string;
	className?: string;
	// allow arbitrary legacy style props without strict typing
	[key: string]: any;
}

export default function Button({ text, children, className, ...rest }: LegacyProps) {
	return <BaseButton className={className} {...rest}>{text ?? children}</BaseButton>;
}
