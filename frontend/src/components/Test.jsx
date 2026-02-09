import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, MaterialCommunityIcons, Feather, Entypo } from '@expo/vector-icons';
import Colors from '../../styles/Colors';
import { IconButton, Menu } from 'react-native-paper';
import { router, useGlobalSearchParams } from 'expo-router';
import ConfirmModal from './modals/ConfirmModal';
import api from '../../util/api';
import InputModal from './modals/InputModal';

export default function Test({ data, allTests, setAllTests }) {

  const [isMenuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const { width } = useWindowDimensions();
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [ isInputModalVisible, setInputModalVisible] = useState(false);
  const [ newTestName, setNewTestName] = useState(""); 

  const { classroomId } = useGlobalSearchParams();


  function handleEdit() {
    console.log('edit')
    router.push({
      pathname: '/[classroomId]/(tabs)/test/[testId]/edit',
      params: {
        classroomId: data.classroomId,
        testId: data.testId,
        title: data.testTitle,
      },
    })
  }

  function handlePublish() {
    console.log('publish')
    router.push({
      pathname: '/[classroomId]/(tabs)/test/[testId]/publish',
      params: {
        classroomId: data.classroomId,
        testId: data.testId,
      },
    })
  }

   async function handleRename() {
    if(newTestName.trim().length == 0) return;
    const success = await renameTest(classroomId,data.testId,newTestName);
    if(success){
      setAllTests(allTests.map(test => {
        if( test.testId == data.testId){
            test.testTitle = newTestName;
        }
        return test;
      }));
    }
    setInputModalVisible(false);
  }

  async function handleDelete() {
    const success = await deleteTest(classroomId, data.testId);
    if (success) {
      setAllTests(allTests.filter(test => test.testId !== data.testId));
    }
    setConfirmModalVisible(false)
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>

        <View style={styles.row}>


          <Ionicons name='clipboard-outline' size={20} color={Colors.primaryColor} />
          <Text onPress={handleEdit} style={styles.title}>{data.testTitle}</Text>

          {data.status === "DRAFT" && (
            <View style={styles.draftBadge}>
              <Text style={styles.draftText}>Draft</Text>
            </View>
          )}
          <Menu

            key={isMenuVisible ? 'visible' : 'invisible'}
            visible={isMenuVisible}
            onDismiss={closeMenu}
            anchorPosition='bottom'
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={openMenu}
                iconColor='black'
              />
            }
            contentStyle={styles.menuContentStyle}
          >
            <Menu.Item title="Preview" onPress={() => { closeMenu(); }} titleStyle={styles.menuTitleStyle} />
            <Menu.Item title="Rename" onPress={() => { closeMenu(); setInputModalVisible(true) }} titleStyle={styles.menuTitleStyle} />
            <Menu.Item title="Delete" onPress={() => { closeMenu(); setConfirmModalVisible(true) }} titleStyle={styles.menuTitleStyle} />
          </Menu>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="timer-outline" size={16} />
            <Text style={styles.infoText}>
              {data.timedTest ? `${data.durationMinutes} min` : 'Untimed'}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Feather name="repeat" size={16} />
            <Text style={styles.infoText}>
              {data.maximumAttempts == 0 ? 'Unlimited' : data.maximumAttempts}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="check-decagram-outline" size={16} />
            <Text style={styles.infoText}>{data.correctionMethod}</Text>
          </View>

          <View style={styles.btnContainer}>
            <Pressable style={styles.btnInsideContainer} onPress={handlePublish} >
              <Entypo name="paper-plane" size={20} color="black" />
              <Text>Publish</Text>
            </Pressable>
          </View>

          <View style={styles.btnContainer}>
            <Pressable style={styles.btnInsideContainer} onPress={handleEdit}>
              <Feather name="edit" size={20} color="black" />
              <Text>Edit</Text>
            </Pressable>
          </View>

          {
            width >= 890 ? (
              <View style={styles.createdAt}>
                <Text style={styles.date}>{new Date(data.createdAt * 1000).toLocaleDateString()}</Text>
              </View>
            ) : null
          }

          {
            isConfirmModalVisible ? (
              <ConfirmModal message={'Are you sure, Delete the Test?'} onConfirm={handleDelete}
                onCancel={() => setConfirmModalVisible(false)}
                visible={isConfirmModalVisible}
              />
            ) : null
          }

          {
            isInputModalVisible ? (
              <InputModal
                defaultValue={data.testTitle} 
                placeholder={'New test name'}
                onValueChange={setNewTestName}
                onConfirm={handleRename}
                visible={isInputModalVisible}
                onCancel={() => setInputModalVisible(false)}
              />
            ) : null
          }

        </View>

      </View>
    </View>
  );
}

async function deleteTest(classroomId, testId) {
  try {
    const result = await api.delete(`/api/tests/deleteTest`, {
      headers: {
        'X-ClassroomId': classroomId,
        'X-TestId': testId
      }
    });
    if (result.status == 200 && result.data.success) {
      console.log('test deleted successfully');
      return result.data.success;
    } else {
      console.log('test not deleted');
    }
  } catch (err) {
    console.log(err);
  }
  return false;
}


async function renameTest(classroomId, testId, newTitle) {

  try {
    const result = await api.patch(`/api/tests/renameTest`, {
      testTitle: newTitle
    }, {
      headers: {
        'X-ClassroomId': classroomId,
        'X-TestId': testId,
      }
    })


    if (result.status == 200 && result.data.success) {
      console.log('test renamed successfully');
      return result.data.success;
    }else{
      console.log('test not renamed');
    }
  } catch (err) {
    console.log(err);
  }
  return false;
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
    marginHorizontal: 16,
  },

  card: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 8,
    boxShadow: Colors.blackBoxShadow,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },

  draftBadge: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  draftText: {
    fontSize: 12,
    color: '#856404',
  },

  infoRow: {
    flexDirection: 'row',
    marginTop: 14,
    flexWrap: 'wrap',
    gap: 14,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 10
  },

  infoText: {
    fontSize: 13,
    color: Colors.gray,
  },
  menuTitleStyle: {
    color: 'black'
  },
  menuContentStyle: {
    backgroundColor: Colors.bgColor
  },
  btnContainer: {
    // marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 0.5,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnInsideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    width: '100%',
  },
  createdAt: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    marginRight: 15
  },
  date: {
    // color : Colors.black
  }
});

