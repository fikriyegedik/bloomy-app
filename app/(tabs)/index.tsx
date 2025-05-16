import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
import StoriesSection from "@/components/Stories";
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { useState } from "react";
import { Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";
import { api } from "../../convex/_generated/api";
import { styles } from "../../styles/feed.styles";
export default function Index() {

  const { signOut } = useAuth();
  const [refreshing , setRefreshing] = useState(false)

  // this does nothing
  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      //tanstack query refetch
    }, 2000)
  }
  const handleSignOut = () => {
  Alert.alert(
    "Hold Up!",
    "Leaving already? Come back soon!",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Sign Out",
        onPress: () => signOut()
      }
    ]
  );
};

  const posts = useQuery(api.posts.getFeedPosts)

  if (posts === undefined) return <Loader />
  if (posts.length === 0) return <NoPostsFound />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>whiskr circle</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom:60}}
        ListHeaderComponent={<StoriesSection />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary}/>
        }
      />

    </View>
  );
}

const NoPostsFound = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
      <Text>No posts found</Text>
    </View>
  );
};
