import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { SplashScreen } from 'expo-router';
import { Menu, X, Chrome as Home, Book, Calculator } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

SplashScreen.preventAutoHideAsync();

const MENU_ITEMS = [
  { 
    title: 'Home',
    route: '/',
    icon: Home,
    gradient: ['#4F46E5', '#3730A3']
  },
  { 
    title: 'Alphabet',
    route: '/alphabet',
    icon: Book,
    gradient: ['#D01C1F', '#9B1C1F']
  },
  { 
    title: 'Numbers',
    route: '/numbers',
    icon: Calculator,
    gradient: ['#009B74', '#007B5C']
  }
];

export default function RootLayout() {
  useFrameworkReady();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));

  const [fontsLoaded, fontError] = useFonts({
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Bold': Roboto_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    Animated.timing(menuAnimation, {
      toValue: isMenuOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isMenuOpen]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const translateY = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0]
  });

  return (
    <View style={styles.container}>
      {/* Top Header with Burger Menu */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X size={24} color="#1e293b" />
          ) : (
            <Menu size={24} color="#1e293b" />
          )}
        </TouchableOpacity>
      </View>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <Animated.View
        style={[
          styles.mobileMenu,
          {
            transform: [{ translateY }],
            opacity: menuAnimation
          }
        ]}
      >
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.mobileMenuItem}
            onPress={() => {
              router.push(item.route);
              setIsMenuOpen(false);
            }}
          >
            <LinearGradient
              colors={item.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mobileMenuItemGradient}
            >
              <item.icon size={24} color="#fff" />
              <Text style={styles.mobileMenuText}>
                {item.title}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Main Content */}
      <View style={styles.content}>
        <Stack screenOptions={{ 
          headerShown: false,
          animation: 'fade',
          animationDuration: 200
        }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="alphabet/index" />
          <Stack.Screen name="numbers" />
        </Stack>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    zIndex: 10,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  overlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  mobileMenu: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 16,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mobileMenuItem: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mobileMenuItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  mobileMenuText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
});