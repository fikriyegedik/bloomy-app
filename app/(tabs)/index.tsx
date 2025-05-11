import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/feed.styles";
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../../constants/theme";
import { STORIES } from "@/constants/mock-data";
import Story from "@/components/Story";

export default function Index() {

  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>bloomy</Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsVerticalScrollIndicator={false} style={styles.storiesContainer}>
        {STORIES.map((story) => (
          <Story key={story.id} story={story} />
        ))}
      </ScrollView>
    </View>
  );
}

