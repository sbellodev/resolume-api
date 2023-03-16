import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';

export default function App() {
  const [ipAddress, setIpAddress] = useState('192.168.0.18:8081');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [compositionClips, setCompositionClips] = useState(null);
  const [customEndpoint, setCustomEndpoint] = useState('');


  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`http://${ipAddress}/api/v1/${endpoint}`);
      const text = await response.text();
      try {
        const jsonData = JSON.parse(text);
        setData(jsonData);
        setError(null);
      } catch (error) {
        setError('Failed to parse JSON');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchCompositionClips = async () => {
    try {
      const response = await fetch(`http://${ipAddress}/api/v1/composition/clips`);
      const text = await response.text();
      console.log(text); // log the response text to see if it contains valid JSON
      const jsonData = JSON.parse(text);
      setCompositionClips(jsonData);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Resolume Fetch Data from API</Text>
        <Text style={styles.label}>Enter IP address:</Text>
        <TextInput
          style={styles.input}
          value={ipAddress}
          onChangeText={setIpAddress}
          placeholder="e.g. 192.168.0.18:8081"
        />
        <TextInput
            style={styles.input}
            value={customEndpoint}
            onChangeText={setCustomEndpoint}
            placeholder="Enter custom endpoint"
          />
        <View style={styles.buttonContainer}>
          <Button title="/sources" onPress={() => fetchData('sources')} />
          <Button title="/product" onPress={() => fetchData('product')} />
          <Button title="/composition" onPress={() => fetchData('composition')} />
          <Button title="/composition clips" onPress={() => fetchData('composition/clips')} />
          <Button title="show composition clips" onPress={fetchCompositionClips} />
          <Button title="Fetch Custom Endpoint" onPress={fetchCustomEndpoint} />
        </View>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : data ? (
          <ScrollView style={styles.dataContainer}>
            <Text style={styles.label}>Data:</Text>
            <Text style={styles.data}>{JSON.stringify(data)}</Text>
          </ScrollView>
        ) : compositionClips ? (
          <ScrollView style={styles.dataContainer}>
            <Text style={styles.label}>Composition Clips:</Text>
            {compositionClips.map((clip) => (
              <View key={clip.clip_uuid} style={styles.clipContainer}>
                <Image
                  source={{
                    uri: `http://${ipAddress}/api/v1/composition/clips/${clip.clip_uuid}/thumbnail`,
                  }}
                  style={styles.thumbnail}
                />
                <Text style={styles.clipName}>{clip.clip_name}</Text>
              </View>
            ))}
          </ScrollView>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    justifyItems: 'center',
    marginTop: 60,
    marginHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  dataContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  data: {
    fontSize: 16,
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
    rowGap: 6
  },
  error: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
  },
});
