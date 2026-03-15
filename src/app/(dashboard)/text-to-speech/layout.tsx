import { TextToSpeechLayout } from "@/features/text-to-speech/views/text-to-speech-layout"


export default function Layout({
    childern
}:{
    childern: React.ReactNode
}){
    return<TextToSpeechLayout>
        {childern}
    </TextToSpeechLayout>
}