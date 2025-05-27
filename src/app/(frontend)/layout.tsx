import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';

import { Toaster } from '@/components/ui/sonner';
import { TRPCReactProvider } from '@/trpc/client';

const dmSans = DM_Sans({
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Multitenant E-Commerce',
	description: 'Create by @Aldiyes',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${dmSans.className} antialiased`}>
				<NuqsAdapter>
					<TRPCReactProvider>
						{children}
						<Toaster />
					</TRPCReactProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
