import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  currentUser: UserProfile | null;
  activeRole: UserRole | null;
  isAuthenticated: boolean;
  login: (nipOrUsername: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLogoutModalOpen: boolean;
  openLogoutModal: () => void;
  closeLogoutModal: () => void;
  setActiveRole: (role: UserRole) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  quickSwitchUser: (userId: string) => void;
  loggedOutNotice: string | null;
  clearLoggedOutNotice: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_ID_KEY = 'schoolhub_current_user_id';
const ACTIVE_ROLE_KEY = 'schoolhub_active_role';
const EXPLICIT_LOGOUT_KEY = 'schoolhub_explicit_logout';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRoleState] = useState<UserRole | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loggedOutNotice, setLoggedOutNotice] = useState<string | null>(null);

  useEffect(() => {
    // Restore session
    const isExplicitlyLoggedOut = localStorage.getItem(EXPLICIT_LOGOUT_KEY) === 'true';
    const savedUserId = localStorage.getItem(CURRENT_USER_ID_KEY);
    const savedRole = localStorage.getItem(ACTIVE_ROLE_KEY) as UserRole | null;

    if (savedUserId && !isExplicitlyLoggedOut) {
      const user = storageService.getUserById(savedUserId);
      if (user && user.isActive) {
        setCurrentUser(user);
        if (savedRole && user.roles.includes(savedRole)) {
          setActiveRoleState(savedRole);
        } else {
          setActiveRoleState(user.roles[0] || null);
        }
      }
    } else if (!isExplicitlyLoggedOut) {
      // Default to Wali Kelas VII-A for initial demonstration and preview
      const defaultUser = storageService.getUserById('user-wali-7a');
      if (defaultUser) {
        setCurrentUser(defaultUser);
        setActiveRoleState('wali_kelas');
        localStorage.setItem(CURRENT_USER_ID_KEY, defaultUser.id);
        localStorage.setItem(ACTIVE_ROLE_KEY, 'wali_kelas');
      }
    }

    const unsubscribe = storageService.subscribe(() => {
      const currentId = localStorage.getItem(CURRENT_USER_ID_KEY);
      const isLoggedOut = localStorage.getItem(EXPLICIT_LOGOUT_KEY) === 'true';
      if (currentId && !isLoggedOut) {
        const u = storageService.getUserById(currentId);
        if (u) setCurrentUser(u);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (
    nipOrUsername: string,
    _password?: string
  ): Promise<{ success: boolean; message?: string }> => {
    const trimmed = nipOrUsername.trim().toLowerCase();
    if (!trimmed) {
      return { success: false, message: 'Harap masukkan Username atau NIP Anda.' };
    }

    const allUsers = storageService.getUsers();
    const user = allUsers.find(
      (u) =>
        u.nipOrId.toLowerCase() === trimmed ||
        u.username.toLowerCase() === trimmed ||
        u.email.toLowerCase() === trimmed
    );

    if (!user) {
      return {
        success: false,
        message: 'Kredensial tidak ditemukan. Pastikan NIP atau Username benar, atau pilih akun dari daftar simulasi.',
      };
    }

    if (!user.isActive) {
      return { success: false, message: 'Akun Anda dinonaktifkan oleh administrator sekolah.' };
    }

    // Clear explicit logout
    localStorage.removeItem(EXPLICIT_LOGOUT_KEY);
    setLoggedOutNotice(null);

    setCurrentUser(user);
    const initialRole = user.roles[0];
    setActiveRoleState(initialRole);
    localStorage.setItem(CURRENT_USER_ID_KEY, user.id);
    localStorage.setItem(ACTIVE_ROLE_KEY, initialRole);
    storageService.addAuditLog(user.fullName, 'LOGIN', 'Autentikasi', `Login berhasil sebagai ${user.position}`);

    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      storageService.addAuditLog(currentUser.fullName, 'LOGOUT', 'Autentikasi', 'Logout dari sistem');
    }
    setCurrentUser(null);
    setActiveRoleState(null);
    setIsLogoutModalOpen(false);
    localStorage.setItem(EXPLICIT_LOGOUT_KEY, 'true');
    localStorage.removeItem(CURRENT_USER_ID_KEY);
    localStorage.removeItem(ACTIVE_ROLE_KEY);
    setLoggedOutNotice('Anda telah berhasil keluar dari akun MTsN 1 Kartanegara. Silakan login kembali.');
  };

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const clearLoggedOutNotice = () => {
    setLoggedOutNotice(null);
  };

  const setActiveRole = (role: UserRole) => {
    if (currentUser && currentUser.roles.includes(role)) {
      setActiveRoleState(role);
      localStorage.setItem(ACTIVE_ROLE_KEY, role);
    }
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const newProfile = { ...currentUser, ...updated };
    storageService.saveUser(newProfile, currentUser.fullName);
    setCurrentUser(newProfile);
  };

  const quickSwitchUser = (userId: string) => {
    const user = storageService.getUserById(userId);
    if (user && user.isActive) {
      localStorage.removeItem(EXPLICIT_LOGOUT_KEY);
      setLoggedOutNotice(null);
      setCurrentUser(user);
      const role = user.roles[0];
      setActiveRoleState(role);
      localStorage.setItem(CURRENT_USER_ID_KEY, user.id);
      localStorage.setItem(ACTIVE_ROLE_KEY, role);
      storageService.addAuditLog(user.fullName, 'SWITCH_USER', 'Autentikasi', `Beralih ke akun ${user.fullName}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        isAuthenticated: !!currentUser,
        login,
        logout,
        isLogoutModalOpen,
        openLogoutModal,
        closeLogoutModal,
        setActiveRole,
        updateProfile,
        quickSwitchUser,
        loggedOutNotice,
        clearLoggedOutNotice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
