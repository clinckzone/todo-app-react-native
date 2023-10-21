import { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
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
		<SafeAreaView
			style={{
				flex: 1,
				justifyContent: 'center',
				padding: 8,
			}}
		>
			{user.email === undefined ? (
				<ActivityIndicator
					size='large'
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

export default ProfileScreen;
