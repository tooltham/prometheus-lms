import { configureStore } from '@reduxjs/toolkit';

// Placeholder reducer
const rootReducer = (state = { user: null, courses: [] }, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const store = configureStore({
  reducer: {
    app: rootReducer,
  },
});

export default store;
