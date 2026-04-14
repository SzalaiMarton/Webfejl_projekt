import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  projects: [],
  issues: [],
  user: null,
};

const StoreContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [action.payload, ...state.projects] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'REMOVE_PROJECT':
      return { ...state, projects: state.projects.filter(p => p.id !== action.payload) };
    case 'SET_ISSUES':
      return { ...state, issues: action.payload };
    case 'ADD_ISSUE':
      return { ...state, issues: [action.payload, ...state.issues] };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export default StoreContext;
