import { Image } from 'react-native';
import { useUser } from '../../context/userContext';

export const ProfileIcon = () => {
    
  const { user } = useUser();

  if (!user?.user_metadata?.picture) return null;

  return (
    <Image
      source={{ uri: user?.user_metadata?.picture }} 
      style={{ width: 32, height: 32, borderRadius: 16, marginLeft: 10 }}
    />
  );
};