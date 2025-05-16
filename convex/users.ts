import { Id } from "./_generated/dataModel";
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

export const updateProfile = mutation({
    args: {
        fullname: v.string(),
        bio: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)
        await ctx.db.patch(currentUser._id, { fullName: args.fullname, bio: args.bio })
    }
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

export const getUserProfile = query({
    args: {id: v.id("users")},
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.id)
        if (!user) throw new Error("User not found")
        return user;
    }
})

export const isFollowing = query({
    args: {followingId: v.id("users")},

    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)

        const follow = await ctx.db
        .query("followers")
        .withIndex("by_both",
            (q) => q.eq("followerId", currentUser._id).eq("followingId", args.followingId))
        .first()
        return !!follow
    }
})

export const toggleFollow = mutation({
    args : {followingId: v.id("users")},
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)

        const existing = await ctx.db
        .query("followers")
        .withIndex("by_both",
            (q) => q.eq("followerId", currentUser._id).eq("followingId", args.followingId))
        .first()

        if (existing) {
            //unfollow
            await ctx.db.delete(existing._id)

            await updateFollowCounts(ctx, currentUser._id, args.followingId, false)
        } else {
            //follow
            await ctx.db.insert("followers", {
                followerId: currentUser._id,
                followingId: args.followingId
            })
            await updateFollowCounts(ctx, currentUser._id, args.followingId, true)

            //create a notification
            await ctx.db.insert("notifications", {
                senderId: currentUser._id,
                recieverId: args.followingId,
                type: "follow"
            })
        }
    }
})

async function updateFollowCounts(
    ctx: MutationCtx,
    followerId: Id<"users">,
    followingId: Id<"users">,
    isFollowing: boolean
){
    const follower = await ctx.db.get(followerId)
    const following = await ctx.db.get(followingId)

    if (follower && following) {
        await ctx.db.patch(followerId, { following: follower.following + (isFollowing ? 1 : -1) })
        await ctx.db.patch(followingId, { followers: following.followers + (isFollowing ? 1 : -1) })
    }
}