import React, { useState } from 'react';
import { View, Button, Text, FlatList, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const audioRecorderPlayer = new AudioRecorderPlayer();

  // Request microphone permission for iOS and Android
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs access to your microphone to record audio.',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      const result = await request(PERMISSIONS.IOS.MICROPHONE);
      return result === RESULTS.GRANTED;
    }
  };

  const startRecording = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const path = Platform.select({
      ios: 'audio.m4a',
      android: `${Date.now()}.mp3`,
    });

    try {
      await audioRecorderPlayer.startRecorder(path);
      audioRecorderPlayer.addRecordBackListener((e) => {
        console.log('Recording in progress', e.current_position);
      });
      setIsRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecordings((prevRecordings) => [...prevRecordings, result]);
      setIsRecording(false);
    } catch (error) {
      console.error(error);
    }
  };

  const playRecording = async (path) => {
    try {
      await audioRecorderPlayer.startPlayer(path);
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.current_position === e.duration) {
          audioRecorderPlayer.stopPlayer();
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
      />
      {recordings.length > 0 && (
        <FlatList
          data={recordings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => playRecording(item)}>
              <Text style={styles.recordingItem}>
                Recording {index + 1}: {item.split('/').pop()}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  recordingItem: {
    padding: 10,
    color: 'blue',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
  },
});

export default App;
