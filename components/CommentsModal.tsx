import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import React, { use, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from '../styles/feed.styles'
import Ionicons from '@expo/vector-icons/Ionicons'
import { COLORS } from '@/constants/theme'
import { Loader } from './Loader'
import Comment from './Comment'
import { set } from 'date-fns'

type CommentsModal = {
    postId: Id<"posts">
    visible: boolean
    onClose: () => void
    onCommentAdded: () => void
}

export default function CommentsModal({onClose, onCommentAdded, postId, visible}: CommentsModal) {
    const [newComment, setNewComment] = useState("")
    const comments = useQuery(api.comments.getComments, { postId })
    const addComment = useMutation(api.comments.addComment)

    const handleAddComment = async () => {
        if (!newComment.trim()) return
        try {
            await addComment({
                content: newComment,
                postId
            })
            setNewComment("")
            onCommentAdded()
        }catch (error) {
            console.log("Error adding comment:", error)
        }
    }

    return (
        <Modal visible={visible} animationType='slide' transparent={true} onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name='close' size={24} color={COLORS.white}/>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Comments</Text>
                    <View style={{ width: 24 }}/>
                </View>

                {comments === undefined ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={comments}
                        renderItem={({ item }) => <Comment comment={item} />}
                        contentContainerStyle={styles.commentsList}
                    />

                )}

                <View style={styles.commentInput}>
                    <TextInput style={styles.input} placeholder='Add a comment' value={newComment} onChangeText={setNewComment} placeholderTextColor={COLORS.grey} multiline />
                    <TouchableOpacity onPress={handleAddComment} disabled={!newComment.trim()}>
                        <Text style={[styles.postButton, !newComment.trim() && styles.postButtonDisabled]}>Post</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}