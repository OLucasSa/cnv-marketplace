import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);

// Editor procedure: can manage products but not users or settings
export const editorProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || (ctx.user.role !== 'admin' && ctx.user.role !== 'editor')) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Editor access required" });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);

// Admin procedure para painel simples (aceita chave na URL)
export const adminSimpleProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;
    const ADMIN_SECRET_KEY = "cnv2024admin"; // Mesma chave do painel admin

    // Verificar se eh admin via OAuth
    if (ctx.user && ctx.user.role === 'admin') {
      return next({ ctx });
    }

    // Verificar se tem chave admin na URL ou header
    const adminKey = (ctx.req.query as any)?.adminKey || ctx.req.headers['x-admin-key'];
    if (adminKey === ADMIN_SECRET_KEY) {
      return next({ ctx });
    }

    throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
  }),
);
