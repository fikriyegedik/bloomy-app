import { useSSO } from '@clerk/clerk-expo'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { COLORS } from '../../constants/theme'
import { styles } from '../../styles/auth.styles'

export default function Login() {
    const { startSSOFlow } = useSSO()
    const router = useRouter()
    const handleGoogleSignIn = async () => {
        try {
            const { createdSessionId, setActive } = await startSSOFlow({strategy: 'oauth_google'})

            if (setActive && createdSessionId) {
                await setActive({session: createdSessionId})
                router.replace('/(tabs)')
            }

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.brandSection}>
                <View style={styles.logoContainer}>
                    {/* <Ionicons name='paw-outline' size={32} color={COLORS.primary} /> */}

                    <Image source={require('./../.././assets/images/logo-white-whiskr.png')} style={styles.logo} />

                </View>

                <Text style={styles.appName}>whiskr circle</Text>
                <Text style={styles.tagline}>where every whisker tells a story.</Text>

            </View>
            <View style={styles.illustrationContainer}>
                <Image source={require('./../../assets/images/gif-bg.gif')} style={styles.illustration} resizeMode='cover'/>
            </View>
            <View style={styles.loginSection}>
                <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn} activeOpacity={0.9}>
                    <View style={styles.googleIconContainer}>
                        <Ionicons name='logo-google' size={20} color={COLORS.surface} />
                    </View>
                    <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </TouchableOpacity>
                <Text style={styles.termsText}>By continuing, you agree to our Terms and Privacy Policy</Text>
            </View>

        </View>
    )
}