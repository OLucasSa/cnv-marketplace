import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from "../../shared/const";

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

// Admin procedure para painel simples (aceita chave admin via header)
export const adminSimpleProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;
    const ADMIN_SECRET_KEY = "cnv2024admin";

    // Verificar se eh admin via OAuth
    if (ctx.user && ctx.user.role === 'admin') {
      return next({ ctx });
    }

    // Verificar chave no header x-admin-key
    const headerKey = ctx.req.headers['x-admin-key'];
    if (headerKey === ADMIN_SECRET_KEY) {
      return next({ ctx });
    }

    // Verificar chave no header Authorization (Bearer token)
    const authHeader = ctx.req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      if (token === ADMIN_SECRET_KEY) {
        return next({ ctx });
      }
    }

    throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
  }),
);
