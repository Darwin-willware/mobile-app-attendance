import React from 'react';
import { Gradients } from '../../constants/constants';
import { signOutFromGoogle } from '../../services/authService';
import GradButton from '../shared/GradButton';

export default function SignOut() {
  return (
    <GradButton text="Sign Out" gradientColors={Gradients.signOut} onPress={signOutFromGoogle} />
  );
}