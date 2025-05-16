import { Ionicons } from '@expo/vector-icons'
import { formatDistanceToNow } from 'date-fns'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import { COLORS } from '../constants/theme'
import { styles } from '../styles/notifications.styles'
export default function Notification({ notification } : any) {
    return (
        <View style={styles.notificationItem}>
            <View style={styles.notificationContent}>
                <Link href={`/user/${notification.sender._id}`} asChild>
                    <TouchableOpacity style={styles.avatarContainer}>
                        <Image source={notification.sender.image} style={styles.avatar} contentFit='cover' transition={200}/>
                        <View style={styles.iconBadge}>
                        {notification.type === "like" ? (
                            <Ionicons name='heart' size={14} color={COLORS.primary} />
                            ) :
                            notification.type=== "follow" ? (
                            <Ionicons name='person-add' size={14} color={COLORS.gradient} />
                            ) : (
                            <Ionicons name='chatbubble' size={14} color={COLORS.secondary} /> )
                        }
                        </View>
                    </TouchableOpacity>
                </Link>

                <View style={styles.notificationInfo}>
                    <Link href={`/user/${notification.sender._id}`} asChild>
                        <TouchableOpacity>
                            <Text style={styles.username}>{notification.sender.userName}</Text>
                        </TouchableOpacity>
                    </Link>
                    <Text style={styles.action}>
                        {notification.type === "like" ? "liked your post" : notification.type === "follow" ? "followed you" :  `commented on your post: "${notification.comment}"`}
                    </Text>
                    <Text style={styles.timeAgo}>
                        {formatDistanceToNow(notification._creationTime, { addSuffix: true })}
                    </Text>
                </View>
            </View>
                {notification.post && (
                    <Image source={notification.post.imageUrl} style={styles.postImage} contentFit='cover' transition={200} />
                )}
        </View>
    )
}