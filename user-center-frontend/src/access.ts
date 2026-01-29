export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  // Define project permissions here based on initial state, managed centrally
  // Reference: https://umijs.org/docs/max/access
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.userRole === 1,
  };
};
