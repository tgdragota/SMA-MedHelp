import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Button,
  TextInput,
} from 'react-native';
import PDFView from 'react-native-view-pdf';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const VizualizareDocumentePage = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cnpFilter, setCnpFilter] = useState('');
  const [role, setRole] = useState('');
  const [cnp, setCnp] = useState('');
  const [documents, setDocuments] = useState([]);

  database()
    .ref('/users/' + auth().currentUser?.uid)
    .once('value', function (snapshot) {
      setRole(snapshot.val().role);
    });

  useEffect(() => {
    if (role === 'pacient') {
      database()
        .ref('/users/' + auth().currentUser?.uid)
        .once('value', function (snapshot) {
          setCnp(snapshot.val().cnp);
        });
      database()
        .ref('/documents/' + cnp)
        .on('value', function (snapshots) {
          let documente = [];
          let id = 1;
          snapshots.forEach(function (snapshot) {
            let document = snapshot.val();
            documente.push({
              id: id,
              name: document.name,
              url: document.url,
            });
            id++;
          });
          setDocuments(documente);
        });
    }
  });

  const GetDocuments = () => {
    database()
      .ref('/documents/' + cnpFilter)
      .on('value', function (snapshots) {
        let documente = [];
        let id = 1;
        snapshots.forEach(function (snapshot) {
          let document = snapshot.val();
          documente.push({
            id: id,
            name: document.name,
            url: document.url,
          });
          id++;
        });
        setDocuments(documente);
      });
  };

  const renderDocument = ({item}) => (
    <TouchableOpacity onPress={() => handleDocumentPress(item)}>
      <Text style={styles.documentItem}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleDocumentPress = item => {
    setSelectedDocument(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedDocument(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {role === 'doctor' ? (
        <View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.cnpInput}
              placeholder="CNP"
              keyboardType="numeric"
              value={cnpFilter}
              onChangeText={text => setCnpFilter(text)}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={GetDocuments}>
              <Text style={styles.submitButtonText}>Caută</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={documents}
            renderItem={renderDocument}
            keyExtractor={item => item.id}
          />
        </View>
      ) : (
        <View>
          <View style={styles.centeredContainer}>
            <Image
              source={require('./img/istoric.png')}
              style={styles.cerere}
            />
          </View>
          <FlatList
            data={documents}
            renderItem={renderDocument}
            keyExtractor={item => item.id}
          />
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.closeButtonContainer}>
            <Button title="X" onPress={closeModal} color="red" />
          </View>
          <View style={styles.pdfContainer}>
            {selectedDocument &&
            selectedDocument.url &&
            typeof selectedDocument.url === 'string' ? (
              selectedDocument.url.endsWith('.pdf') ? (
                <PDFView
                  fadeInDuration={250.0}
                  style={{flex: 1}}
                  resource={selectedDocument.url}
                  resourceType="url"
                  onError={error => console.error('Eroare PDF:', error)}
                />
              ) : (
                <Image
                  source={{uri: selectedDocument.url}}
                  style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                />
              )
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cerere: {
    width: 150,
    height: 150,
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  centeredContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cnpInput: {
    height: 40,
    width: '70%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'white',
  },
  documentItem: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  pdfContainer: {
    flex: 1,
  },
  closeButtonContainer: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default VizualizareDocumentePage;
