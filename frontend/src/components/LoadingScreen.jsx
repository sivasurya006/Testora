// import { View, StyleSheet, Modal } from 'react-native'
// import React from 'react'
// import LottieView from 'lottie-react-native'
// import Colors from '../../styles/Colors'

// export default function LoadingScreen({ visible = false }) {
//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       statusBarTranslucent
//     >
//       <View style={styles.overlay}>
//         <View style={styles.loaderContainer}>
//           <LottieView
//             source={require('../../assets/animations/loading.json')}
//             autoPlay
//             loop
//             style={styles.animation}
//             resizeMode='contain'
//           />
//         </View>
//       </View>
//     </Modal>
//   )
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: Colors.dimBg, 
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loaderContainer: {
//     backgroundColor: 'rgba(255,255,255,0)',
//     padding: 20,
//     borderRadius: 16,
//   },
//   animation: {
//     width: 1050,
//     height: 1050,
//   },
// })

import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import {ActivityIndicator} from 'react-native-paper'
import Colors from '../../styles/Colors';

const LoadingScreen = ({ visible }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.dimBg, 
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
