import { usePermissions } from "expo-media-library"
import { useState } from "react"
import * as ImagePicker from 'expo-image-picker'

export function useImagePicker() {
    const [image, setImage] = useState<string | undefined>(undefined)
    const [status, requestPermission] = usePermissions()

    async function openImagePicker(){
        if (status === null) {
            const permission = await requestPermission();
            if (permission.granted === false) {
                alert("Please grant permission to access you images");
                return
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [4, 4],
        })

        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }

    function reset () {
        setImage(undefined)
    }

    return {image, openImagePicker, reset}
}
