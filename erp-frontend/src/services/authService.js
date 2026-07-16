import API from './api';

const authService = {
  // Login user
  login: async (username, password) => {
    try {
      const response = await API.post('/api/auth/login', { username, password });
      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user, token };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await API.post('/api/auth/register', userData);
      return { success: true, user: response.data };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get user role
  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user?.role || null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Check if user has specific role
  hasRole: (role) => {
    const userRole = authService.getUserRole();
    return userRole === role;
  },

  // Check if user has any of the specified roles
  hasAnyRole: (roles) => {
    const userRole = authService.getUserRole();
    return roles.includes(userRole);
  }
};

export default authService;