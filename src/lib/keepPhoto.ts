import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

/**
 * TP3 bonus.
 * The gallery and the camera return a *temporary* file (in the app's cache),
 * which the system may delete one day. This copies the photo into the app's
 * own documents folder (`<documents>/photos/`) and returns the new, permanent
 * address, which is the one we save in the item.
 */
export async function keepPhoto(tempUri: string): Promise<string> {
  // No file system in the browser: the picker gives a data/blob address, keep it as is.
  if (Platform.OS === 'web') {
    return tempUri;
  }

  try {
    const folder = new Directory(Paths.document, 'photos');
    folder.create({ idempotent: true, intermediates: true });

    const source = new File(tempUri);
    const extension = source.extension || '.jpg'; // e.g. ".jpeg"
    const destination = new File(folder, `${Date.now()}${extension}`);

    await source.copy(destination);
    return destination.uri;
  } catch (error) {
    // If the copy fails, still save the item with the temporary address.
    console.warn('Could not copy the photo, keeping the temporary file:', error);
    return tempUri;
  }
}
