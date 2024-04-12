import AsyncStorage from '@react-native-async-storage/async-storage';

storage = []

storage.storeItem = async(key, item) => {
    try {
        item = item.toString()
        await AsyncStorage.setItem(key, item);
    } catch (e) {
        console.log("Error:", e)
    }
}

storage.getItemAsInt = async(key, callback) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            callback(parseInt(value))
        }
    } catch (e) {
        console.log("Error:", e)
    }
}

export default storage;