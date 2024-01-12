import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

LocaleConfig.locales['ro'] = {
  monthNames: [
    'Ianuarie',
    'Februarie',
    'Martie',
    'Aprilie',
    'Mai',
    'Iunie',
    'Iulie',
    'August',
    'Septembrie',
    'Octombrie',
    'Noiembrie',
    'Decembrie',
  ],
  monthNamesShort: [
    'Ian',
    'Feb',
    'Mar',
    'Apr',
    'Mai',
    'Iun',
    'Iul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: [
    'Duminica',
    'Luni',
    'Marti',
    'Miercuri',
    'Joi',
    'Vineri',
    'Sambata',
  ],
  dayNamesShort: ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sam'],
  today: 'Azi',
};

LocaleConfig.defaultLocale = 'ro';

function VizualizareProgramariPage() {
  const [programari, setProgramari] = useState([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    database()
      .ref('/users/' + auth().currentUser?.uid)
      .once('value', function (snapshot) {
        setRole(snapshot.val().role);
      });

    database()
      .ref('/appointments/')
      .on('value', function (snapshots) {
        let appointments = [];
        let id = 1;
        snapshots.forEach(function (snapshot) {
          let programare = snapshot.val();
          if (programare.time < Date.now()) {
            return;
          }
          if (
            role === 'pacient' &&
            programare.pacient === auth().currentUser?.uid
          ) {
            appointments.push({
              id: id,
              time: programare.time,
              data: programare.date,
              ora: programare.hour,
              detalii: programare.message,
            });
            id++;
          } else if (
            role === 'doctor' &&
            programare.doctor === auth().currentUser?.uid
          ) {
            appointments.push({
              id: id,
              time: programare.time,
              pacient: programare.name,
              data: programare.date,
              ora: programare.hour,
              detalii: programare.message,
            });
            id++;
          }
        });
        setProgramari(appointments);
      });
  }, [role]);

  const getMarkedDates = programari => {
    const markedDates = {};

    programari.forEach(programare => {
      markedDates[new Date(programare.time).toISOString().split('T')[0]] = {
        marked: true,
      };
    });

    return markedDates;
  };

  const calendarTheme = {
    calendarBackground: 'white',
    textSectionTitleColor: 'black',
    dayTextColor: 'black',
    todayTextColor: 'white', // Culoarea pentru ziua curentă
    todayBackgroundColor: 'red',
    selectedDayBackgroundColor: 'black',
    selectedDayTextColor: '#ffffff',
    textDisabledColor: '#d9e1e8',
    dotColor: 'red',
    dotBackgroundColor: 'red',
    selectedDotColor: '#ffffff',
    arrowColor: 'red',
    monthTextColor: 'black',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 20,
    textDayHeaderFontSize: 16,
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        markedDates={getMarkedDates(programari)}
        theme={calendarTheme}
      />
      <FlatList
        data={programari}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.programareContainer}>
            {role === 'doctor' && <Text>Pacient: {item.pacient}</Text>}
            <Text>Data: {item.data}</Text>
            <Text>Ora: {item.ora}</Text>
            {item.detalii !== '' && <Text>Detalii: {item.detalii}</Text>}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  calendar: {
    width: '100%',
  },
  programareContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 15,
    backgroundColor: 'white',
  },
});

export default VizualizareProgramariPage;
