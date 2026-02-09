import { View, Text, TextInput, StyleSheet, useWindowDimensions, Pressable } from 'react-native'
import React from 'react'
import { Checkbox } from 'react-native-paper';

/**
 * 
 * +------------------+---------------------------+------+-----+-------------------+-------------------+
| Field            | Type                      | Null | Key | Default           | Extra             |
+------------------+---------------------------+------+-----+-------------------+-------------------+
| test_id          | int                       | NO   | PRI | NULL              | auto_increment    |
| classroom_id     | int                       | NO   | MUL | NULL              |                   |
| creator_id       | int                       | NO   | MUL | NULL              |                   |
| title            | varchar(100)              | YES  |     | NULL              |                   |
| correction_type  | enum('auto','manual')     | YES  |     | auto              |                   |
| created_at       | timestamp                 | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| is_timed         | tinyint(1)                | YES  |     | 0                 |                   |
| duration_minutes | int                       | YES  |     | NULL              |                   |
| status           | enum('draft','published') | YES  |     | draft             |                   |
| maximumAttempts  | int                       | YES  |     | 0                 |                   |
+------------------+---------------------------+------+-----+-------------------+-------------------+

 * 
 * 
 * 
 */


export default function Publish() {

     const [correctionOptions, setCorrectionOptions] = React.useState({
          auto: true,
          manual: false,
     });

     const [isTimed, setIsTimed] = React.useState(false);

     const { width } = useWindowDimensions();

     return (
          <View>
               <View style={width > 861 ? styles.pageHeader : null} >
                    <Text style={styles.header}>Publish Test</Text>
               </View>
               <View style={styles.pageContent}>
                    <View style={styles.contentWrapper}>
                         <Text style={styles.label} >Title : </Text>
                         <Text style={styles.value} >{'dummy'}</Text>
                    </View>
                    <View style={styles.contentWrapper}>
                         <Text style={styles.label} >Correction Type : </Text>
                         <Checkbox
                              status={correctionOptions.auto ? 'checked' : 'unchecked'}
                              onPress={() => setCorrectionOptions({ auto: true, manual: false })}
                         />
                         <Text style={styles.value} >Auto</Text>
                         <Checkbox
                              status={correctionOptions.manual ? 'checked' : 'unchecked'}
                              onPress={() => setCorrectionOptions({ auto: false, manual: true })}
                         />
                         <Text style={styles.value} >Manual</Text>
                    </View>
                    <View style={styles.contentWrapper}>
                         <Text style={styles.label} >Is Timed : </Text>
                         <Checkbox
                              status={isTimed ? 'checked' : 'unchecked'}
                              onPress={() => setIsTimed(!isTimed)}
                         />
                         {
                              isTimed && (
                                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TextInput
                                             placeholder='30'
                                             style={{ borderWidth: 1, borderColor: '#ccc', padding: 5, borderRadius: 5, width: 50, marginRight: 5 }}
                                             keyboardType='numeric'
                                        />
                                        <Text style={styles.value} >{' minutes'}</Text>
                                   </View>
                              )
                         }
                    </View>
                    <View style={styles.contentWrapper}>
                         <Text style={styles.label} >Maximum Attempts : </Text>
                         <TextInput
                              value='0'
                              style={{ borderWidth: 1, borderColor: '#ccc', padding: 5, borderRadius: 5, width: 50 }}
                              keyboardType='numeric'
                         />
                    </View>
                    <Text style={styles.value} >{' (0 for unlimited)'}</Text>
               </View>
               <View style={{ flexDirection: 'row' }} >
                    <Pressable style={styles.cancelBtn} >
                         <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Cancel</Text>
                    </Pressable>
                    <Pressable style={styles.publishBtn} >
                         <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Publish Test</Text>
                    </Pressable>
               </View>
          </View>
     )
}


const styles = StyleSheet.create({
     pageHeader: {
          paddingVertical: 20,
          borderBottomColor: '#ddd',
          borderBottomWidth: 1,
          marginBottom: 20,
     },
     header: {
          fontSize: 16,
          marginTop: 10,
          fontWeight: 600,
          textAlign: 'center',
     },
     pageContent: {
          paddingHorizontal: 20
     },
     label: {
          fontSize: 16,
          fontWeight: 600,
     },
     value: {
          fontSize: 16,
          fontWeight: 400,
     },
     contentWrapper: {
          marginBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
     },
     cancelBtn: {
          backgroundColor: 'red',
          padding: 10,
          borderRadius: 5,
          width: 100,
          alignItems: 'center',
          marginRight: 10,
     },
     publishBtn: {
          backgroundColor: 'green',
          padding: 10,
          borderRadius: 5,
          width: 120,
          alignItems: 'center',
     },
})