import { useAuth } from '@clerk/clerk-expo'
import { Stack, useRouter, useSegments } from 'expo-router'
import React, { useEffect } from 'react'


export default function InitialLayout() {

    // Destructure authentication status:
    // isLoaded tells if the auth state is fully loaded
    // isSignedIn indicates whether the user is signed in
    const { isLoaded, isSignedIn } = useAuth()

    // Get the current navigation segments (e.g. ['(auth)', 'login'])
    const segments = useSegments()

    // Get access to router for navigation
    const router = useRouter()

    // useEffect runs when auth state or route changes
    useEffect(() => {
        // Wait until auth is fully loaded
        if (!isLoaded) return

        // Check if user is currently in the auth screens (e.g., login or register)
        const inAuthScreen = segments[0] === '(auth)'

        // If the user is NOT signed in and NOT on the auth screen, redirect to login
        if (!isSignedIn && !inAuthScreen) {
            router.replace('/(auth)/login')
        }
        // If the user IS signed in but IS on an auth screen, redirect to main app
        else if (isSignedIn && inAuthScreen) {
            router.replace('/(tabs)')
        }

    }, [isLoaded, isSignedIn, segments]) // dependencies for the effect

    // While auth state is still loading, render nothing
    if (!isLoaded) {
        return null
    }

    // Once loaded, render the Stack navigator without headers
    return <Stack screenOptions={{ headerShown: false }} />
}