type User = {
  name: string;
  audioCount: number;
};

type MessageResult = {
  check_speaker_message: string;
  transcribe_audio_message?: string;
};