import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { renewAccessToken } from './utils/tokens';
import LoginScreen from './components/LoginScreen';
import ProfileScreen from './components/ProfileScreen';
import TodoListScreen from './components/TodoListScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { IconButton, ActivityIndicator, MD3Colors } from 'react-native-paper';

const Stack = createStackNavigator();

export default function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(null);

	useEffect(() => {
		const checkAndRenewAccessToken = async () => {
			const accessTokenRenewed = await renewAccessToken();
			if (accessTokenRenewed) {
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
			}
		};

		checkAndRenewAccessToken();
	}, []);

	return (
		<NavigationContainer>
			{isAuthenticated === null ? (
				<SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
					<ActivityIndicator
						size={'Large'}
						animating={true}
						color={MD3Colors.primary40}
					/>
				</SafeAreaView>
			) : (
				<Stack.Navigator initialRouteName={isAuthenticated ? 'Todos' : 'Login'}>
					<Stack.Screen
						name='Login'
						component={LoginScreen}
						options={({ navigation }) => ({
							headerLeft: () => null,
							headerRight: () => null,
						})}
					/>
					<Stack.Screen
						name='Todos'
						component={TodoListScreen}
						options={({ navigation }) => ({
							headerLeft: () => null,
							headerRight: () => (
								<IconButton
									icon='face-man'
									size={24}
									containerColor={MD3Colors.primary40}
									iconColor='white'
									onPress={() => navigation.navigate('Profile')}
								/>
							),
						})}
					/>
					<Stack.Screen name='Profile' component={ProfileScreen} />
				</Stack.Navigator>
			)}
		</NavigationContainer>
	);
}
