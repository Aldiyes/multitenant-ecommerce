import { cookies as getCookies, headers as getHeaders } from 'next/headers';

import { AUTH_COOKIE } from '@/constants';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { TRPCError } from '@trpc/server';

import { loginSchema, registerSchema } from '@/zod-schemas';

export const authRouter = createTRPCRouter({
	session: baseProcedure.query(async ({ ctx }) => {
		const headers = await getHeaders();
		const session = await ctx.payload.auth({ headers });

		return session;
	}),

	register: baseProcedure
		.input(registerSchema)
		.mutation(async ({ ctx, input }) => {
			const existingUsername = await ctx.payload.find({
				collection: 'users',
				limit: 1,
				where: {
					username: {
						equals: input.username,
					},
				},
			});

			const existingUser = existingUsername.docs[0];

			if (existingUser) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Username already taken. Please try with another username',
				});
			}
			await ctx.payload.create({
				collection: 'users',
				data: {
					username: input.username,
					email: input.email,
					password: input.password, // this will be hashed
				},
			});

			const data = await ctx.payload.login({
				collection: 'users',
				data: {
					email: input.email,
					password: input.password,
				},
			});

			if (!data.token) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Failed to login',
				});
			}

			const cookies = await getCookies();

			cookies.set({
				name: AUTH_COOKIE,
				value: data.token,
				httpOnly: true,
				path: '/',
				// TODO: ensure cross-domain cookie sharing
				// samesite: "none",
				// domain: ""
			});

			return data;
		}),

	login: baseProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
		const data = await ctx.payload.login({
			collection: 'users',
			data: {
				email: input.email,
				password: input.password,
			},
		});

		if (!data.token) {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Failed to login',
			});
		}

		const cookies = await getCookies();

		cookies.set({
			name: AUTH_COOKIE,
			value: data.token,
			httpOnly: true,
			path: '/',
			// TODO: ensure cross-domain cookie sharing
			// samesite: "none",
			// domain: ""
		});

		return data;
	}),

	logout: baseProcedure.mutation(async () => {
		const cookies = await getCookies();
		cookies.delete(AUTH_COOKIE);
	}),
});
