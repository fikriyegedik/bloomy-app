import { Image, Text, View } from "react-native";
import { styles } from "../../styles/auth.styles";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Image source={require("./../../assets/images/icon.png")} style={{ width: 200, height: 200 }} />
      <Link href="/notifications"><Text>Notifications</Text></Link>
    </View>
  );
}
