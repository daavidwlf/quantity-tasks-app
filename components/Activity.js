import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableHighlight, TouchableOpacityComponent, TextInput, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import sql from '../data/sql';
import storage from '../data/storage';

const {width, height} = Dimensions.get('screen');

const Activity = ({triggerBottomSheet, goal, setGoal}) => {
    const [activities, setActivities] = useState([]);
    const [total, setTotal] = useState(0);
    const [inputShown, setInputShown] = useState(false);

    const [input, setInput] = useState("");

    const amountData = activities?.length;
    const progress = total/goal;

    const initializeList = () =>{
        const initialList = require('../data/activities.json')
        for(x in initialList){
            sql.setNewData(initialList[x].name)
        }
    }


    const isFirstLaunch = async() =>{
        try{
            const firstLaunch = await AsyncStorage.getItem('first')
            if(firstLaunch != 'done'){
                AsyncStorage.setItem('first', 'done')
                sql.createTable()
                storage.storeItem('total',0)
                storage.storeItem('goal', 25)
                initializeList()
            }
        }catch(err){
            console.log("Error:", err)
        }
    }


    useEffect(()=>{ 
        isFirstLaunch()
        storage.getItemAsInt('total', setTotal)
        sql.getAllData(setActivities)
    },[])

    let dateFormat = new Intl.DateTimeFormat('de', {
        month: 'long',
        hour12: false,
        timeZone: 'Europe/Berlin',
    });

    const  addCount = (id) =>{
        for(x in activities){
            if(activities[x].id == id){
                sql.updateCount(id, activities[x].count+1)
                sql.getAllData(setActivities)
                storage.storeItem('total', total+1);
                storage.getItemAsInt('total', setTotal)
            }
        }
    }

    const  subCount = (id) =>{
        for(x in activities){
            if(activities[x].id == id && activities[x].count >0){
                sql.updateCount(id, activities[x].count-1)
                sql.getAllData(setActivities)
                storage.storeItem('total', total-1);
                storage.getItemAsInt('total', setTotal)
            }
        }
    }

    const addToList = () =>{
        if(input != ""){
            sql.setNewData(input)
            sql.getAllData(setActivities)
            setInput()
        }
    }

    const deleteObject = (id) =>{
        let newTotal = total
        for(x in activities){
            if(activities[x].id == id){
                newTotal = total - activities[x].count
            }
        }
        sql.delData(id)
        sql.getAllData(setActivities)
        storage.storeItem('total', newTotal);
        storage.getItemAsInt('total', setTotal)
    }

    const isSwipeRight = ({layoutMeasurement, contentOffset, contentSize}) =>{
        return contentOffset.x < -70
    }

    return (
        <View>
            <View style={styles.header}>
                <TouchableHighlight  style={styles.settingsPress} onPress={() => triggerBottomSheet()} activeOpacity={0.4} underlayColor={'transparent'}>
                    <Entypo name="dots-three-vertical" size={24} color="white" />
                </TouchableHighlight>
            </View>
            <View style={styles.dateBox}>
                <Text style={styles.date}>{dateFormat.format(Date.now())}</Text>
            </View>
            <View style={styles.scoreContainer}>
                <Text style={styles.score}>{total}/{goal}</Text>
                <View style={styles.progressBox}>
                    <View style={[styles.progress, {width: (width-20)*0.8*progress}]}/>
                    <Text style={styles.progressLabel}>{Math.round(progress*100)}%</Text>
                </View>
            </View>
            <View style={styles.subtitleBox}>
                <Text style={styles.subtitle}>Aktivitäten</Text>
            </View>
            <View style={styles.container}>
                <ScrollView style={styles.activitieList}
                    ref={ref => {this.scrollView = ref}}
                >
                    {activities?.map((item, index)=>{

                        console.log(item)

                        return(
                            <View style={styles.swipe} key={index}>
                                <View style={styles.deleteBox}>
                                    <Text style={styles.delete}>Löschen</Text>
                                </View>
                                <ScrollView 
                                    horizontal={true}
                                    ref={ref => {this.scrollSideways = ref}}
                                    showsHorizontalScrollIndicator={false}
                                    onScrollEndDrag={({nativeEvent}) => {
                                        if (isSwipeRight(nativeEvent)) {
                                          deleteObject(item.id)
                                        }
                                      }}
                                      scrollEventThrottle={400}
                                    >
                                    <View style={styles.activityBox}>
                                        <Text allowFontScaling={false} style={styles.activityLabel}>{item.title}</Text>
                                        <View style={styles.activityChange}>
                                            <TouchableHighlight onPress={() => addCount(item.id)} style={styles.plusBox} underlayColor={'transparent'} activeOpacity={0.8}>
                                                <AntDesign name="plus" size={20} color="white" />
                                            </TouchableHighlight>
                                            <View style={styles.activityCountBox}>
                                                <Text style={styles.activityCount}>{item.count}</Text>
                                            </View>
                                            <TouchableHighlight onPress={() => subCount(item.id)} style={styles.minusBox} underlayColor={'transparent'} activeOpacity={0.8}>
                                                <AntDesign name="minus" size={20} color="white" />
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        )
                    })}
                    <View style={styles.addItemBox}>
                        <Text style={styles.addItemHeader}>Eintrag hinzufügen</Text>
                        <View style={styles.addItemIputBox}>
                            <TextInput 
                                value={input}
                                style={styles.addItem}
                                onChangeText={setInput}
                                onPressIn={() =>{
                                    setInputShown(true)
                                    this.scrollView.scrollToEnd({animated: true})
                                }}
                                onEndEditing={() => setInputShown(false)}
                            />
                            <TouchableHighlight style={styles.addItemButton} onPress={() => addToList()} underlayColor={'transparent'} activeOpacity={0.8}>
                                <Entypo name="add-to-list" size={24} color="white" />
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={{height: 870}}/>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
    },

    header:{
        alignItems: 'flex-end',
        paddingHorizontal: 10,
        paddingTop: Platform.OS === 'ios' ? 5:25,
    },

    settingsPress:{
        padding: 10,
    },

    scoreContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
        borderWidth: 1,
        marginBottom: 40,
        borderRadius: 20,
        borderColor: 'rgba(39, 138, 245, 0.4)',
        gap: 20,
        marginHorizontal: 10,
    },

    score:{
        color: 'white',
        fontFamily: 'Supreme-Light',
        fontSize: width/20,
    },

    progress:{
        backgroundColor: 'rgba(39, 138, 245, 0.4)',
        height: '100%',
        borderRadius: 9,
    },

    progressBox:{
        width: '80%',
        height: 30,
        borderColor: 'rgba(200,200,200,0.5)',
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center'
    },

    progressLabel:{
        position: 'absolute',
        alignSelf: 'center',
        color: 'white',
        fontFamily: 'Supreme-Light',
        fontSize: width/22,
    },

    dateBox:{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
    },

    date:{
        fontFamily: 'Supreme-Bold',
        fontSize: width/12,
        color: 'white',
    },

    subtitle:{
        fontFamily: 'Supreme-Bold',
        fontSize: width/16,
        color: 'white',
        marginHorizontal: 10,
        marginBottom: 20,
    },

    activitieList:{

    },

    swipe:{
        alignItems: 'center',
        flexDirection: 'row',
    },

    deleteBox:{
        alignItems: 'center',
        position: 'absolute',
        marginHorizontal: 10,
        paddingBottom: 10,
    },

    delete:{
        color: 'red',
        fontFamily: 'Supreme-Light',
        fontSize: width/24,
    },

    activityBox:{
        paddingVertical: 20,
        borderWidth: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderColor: 'rgba(100,100,100,.4)',
        width: width -20,
        borderRadius: 10,
        backgroundColor: '#111718',
        paddingHorizontal: 10,
        marginHorizontal: 10,
        marginBottom: 10,
    },

    activityLabel:{
        flex: 2,
        fontFamily: 'Supreme-Light',
        fontSize: width/20,
        color: 'white',
    },

    activityChange:{
        flexDirection: 'row',
        flex: 1,
        gap: 5,
    },

    activityCountBox:{
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 5,
        borderRadius: 10,
        flex: 1
    },

    activityCount:{
        fontFamily: 'Supreme-Medium',
        fontSize: width/20,
    },

    plusBox:{
        backgroundColor: 'rgba(94, 217, 92, 0.4)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },

    minusBox:{
        backgroundColor: 'rgba(125, 39, 32, 0.4)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },

    addItemBox:{
        marginBottom: 800,
    },

    addItemHeader:{
        fontFamily: 'Supreme-Light',
        fontSize: width/20,
        color: 'white',
        marginBottom: 10,
        marginHorizontal: 10,
        marginTop: 20,
    },

    addItemIputBox:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        marginHorizontal: 10,
    },

    addItem:{
        flex: 5,
        borderColor: 'rgba(200,200,200,0.5)',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        color: 'white',
        fontFamily: 'Supreme-Light',
        fontSize: width/20,
        color: 'white',
        height: 50,
    },

    addItemButton:{
        flex: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        height: 50,
    }
});

export default Activity;