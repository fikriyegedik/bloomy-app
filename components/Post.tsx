import { COLORS } from '@/constants/theme'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/clerk-expo'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useMutation, useQuery } from 'convex/react'
import { formatDistanceToNow } from 'date-fns'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { styles } from '../styles/feed.styles'
import CommentsModal from './CommentsModal'


type PostProps = {
    post:{
        _id: Id<"posts">
        imageUrl: string
        caption?: string
        likes: number
        comments: number
        _creationTime: number
        isLiked: boolean
        isBookmarked: boolean
        author: {
            _id: string
            userName: string
            image: string
        }
    }
}
export default function Post({ post }: PostProps ) {

    const [isLiked, setIsLiked] = useState(post.isLiked)
    const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked)
    const [likesCount , setLikesCount] = useState(post.likes)
    const [commentsCount , setCommentsCount] = useState(post.comments)
    const [showComments, setShowComments] = useState(false)

    const {user} = useUser() //clerk user doesn't have spesific fields like in the db
    const currentUser =useQuery(api.users.getUserByClerkId, user ? {clerkId: user?.id} : 'skip') //db user

    const toggleLike = useMutation(api.posts.toggleLike)
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark)
    const deletePost = useMutation(api.posts.deletePosts)

    const handleDelete = async () => {
        try {
            await deletePost({postId: post._id})
        }catch (error) {
            console.log( "Error deleting post:" , error)
        }
    }

    const handleLike = async () => {
        try {
            const newIsLiked =await toggleLike({ postId: post._id })
            setIsLiked(newIsLiked)
            setLikesCount((prev) => newIsLiked ? prev + 1 : prev - 1)
        }catch (error) {
            console.log( "Error liking post:" , error)
        }
    }

    const handleBookmark = async () => {
        const newIsBookmarked = await toggleBookmark({ postId: post._id })
        setIsBookmarked(newIsBookmarked)
    }
    return (
        <View style={styles.post}>
            <View style={styles.postHeader}>
                <Link href={"/(tabs)"}>
                    <TouchableOpacity style={styles.postHeaderLeft}>
                        <Image source={post.author.image} style={styles.postAvatar} contentFit="cover" transition={200}
                        cachePolicy="memory-disk" />
                        <Text style={styles.postUsername}>{post.author.userName}</Text>
                    </TouchableOpacity>
                </Link>

                {/* if im the owner of the post show delete */}

                { post.author._id === currentUser?._id ? (
                    <TouchableOpacity onPress={handleDelete}>
                        <Ionicons name='trash-outline' size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity>
                        <Ionicons name='ellipsis-horizontal' size={20} color={COLORS.white} />
                    </TouchableOpacity>
                )}

            </View>

            <Image source={post.imageUrl} style={styles.postImage} contentFit="cover" transition={200} cachePolicy="memory-disk"/>

            {/* Post actions */}
            <View style={styles.postActions}>
                <View style={styles.postActionsLeft}>
                    <TouchableOpacity onPress={handleLike}>
                        <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={22}
                        color={isLiked ? COLORS.gradient : COLORS.white} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowComments(true)}>
                        <Ionicons name='chatbubble-outline' size={22} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleBookmark}>
                    <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={22} color={COLORS.white} />
                </TouchableOpacity>

            </View>
            {/* post info */}
            <View style={styles.postInfo}>
                <Text style={styles.likesText}>{likesCount > 0 ? `${likesCount.toLocaleString()} likes`: "Be the first to like" }</Text>
                {post.caption && (
                    <View style={styles.captionContainer}>
                        <Text style={styles.captionUsername}>{post.author.userName}</Text>
                        <Text style={styles.captionText}>{post.caption}</Text>
                    </View>
                )}
                {commentsCount > 0 && (
                    <TouchableOpacity onPress={() => setShowComments(true)}>
                        <Text style={styles.commentsText}>View all {commentsCount} comments</Text>
                    </TouchableOpacity>
                )}
                <Text style={styles.timeAgo}>
                    {formatDistanceToNow(post._creationTime, { addSuffix: true })}
                </Text>
            </View>

            <CommentsModal
                postId = {post._id}
                visible={showComments}
                onClose={() => setShowComments(false)}
                onCommentAdded={() => setCommentsCount(prev => prev + 1)}

            />
        </View>
    )
}
