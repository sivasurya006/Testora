import { View, Text, StyleSheet, TextInput, Pressable, FlatList, useWindowDimensions } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import Colors from '../../../../styles/Colors';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { fonts } from '../../../../styles/fonts';
import { ActivityIndicator, Modal, Portal, Menu, IconButton } from 'react-native-paper';
import api from '../../../../util/api';
import { useGlobalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ConfirmModal from '../../../../src/components/modals/ConfirmModal';

export default function StudentList() {
  const [studentsList, setStudentsList] = useState([]);
  const [inviteStudentModalVisible, setInviteStudentModalVisible] = useState(false);
  const [menuVisibleFor, setMenuVisibleFor] = useState(null);
  const [isFetchingStudents, setIsFetchingStudents] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { classroomId } = useGlobalSearchParams();
  const { width } = useWindowDimensions();

  const openMenu = (studentId) => setMenuVisibleFor(studentId);
  const closeMenu = () => setMenuVisibleFor(null);

  const numColumns = width >= 1080 ? 2 : 1;
  const hasSearchQuery = searchText.trim().length > 0;

  const filteredStudents = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return studentsList;

    return studentsList.filter((item) => {
      const name = item?.user?.name?.toLowerCase() || '';
      const email = item?.user?.email?.toLowerCase() || '';
      return name.includes(query) || email.includes(query);
    });
  }, [studentsList, searchText]);

  async function getStudentsList() {
    try {
      setIsFetchingStudents(true);
      const result = await api.get('/api/students', {
        headers: {
          'X-ClassroomId': classroomId,
        },
      });

      if (result?.status === 200 && result.data) {
        setStudentsList(result.data);
      }
    } catch (err) {
      console.log('getStudentsList', err.response?.data);
    } finally {
      setIsFetchingStudents(false);
    }
  }

  async function deleteStudent(studentId) {
    const result = await api.delete(`/api/deletestudent?studentId=${studentId}`, {
      headers: { 'X-ClassroomId': classroomId },
    });

    if (result?.status !== 200) {
      throw new Error('Delete failed');
    }
  }

  const handleDelete = async (studentId) => {
    const previous = studentsList;
    setStudentsList((prev) => prev.filter((s) => s.user.userId !== studentId));

    try {
      await deleteStudent(studentId);
    } catch (err) {
      console.log('delete failed', err.response?.data || err.message);
      setStudentsList(previous);
    }
  };

  useEffect(() => {
    getStudentsList();
  }, []);

  return (
    <>
      <StatusBar translucent />
      <SafeAreaView style={styles.container} edges={[]}>
        <TopBar
          searchText={searchText}
          setSearchText={setSearchText}
          setInviteStudentModalVisible={setInviteStudentModalVisible}
        />

        <FlatList
          key={`student-columns-${numColumns}`}
          data={filteredStudents}
          numColumns={numColumns}
          keyExtractor={(item) => String(item.user.userId)}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              {isFetchingStudents ? (
                <ActivityIndicator size="large" color={Colors.primaryColor} />
              ) : (
                <Text style={styles.emptyText}>
                  {hasSearchQuery ? 'No students match your search' : 'No students found'}
                </Text>
              )}
            </View>
          }
          renderItem={({ item }) => {
            const totalTests = item.user?.totalTestCount || 0;
            const totalAttempted = item.user?.totalAttemptedTestCount || 0;
            const progress = totalTests > 0 ? Math.floor((totalAttempted / totalTests) * 100) : 0;

            return (
              <StudentCard
                student={item}
                progress={progress}
                menuVisible={menuVisibleFor === item.user.userId}
                onOpenMenu={() => openMenu(item.user.userId)}
                onCloseMenu={closeMenu}
                onDelete={() => {
                  closeMenu();
                  handleDelete(item.user.userId);
                }}
                isHalf={numColumns > 1}
              />
            );
          }}
        />

        <InviteStudentModal
          visible={inviteStudentModalVisible}
          classroomId={classroomId}
          onConfirm={async (link) => {
            await Clipboard.setStringAsync(link);
            setInviteStudentModalVisible(false);
          }}
          onCancel={() => setInviteStudentModalVisible(false)}
        />
      </SafeAreaView>
    </>
  );
}

function StudentCard({ student, progress, menuVisible, onOpenMenu, onCloseMenu, onDelete, isHalf }) {

  const [ confirmVisible, setConfirmVisible] = useState(false);

  const registeredAt = student?.user?.registeredAt
    ? new Date(student.user.registeredAt * 1000).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '-';

  return (
    <View style={[styles.card, isHalf && styles.cardHalf]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.nameText}>{student?.user?.name || '-'}</Text>
          <Text style={styles.emailText}>{student?.user?.email || '-'}</Text>
        </View>

        <Menu
          visible={menuVisible}
          onDismiss={onCloseMenu}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={onOpenMenu}
              iconColor={Colors.secondaryColor}
            />
          }
          contentStyle={styles.menuContentStyle}
        >
          <Menu.Item title="Remove" onPress={() => setConfirmVisible(true)}  />
        </Menu>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Enrolled</Text>
        <Text style={styles.metaValue}>{registeredAt}</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Progress</Text>
        <Text style={styles.metaValue}>{progress}%</Text>
      </View>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

        <ConfirmModal
          visible={confirmVisible}
          onConfirm={() => {
            onDelete(student.user.userId);
            setConfirmVisible(false);
          }}
          onCancel={() => setConfirmVisible(false)}
          title="Remove Student"
          message={`Are you sure you want to remove ${student.user.name} from the classroom?`}
        />

    </View>
  );
}

function TopBar({ searchText, setSearchText, setInviteStudentModalVisible }) {
  return (
    <View style={styles.topBar}>
      <View style={styles.searchWrap}>
        <TextInput
          placeholder="Search trainee..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
        {searchText.trim().length > 0 && (
          <Pressable style={styles.clearBtn} onPress={() => setSearchText('')}>
            <AntDesign name="close-circle" size={16} color={Colors.lightFont} />
          </Pressable>
        )}
      </View>

      <Pressable style={styles.addButton} onPress={() => setInviteStudentModalVisible(true)}>
        <AntDesign name="plus" size={16} color={Colors.white} />
        <Text style={styles.addButtonText}>Invite</Text>
      </Pressable>
    </View>
  );
}

function InviteStudentModal({ visible, classroomId, onConfirm, onCancel }) {
  const [link, setLink] = useState('');
  const [isLoadingLink, setIsLoadingLink] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [hasValidLink, setHasValidLink] = useState(false);
  const baseLink = 'https://testora-kqvp.onrender.com/join/classroom?code=';

  const loadInviteLink = async (regenerate = false) => {
    try {
      if (!regenerate && hasValidLink) return;

      if (regenerate) {
        setIsRegenerating(true);
      } else {
        setIsLoadingLink(true);
      }

      const endpoint = regenerate ? '/api/classroom/updateInviteLink' : '/api/classroom/inviteLink';
      const result = await api.get(endpoint, {
        headers: {
          'X-ClassroomId': classroomId,
        },
      });

      if (result?.status === 200 && result.data?.code) {
        setLink(baseLink + result.data.code);
        setHasValidLink(true);
      } else {
        setLink('Unable to load invite link');
        setHasValidLink(false);
      }
    } catch (err) {
      console.log('invite link error', err.response?.data);
      setLink('Unable to load invite link');
      setHasValidLink(false);
    } finally {
      setIsLoadingLink(false);
      setIsRegenerating(false);
    }
  };

  useEffect(() => {
    if (!visible) return;
    loadInviteLink(false);
  }, [visible]);

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onCancel} contentContainerStyle={styles.modalContent}>
        <View style={styles.inputBox}>
          <View style={{ flex: 1, marginRight: 8 }}>
            {isLoadingLink ? (
              <ActivityIndicator size="small" color={Colors.primaryColor} />
            ) : (
              <Text style={styles.inviteLinkText} numberOfLines={2} ellipsizeMode="tail">
                {link || 'Loading invite link...'}
              </Text>
            )}
          </View>

          <Pressable onPress={() => loadInviteLink(true)} disabled={isRegenerating || isLoadingLink}>
            {isRegenerating ? (
              <ActivityIndicator size="small" color={Colors.primaryColor} />
            ) : (
              <FontAwesome name="refresh" size={16} color={Colors.secondaryColor} />
            )}
          </Pressable>
        </View>

        <View style={styles.options}>
          <Pressable style={[styles.optionBtn, styles.cancelBtn]} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={[styles.optionBtn, styles.confirmBtn]}
            onPress={() => onConfirm(link)}
            disabled={isLoadingLink || !link || link === 'Unable to load invite link'}
          >
            <Text style={styles.confirmText}>Copy Link</Text>
          </Pressable>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    width: '100%',
  },
  searchWrap: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingRight: 34,
    height: 40,
    backgroundColor: Colors.white,
  },
  clearBtn: {
    position: 'absolute',
    right: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.white,
    marginLeft: 6,
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    width: '100%',
    flexGrow: 1,
  },
  columnWrapper: {
    gap: 12,
  },
  emptyWrap: {
    flex: 1,
    minHeight: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: Colors.secondaryColor,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.thirdColor,
    padding: 14,
    marginBottom: 12,
  },
  cardHalf: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: Colors.secondaryColor,
  },
  emailText: {
    marginTop: 2,
    fontSize: 13,
    fontFamily: fonts.regular,
    color: Colors.lightFont,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  metaLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: Colors.lightFont,
  },
  metaValue: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: Colors.secondaryColor,
  },
  progressBarBackground: {
    marginTop: 10,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.green,
    borderRadius: 4,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    margin: 'auto',
  },
  inputBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteLinkText: {
    color: Colors.primaryColor,
    fontFamily: fonts.regular,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelBtn: {
    backgroundColor: '#ddd',
  },
  confirmBtn: {
    backgroundColor: Colors.primaryColor,
  },
  cancelText: {
    color: '#111827',
    fontWeight: '500',
  },
  confirmText: {
    color: Colors.white,
    fontWeight: '500',
  },
  menuContentStyle: {
    backgroundColor: Colors.white,
  },
  menuTitleStyle: {
    color: Colors.secondaryColor,
    fontFamily: fonts.medium,
  },
});
