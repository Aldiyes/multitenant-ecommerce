'use client';

import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Loader2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';
import { loginSchema } from '@/zod-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['700'],
});

export const SignInView = () => {
	const router = useRouter();
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const login = useMutation(
		trpc.auth.login.mutationOptions({
			onError: (error) => {
				toast.error(error.message);
			},
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
				router.push('/');
			},
		})
	);

	const form = useForm<z.infer<typeof loginSchema>>({
		mode: 'all',
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = (values: z.infer<typeof loginSchema>) => {
		login.mutate(values);
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-5">
			<div className="bg-[#F4F4F4] h-sreen w-full lg:col-span-3 overflow-y-auto">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-8 p-4 lg:p-16"
					>
						<div className="flex items-center justify-between mb-8">
							<Link href="/">
								<span
									className={cn('text-xl font-semibold', poppins.className)}
								>
									Gumroad
								</span>
							</Link>
							<Button
								variant="ghost"
								size="sm"
								className="text-base border-none underline"
								asChild
							>
								<Link prefetch href="/sign-up">
									Sign up
								</Link>
							</Button>
						</div>
						<h1 className="text-2xl font-medium">Welcome back to Gumroad.</h1>

						<FormField
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-base">Email</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-base">Password</FormLabel>
									<FormControl>
										<Input {...field} type="password" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							size="lg"
							variant="elevated"
							disabled={login.isPending}
							className="bg-black text-white hover:bg-pink-400 hover:text-primary"
						>
							{login.isPending ? (
								<Loader2Icon className="animate-spin size-6" />
							) : (
								'Log In'
							)}
						</Button>
					</form>
				</Form>
			</div>
			<div
				className="h-screen w-full lg:col-span-2 hidden lg:block"
				style={{
					backgroundImage: "url('/auth-background.png')",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			></div>
		</div>
	);
};
