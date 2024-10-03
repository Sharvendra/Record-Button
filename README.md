# React Native Audio Recorder App

A simple React Native application that allows users to record and play audio files on both Android and iOS. This project can be used to record audio, list recordings, and play them back, making it ideal for creating audio-related apps.

## Features

- Record audio using the device's microphone
- Display a list of recorded audio files
- Play back recorded audio files
- Works on both Android and iOS

## Installation

To use this component in your React Native project, you can install it directly from npm.

### Using npm:

npm install npm i react-native-record-button

Permissions
This package requires microphone permissions to work properly on both Android and iOS:

Android:
Add the following permission to your AndroidManifest.xml file:

xml
Copy code
<uses-permission android:name="android.permission.RECORD_AUDIO" />
iOS:
Make sure to add the NSMicrophoneUsageDescription key to your Info.plist file:

xml
Copy code
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to your microphone to record audio.</string>
Usage
Once the package is installed, you can use it in your project like this:

javascript
Copy code
import React from 'react';
import { View } from 'react-native';
import AudioRecorderApp from 'react-native-audio-recorder-app';

const MyApp = () => {
  return (
    <View style={{ flex: 1 }}>
      <AudioRecorderApp />
    </View>
  );
};

export default MyApp;
