import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      common: {
        error: 'Error',
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        backToHome: 'Back to Home',
        toggleTheme: 'Toggle theme',
        processing: 'Processing...',
      },
      nav: {
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        profile: 'Profile',
        addTool: 'Add Tool',
        findTools: 'Find Tools',
      },
      auth: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        fullName: 'Full Name',
        invitationToken: 'Invitation Token',
        community: 'Community',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
        loginSuccess: 'Successfully logged in',
        loginError: 'Login failed',
        registerSuccess: 'Successfully registered',
        registerError: 'Registration failed',
        invalidCredentials: 'Invalid email or password',
        tryAgain: 'Please try again',
        required: 'Authentication required',
      },
      validation: {
        required: '{{field}} is required',
        email: 'Invalid email address',
        minLength: '{{field}} must be at least {{min}} characters',
        passwordMatch: 'Passwords must match',
      },
      tools: {
        addTool: 'Add Tool',
        findTools: 'Find Tools',
        myTools: 'My Tools',
        toolName: 'Tool Name',
        description: 'Description',
        price: 'Price per day',
        location: 'Location',
        category: 'Category',
        images: 'Images',
        status: {
          available: 'Available',
          unavailable: 'Unavailable',
          booked: 'Booked',
        },
        availableFrom: 'Available from',
        to: 'to',
        notAvailable: 'This tool is currently not available',
        findOther: 'Find other tools',
        loginToBook: 'Please login to book this tool',
      },
      bookings: {
        book: 'Book Now',
        selectDates: 'Select Dates',
        dates: 'Dates',
        success: 'Booking successful',
        error: 'Booking failed',
        tryAgain: 'Please try again later',
        status: {
          pending: 'Pending',
          confirmed: 'Confirmed',
          cancelled: 'Cancelled',
          completed: 'Completed',
        },
      },
      user: {
        memberSince: 'Member since',
        stats: 'Statistics',
        tools: 'Tools',
        bookings: 'Bookings',
        noTools: 'No tools added yet',
        noBookings: 'No bookings yet',
        toolsCount: '{{count}} tool(s)',
        bookingsCount: '{{count}} booking(s)',
      },
      error: {
        pageNotFound: 'Page Not Found',
        pageNotFoundDesc: "The page you're looking for doesn't exist.",
      },
      home: {
        title: 'Share and Borrow Tools in Your Community',
        subtitle: 'Join the sharing economy and help build a sustainable future',
        shareTools: {
          title: 'Share Your Tools',
          description: 'Make money by sharing your tools with others in your community',
        },
        findWhat: {
          title: 'Find What You Need',
          description: 'Save money by borrowing tools instead of buying them',
        },
        buildCommunity: {
          title: 'Build Community',
          description: 'Connect with neighbors and build a stronger community',
        },
      },
    },
  },
  ca: {
    translation: {
      // Catalan translations would go here
    },
  },
  es: {
    translation: {
      // Spanish translations would go here
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
