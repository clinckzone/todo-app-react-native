import { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import {
  Text,
  Button,
  Avatar,
  ActivityIndicator,
  MD3Colors,
} from 'react-native-paper';
import { getUserProfileData, logoutUser } from '../utils/users';

type UserType = {
  name: string;
  email: string;
  avatar: string;
};

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState<UserType | null>(null);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfileData();
        setUser(userProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {user.email === undefined ? (
        <ActivityIndicator
          size='large'
          animating={true}
          color={MD3Colors.primary40}
        />
      ) : (
        <View style={styles.profileContainer}>
          <Avatar.Image
            size={100}
            style={styles.avatar}
            source={{ uri: user.avatar }}
          ></Avatar.Image>
          <Text variant='titleLarge'>{user.name}</Text>
          <Text variant='bodyMedium'>{user.email}</Text>
          <Button
            mode={'contained'}
            style={styles.logout}
            onPress={() => {
              navigation.navigate('Login');
              logoutUser();
            }}
          >
            Logout
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
  profileContainer: {
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 10,
  },
  logout: {
    marginTop: 20,
  },
});
