import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

// Create a new task with the given text
export const createUser = mutation({
    args: { userName: v.string(),
        fullName: v.string(),
        email: v.string(),
        bio: v.optional(v.string()),
        image: v.string(),
        followers: v.number(),
        following: v.number(),
        posts: v.number(),
        clerkId: v.string()},
    handler: async (ctx, args) => {
        const existingUser = await ctx.db.query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
        .first()


        if(existingUser) return;

        //create a user in database
        await ctx.db.insert("users", { userName: args.userName,
        fullName: args.fullName, email: args.email, bio: args.bio, image: args.image, followers: 0, following: 0, posts: 0, clerkId: args.clerkId });
    },
});

export const getUserByClerkId = query({
    args: {clerkId: v.string()},
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
        .unique()

        return user;
    },
})

export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const currentUser = await ctx.db.query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

    if (!currentUser) throw new Error("User not found");

    return currentUser;
}


