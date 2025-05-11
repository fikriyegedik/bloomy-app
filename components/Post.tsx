import { View, Text, TouchableOpacity  } from 'react-native'
import React from 'react'
import { styles } from '../styles/feed.styles'
import { Link } from 'expo-router'
import { Image } from 'expo-image'
import Ionicons from '@expo/vector-icons/Ionicons'
import { COLORS } from '@/constants/theme'
export default function Post({ post }: { post: any }) {
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
                <TouchableOpacity>
                    <Ionicons name='ellipsis-horizontal' size={20} color={COLORS.white} />
                </TouchableOpacity>

                {/* <TouchableOpacity>
                    <Ionicons name='trash-outline' size={20} color={COLORS.primary} />
                </TouchableOpacity> */}
            </View>

            <Image source={post.imageUrl} style={styles.postImage} contentFit="cover" transition={200} cachePolicy="memory-disk"/>

            {/* Post actions */}
            <View style={styles.postActions}>
                <View style={styles.postActionsLeft}>
                    <TouchableOpacity>
                        <Ionicons name='heart-outline' size={22} color={COLORS.white} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name='chatbubble-outline' size={22} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Ionicons name='bookmark-outline' size={22} color={COLORS.white} />
                </TouchableOpacity>

            </View>
            {/* post info */}
            <View style={styles.postInfo}>
                <Text style={styles.likesText}>Be the first to like</Text>
                {post.caption && (
                    <View style={styles.captionContainer}>
                        <Text style={styles.captionUsername}>{post.author.userName}</Text>
                        <Text style={styles.captionText}>{post.caption}</Text>
                    </View>
                )}
                <TouchableOpacity>
                    <Text style={styles.commentsText}>View all comments</Text>
                </TouchableOpacity>
                <Text style={styles.timeAgo}>2 hours ago</Text>
            </View>
        </View>
    )
}
