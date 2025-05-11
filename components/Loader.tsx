import { View , ActivityIndicator } from "react-native";
import { COLORS } from "@/constants/theme";

export function Loader() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    )
}