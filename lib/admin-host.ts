// No imports here: proxy.ts loads Clerk lazily and must not pull it in through this file.
export const isAdminHost = (hostname: string) => {
  return (
    hostname === 'admin.elgatonegro.coffee' ||
    hostname === 'admin.localhost' ||
    hostname.startsWith('admin.localhost:')
  );
};
