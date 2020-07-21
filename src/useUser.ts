import * as React from 'react';

/**
 *  Example of hook with encapsulated logic.
 *  In reality this file would probably live under a separate "user" package.
 *  It would have it's own unit tests.
 */

interface UserInput {
  id: string;
}

interface UserOutput {
  user: User | null;
}

export interface User {
  id: string;
  name: string;
}

// fake user for example
export const MOCK_USER: User = {
  id: '0',
  name: 'mock_user',
};

export const useUser = ({ id }: UserInput): UserOutput => {
  const [user, setUser] = React.useState<User | null>(null);

  // Initialization effect
  React.useEffect(() => {
    // Simulates some async call that we could receive user from then save it in state
    setTimeout(() => {
      setUser(MOCK_USER);
    }, 0);
  }, [setUser]);

  return {
    user,
  };
};
