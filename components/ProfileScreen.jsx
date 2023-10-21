import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import {
	Text,
	Button,
	Avatar,
	ActivityIndicator,
	MD3Colors,
} from 'react-native-paper';
import { getUserProfileData, logoutUser } from '../utils/users';

const ProfileScreen = ({ navigation }) => {
	const [user, setUser] = useState({});
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
					size={'Large'}
					animating={true}
					color={MD3Colors.primary40}
				/>
			) : (
				<View style={{ alignItems: 'center' }}>
					<Avatar.Image
						size={100}
						style={{ marginBottom: 10 }}
						source={{ uri: user.avatar }}
					></Avatar.Image>
					<Text variant='titleLarge'>{user.name}</Text>
					<Text variant='bodyMedium'>{user.email}</Text>
					<Button
						mode={'contained'}
						style={{ marginTop: 20 }}
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 8,
	},
});

export default ProfileScreen;
