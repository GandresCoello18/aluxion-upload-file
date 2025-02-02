export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    if (e instanceof Error) {
      console.error('Error during file download', e.message);
    }
    return false;
  }
};
