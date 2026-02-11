import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, MaterialCommunityIcons, Feather, Entypo } from '@expo/vector-icons';
import Colors from '../../styles/Colors';
import { IconButton, Menu } from 'react-native-paper';
import { router, useGlobalSearchParams } from 'expo-router';
import ConfirmModal from './modals/ConfirmModal';
import api from '../../util/api';
import InputModal from './modals/InputModal';


export default function StudentTest({data,allTests,setAllTests}){
      const [isMenuVisible,setMenuVisible]=useState(false);
      const openMenu=()=> setMenuVisible(true);
      const closeMenu=()=> setMenuVisible(false);
      const {width}= useWindowDimensions();
      const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
      const [isInputModalVisible,setInputModalVisible]=useState(false);
      const [newTestName,setNewTestName]=useState("");
       
    
const styles=StyleSheet.create({
    wrapper:{
        marginVertical:8,
    },
    
    card:{
        backgroundColor:Colors.white,
        padding:20,
        borderRadius:8,
        boxShadow:Colors.blackBoxShadow,

    },
    
    row:{
        flexDirection:"row",
        alignItems:"center",
        gap:8
    },
    title:{
        fontSize:16,
        fontWeight:"600",
        flex:1,
    },

    draftBadge:{
        backgroundColor:"#FFF3CD",
        
        
    },
    
})
}