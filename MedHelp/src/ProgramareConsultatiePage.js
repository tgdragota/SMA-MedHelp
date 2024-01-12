import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {TimerPickerModal} from 'react-native-timer-picker';

LocaleConfig.locales.ro = {
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

const ProgramareConsultatiePage = () => {
  let UTCtoday = moment().toDate();
  let today = new Date(
    UTCtoday.getTime() - UTCtoday.getTimezoneOffset() * 60 * 1000,
  );
  let now = new Date(today.setHours(8, 0, 0));
  const [selectedDate, setSelectedDate] = useState(today);
  const [optionalMessage, setOptionalMessage] = useState('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(now);
  const [doctor, setDoctor] = useState('');
  const [name, setName] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  database()
    .ref('/users/' + auth().currentUser?.uid)
    .once('value', function (snapshot) {
      setDoctor(snapshot.val().doctor);
      setName(snapshot.val().firstName + ' ' + snapshot.val().lastName);
    });

  const handleDateSelection = date => {
    setSelectedDate(new Date(date));
  };

  const handleTimeSelection = time => {
    setTimePickerVisible(false);

    if (time !== undefined) {
      const selectedTime = new Date(time);
      setSelectedTime(selectedTime);
    }
  };

  const handleAppointmentSubmission = () => {
    const newReference = database().ref('/appointments').push();
    newReference.set({
      pacient: auth().currentUser.uid,
      name: name,
      doctor: doctor,
      time: selectedDate.getTime(),
      date: selectedDate
        .toLocaleDateString('en-GB', {dateStyle: 'short'})
        .replaceAll('/', '.'),
      hour: selectedTime.toTimeString().split(' ')[0].substring(0, 5),
      message: optionalMessage,
    });
    alert('Programare efectuata cu succes!');
  };

  const hourLimit = {
    max: 17,
    min: 8,
  };

  const minuteLimit = {
    max: 1,
    min: 0,
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <Calendar
          style={styles.calendar}
          minDate={today.toDateString()}
          disableAllTouchEventsForDisabledDays={true}
          onDayPress={day => handleDateSelection(day.dateString)}
          markedDates={{
            [selectedDate.toISOString().split('T')[0]]: {selected: true},
          }}
          theme={{
            calendarBackground: 'white',
            textSectionTitleColor: 'black',
            dayTextColor: 'black',
            todayTextColor: 'red',
            selectedDayBackgroundColor: 'red',
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
          }}
        />
        <View
          onPress={() => {
            /* Deschideți un alt ecran sau modul pentru a permite selectarea datei */
          }}
          style={styles.datePickerButton}>
          <Text>Selectează data: {selectedDate.toDateString()}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowPicker(true)}>
          <View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowPicker(true)}>
              <View style={styles.datePickerButton}>
                <Text>Selectează ora: {selectedTime.toLocaleTimeString()}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <TimerPickerModal
          visible={showPicker}
          setIsVisible={setShowPicker}
          onConfirm={pickedDuration => {
            setSelectedTime(
              new Date(
                selectedDate.setHours(
                  pickedDuration.hours,
                  pickedDuration.minutes,
                ),
              ),
            );
            setShowPicker(false);
          }}
          onCancel={() => setShowPicker(false)}
          closeOnOverlayPress
          hideSeconds={true}
          use24HourPicker
          disableInfiniteScroll
          hourLimit={hourLimit}
          //minuteLimit={minuteLimit}
          confirmButtonText={'OK'}
          initialHours={hourLimit.min}
          styles={{
            theme: 'light',
            confirmButton: {
              borderWidth: 0,
              color: '#FF0000',
            },
            cancelButton: {
              borderWidth: 0,
            },
            contentContainer: {
              borderRadius: 0,
            },
            disabledPickerItem: {
              color: 'transparent',
            },
          }}
        />
        <TextInput
          style={styles.optionalMessageInput}
          placeholder="Mesaj (optional)"
          value={optionalMessage}
          onChangeText={text => setOptionalMessage(text)}
        />
        <TouchableOpacity
          onPress={handleAppointmentSubmission}
          style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Trimite programarea</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  scrollContainer: {
    width: '100%',
  },
  containerWithKeyboard: {
    justifyContent: 'flex-start',
  },
  datePickerButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 20,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendar: {
    width: '100%',
  },
  optionalMessageInput: {
    height: 100,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'white',
  },
  submitButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 5,
    alignSelf: 'center',
    position: 'relative',
    marginTop: 50,
    marginBottom: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProgramareConsultatiePage;
