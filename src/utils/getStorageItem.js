import { AsyncStorage } from 'react-native'

export default async function getStorageItem(key) {
  const root = await AsyncStorage.getItem('persist:root')

  if (root) {
    const { Main } = JSON.parse(root)
    const { [key]: result } = JSON.parse(Main)

    return result
  }

  return null
}