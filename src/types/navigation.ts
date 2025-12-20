import {StackNavigationProp} from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  LoginPolicial: undefined;
  Dashboard: undefined;
};

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

export type LoginPolicialScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoginPolicial'
>;

export type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

