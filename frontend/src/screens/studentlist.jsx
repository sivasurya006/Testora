
// export default function StudentListHeader() {

// const renderSectionHeader = ({ section }) => (
//         <View style={styles.studentHeader}>
//             <View>
//                 <AppSemiBoldText style={styles.studentName}>
//                     {section.title}
//                 </AppSemiBoldText>
//                 <AppRegularText style={styles.studentEmail}>
//                     {section.email}
//                 </AppRegularText>
//             </View>
//         </View>
//     );

//     return (
//         <View style={styles.container}>
            
//                     <FlatList
//                         data={data}
//                         keyExtractor={(item, index) =>
//                             item.email + item.title + index
//                         }
//                         renderItem={renderItem}
//                     />
                
            
//         </View>
//     );
// };




// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F5F7FA',
//         paddingHorizontal: 16,
//     },

//     studentHeader: {
//         backgroundColor: '#FFFFFF',
//         paddingVertical: 14,
//         paddingHorizontal: 16,
//         borderRadius: 12,
//         marginTop: 16,
//         marginBottom: 8,
//         elevation: 2,
//     },

//     studentName: {
//         fontSize: 16,
//         color: '#1E293B',
//     },

//     studentEmail: {
//         fontSize: 13,
//         color: '#64748B',
//         marginTop: 2,
//     },

//     testCard: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 14,
//         borderRadius: 12,
//         marginBottom: 8,
//     },

//     attemptedCard: {
//         backgroundColor: '#E6F9F0',
//     },

//     notAttemptedCard: {
//         backgroundColor: '#FFFFFF',
//         borderWidth: 1,
//         borderColor: '#E2E8F0',
//     },

//     testTitle: {
//         fontSize: 14,
//         color: '#0F172A',
//     },

//     testId: {
//         fontSize: 12,
//         color: '#64748B',
//         marginTop: 4,
//     },

//     attemptContainer: {
//         alignItems: 'center',
//         minWidth: 60,
//     },

//     attemptCount: {
//         fontSize: 18,
//     },

//     attemptLabel: {
//         fontSize: 11,
//         color: '#64748B',
//     },

//     greenText: {
//         color: '#16A34A',
//     },

//     grayText: {
//         color: '#94A3B8',
//     },
//     button: {
//         backgroundColor: Colors.primaryColor,
//         paddingVertical: 2,
//         paddingHorizontal: 10,
//         borderRadius: 8,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginHorizontal: 20,
//         flexDirection: 'row',
//         gap: 10,
//         width: 80
//     },
//     buttonText: {
//         // fontSize: 16,
//         color: Colors.white,
//         // fontWeight: 'bold',
//     },
// });