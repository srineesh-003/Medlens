const USERS_KEY = 'medlens_users';
const SESSION_KEY = 'medlens_user_session';

/**
 * Get current logged in user session
 * @returns {Object|null} User profile object or null
 */
export function getCurrentUser() {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;
    return JSON.parse(sessionData);
  } catch (err) {
    console.error('Failed to parse user session from localStorage:', err);
    return null;
  }
}

/**
 * Get all registered user profiles
 * @returns {Array} List of registered user profiles
 */
export function getRegisteredUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

/**
 * Register / Create a new user profile
 * @param {Object} param0 { userName, identifier, password }
 * @returns {Object} Created user profile
 */
export function createProfile({ userName, identifier, password }) {
  if (!userName || !userName.trim()) {
    throw new Error('Please enter your User Name.');
  }
  if (!identifier || !identifier.trim()) {
    throw new Error('Please enter your Gmail address or Mobile Number.');
  }
  if (!password || !password.trim()) {
    throw new Error('Please enter a Password.');
  }

  const users = getRegisteredUsers();
  const cleanId = identifier.trim().toLowerCase();
  const cleanName = userName.trim();

  // Check if identifier already registered
  const existingUser = users.find((u) => u.identifier.toLowerCase() === cleanId);
  if (existingUser) {
    // Update profile
    existingUser.userName = cleanName;
    existingUser.password = password;
  } else {
    users.push({
      userName: cleanName,
      identifier: cleanId,
      password: password,
      createdAt: new Date().toISOString(),
    });
  }

  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save user profile:', err);
  }

  const session = {
    userName: cleanName,
    identifier: cleanId,
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to set user session:', err);
  }

  return session;
}

/**
 * Login existing user
 * @param {string} identifier Gmail or Mobile Number
 * @param {string} password Password
 * @returns {Object} User session object
 */
export function loginUser(identifier, password) {
  if (!identifier || !identifier.trim()) {
    throw new Error('Please enter your Gmail address or Mobile Number.');
  }
  if (!password || !password.trim()) {
    throw new Error('Please enter your Password.');
  }

  const users = getRegisteredUsers();
  const cleanId = identifier.trim().toLowerCase();

  const user = users.find((u) => u.identifier.toLowerCase() === cleanId);

  if (!user) {
    // For demo convenience: if no profiles exist yet, auto-create profile with provided credentials
    return createProfile({
      userName: identifier.split('@')[0] || 'User',
      identifier,
      password,
    });
  }

  if (user.password !== password) {
    throw new Error('Incorrect password. Please try again or create a new profile.');
  }

  const session = {
    userName: user.userName,
    identifier: user.identifier,
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to set user session:', err);
  }

  return session;
}

/**
 * Logout user session without deleting saved patient records
 */
export function logoutUser() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error('Failed to clear user session:', err);
  }
}

