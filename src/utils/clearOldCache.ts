export const clearOldSupabaseCache = () => {
  const OLD_SUPABASE_URLS = [
    'asqsltuwmqdvayjmwsjs',
    'https://asqsltuwmqdvayjmwsjs.supabase.co'
  ];

  let clearedCount = 0;

  try {
    const localStorageKeys = Object.keys(localStorage);

    localStorageKeys.forEach(key => {
      OLD_SUPABASE_URLS.forEach(oldUrl => {
        if (key.includes(oldUrl)) {
          console.log('Clearing old cache key:', key);
          localStorage.removeItem(key);
          clearedCount++;
        }
      });
    });

    const sessionStorageKeys = Object.keys(sessionStorage);

    sessionStorageKeys.forEach(key => {
      OLD_SUPABASE_URLS.forEach(oldUrl => {
        if (key.includes(oldUrl)) {
          console.log('Clearing old session key:', key);
          sessionStorage.removeItem(key);
          clearedCount++;
        }
      });
    });

    if (clearedCount > 0) {
      console.log(`Cleared ${clearedCount} old cache entries`);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error clearing old cache:', error);
    return false;
  }
};
