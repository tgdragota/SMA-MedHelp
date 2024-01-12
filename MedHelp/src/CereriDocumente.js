import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const CereriDocumente = () => {
  const [cereri, setCereri] = useState([]);

  database()
    .ref('/requests/')
    .once('value', function (snapshots) {
      let requests = [];
      snapshots.forEach(function (snapshot) {
        let request = snapshot.val();
        if (request.doctor === auth().currentUser.uid) {
          requests.push({
            id: snapshot.key,
            pacient: request.pacient,
            tip: request.request,
            detalii: request.reason,
          });
        }
      });
      setCereri(requests);
    });

  const renderDocument = ({item}) => (
    <View style={styles.documentItemContainer}>
      <View style={styles.documentItemText}>
        <Text style={styles.documentItemLabel}>Pacient:</Text>
        <Text>{item.pacient}</Text>
      </View>
      <View style={styles.documentItemText}>
        <Text style={styles.documentItemLabel}>Tip:</Text>
        <Text>{item.tip}</Text>
      </View>
      <View style={styles.documentItemText}>
        <Text style={styles.documentItemLabel}>Mesaj:</Text>
        <Text>{item.detalii}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteDocument(item)}>
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  const handleDeleteDocument = document => {
    database()
      .ref('/requests/' + document.id)
      .remove();
    console.log('Șterge documentul:', document.tip);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cereri}
        renderItem={renderDocument}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  documentItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  documentItemText: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 20,
  },
  documentItemLabel: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CereriDocumente;
