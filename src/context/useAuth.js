import { useContext } from 'react';
import { userContext } from './UserContext';

export const useAuth = () => useContext(userContext);
