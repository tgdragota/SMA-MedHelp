import React, { useState } from "react";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Importă paginile tale
import ProgramareConsultatiePage from './ProgramareConsultatiePage';
import VizualizareProgramariPage from './VizualizareProgramariPage';
import VizualizareDocumentePage from './VizualizareDocumentePage';
import SolicitarePage from './SolicitarePage';
import Profil from './Profil';
import IncarcarePage from './IncarcarePage';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import CereriDocumente from "./CereriDocumente";

const Tab = createBottomTabNavigator();

const HomePacient = () => {
  const [role, setRole] = useState('');
  database()
    .ref('/users/' + auth().currentUser?.uid)
    .once('value', function (snapshot) {
      setRole(snapshot.val().role);
    });
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: 'red',
      }}>
      <Tab.Screen
        name="Programare Consultație"
        component={ProgramareConsultatiePage}
        options={{
          tabBarLabel: 'Programare',
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="calendar-check-o" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Vizualizare Programare"
        component={VizualizareProgramariPage}
        options={{
          tabBarLabel: 'Vizualizare',
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Istoric Medical"
        component={VizualizareDocumentePage}
        options={{
          tabBarLabel: 'Istoric',
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="file-text-o" size={size} color={color} />
          ),
        }}
      />
      {role === 'pacient' && (
        <Tab.Screen
          name="Solicitare Documente"
          component={SolicitarePage}
          options={{
            tabBarLabel: 'Solicitare',
            tabBarIcon: ({color, size}) => (
              <FontAwesome5 name="file-import" size={size} color={color} />
            ),
          }}
        />
      )}
      {role === 'doctor' && (
        <Tab.Screen
          name="Cereri Documente"
          component={CereriDocumente}
          options={{
            tabBarLabel: 'Cereri',
            tabBarIcon: ({color, size}) => (
              <FontAwesome5
                name="envelope-open-text"
                size={size}
                color={color}
              />
            ),
          }}
        />
      )}
      {role === 'doctor' && (
        <Tab.Screen
          name="Incărcare Documente"
          component={IncarcarePage}
          options={{
            tabBarLabel: 'Incărcare',
            tabBarIcon: ({color, size}) => (
              <FontAwesome5 name="file-upload" size={size} color={color} />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="Profil"
        component={Profil}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomePacient;
