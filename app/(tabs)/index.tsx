import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/feed.styles";
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../../constants/theme";
import { STORIES } from "@/constants/mock-data";
import Story from "@/components/Story";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
export default function Index() {

  const { signOut } = useAuth();

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
        <Text style={styles.headerTitle}>bloomy</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:60}}>
        <ScrollView horizontal showsVerticalScrollIndicator={false} style={styles.storiesContainer}>
          {STORIES.map((story) => (
            <Story key={story.id} story={story} />
          ))}
        </ScrollView>
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </ScrollView>
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

