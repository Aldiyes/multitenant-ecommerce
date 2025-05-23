import { cookies as getCookies } from 'next/headers';

type CookieProps = {
	prefix: string;
	value: string;
};

export const generateAuthCookie = async ({ prefix, value }: CookieProps) => {
	const cookies = await getCookies();

	cookies.set({
		name: `${prefix}-token`,
		value: value,
		httpOnly: true,
		path: '/',
	});
};
